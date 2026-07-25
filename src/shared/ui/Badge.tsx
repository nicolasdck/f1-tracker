import { ReactNode } from "react";

export function Badge({ children, variant = "default" }: { children: ReactNode; variant?: "default" | "primary" }) {
  const styles =
    variant === "primary"
      ? "text-black bg-[var(--color-primary)]"
      : "text-white/50 bg-white/5";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider ${styles}`}>
      {children}
    </span>
  );
}
