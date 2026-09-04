type BrandWordmarkProps = {
  className?: string;
  gradientId?: string;
};

/**
 * Wordmark provisional de Lynex basado en la referencia de marca.
 *
 * Se dibuja como vector para que conserve nitidez en cualquier tamaño. La E
 * se construye con tres barras, igual que en la pieza visual entregada.
 */
export function BrandWordmark({
  className = "",
  gradientId = "lynex-silver",
}: BrandWordmarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={`brand-wordmark ${className}`.trim()}
      focusable="false"
      viewBox="0 0 520 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.46" stopColor="#aeb8c6" />
          <stop offset="0.7" stopColor="#f7f9fc" />
          <stop offset="1" stopColor="#8c98a8" />
        </linearGradient>
      </defs>
      <g
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="12"
      >
        <path d="M12 15v70h70" />
        <path d="m105 15 40 37 40-37M145 52v33" />
        <path d="M220 85V15l80 70V15" />
        <path d="M335 15h70M335 50h60M335 85h70" />
        <path d="m440 15 68 70M508 15l-68 70" />
      </g>
    </svg>
  );
}
