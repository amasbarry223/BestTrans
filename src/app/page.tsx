'use client'

import dynamic from 'next/dynamic'
import { DashboardLoading } from '@/components/dashboard/dashboard-app'

const DashboardApp = dynamic(
  () => import('@/components/dashboard/dashboard-app'),
  {
    ssr: false,
    loading: () => <DashboardLoading />,
  }
)

export default function Home() {
  return (
    <div suppressHydrationWarning>
      <DashboardApp />
    </div>
  )
}
