'use client'

import { useState } from 'react'
import { DashboardSidebar, MobileSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardProvider, useDashboard } from '@/components/dashboard/dashboard-context'
import { type ViewKey } from '@/components/dashboard/navigation'
import { DashboardView } from '@/components/dashboard/views/dashboard-view'
import { DossiersView } from '@/components/dashboard/views/dossiers-view'
import { DossierDetailView } from '@/components/dashboard/views/dossier-detail-view'
import { ClientsView } from '@/components/dashboard/views/clients-view'
import { TransportView } from '@/components/dashboard/views/transport-view'
import { DepotsView } from '@/components/dashboard/views/depots-view'
import { FacturationView } from '@/components/dashboard/views/facturation-view'
import { GedView } from '@/components/dashboard/views/ged-view'
import { SecuriteView } from '@/components/dashboard/views/securite-view'
import { NotificationsView } from '@/components/dashboard/views/notifications-view'
import { ParametresView } from '@/components/dashboard/views/parametres-view'

const viewComponents: Record<Exclude<ViewKey, 'dashboard'>, React.ComponentType> = {
  dossiers: DossiersView,
  'dossier-detail': DossierDetailView,
  clients: ClientsView,
  transport: TransportView,
  depots: DepotsView,
  facturation: FacturationView,
  ged: GedView,
  securite: SecuriteView,
  notifications: NotificationsView,
  parametres: ParametresView,
}

export function DashboardLoading() {
  return (
    <div
      className="h-screen flex bg-[#F9FAFB] overflow-hidden"
      suppressHydrationWarning
    >
      <aside className="hidden lg:block w-[260px] min-w-[260px] border-r border-[#E5E7EB] bg-white" />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[73px] border-b border-[#F3F4F6] bg-white" />
        <main className="flex-1 bg-[#F9FAFB]" />
      </div>
    </div>
  )
}

function DashboardShell() {
  const { activeView, setActiveView } = useDashboard()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const ActiveComponent = viewComponents[activeView] || DashboardView

  return (
    <div
      className="h-screen flex bg-[#F9FAFB] overflow-hidden"
      suppressHydrationWarning
    >
      <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />

      <MobileSidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader
          activeView={activeView}
          onMenuClick={() => setMobileSidebarOpen(true)}
          onNotificationClick={() => setActiveView('notifications')}
          onNavigate={setActiveView}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="h-full px-4 lg:px-8 py-6">
            {activeView === 'dashboard' ? (
              <DashboardView setActiveView={setActiveView} />
            ) : (
              <ActiveComponent />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardApp() {
  return (
    <DashboardProvider>
      <DashboardShell />
    </DashboardProvider>
  )
}
