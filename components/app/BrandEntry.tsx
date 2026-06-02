"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";

const BRAND = {
  bg: "#f8fbff",
  card: "#ffffff",
  border: "rgba(37, 99, 235, 0.12)",
  borderStrong: "rgba(37, 99, 235, 0.22)",
  blue: "#2563eb",
  blueSoft: "rgba(37, 99, 235, 0.12)",
  teal: "#0f766e",
  amber: "#b45309",
  text: "#0f172a",
  textMid: "#475569",
  textDim: "#94a3b8",
};

function PulseDot({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      aria-hidden="true"
      animate={{ opacity: [0.35, 1, 0.35], y: [0, -1, 0] }}
      transition={{ duration: 1.4, repeat: Infinity, delay }}
      style={{
        width: 8,
        height: 8,
        borderRadius: 999,
        display: "inline-block",
        background: BRAND.blue,
      }}
    />
  );
}

export function BrandEntryScreen({
  title = "SY DATA SUB",
  subtitle = "Preparing your account",
  message = "Loading your dashboard securely and synchronizing your latest balance.",
  accentLabel = "Fast. Reliable. Ready.",
}: {
  title?: string;
  subtitle?: string;
  message?: string;
  accentLabel?: string;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(37, 99, 235, 0.14), transparent 36%), linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: 380,
          borderRadius: 28,
          border: `1px solid ${BRAND.border}`,
          background: BRAND.card,
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.08)",
          padding: 24,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(37, 99, 235, 0.06) 0%, transparent 34%, rgba(15, 118, 110, 0.06) 100%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative" }}>
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 76,
              height: 76,
              borderRadius: 24,
              background: "linear-gradient(135deg, #2563eb 0%, #0f766e 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 18,
              boxShadow: "0 18px 40px rgba(37, 99, 235, 0.22)",
            }}
          >
            <img
              src="/logo.jpeg"
              alt="SY Data Sub"
              style={{
                width: 56,
                height: 56,
                objectFit: "contain",
                borderRadius: 16,
                background: "#ffffff",
              }}
            />
          </motion.div>

          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 12px",
                borderRadius: 999,
                background: BRAND.blueSoft,
                color: BRAND.blue,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.02em",
                marginBottom: 14,
              }}
            >
              <Sparkles size={14} />
              {accentLabel}
            </div>

            <h1
              style={{
                margin: "0 0 8px",
                color: BRAND.text,
                fontFamily: "Inter, sans-serif",
                fontSize: 28,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                fontWeight: 900,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                margin: "0 0 8px",
                color: BRAND.textMid,
                fontFamily: "Inter, sans-serif",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              {subtitle}
            </p>
            <p
              style={{
                margin: 0,
                color: BRAND.textDim,
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                lineHeight: 1.55,
              }}
            >
              {message}
            </p>
          </div>

          <div
            style={{
              borderRadius: 20,
              border: `1px solid ${BRAND.borderStrong}`,
              background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
              padding: 16,
              marginBottom: 18,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <p style={{ margin: "0 0 4px", color: BRAND.text, fontSize: 13, fontWeight: 800 }}>
                  Verifying session
                </p>
                <p style={{ margin: 0, color: BRAND.textDim, fontSize: 12 }}>
                  Secure access, balances, and notices
                </p>
              </div>
              <ShieldCheck size={18} color={BRAND.teal} />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
                marginTop: 16,
              }}
            >
              {[
                { label: "Auth", value: "Checking" },
                { label: "Wallet", value: "Syncing" },
                { label: "Plans", value: "Loading" },
              ].map((item, index) => (
                <div
                  key={item.label}
                  style={{
                    borderRadius: 16,
                    background: index === 1 ? "#eefbf8" : "#f8fafc",
                    border: `1px solid ${index === 1 ? "rgba(15, 118, 110, 0.12)" : "rgba(148, 163, 184, 0.16)"}`,
                    padding: "12px 10px",
                    textAlign: "center",
                  }}
                >
                  <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 800, color: BRAND.textMid }}>
                    {item.label}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <PulseDot delay={index * 0.18} />
                    <span style={{ fontSize: 12, fontWeight: 800, color: BRAND.text }}>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, color: BRAND.textMid, fontSize: 12, fontWeight: 700 }}>
            <PulseDot />
            <span>{message}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
