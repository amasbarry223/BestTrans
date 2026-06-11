'use client'

import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  Send,
  QrCode,
  Users,
  Percent,
  Wallet,
  Smartphone,
  Clock,
  Bell,
  Settings,
  X,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { RicashLogo } from '@/components/ricash-logo'
import { type ViewKey } from './navigation'

const mainItems: { key: ViewKey; label: string; icon: React.ElementType }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { key: 'depot', label: 'Dépôt Wallet', icon: ArrowDownToLine },
  { key: 'retrait', label: 'Retrait Wallet', icon: ArrowUpFromLine },
  { key: 'transfert', label: 'Transfert National', icon: Send },
  { key: 'retrait-transfert', label: 'Retrait Transfert', icon: QrCode },
]

const managementItems: { key: ViewKey; label: string; icon: React.ElementType }[] = [
  { key: 'clients', label: 'Clients', icon: Users },
  { key: 'commissions', label: 'Commissions', icon: Percent },
  { key: 'caisse', label: 'Caisse Agent', icon: Wallet },
]

const servicesItems: { key: ViewKey; label: string; icon: React.ElementType }[] = [
  { key: 'airtime', label: 'Airtime & Factures', icon: Smartphone },
  { key: 'historique', label: 'Historique', icon: Clock },
  { key: 'rapports', label: 'Rapports', icon: BarChart3 },
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
      {/* Main */}
      <div className="mb-6">
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
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#111827]'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5',
                    activeView === item.key ? 'text-emerald-600' : 'text-[#9CA3AF]'
                  )}
                />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Management */}
      <div className="mb-6">
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
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#111827]'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5',
                    activeView === item.key ? 'text-emerald-600' : 'text-[#9CA3AF]'
                  )}
                />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Services */}
      <div className="mb-2">
        <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
          Services
        </p>
        <ul className="space-y-0.5">
          {servicesItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => handleClick(item.key)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  activeView === item.key
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#111827]'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5',
                    activeView === item.key ? 'text-emerald-600' : 'text-[#9CA3AF]'
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
        <RicashLogo
          showText={false}
          imageClassName="h-16 w-auto max-w-[220px]"
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
          <RicashLogo
            showText={false}
            imageClassName="h-14 w-auto max-w-[200px]"
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
