'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, Check, Eye, EyeOff, Loader2, Lock, User } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { AuthUser } from '@/lib/auth'

const inputClass =
  'w-full h-12 pl-11 pr-4 rounded-2xl border border-[#E5E7EB]/80 bg-[#F9FAFB]/90 text-[#111827] text-sm placeholder:text-[#9CA3AF] transition-all duration-200 focus:outline-none focus:bg-white focus:border-teal-400/60 focus:ring-4 focus:ring-teal-500/10'

export function LoginForm() {
  const searchParams = useSearchParams()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<'id' | 'pwd' | null>(null)

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
              focused === 'id' ? 'text-teal-500' : 'text-[#9CA3AF]'
            )}
          />
          <input
            id="identifier"
            type="text"
            autoComplete="username"
            required
            value={identifier}
            onFocus={() => setFocused('id')}
            onBlur={() => setFocused(null)}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="dir001 ou email"
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
              focused === 'pwd' ? 'text-teal-500' : 'text-[#9CA3AF]'
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
                  ? 'border-teal-500 bg-teal-500'
                  : 'border-[#D1D5DB] group-hover:border-teal-300'
              )}
            >
              <Check
                className={cn('w-3 h-3 text-white transition-opacity', remember ? 'opacity-100' : 'opacity-0')}
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
          className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
          onClick={() =>
            toast.info('Contactez l\'administrateur système pour réinitialiser votre mot de passe.')
          }
        >
          Mot de passe oublié ?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="login-btn-shine group w-full h-12 mt-2 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-600 text-white font-semibold shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2"
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

      <div className="rounded-2xl border border-dashed border-teal-200/80 bg-teal-50/50 px-4 py-3 mt-2">
        <p className="text-[11px] font-medium text-teal-800/70 text-center mb-1.5">
          Accès démonstration
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <code className="text-xs font-mono bg-white/80 px-2.5 py-1 rounded-lg text-[#374151] border border-teal-100">
            dir001
          </code>
          <span className="text-[#9CA3AF] text-xs">/</span>
          <code className="text-xs font-mono bg-white/80 px-2.5 py-1 rounded-lg text-[#374151] border border-teal-100">
            transit2026
          </code>
        </div>
      </div>
    </form>
  )
}
