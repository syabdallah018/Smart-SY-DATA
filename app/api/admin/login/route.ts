import { NextRequest, NextResponse } from "next/server";
import { createAdminSessionResponse, validateAdminPassword } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import { enforceRateLimit, rejectCrossSiteMutation } from "@/lib/security";

/**
 * POST /api/admin/login
 * Step-up admin auth: phone+pin validation + admin password authentication.
 */
const adminLoginSchema = z.object({
  phone: z.string().regex(/^0[0-9]{10}$/, "Invalid phone number"),
  pin: z.string().regex(/^\d{6}$/, "Invalid PIN"),
  password: z.string().min(1, "Admin password required"),
});

export async function POST(req: NextRequest) {
  try {
    const originError = rejectCrossSiteMutation(req, { requireOrigin: true });
    if (originError) return originError;

    const rateLimitError = enforceRateLimit(req, "login", "admin-login");
    if (rateLimitError) return rateLimitError;

    const body = await req.json();
    const { phone, pin, password } = adminLoginSchema.parse(body);

    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Admin password not configured" },
        { status: 500 }
      );
    }

    const adminUser = await prisma.user.findUnique({
      where: { phone },
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        role: true,
        pinHash: true,
        isBanned: true,
      },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    if (adminUser.isBanned) {
      return NextResponse.json(
        { error: "Admin account is banned" },
        { status: 403 }
      );
    }

    if (!adminUser.pinHash) {
      return NextResponse.json(
        { error: "Admin account PIN is not configured" },
        { status: 400 }
      );
    }

    const isPinValid = await bcryptjs.compare(pin, adminUser.pinHash);
    if (!isPinValid) {
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    if (!validateAdminPassword(password)) {
      return NextResponse.json(
        { error: "Invalid admin password" },
        { status: 401 }
      );
    }

    return createAdminSessionResponse({
      userId: adminUser.id,
      email: adminUser.email || adminUser.phone,
      role: "ADMIN",
      fullName: adminUser.fullName,
      phone: adminUser.phone,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
