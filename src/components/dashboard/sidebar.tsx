'use client'

import Image from 'next/image'
import {
  LayoutDashboard, Users, Map, CreditCard,
  BarChart3, Settings, Bell, X, Car,
  Wallet, Shield, Navigation, TrendingUp,
  Percent, Headphones, FileQuestion,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { type ViewKey } from './navigation'

/* ------------------------------------------------------------------ */
/*  Nav items                                                          */
/* ------------------------------------------------------------------ */

type NavItem = { key: ViewKey; label: string; icon: React.ElementType; badge?: string }

const sections: { title: string; items: NavItem[]; accent?: boolean }[] = [
  {
    title: '',
    items: [{ key: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard }],
  },
  {
    title: 'Utilisateurs',
    accent: true,
    items: [
      { key: 'passagers',      label: 'Passagers',      icon: Users },
      { key: 'chauffeurs',     label: 'Chauffeurs',      icon: Car },
    ],
  },
  {
    title: 'Opérations',
    items: [
      { key: 'courses',          label: 'Courses',          icon: Navigation },
      { key: 'carte-operations', label: 'Carte opérations', icon: Map },
    ],
  },
  {
    title: 'Finance',
    items: [
      { key: 'transactions',       label: 'Transactions',        icon: CreditCard },
      { key: 'revenus-chauffeurs', label: 'Revenus chauffeurs',  icon: Wallet },
      { key: 'synthese-finance',   label: 'Synthèse financière', icon: TrendingUp },
      { key: 'commissions',        label: 'Commissions',         icon: Percent },
    ],
  },
  {
    title: 'Système',
    items: [
      { key: 'rapports',      label: 'Rapports & Analytique', icon: BarChart3 },
      { key: 'parametres',    label: 'Paramètres',             icon: Settings },
      { key: 'notifications', label: 'Notifications',          icon: Bell },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  NavSection                                                         */
/* ------------------------------------------------------------------ */

function NavSection({ title, items, accent, activeView, setActiveView, onClose }: {
  title: string
  items: NavItem[]
  accent?: boolean
  activeView: ViewKey
  setActiveView: (k: ViewKey) => void
  onClose?: () => void
}) {
  return (
    <div className="mb-4">
      {title && (
        <p className={cn('px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider',
          accent ? 'text-orange-400/70' : 'text-slate-500')}>
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
                  : 'text-slate-300 hover:bg-white/5 hover:text-white',
              )}
            >
              <item.icon className={cn('w-[18px] h-[18px] shrink-0',
                activeView === item.key ? 'text-orange-500' : 'text-slate-500')} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 leading-none min-w-[18px] text-center">
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

/* ------------------------------------------------------------------ */
/*  NavContent                                                         */
/* ------------------------------------------------------------------ */

function NavContent({ activeView, setActiveView, onClose }: {
  activeView: ViewKey
  setActiveView: (k: ViewKey) => void
  onClose?: () => void
}) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
      {sections.map((s) => (
        <NavSection
          key={s.title}
          title={s.title}
          items={s.items}
          accent={s.accent}
          activeView={activeView}
          setActiveView={setActiveView}
          onClose={onClose}
        />
      ))}
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/*  Desktop sidebar                                                    */
/* ------------------------------------------------------------------ */

export function DashboardSidebar({ activeView, setActiveView, onHide }: {
  activeView: ViewKey
  setActiveView: (k: ViewKey) => void
  onHide: () => void
}) {
  return (
    <aside className="hidden lg:flex w-[250px] min-w-[250px] flex-col bg-[#1A1A2E] h-screen sticky top-0">
      {/* Header */}
      <div className="flex flex-col items-center px-5 py-6 border-b border-white/5 relative">
        <div className="flex items-center justify-center relative w-20 h-20 mb-3">
          {/* Enhanced glow for better contrast */}
          <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full" aria-hidden="true" />
          
          <div className="relative flex items-center justify-center w-full h-full bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl">
            <Image 
              src="/logo-bestTrans.png" 
              alt="Logo" 
              width={70} 
              height={70} 
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>
        <button
          onClick={onHide}
          title="Masquer la sidebar"
          className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <NavContent activeView={activeView} setActiveView={setActiveView} />

      <div className="px-4 py-3 border-t border-white/5">
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <Shield className="w-3 h-3" />
          <span>v2.0 · Admin</span>
        </div>
      </div>
    </aside>
  )
}

/* ------------------------------------------------------------------ */
/*  Mobile sidebar                                                     */
/* ------------------------------------------------------------------ */

export function MobileSidebar({ open, onClose, activeView, setActiveView }: {
  open: boolean
  onClose: () => void
  activeView: ViewKey
  setActiveView: (k: ViewKey) => void
}) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} />}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-[250px] bg-[#1A1A2E] flex flex-col transform transition-transform duration-300 lg:hidden',
        open ? 'translate-x-0' : '-translate-x-full',
      )}>
        <div className="flex flex-col items-center px-5 py-6 border-b border-white/5 relative">
          <div className="flex items-center justify-center relative w-20 h-20 mb-3">
            {/* Subtle glow/aura for contrast on dark background */}
            <div className="absolute inset-0 bg-orange-500/10 blur-2xl rounded-full" aria-hidden="true" />
            
            <div className="relative flex items-center justify-center w-full h-full bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-2 shadow-xl">
              <Image 
                src="/logo-bestTrans.png" 
                alt="Logo" 
                width={80} 
                height={80} 
                className="object-contain drop-shadow-md"
                priority
              />
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-white/10 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <NavContent activeView={activeView} setActiveView={setActiveView} onClose={onClose} />
        <div className="px-4 py-3 border-t border-white/5">
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <Shield className="w-3 h-3" />
            <span>v2.0 · Admin</span>
          </div>
        </div>
      </div>
    </>
  )
}
