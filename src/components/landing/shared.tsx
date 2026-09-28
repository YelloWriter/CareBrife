import type { ReactNode } from "react";
import { Button } from "../ui/button";
const BETA_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdv7-MYk37xpZkBIXTOJsZLTyOBeV0_8FSu5pX_eRMaf_SwUA/viewform?usp=header";
export function Brand({ compact = false, priority = false }: { compact?: boolean; priority?: boolean }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <img
        className="brand-logo"
        src="/figma/logo.webp"
        fetchPriority={priority ? "high" : "auto"}
        width="340"
        height="100"
        alt="진료한장 - 진료보다 먼저 도착하는 마음"
      />
    </div>
  );
}

export function BetaLink({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Button asChild size="landing" variant="outline" className={className}><a
      href={BETA_FORM_URL}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a></Button>
  );
}

