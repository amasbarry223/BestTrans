'use client'

import { Suspense } from 'react'
import { Anchor } from 'lucide-react'
import { LoginForm } from '@/components/auth/login-form'
import { TransitLogo } from '@/components/transit-logo'

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
      <div className="h-12 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-2xl" />
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
      <div className="login-card relative z-10 w-full max-w-[440px] rounded-[28px] p-7 sm:p-9 shadow-2xl shadow-teal-900/10">
        {/* Top decorative line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />

        {/* Logo Section */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-2xl bg-teal-400/20 blur-xl scale-150" />
            <TransitLogo
              size={72}
              showText={false}
              className="relative justify-center rounded-2xl bg-white p-1 shadow-sm ring-1 ring-[#E5E7EB]"
            />
          </div>

          {/* Brand Name */}
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">
            TransitPro
          </h1>

          <div className="flex items-center gap-1.5 mt-1.5">
            <Anchor className="w-3 h-3 text-teal-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600/90">
              Transit & Logistique
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-7 h-px bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent" />

        {/* Welcome Text */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-[#111827]">Bienvenue</h2>
          <p className="text-sm text-[#6B7280] mt-1 leading-relaxed">
            Connectez-vous pour accéder à votre plateforme de gestion
          </p>
        </div>

        {/* Login Form */}
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#F3F4F6] text-center">
          <p className="text-[11px] text-[#9CA3AF]">
            © 2026 TransitPro — Bamako, Mali
          </p>
        </div>
      </div>
    </div>
  )
}
