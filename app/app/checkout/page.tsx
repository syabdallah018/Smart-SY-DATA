"use client";

import { Suspense } from "react";
import CheckoutContent from "./checkout-content";
import { BrandEntryScreen } from "@/components/app/BrandEntry";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<BrandEntryScreen subtitle="Preparing checkout" message="Loading plans and secure purchase controls." accentLabel="Checkout ready" />}>
      <CheckoutContent />
    </Suspense>
  );
}
