import { cn } from '@/lib/utils'

export const RICASH_LOGO_SRC = '/ricash-logo.png'

type RicashLogoProps = {
  size?: number
  showText?: boolean
  subtitle?: string
  className?: string
  textClassName?: string
  /** Ex. `h-14 w-auto max-w-[220px]` pour un logo horizontal (sidebar). */
  imageClassName?: string
}

export function RicashLogo({
  size = 36,
  showText = true,
  subtitle = 'Web Agent',
  className,
  textClassName,
  imageClassName,
}: RicashLogoProps) {
  const useSquareSize = !imageClassName

  return (
    <div className={cn('flex items-center gap-2.5 min-w-0', className)}>
      <img
        src={RICASH_LOGO_SRC}
        alt="Ricash"
        width={useSquareSize ? size : undefined}
        height={useSquareSize ? size : undefined}
        className={cn('object-contain shrink-0', imageClassName)}
        style={useSquareSize ? { width: size, height: size } : undefined}
        decoding="async"
      />
      {showText ? (
        <div className="min-w-0">
          <span
            className={cn(
              'block font-bold text-lg text-[#111827] tracking-tight leading-tight',
              textClassName
            )}
          >
            Ricash
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
