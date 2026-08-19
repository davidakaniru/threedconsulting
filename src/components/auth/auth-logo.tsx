import { BrandLogo } from "@/components/shared/brand-logo";

interface AuthLogoProps {
  className?: string;
  compact?: boolean;
}

export function AuthLogo({ className }: AuthLogoProps) {
  return <BrandLogo className={className} priority />;
}
