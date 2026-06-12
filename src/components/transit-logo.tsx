import { cn } from '@/lib/utils'

type TransitLogoProps = {
  size?: number
  showText?: boolean
  subtitle?: string
  className?: string
  textClassName?: string
  imageClassName?: string
}

export function TransitLogo({
  size = 36,
  showText = true,
  subtitle = 'Transit & Logistique',
  className,
  textClassName,
  imageClassName,
}: TransitLogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5 min-w-0', className)}>
      {/* Custom SVG Logo for Transit company */}
      <div
        className={cn(
          'shrink-0 flex items-center justify-center bg-teal-600 rounded-lg',
          imageClassName || ''
        )}
        style={!imageClassName ? { width: size, height: size } : undefined}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn('w-full h-full p-1.5', imageClassName ? 'w-10 h-10' : '')}
        >
          {/* Container/Box shape */}
          <rect x="6" y="12" width="18" height="14" rx="2" stroke="white" strokeWidth="1.8" fill="none" />
          {/* Ship hull */}
          <path d="M4 28 L8 24 L32 24 L36 28 Z" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="1.5" />
          {/* Crane arm */}
          <line x1="28" y1="8" x2="28" y2="26" stroke="white" strokeWidth="1.8" />
          <line x1="28" y1="8" x2="38" y2="8" stroke="white" strokeWidth="1.8" />
          <line x1="38" y1="8" x2="38" y2="16" stroke="white" strokeWidth="1.5" strokeDasharray="2 2" />
          {/* Waves */}
          <path d="M2 32 Q7 30 12 32 Q17 34 22 32 Q27 30 32 32 Q37 34 40 32" stroke="white" strokeWidth="1.2" fillOpacity="0" />
        </svg>
      </div>
      {showText ? (
        <div className="min-w-0">
          <span
            className={cn(
              'block font-bold text-lg text-[#111827] tracking-tight leading-tight',
              textClassName
            )}
          >
            TransitPro
          </span>
          {subtitle ? (
            <p className="text-[10px] text-[#9CA3AF] font-medium -mt-0.5 truncate">
              {subtitle}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
