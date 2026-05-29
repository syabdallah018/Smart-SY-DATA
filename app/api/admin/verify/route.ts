import { NextRequest, NextResponse } from "next/server"
import { createAdminSessionResponse, requireAdmin, validateAdminPassword } from "@/lib/adminAuth";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { enforceRateLimit, rejectCrossSiteMutation } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const originError = rejectCrossSiteMutation(req, { requireOrigin: true });
    if (originError) return originError;

    const rateLimitError = enforceRateLimit(req, "login", "admin-verify");
    if (rateLimitError) return rateLimitError;

    const { password } = await req.json()

    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return NextResponse.json({ success: false, error: "Admin not configured" }, { status: 500 })
    }

    const sessionUser = await getSessionUser(req);
    if (!sessionUser || sessionUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Admin phone/PIN validation is required first." },
        { status: 401 }
      );
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: sessionUser.userId },
      select: { id: true, phone: true, email: true, fullName: true, role: true, isBanned: true },
    });

    if (!adminUser || adminUser.role !== "ADMIN" || adminUser.isBanned) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (validateAdminPassword(password)) {
      return createAdminSessionResponse({
        userId: adminUser.id,
        email: adminUser.email || adminUser.phone,
        role: "ADMIN",
        fullName: adminUser.fullName,
        phone: adminUser.phone,
      });
    } else {
      return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
}
