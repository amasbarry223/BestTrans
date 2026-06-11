'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell, LogOut, Menu, Settings, ChevronDown } from 'lucide-react'
import { useAuthUser } from '@/hooks/use-auth-user'
import { cn } from '@/lib/utils'
import { type ViewKey } from './navigation'

const viewTitles: Record<ViewKey, { title: string; subtitle: string }> = {
  dashboard: { title: 'Tableau de bord', subtitle: 'Pilotage opérationnel et financier' },
  dossiers: { title: 'Dossiers de Transit', subtitle: 'Gestion des dossiers de dédouanement' },
  'dossier-detail': { title: 'Détails Dossier', subtitle: 'Informations et suivi du dossier' },
  clients: { title: 'Clients & Contrats', subtitle: 'Gestion clients, contrats et tarification' },
  transport: { title: 'Transport & Flotte', subtitle: 'Gestion de la flotte et des missions' },
  depots: { title: 'Dépôts & Entreposage', subtitle: 'Gestion des magasins sous douane' },
  facturation: { title: 'Facturation & Comptabilité', subtitle: 'Factures, règlements et comptabilité' },
  ged: { title: 'Documents (GED)', subtitle: 'Gestion électronique des documents' },
  securite: { title: 'Accès & Sécurité', subtitle: 'Gestion des rôles et permissions' },
  notifications: { title: 'Notifications', subtitle: 'Alertes et messages système' },
  parametres: { title: 'Paramètres', subtitle: 'Configuration de votre compte' },
}

export function DashboardHeader({
  activeView,
  onMenuClick,
  onNotificationClick,
  onNavigate,
}: {
  activeView: ViewKey
  onMenuClick: () => void
  onNotificationClick?: () => void
  onNavigate?: (view: ViewKey) => void
}) {
  const { title, subtitle } = viewTitles[activeView] || viewTitles.dashboard
  const user = useAuthUser()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement | null>(null)

  async function handleLogout() {
    setProfileOpen(false)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      window.location.href = '/login'
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
    <header className="flex items-center justify-between px-4 lg:px-8 py-4 bg-white border-b border-[#F3F4F6]">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-[#6B7280]" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-[#111827]">{title}</h1>
          <p className="text-sm text-[#6B7280] hidden sm:block">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onNotificationClick}
          className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Bell className="w-5 h-5 text-[#6B7280]" />
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
            3
          </span>
        </button>
        <div ref={profileRef} className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2.5 bg-[#F9FAFB] hover:bg-gray-50 rounded-xl px-3 py-2 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-xs">
              {user?.initials ?? 'SD'}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-[#111827] leading-5">
                {user?.name ?? 'Seydou Diarra'}
              </p>
              <p className="text-[10px] text-[#9CA3AF] leading-4">
                Directeur · {user?.location ?? 'Bamako'}
              </p>
            </div>
            <ChevronDown
              className={cn(
                'w-4 h-4 text-[#9CA3AF] transition-transform',
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
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#374151] hover:bg-gray-50"
              >
                <Settings className="w-4 h-4 text-[#6B7280]" />
                Paramètres
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
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
