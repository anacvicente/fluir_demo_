'use client';

interface FluirLogoProps {
  /** 'white' for dark backgrounds (sidebar), 'color' for light backgrounds */
  variant?: 'white' | 'color';
  /** Show only the wave icon (collapsed sidebar) */
  iconOnly?: boolean;
  /** Logo height in px */
  height?: number;
  className?: string;
}

export function FluirLogo({
  variant = 'white',
  iconOnly = false,
  height = 34,
  className,
}: FluirLogoProps) {
  const src =
    variant === 'white'
      ? '/logo-fluir-negativo-1@2000x.png'
      : '/logo-fluir@2000x.png';

  if (iconOnly) {
    // Show only the wave portion — crop to roughly the left 28% of the logo
    // using a wrapper with overflow:hidden
    const iconWidth = Math.round(height * 0.95);
    return (
      <div
        className={className}
        style={{ width: iconWidth, height, overflow: 'hidden', flexShrink: 0 }}
      >
        <img
          src={src}
          alt="Fluir"
          style={{ height, width: 'auto', maxWidth: 'none' }}
          draggable={false}
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Fluir.vc"
      height={height}
      style={{ height, width: 'auto' }}
      className={className}
      draggable={false}
    />
  );
}
