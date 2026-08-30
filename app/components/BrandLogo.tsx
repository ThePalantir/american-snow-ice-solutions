import Image from "next/image";

export const brandLogoPath = "/media/brand/asis-2026-logo-v2.png";

type BrandLogoProps = {
  priority?: boolean;
  context?: "header" | "footer";
};

export function BrandLogo({ priority = false, context = "header" }: BrandLogoProps) {
  return (
    <Image
      className="site-logo"
      src={brandLogoPath}
      alt="American Snow & Ice Solutions"
      width={1254}
      height={1254}
      sizes={context === "header"
        ? "(max-width: 760px) 100px, (max-width: 1050px) 138px, 164px"
        : "180px"}
      priority={priority}
    />
  );
}
