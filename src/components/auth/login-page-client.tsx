'use client'

import dynamic from 'next/dynamic'

const LoginView = dynamic(
  () => import('@/components/auth/login-view').then((m) => m.LoginView),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    ),
  }
)

export function LoginPageClient() {
  return <LoginView />
}
