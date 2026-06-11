'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

const LoginView = dynamic(
  () => import('@/components/auth/login-view').then((m) => m.LoginView),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
          <p className="text-sm text-teal-600/70 font-medium">Chargement...</p>
        </div>
      </div>
    ),
  }
)

export function LoginPageClient() {
  return <LoginView />
}
