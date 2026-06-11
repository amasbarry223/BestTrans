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
  Users,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getAllDemoUsers, getRoleLabel, getRoleColor } from '@/lib/auth'
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
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null)
  const identifierRef = useRef<HTMLInputElement>(null)

  const demoUsers = getAllDemoUsers()

  // When a demo user is selected, auto-fill and focus the password field
  useEffect(() => {
    if (selectedDemo) {
      setIdentifier(selectedDemo)
      setPassword('transit2026')
      // Focus the password field after a brief delay for UI update
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
    setPassword('transit2026')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Identifier Input */}
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

      {/* Password Input */}
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

      {/* Remember + Forgot */}
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
          className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
          onClick={() =>
            toast.info(
              "Contactez l'administrateur système pour réinitialiser votre mot de passe."
            )
          }
        >
          Mot de passe oublié ?
        </button>
      </div>

      {/* Submit Button */}
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

      {/* Demo Accounts Section */}
      <div className="pt-3">
        <div className="rounded-2xl border border-teal-200/60 bg-gradient-to-b from-teal-50/60 to-teal-50/30 px-4 py-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
              Comptes de démonstration
            </p>
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
          </div>
          <p className="text-[11px] text-teal-600/70 text-center mb-3">
            Cliquez sur un rôle pour remplir automatiquement les identifiants
          </p>
          <div className="grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
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
                      ? 'border-teal-300 bg-teal-100/80 shadow-sm ring-1 ring-teal-400/30'
                      : cn(
                          roleColor.border,
                          roleColor.bg,
                          'hover:border-teal-300/60'
                        )
                  )}
                >
                  {/* Role color dot */}
                  <span
                    className={cn(
                      'shrink-0 w-2.5 h-2.5 rounded-full',
                      du.role === 'admin'
                        ? 'bg-rose-500'
                        : du.role === 'directeur'
                          ? 'bg-teal-500'
                          : du.role === 'declarant'
                            ? 'bg-amber-500'
                            : du.role === 'agent'
                              ? 'bg-sky-500'
                              : du.role === 'magasinier'
                                ? 'bg-violet-500'
                                : du.role === 'transport'
                                  ? 'bg-orange-500'
                                  : du.role === 'comptable'
                                    ? 'bg-emerald-500'
                                    : du.role === 'commercial'
                                      ? 'bg-pink-500'
                                      : 'bg-gray-500'
                    )}
                  />
                  {/* Role label */}
                  <span
                    className={cn(
                      'text-xs font-semibold shrink-0',
                      roleColor.text
                    )}
                  >
                    {roleLabel}
                  </span>
                  {/* Separator */}
                  <span className="text-teal-300/60 text-[10px]">•</span>
                  {/* Name */}
                  <span className="text-xs text-[#6B7280] truncate flex-1">
                    {du.name}
                  </span>
                  {/* Username badge */}
                  <code
                    className={cn(
                      'text-[10px] font-mono px-1.5 py-0.5 rounded-md shrink-0 border',
                      isSelected
                        ? 'bg-teal-100 border-teal-300 text-teal-700'
                        : 'bg-white/80 border-[#E5E7EB] text-[#6B7280]'
                    )}
                  >
                    {du.username}
                  </code>
                </button>
              )
            })}
          </div>
          <p className="text-[10px] text-teal-500/60 text-center mt-2.5">
            Mot de passe commun : <code className="font-mono bg-white/80 px-1.5 py-0.5 rounded border border-teal-100 text-[#6B7280]">transit2026</code>
          </p>
        </div>
      </div>
    </form>
  )
}
