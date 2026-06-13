'use client'

import { Suspense } from 'react'
import Image from 'next/image'
import { Car } from 'lucide-react'
import { LoginForm } from '@/components/auth/login-form'

function LoginFormFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-20 bg-[#E5E7EB]/60 rounded" />
        <div className="h-12 bg-[#F3F4F6]/80 rounded-2xl" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-24 bg-[#E5E7EB]/60 rounded" />
        <div className="h-12 bg-[#F3F4F6]/80 rounded-2xl" />
      </div>
      <div className="h-12 bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl" />
    </div>
  )
}

export function LoginView() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8"
      suppressHydrationWarning
    >
      {/* Animated background */}
      <div className="login-page-bg absolute inset-0" aria-hidden />
      <div className="login-orb login-orb-1" aria-hidden />
      <div className="login-orb login-orb-2" aria-hidden />
      <div className="login-orb login-orb-3" aria-hidden />

      {/* Login Card */}
      <div className="login-card relative z-10 w-full max-w-[440px] rounded-[28px] p-7 sm:p-9 shadow-2xl shadow-[#1A1A2E]/10">
        {/* Top decorative line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />

        {/* Logo Section */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-2xl bg-orange-400/20 blur-xl scale-150" />
            <div className="relative flex items-center justify-center w-[72px] h-[72px] rounded-2xl overflow-hidden shadow-lg shadow-orange-500/30">
              <Image
                src="/logo-bestTrans.png"
                alt="BestTrans"
                width={72}
                height={72}
                className="object-cover"
              />
            </div>
          </div>

          {/* Brand Name */}
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">
            Best<span className="text-orange-600">Trans</span>
          </h1>

          <div className="flex items-center gap-1.5 mt-1.5">
            <Car className="w-3 h-3 text-orange-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-600/90">
              Dashboard Admin
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-7 h-px bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent" />

        {/* Welcome Text */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-[#111827]">Bienvenue</h2>
          <p className="text-sm text-[#6B7280] mt-1 leading-relaxed">
            Connectez-vous pour accéder au back-office BestTrans
          </p>
        </div>

        {/* Login Form */}
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#F3F4F6] text-center">
          <p className="text-[11px] text-[#9CA3AF]">
            © 2025 BestTrans — Bamako, Mali
          </p>
        </div>
      </div>
    </div>
  )
}
