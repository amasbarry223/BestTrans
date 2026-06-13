'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  User,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getAllDemoUsers, getRoleLabel, getRoleColor } from '@/lib/auth'
import type { AuthUser } from '@/lib/auth'

const inputClass =
  'w-full h-12 pl-11 pr-4 rounded-2xl border border-[#E5E7EB]/80 bg-[#F9FAFB]/90 text-[#111827] text-sm placeholder:text-[#9CA3AF] transition-all duration-200 focus:outline-none focus:bg-white focus:border-orange-400/60 focus:ring-4 focus:ring-orange-500/10'

export function LoginForm() {
  const searchParams = useSearchParams()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<'id' | 'pwd' | null>(null)
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null)
  const identifierRef = useRef<HTMLInputElement>(null)

  const demoUsers = getAllDemoUsers()

  useEffect(() => {
    if (selectedDemo) {
      setIdentifier(selectedDemo)
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
        body: JSON.stringify({ identifier, password }),
      })

      if (!res.ok) {
        toast.error('Identifiants incorrects', {
          description: 'Vérifiez votre identifiant et votre mot de passe.',
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

  function handleDemoClick(username: string) {
    setSelectedDemo(username)
    setIdentifier(username)
    setPassword('besttrans2025')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="identifier"
          className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]"
        >
          Identifiant
        </label>
        <div className="relative group">
          <User
            className={cn(
              'absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors',
              focused === 'id' ? 'text-orange-500' : 'text-[#9CA3AF]'
            )}
          />
          <input
            ref={identifierRef}
            id="identifier"
            type="text"
            autoComplete="username"
            required
            value={identifier}
            onFocus={() => setFocused('id')}
            onBlur={() => setFocused(null)}
            onChange={(e) => {
              setIdentifier(e.target.value)
              setSelectedDemo(null)
            }}
            placeholder="Nom d'utilisateur ou email"
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
        className="group w-full h-12 mt-2 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-[#1A1A2E] text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2"
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

      <div className="pt-3">
        <div className="rounded-2xl border border-orange-200/60 bg-gradient-to-b from-orange-50/60 to-orange-50/30 px-4 py-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
              Comptes de démonstration
            </p>
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          </div>
          <p className="text-[11px] text-orange-600/70 text-center mb-3">
            Cliquez sur un rôle pour remplir automatiquement les identifiants
          </p>
          <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {demoUsers.map((du) => {
              const roleColor = getRoleColor(du.role)
              const roleLabel = getRoleLabel(du.role)
              const isSelected = selectedDemo === du.username

              return (
                <button
                  key={du.username}
                  type="button"
                  onClick={() => handleDemoClick(du.username)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all duration-200',
                    'hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]',
                    isSelected
                      ? 'border-orange-300 bg-orange-100/80 shadow-sm ring-1 ring-orange-400/30'
                      : cn(
                          roleColor.border,
                          roleColor.bg,
                          'hover:border-orange-300/60'
                        )
                  )}
                >
                  <span
                    className={cn(
                      'shrink-0 w-2.5 h-2.5 rounded-full',
                      du.role === 'super_admin'
                        ? 'bg-rose-500'
                        : du.role === 'admin'
                          ? 'bg-orange-500'
                          : du.role === 'support'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                    )}
                  />
                  <span className={cn('text-xs font-semibold shrink-0', roleColor.text)}>
                    {roleLabel}
                  </span>
                  <span className="text-orange-300/60 text-[10px]">•</span>
                  <span className="text-xs text-[#6B7280] truncate flex-1">{du.name}</span>
                  <code
                    className={cn(
                      'text-[10px] font-mono px-1.5 py-0.5 rounded-md shrink-0 border',
                      isSelected
                        ? 'bg-orange-100 border-orange-300 text-orange-700'
                        : 'bg-white/80 border-[#E5E7EB] text-[#6B7280]'
                    )}
                  >
                    {du.username}
                  </code>
                </button>
              )
            })}
          </div>
          <p className="text-[10px] text-orange-500/60 text-center mt-2.5">
            Mot de passe commun : <code className="font-mono bg-white/80 px-1.5 py-0.5 rounded border border-orange-100 text-[#6B7280]">besttrans2025</code>
          </p>
        </div>
      </div>
    </form>
  )
}
