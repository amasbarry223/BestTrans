'use client'

import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'

export function LoginLottiePanel() {
  const [animationData, setAnimationData] = useState<object | null>(null)

  useEffect(() => {
    fetch('/login-animation.json')
      .then((r) => r.json())
      .then(setAnimationData)
      .catch(() => null)
  }, [])

  return (
    <div className="hidden lg:flex flex-col items-center justify-center relative overflow-hidden">
      {/* Fond dégradé navy */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460]" />

      {/* Orbes décoratifs */}
      <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-orange-500/20 blur-2xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-28 h-28 rounded-full bg-orange-400/10 blur-xl pointer-events-none" />

      {/* Animation Lottie */}
      <div className="relative z-10 w-full max-w-[220px] xl:max-w-[260px] px-2">
        {animationData ? (
          <Lottie
            animationData={animationData}
            loop
            autoplay
            style={{ width: '100%', height: 'auto' }}
          />
        ) : (
          <div className="w-full aspect-square rounded-2xl bg-white/5 animate-pulse" />
        )}
      </div>
    </div>
  )
}
