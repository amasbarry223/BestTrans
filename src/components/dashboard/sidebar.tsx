'use client'

import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Truck,
  Warehouse,
  Receipt,
  FileText,
  Shield,
  Bell,
  Settings,
  X,
  Route,
  Calculator,
  Container,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TransitLogo } from '@/components/transit-logo'
import { type ViewKey } from './navigation'

const mainItems: { key: ViewKey; label: string; icon: React.ElementType }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { key: 'dossiers', label: 'Dossiers de Transit', icon: FolderOpen },
  { key: 'clients', label: 'Clients & Contrats', icon: Users },
  { key: 'transport', label: 'Transport & Flotte', icon: Truck },
  { key: 'depots', label: 'Dépôts & Entreposage', icon: Warehouse },
]

const expertItems: { key: ViewKey; label: string; icon: React.ElementType; badge?: string }[] = [
  { key: 'corridors', label: 'Suivi Corridors', icon: Route, badge: 'NEW' },
  { key: 'calculatrice', label: 'Calcul Douanes', icon: Calculator, badge: 'NEW' },
  { key: 'surestaries', label: 'Surestaries', icon: Container, badge: 'NEW' },
]

const managementItems: { key: ViewKey; label: string; icon: React.ElementType }[] = [
  { key: 'facturation', label: 'Facturation & Compta', icon: Receipt },
  { key: 'ged', label: 'Documents (GED)', icon: FileText },
]

const systemItems: { key: ViewKey; label: string; icon: React.ElementType }[] = [
  { key: 'securite', label: 'Accès & Sécurité', icon: Shield },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'parametres', label: 'Paramètres', icon: Settings },
]

function NavContent({
  activeView,
  setActiveView,
  onClose,
}: {
  activeView: ViewKey
  setActiveView: (key: ViewKey) => void
  onClose?: () => void
}) {
  const handleClick = (key: ViewKey) => {
    setActiveView(key)
    onClose?.()
  }

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
      {/* Opérations */}
      <div className="mb-5">
        <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
          Opérations
        </p>
        <ul className="space-y-0.5">
          {mainItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => handleClick(item.key)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  activeView === item.key
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#111827]'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5',
                    activeView === item.key ? 'text-teal-600' : 'text-[#9CA3AF]'
                  )}
                />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Outils Expert */}
      <div className="mb-5">
        <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-teal-500">
          Outils Expert
        </p>
        <ul className="space-y-0.5">
          {expertItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => handleClick(item.key)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  activeView === item.key
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#111827]'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5',
                    activeView === item.key ? 'text-teal-600' : 'text-[#9CA3AF]'
                  )}
                />
                {item.label}
                {item.badge && (
                  <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-700 leading-none">
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Gestion */}
      <div className="mb-5">
        <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
          Gestion
        </p>
        <ul className="space-y-0.5">
          {managementItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => handleClick(item.key)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  activeView === item.key
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#111827]'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5',
                    activeView === item.key ? 'text-teal-600' : 'text-[#9CA3AF]'
                  )}
                />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Système */}
      <div className="mb-2">
        <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
          Système
        </p>
        <ul className="space-y-0.5">
          {systemItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => handleClick(item.key)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  activeView === item.key
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#111827]'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5',
                    activeView === item.key ? 'text-teal-600' : 'text-[#9CA3AF]'
                  )}
                />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export function DashboardSidebar({
  activeView,
  setActiveView,
}: {
  activeView: ViewKey
  setActiveView: (key: ViewKey) => void
}) {
  return (
    <aside className="hidden lg:flex w-[260px] min-w-[260px] flex-col border-r border-[#E5E7EB] bg-white h-screen sticky top-0">
      {/* Logo */}
      <div className="flex justify-center items-center px-4 py-6 border-b border-[#E5E7EB]">
        <TransitLogo
          showText={false}
          imageClassName="h-14 w-auto max-w-[220px]"
          className="justify-center"
        />
      </div>

      <NavContent activeView={activeView} setActiveView={setActiveView} />
    </aside>
  )
}

export function MobileSidebar({
  open,
  onClose,
  activeView,
  setActiveView,
}: {
  open: boolean
  onClose: () => void
  activeView: ViewKey
  setActiveView: (key: ViewKey) => void
}) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white transform transition-transform duration-300 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative flex items-center justify-center px-6 py-6 border-b border-[#E5E7EB]">
          <TransitLogo
            showText={false}
            imageClassName="h-12 w-auto max-w-[200px]"
            className="justify-center"
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>
        <NavContent
          activeView={activeView}
          setActiveView={setActiveView}
          onClose={onClose}
        />
      </div>
    </>
  )
}
