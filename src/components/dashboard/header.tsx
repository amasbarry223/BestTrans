'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell, LogOut, Menu, Settings, ChevronDown, PanelLeftOpen } from 'lucide-react'
import { useAuthUser } from '@/hooks/use-auth-user'
import { cn } from '@/lib/utils'
import { type ViewKey } from './navigation'
import { mockDb } from '@/lib/mock-db'

const viewTitles: Record<ViewKey, { title: string; subtitle: string }> = {
  dashboard: { title: 'Tableau de bord', subtitle: 'Vue d\'ensemble de la plateforme' },
  passagers: { title: 'Passagers', subtitle: 'Gestion des comptes passagers' },
  'passager-detail': { title: 'Profil Passager', subtitle: 'Informations et historique' },
  chauffeurs: { title: 'Chauffeurs', subtitle: 'Supervision et validation des chauffeurs' },
  'chauffeur-detail': { title: 'Fiche Chauffeur', subtitle: 'Profil et performances' },
  'kyc-validation': { title: 'Validation KYC', subtitle: 'Vérification des documents chauffeurs' },
  courses: { title: 'Courses', subtitle: 'Suivi opérationnel des courses' },
  'course-detail': { title: 'Détail Course', subtitle: 'Informations et trajet de la course' },
  'carte-operations': { title: 'Carte opérations', subtitle: 'Suivi GPS en temps réel' },
  transactions: { title: 'Transactions', subtitle: 'Historique des paiements' },
  'revenus-chauffeurs': { title: 'Revenus chauffeurs', subtitle: 'Soldes et versements' },
  'synthese-finance': { title: 'Synthèse financière', subtitle: 'CA, commissions et rapprochement' },
  commissions: { title: 'Commissions', subtitle: 'Taux et historique des commissions' },
  tickets: { title: 'Tickets support', subtitle: 'Réclamations et demandes' },
  'ticket-detail': { title: 'Détail Ticket', subtitle: 'Conversation et interventions' },
  faq: { title: 'FAQ', subtitle: 'Questions fréquentes' },
  rapports: { title: 'Rapports & Analytique', subtitle: 'Tableaux de bord analytiques' },
  parametres: { title: 'Paramètres', subtitle: 'Tarification, rôles, notifications' },
  notifications: { title: 'Notifications', subtitle: 'Alertes et messages système' },
}

export function DashboardHeader({
  activeView,
  onMenuClick,
  onNotificationClick,
  onNavigate,
  sidebarHidden,
  onShowSidebar,
}: {
  activeView: ViewKey
  onMenuClick: () => void
  onNotificationClick?: () => void
  onNavigate?: (view: ViewKey) => void
  sidebarHidden?: boolean
  onShowSidebar?: () => void
}) {
  const { title, subtitle } = viewTitles[activeView] || viewTitles.dashboard
  const user = useAuthUser()
  const [profileOpen, setProfileOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const profileRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setUnreadCount(mockDb.getUnreadCount())
    const timer = setInterval(() => {
      setUnreadCount(mockDb.getUnreadCount())
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  async function handleLogout() {
    setProfileOpen(false)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      window.location.href = '/'
    }
  }

  useEffect(() => {
    function onDocPointerDown(e: PointerEvent) {
      if (!profileRef.current) return
      const target = e.target as Node | null
      if (target && !profileRef.current.contains(target)) setProfileOpen(false)
    }
    if (profileOpen) document.addEventListener('pointerdown', onDocPointerDown)
    return () => document.removeEventListener('pointerdown', onDocPointerDown)
  }, [profileOpen])

  return (
    <header className="flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 py-3 md:py-4 bg-white border-b border-[#F3F4F6] sticky top-0 z-30">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-[#6B7280]" />
        </button>
        {/* Desktop: show sidebar button when hidden */}
        {sidebarHidden && (
          <button
            onClick={onShowSidebar}
            title="Afficher la sidebar"
            className="hidden lg:flex p-2 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <PanelLeftOpen className="w-5 h-5 text-[#6B7280]" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-[#111827] truncate leading-tight">{title}</h1>
          <p className="text-[11px] sm:text-xs text-[#6B7280] hidden sm:block truncate">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onNotificationClick}
          className="relative p-2 rounded-lg hover:bg-orange-50 transition-colors"
        >
          <Bell className="w-5 h-5 text-[#6B7280]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-[16px] rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center px-1 border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 md:gap-2.5 bg-[#F9FAFB] hover:bg-orange-50/50 rounded-xl px-2 py-1.5 md:px-3 md:py-2 transition-colors border border-transparent hover:border-orange-100"
          >
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-[10px] md:text-xs shrink-0">
              {user?.initials ?? 'SD'}
            </div>
            <div className="text-left hidden xs:block">
              <p className="text-xs md:text-sm font-bold text-[#111827] leading-tight truncate max-w-[100px] md:max-w-none">
                {user?.name ?? 'Admin'}
              </p>
              <p className="text-[9px] md:text-[10px] text-[#9CA3AF] leading-tight mt-0.5">
                Admin · Bamako
              </p>
            </div>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-[#9CA3AF] transition-transform hidden xs:block',
                profileOpen && 'rotate-180'
              )}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1 z-50">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false)
                  onNavigate?.('parametres')
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#374151] hover:bg-orange-50 transition-colors"
              >
                <Settings className="w-4 h-4 text-[#6B7280]" />
                Paramètres
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
