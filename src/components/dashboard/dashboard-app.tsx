'use client'

import { useState } from 'react'
import { DashboardSidebar, MobileSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardProvider, useDashboard } from '@/components/dashboard/dashboard-context'
import { type ViewKey } from '@/components/dashboard/navigation'
import { DashboardView } from '@/components/dashboard/views/dashboard-view'
import { PassagersView } from '@/components/dashboard/views/passagers-view'
import { ChauffeursView } from '@/components/dashboard/views/chauffeurs-view'
import { ChauffeurDetailView } from '@/components/dashboard/views/chauffeur-detail-view'
import { KycValidationView } from '@/components/dashboard/views/kyc-validation-view'
import { CoursesView } from '@/components/dashboard/views/courses-view'
import { CourseDetailView } from '@/components/dashboard/views/course-detail-view'
import { CarteOperationsView } from '@/components/dashboard/views/carte-operations-view'
import { TransactionsView } from '@/components/dashboard/views/transactions-view'
import { RevenusChauffeursView } from '@/components/dashboard/views/revenus-chauffeurs-view'
import { SyntheseFinanceView } from '@/components/dashboard/views/synthese-finance-view'
import { TicketsView } from '@/components/dashboard/views/tickets-view'
import { TicketDetailView } from '@/components/dashboard/views/ticket-detail-view'
import { FaqView } from '@/components/dashboard/views/faq-view'
import { RapportsView } from '@/components/dashboard/views/rapports-view'
import { ParametresView } from '@/components/dashboard/views/parametres-view'
import { NotificationsView } from '@/components/dashboard/views/notifications-view'

const viewComponents: Record<Exclude<ViewKey, 'dashboard'>, React.ComponentType> = {
  passagers: PassagersView,
  chauffeurs: ChauffeursView,
  'chauffeur-detail': ChauffeurDetailView,
  'kyc-validation': KycValidationView,
  courses: CoursesView,
  'course-detail': CourseDetailView,
  'carte-operations': CarteOperationsView,
  transactions: TransactionsView,
  'revenus-chauffeurs': RevenusChauffeursView,
  'synthese-finance': SyntheseFinanceView,
  tickets: TicketsView,
  'ticket-detail': TicketDetailView,
  faq: FaqView,
  rapports: RapportsView,
  parametres: ParametresView,
  notifications: NotificationsView,
}

export function DashboardLoading() {
  return (
    <div
      className="h-screen flex bg-[#F9FAFB] overflow-hidden"
      suppressHydrationWarning
    >
      <aside className="hidden lg:block w-[250px] min-w-[250px] border-r border-[#E5E7EB] bg-white" />
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
