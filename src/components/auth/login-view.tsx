'use client'

import { Suspense } from 'react'
import Image from 'next/image'
import { Car } from 'lucide-react'
import { LoginForm } from '@/components/auth/login-form'
import { LoginLottiePanel } from '@/components/auth/login-lottie-panel'

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
      className="min-h-screen flex items-center justify-center bg-[#0F172A] p-4 relative overflow-hidden"
      suppressHydrationWarning
    >
      {/* Orbes de fond */}
      <div className="absolute top-1/4 left-1/6 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/6 w-72 h-72 rounded-full bg-orange-400/8 blur-2xl pointer-events-none" />
      <div className="absolute top-3/4 left-1/2 w-56 h-56 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      {/* Container centré deux colonnes */}
      <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl shadow-black/60 grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">

        {/* ── Colonne gauche : Logo + Formulaire ── */}
        <div className="bg-white flex flex-col items-center justify-center px-5 py-8 sm:px-8">

          {/* Logo */}
          <div className="flex flex-col items-center text-center mb-5">
            <div className="relative mb-3">
              <div className="absolute inset-0 rounded-2xl bg-orange-400/20 blur-xl scale-150" />
              <div className="relative flex items-center justify-center w-[68px] h-[68px] rounded-2xl overflow-hidden shadow-md shadow-orange-500/30">
                <Image
                  src="/logo-bestTrans.png"
                  alt="Logo BestTrans"
                  width={68}
                  height={68}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Car className="w-2.5 h-2.5 text-orange-500" />
              <p className="text-[10px] font-semibold uppercase tracking-widest text-orange-600/90">
                Dashboard Admin
              </p>
            </div>
          </div>

          {/* Titre */}
          <div className="text-center mb-5 w-full">
            <h2 className="text-base font-bold text-[#111827]">Bienvenue</h2>
            <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
              Connectez-vous pour accéder au back-office
            </p>
          </div>

          {/* Formulaire */}
          <div className="w-full">
            <Suspense fallback={<LoginFormFallback />}>
              <LoginForm />
            </Suspense>
          </div>

          {/* Footer */}
          <p className="text-[10px] text-[#9CA3AF] mt-5">
            © 2025 — Bamako, Mali
          </p>
        </div>

        {/* ── Colonne droite : Lottie ── */}
        <LoginLottiePanel />
      </div>
    </div>
  )
}
