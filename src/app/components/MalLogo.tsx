export function MalLogo({ height = 32, className = "" }: { height?: number; className?: string }) {
  const aspectRatio = 3.2;
  const width = height * aspectRatio;
  return (
    <svg width={width} height={height} viewBox="0 0 320 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Geometric gear/flower icon */}
      <g transform="translate(5, 5) scale(0.9)">
        <path d="M50 2 L56 11 L62 5 L63 15 L71 11 L68 21 L77 19 L71 28 L80 29 L72 36 L81 40 L72 44 L79 51 L70 51 L74 59 L65 56 L66 65 L58 59 L56 68 L50 60 L44 68 L42 59 L34 65 L35 56 L26 59 L30 51 L21 51 L28 44 L19 40 L28 36 L20 29 L29 28 L23 19 L32 21 L29 11 L37 15 L38 5 L44 11 L50 2Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
        <path d="M50 22 C60 22 68 30 68 40 C68 50 60 58 50 58 C40 58 32 50 32 40 C32 30 40 22 50 22Z" fill="#C3D2E7"/>
      </g>
      {/* "Mal" text */}
      <text x="105" y="72" fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif" fontSize="72" fontWeight="800" letterSpacing="-2" fill="currentColor">Mal</text>
    </svg>
  );
}
