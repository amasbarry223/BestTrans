'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getAllDemoUsers, getRoleLabel, getRoleColor } from '@/lib/auth'
import type { AuthUser } from '@/lib/auth'

const inputClass =
  'w-full h-9 pl-9 pr-4 rounded-xl border border-[#E5E7EB]/80 bg-[#F9FAFB]/90 text-[#111827] text-xs placeholder:text-[#9CA3AF] transition-all duration-200 focus:outline-none focus:bg-white focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/10'

export function LoginForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<'email' | 'pwd' | null>(null)
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const demoUsers = getAllDemoUsers()

  useEffect(() => {
    if (selectedDemo) {
      setEmail(selectedDemo)
      setPassword('besttrans2025')
      const timer = setTimeout(() => {
        const pwdInput = document.getElementById('password')
        pwdInput?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [selectedDemo])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password }),
      })

      if (!res.ok) {
        toast.error('Identifiants incorrects', {
          description: 'Vérifiez votre adresse email et votre mot de passe.',
        })
        return
      }

      const data = (await res.json()) as { user: AuthUser }
      toast.success('Connexion réussie', {
        description: `Bienvenue, ${data.user.name}`,
      })

      const from = searchParams.get('from')
      const target = from && from !== '/login' ? from : '/'
      window.location.href = target
    } catch {
      toast.error('Erreur de connexion', {
        description: 'Impossible de contacter le serveur. Réessayez.',
      })
    } finally {
      setLoading(false)
    }
  }

  function handleDemoClick(demoEmail: string) {
    setSelectedDemo(demoEmail)
    setEmail(demoEmail)
    setPassword('besttrans2025')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]"
        >
          Adresse email
        </label>
        <div className="relative group">
          <Mail
            className={cn(
              'absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors',
              focused === 'email' ? 'text-orange-500' : 'text-[#9CA3AF]'
            )}
          />
          <input
            ref={emailRef}
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused(null)}
            onChange={(e) => {
              setEmail(e.target.value)
              setSelectedDemo(null)
            }}
            placeholder="votre@email.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]"
        >
          Mot de passe
        </label>
        <div className="relative group">
          <Lock
            className={cn(
              'absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors',
              focused === 'pwd' ? 'text-orange-500' : 'text-[#9CA3AF]'
            )}
          />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onFocus={() => setFocused('pwd')}
            onBlur={() => setFocused(null)}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={cn(inputClass, 'pr-12')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-[#9CA3AF] hover:text-[#374151] hover:bg-[#F3F4F6] transition-colors"
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <span className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="sr-only"
            />
            <span
              className={cn(
                'w-[18px] h-[18px] rounded-md border-2 bg-white transition-all flex items-center justify-center',
                remember
                  ? 'border-orange-500 bg-orange-500'
                  : 'border-[#D1D5DB] group-hover:border-orange-300'
              )}
            >
              <Check
                className={cn(
                  'w-3 h-3 text-white transition-opacity',
                  remember ? 'opacity-100' : 'opacity-0'
                )}
                strokeWidth={3}
              />
            </span>
          </span>
          <span className="text-sm text-[#6B7280] group-hover:text-[#374151] transition-colors">
            Rester connecté
          </span>
        </label>
        <button
          type="button"
          className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
          onClick={() =>
            toast.info(
              "Contactez l'administrateur système pour réinitialiser votre mot de passe."
            )
          }
        >
          Mot de passe oublié ?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group w-full h-9 mt-2 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-[#1A1A2E] text-white text-sm font-semibold shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Connexion en cours...
          </>
        ) : (
          <>
            Se connecter
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </button>

      <DemoAccounts
        demoUsers={demoUsers}
        selectedDemo={selectedDemo}
        onDemoClick={handleDemoClick}
      />
    </form>
  )
}

function DemoAccounts({
  demoUsers,
  selectedDemo,
  onDemoClick,
}: {
  demoUsers: ReturnType<typeof getAllDemoUsers>
  selectedDemo: string | null
  onDemoClick: (email: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="pt-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-center gap-1.5 text-[11px] text-[#9CA3AF] hover:text-orange-500 transition-colors"
      >
        <span>Accès démo</span>
        <ChevronDown
          className={cn('w-3 h-3 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-1">
          {demoUsers.map((du) => {
            const roleColor = getRoleColor(du.role)
            const roleLabel = getRoleLabel(du.role)
            const isSelected = selectedDemo === du.email
            return (
              <button
                key={du.email}
                type="button"
                onClick={() => onDemoClick(du.email)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-xl border text-left transition-all duration-150',
                  'hover:scale-[1.01] active:scale-[0.99]',
                  isSelected
                    ? 'border-orange-300 bg-orange-50 ring-1 ring-orange-400/30'
                    : cn(roleColor.border, roleColor.bg, 'hover:border-orange-300/60')
                )}
              >
                <span
                  className={cn(
                    'shrink-0 w-2 h-2 rounded-full',
                    du.role === 'super_admin' ? 'bg-rose-500' :
                    du.role === 'admin' ? 'bg-orange-500' :
                    du.role === 'support' ? 'bg-amber-500' : 'bg-emerald-500'
                  )}
                />
                <span className={cn('text-[11px] font-semibold shrink-0', roleColor.text)}>
                  {roleLabel}
                </span>
                <span className="text-[11px] text-[#6B7280] truncate flex-1">{du.name}</span>
                <code className="text-[10px] font-mono text-[#9CA3AF] shrink-0">{du.email}</code>
              </button>
            )
          })}
          <p className="text-[10px] text-[#9CA3AF] text-center mt-0.5">
            Mot de passe : <code className="font-mono">besttrans2025</code>
          </p>
        </div>
      )}
    </div>
  )
}
