'use client'

import { Suspense } from 'react'
import { Anchor } from 'lucide-react'
import { LoginForm } from '@/components/auth/login-form'
import { TransitLogo } from '@/components/transit-logo'

function LoginFormFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-12 bg-[#F3F4F6]/80 rounded-2xl" />
      <div className="h-12 bg-[#F3F4F6]/80 rounded-2xl" />
      <div className="h-12 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-2xl" />
    </div>
  )
}

export function LoginView() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden p-4 sm:p-8"
      suppressHydrationWarning
    >
      <div className="login-page-bg absolute inset-0" aria-hidden />
      <div className="login-orb login-orb-1" aria-hidden />
      <div className="login-orb login-orb-2" aria-hidden />
      <div className="login-orb login-orb-3" aria-hidden />

      <div className="login-card relative z-10 w-full max-w-[420px] rounded-[28px] p-8 sm:p-10 shadow-2xl shadow-teal-900/10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />

        <div className="flex flex-col items-center text-center">
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-2xl bg-teal-400/20 blur-xl scale-150" />
            <TransitLogo
              size={80}
              showText={false}
              className="relative justify-center rounded-2xl bg-white p-1 shadow-sm ring-1 ring-[#E5E7EB]"
            />
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            <Anchor className="w-3 h-3 text-teal-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600/90">
              Transit & Logistique
            </p>
          </div>
        </div>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent" />

        <div className="text-center mb-7">
          <h1 className="text-lg font-semibold text-[#111827]">Bienvenue</h1>
          <p className="text-sm text-[#6B7280] mt-1 leading-relaxed">
            Connectez-vous pour accéder à votre plateforme de gestion
          </p>
        </div>

        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
