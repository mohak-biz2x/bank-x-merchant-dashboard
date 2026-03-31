export function MalLogo({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M50 8L58 20L70 12L68 26L82 24L74 36L88 40L76 48L86 58L72 56L76 70L64 64L62 78L52 68L46 80L42 68L32 76L34 62L20 66L28 54L14 52L26 44L16 34L30 32L24 20L36 24L38 12L46 22L50 8Z" fill="currentColor"/>
      <circle cx="50" cy="46" r="16" fill="#C3D2E7"/>
    </svg>
  );
}
