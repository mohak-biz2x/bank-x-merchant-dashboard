import malLogoSrc from "@/assets/mal-logo.svg";

export function MalLogo({ height = 32, className = "" }: { height?: number; className?: string }) {
  return (
    <img
      src={malLogoSrc}
      alt="Mal"
      height={height}
      className={className}
      style={{ height, width: "auto" }}
    />
  );
}
