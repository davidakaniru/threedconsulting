import { BrandLogo } from "@/components/shared/brand-logo";

interface AuthLogoProps {
  className?: string;
  compact?: boolean;
}

export function AuthLogo({ className, compact = false }: AuthLogoProps) {
  return <BrandLogo className={className} compact={compact} priority />;
}
