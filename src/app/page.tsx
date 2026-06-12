'use client'

import { useSyncExternalStore } from 'react'
import dynamic from 'next/dynamic'
import { useAuthUser } from '@/hooks/use-auth-user'
import { DashboardLoading } from '@/components/dashboard/dashboard-app'

const DashboardApp = dynamic(
  () => import('@/components/dashboard/dashboard-app'),
  {
    ssr: false,
    loading: () => <DashboardLoading />,
  }
)

const LoginView = dynamic(
  () => import('@/components/auth/login-view').then((m) => m.LoginView),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
      </div>
    ),
  }
)

const emptySubscribe = () => () => {}

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}

export default function Home() {
  const user = useAuthUser()
  const mounted = useIsMounted()

  if (!mounted) {
    return <DashboardLoading />
  }

  return (
    <div suppressHydrationWarning>
      {user ? <DashboardApp /> : <LoginView />}
    </div>
  )
}
