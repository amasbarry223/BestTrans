'use client'

import Image from 'next/image'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Map,
  CreditCard,
  Headphones,
  BarChart3,
  Settings,
  Bell,
  X,
  Car,
  Wallet,
  FileQuestion,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { type ViewKey } from './navigation'

function BestTransLogo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <Image
        src="/logo-bestTrans.png"
        alt="BestTrans"
        width={36}
        height={36}
        className="rounded-lg"
      />
      <div className="flex flex-col">
        <span className="text-lg font-bold text-white leading-tight tracking-tight">Best<span className="text-orange-400">Trans</span></span>
        <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest leading-none">Admin Dashboard</span>
      </div>
    </div>
  )
}

const mainItems: { key: ViewKey; label: string; icon: React.ElementType }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
]

const userItems: { key: ViewKey; label: string; icon: React.ElementType; badge?: string }[] = [
  { key: 'passagers', label: 'Passagers', icon: Users },
  { key: 'chauffeurs', label: 'Chauffeurs', icon: Car },
  { key: 'kyc-validation', label: 'Validation KYC', icon: UserCheck, badge: '3' },
]

const operationItems: { key: ViewKey; label: string; icon: React.ElementType }[] = [
  { key: 'courses', label: 'Courses', icon: Map },
  { key: 'carte-operations', label: 'Carte opérations', icon: Map },
]

const financeItems: { key: ViewKey; label: string; icon: React.ElementType }[] = [
  { key: 'transactions', label: 'Transactions', icon: CreditCard },
  { key: 'revenus-chauffeurs', label: 'Revenus chauffeurs', icon: Wallet },
  { key: 'synthese-finance', label: 'Synthèse financière', icon: BarChart3 },
]

const supportItems: { key: ViewKey; label: string; icon: React.ElementType }[] = [
  { key: 'tickets', label: 'Tickets support', icon: Headphones },
  { key: 'faq', label: 'FAQ', icon: FileQuestion },
]

const systemItems: { key: ViewKey; label: string; icon: React.ElementType }[] = [
  { key: 'rapports', label: 'Rapports & Analytique', icon: BarChart3 },
  { key: 'parametres', label: 'Paramètres', icon: Settings },
  { key: 'notifications', label: 'Notifications', icon: Bell },
]

function NavSection({ title, items, activeView, setActiveView, onClose, accent }: {
  title: string
  items: { key: ViewKey; label: string; icon: React.ElementType; badge?: string }[]
  activeView: ViewKey
  setActiveView: (key: ViewKey) => void
  onClose?: () => void
  accent?: boolean
}) {
  return (
    <div className="mb-4">
      {title && (
        <p className={cn(
          'px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider',
          accent ? 'text-orange-400/70' : 'text-slate-500'
        )}>
          {title}
        </p>
      )}
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.key}>
            <button
              onClick={() => { setActiveView(item.key); onClose?.() }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all',
                activeView === item.key
                  ? 'bg-orange-500/15 text-orange-400'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'w-[18px] h-[18px]',
                  activeView === item.key ? 'text-orange-500' : 'text-slate-500'
                )}
              />
              {item.label}
              {item.badge && (
                <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 leading-none min-w-[18px] text-center">
                  {item.badge}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function NavContent({
  activeView,
  setActiveView,
  onClose,
}: {
  activeView: ViewKey
  setActiveView: (key: ViewKey) => void
  onClose?: () => void
}) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
      <NavSection title="" items={mainItems} activeView={activeView} setActiveView={setActiveView} onClose={onClose} />
      <NavSection title="Utilisateurs" items={userItems} activeView={activeView} setActiveView={setActiveView} onClose={onClose} accent />
      <NavSection title="Opérations" items={operationItems} activeView={activeView} setActiveView={setActiveView} onClose={onClose} />
      <NavSection title="Paiements" items={financeItems} activeView={activeView} setActiveView={setActiveView} onClose={onClose} />
      <NavSection title="Support" items={supportItems} activeView={activeView} setActiveView={setActiveView} onClose={onClose} />
      <NavSection title="Système" items={systemItems} activeView={activeView} setActiveView={setActiveView} onClose={onClose} />
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
    <aside className="hidden lg:flex w-[250px] min-w-[250px] flex-col bg-[#1A1A2E] h-screen sticky top-0">
      <div className="flex items-center px-5 py-5 border-b border-white/5">
        <BestTransLogo />
      </div>
      <NavContent activeView={activeView} setActiveView={setActiveView} />
      <div className="px-4 py-3 border-t border-white/5">
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <Shield className="w-3 h-3" />
          <span>v1.0 · BestTrans Admin</span>
        </div>
      </div>
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
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[250px] bg-[#1A1A2E] transform transition-transform duration-300 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative flex items-center justify-between px-5 py-5 border-b border-white/5">
          <BestTransLogo />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <NavContent activeView={activeView} setActiveView={setActiveView} onClose={onClose} />
      </div>
    </>
  )
}
