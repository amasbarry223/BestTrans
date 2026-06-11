'use client'

import React, { useState } from 'react'
import {
  Search,
  Check,
  ArrowRight,
  ArrowLeft,
  Printer,
  RotateCcw,
  User,
  Phone,
  ShieldCheck,
  Wallet,
  Lock,
  Send,
  Clock,
  TrendingUp,
  Info,
  ArrowUpFromLine,
  HandCoins,
  CircleDollarSign,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { takePendingClient } from '@/components/dashboard/dashboard-context'
import { ReceiptDialog, type ReceiptData } from '@/components/dashboard/receipt-dialog'

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

interface ClientInfo {
  initials: string
  name: string
  phone: string
  kycLevel: string
  kycVerified: boolean
  balance: number
}

const mockClient: ClientInfo = {
  initials: 'FA',
  name: 'Fatou Alazar',
  phone: '+223 96 55 44 33',
  kycLevel: 'Niveau 2 - Vérifié',
  kycVerified: true,
  balance: 78_500,
}

const quickAmounts = [5_000, 10_000, 25_000, 50_000]

function formatFCFA(n: number): string {
  return n.toLocaleString('fr-FR') + ' FCFA'
}

/* ------------------------------------------------------------------ */
/*  Step Indicator                                                     */
/* ------------------------------------------------------------------ */

const steps = [
  { id: 1, label: 'Identification' },
  { id: 2, label: 'Validation' },
  { id: 3, label: 'Confirmation' },
] as const

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.id
        const isActive = currentStep === step.id
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                  isCompleted && 'bg-emerald-600 text-white',
                  isActive && 'bg-emerald-600 text-white ring-4 ring-emerald-100',
                  !isCompleted && !isActive && 'bg-[#E5E7EB] text-[#9CA3AF]'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <span
                className={cn(
                  'text-xs font-medium whitespace-nowrap',
                  isActive ? 'text-emerald-600' : isCompleted ? 'text-emerald-600' : 'text-[#9CA3AF]'
                )}
              >
                {step.label}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-12 sm:w-20 mt-[-18px] mx-2 rounded-full transition-colors',
                  currentStep > step.id ? 'bg-emerald-500' : 'bg-[#E5E7EB]'
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Step 1 – Identification Client                                     */
/* ------------------------------------------------------------------ */

function StepIdentification({
  onSelectClient,
  onNext,
}: {
  onSelectClient: (c: ClientInfo) => void
  onNext: () => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [clientFound, setClientFound] = useState(false)

  function handleSearch(value: string) {
    setSearchQuery(value)
    if (value.length >= 2) {
      setClientFound(true)
      onSelectClient(mockClient)
    } else {
      setClientFound(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-[#111827]">Identification du client</h3>
        <p className="text-sm text-[#6B7280] mt-1">Recherchez le client pour effectuer un retrait de son wallet</p>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9CA3AF] pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Numéro de téléphone ou code client..."
          className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
        />
      </div>

      {/* Client preview card */}
      {clientFound && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-lg font-bold shrink-0">
              {mockClient.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#9CA3AF]" />
                <p className="text-sm font-semibold text-[#111827] truncate">{mockClient.name}</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Phone className="w-4 h-4 text-[#9CA3AF]" />
                <p className="text-sm text-[#6B7280]">{mockClient.phone}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-emerald-200">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              {mockClient.kycLevel}
            </span>
            <div className="flex items-center gap-1.5 text-sm">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-[#111827]">{formatFCFA(mockClient.balance)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Suivant button */}
      <button
        type="button"
        disabled={!clientFound}
        onClick={onNext}
        className={cn(
          'w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all',
          clientFound
            ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] shadow-sm'
            : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
        )}
      >
        Suivant
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Step 2 – Validation & Montant                                      */
/* ------------------------------------------------------------------ */

function StepValidation({
  client,
  onBack,
  onConfirm,
}: {
  client: ClientInfo
  onBack: () => void
  onConfirm: (amount: number) => void
}) {
  const [amount, setAmount] = useState<string>('')
  const [pin, setPin] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')

  const numericAmount = parseInt(amount.replace(/\D/g, ''), 10) || 0
  const fees = 500
  const netToPay = numericAmount > 0 ? numericAmount - fees : 0
  const remainingBalance = client.balance - numericAmount

  const isFormValid = numericAmount >= fees + 1 && pin.length === 4 && otp.length === 6

  function handleAmountChange(val: string) {
    const digits = val.replace(/\D/g, '')
    setAmount(digits)
  }

  function selectQuickAmount(val: number) {
    setAmount(String(val))
  }

  function handleSendOtp() {
    setOtpSent(true)
  }

  function onlyDigits(val: string, maxLen: number) {
    return val.replace(/\D/g, '').slice(0, maxLen)
  }

  return (
    <div className="space-y-5">
      {/* Client mini-card */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold shrink-0">
          {client.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#111827] truncate">{client.name}</p>
          <p className="text-xs text-[#6B7280]">{client.phone}</p>
        </div>
        <span className="text-xs font-semibold text-emerald-600 whitespace-nowrap">
          {formatFCFA(client.balance)}
        </span>
      </div>

      {/* Montant du retrait */}
      <div>
        <label className="block text-sm font-medium text-[#111827] mb-1.5">Montant du retrait</label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={amount ? Number(amount).toLocaleString('fr-FR') : ''}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0"
            className="w-full h-16 pl-4 pr-20 rounded-xl border border-[#E5E7EB] bg-white text-2xl font-semibold text-[#111827] text-right placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#6B7280]">
            FCFA
          </span>
        </div>
      </div>

      {/* Quick amounts */}
      <div>
        <p className="text-xs font-medium text-[#9CA3AF] mb-2">Montants rapides</p>
        <div className="flex flex-wrap gap-2">
          {quickAmounts.map((qa) => (
            <button
              key={qa}
              type="button"
              onClick={() => selectQuickAmount(qa)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95',
                numericAmount === qa
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#F9FAFB] border border-[#E5E7EB] text-[#6B7280] hover:border-emerald-300 hover:text-emerald-600'
              )}
            >
              {formatFCFA(qa)}
            </button>
          ))}
        </div>
      </div>

      {/* Validation section */}
      <div className="space-y-3.5 pt-1">
        <h4 className="text-sm font-semibold text-[#111827]">Validation</h4>

        {/* Code PIN client */}
        <div>
          <label className="block text-sm font-medium text-[#111827] mb-1.5">Code PIN client</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(onlyDigits(e.target.value, 4))}
              placeholder="••••"
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] tracking-[0.3em] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
            />
          </div>
        </div>

        {/* Envoyer OTP */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={otpSent}
            className={cn(
              'h-10 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all',
              otpSent
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] shadow-sm'
            )}
          >
            <Send className="w-3.5 h-3.5" />
            {otpSent ? 'OTP envoyé ✓' : 'Envoyer OTP'}
          </button>
        </div>

        {/* OTP input */}
        {otpSent && (
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1.5">Code OTP</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(onlyDigits(e.target.value, 6))}
              placeholder="000000"
              className="w-full h-11 px-4 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] tracking-[0.3em] text-center placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
            />
          </div>
        )}
      </div>

      {/* Summary card */}
      <div className="rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] p-4 space-y-2.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B7280]">Montant</span>
          <span className="font-medium text-[#111827]">
            {numericAmount > 0 ? formatFCFA(numericAmount) : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B7280]">Frais</span>
          <span className="font-medium text-[#111827]">{formatFCFA(fees)}</span>
        </div>
        <div className="h-px bg-[#E5E7EB]" />
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-[#111827]">Net à payer</span>
          <span className="font-bold text-emerald-600">
            {netToPay > 0 ? formatFCFA(netToPay) : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B7280]">Solde restant</span>
          <span
            className={cn(
              'font-medium',
              remainingBalance < 0 ? 'text-red-500' : 'text-[#111827]'
            )}
          >
            {numericAmount > 0 ? formatFCFA(remainingBalance) : '—'}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 h-12 rounded-xl border border-[#E5E7EB] bg-white text-sm font-semibold text-[#111827] hover:bg-[#F9FAFB] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Précédent
        </button>
        <button
          type="button"
          disabled={!isFormValid}
          onClick={() => onConfirm(numericAmount)}
          className={cn(
            'flex-[2] h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all',
            isFormValid
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] shadow-sm'
              : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
          )}
        >
          Valider le retrait
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Step 3 – Confirmation                                              */
/* ------------------------------------------------------------------ */

function StepConfirmation({
  client,
  amount,
  onNewRetrait,
  onPrintReceipt,
}: {
  client: ClientInfo
  amount: number
  onNewRetrait: () => void
  onPrintReceipt: () => void
}) {
  const fees = 500
  const cashToRemit = amount - fees
  const remainingBalance = client.balance - amount

  const now = new Date()
  const dateStr = now.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const timeStr = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="space-y-5">
      {/* Success animation */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center animate-[scaleIn_0.4s_ease-out]">
          <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center">
            <Check className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
        </div>
        <h3 className="text-lg font-bold text-[#111827]">Retrait réussi !</h3>
        <p className="text-sm text-[#6B7280]">Le retrait a été effectué avec succès</p>
      </div>

      {/* Transaction details card */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-3.5">
        <h4 className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
          Détails de la transaction
        </h4>

        <div className="space-y-3">
          <DetailRow label="Référence" value="RIC-RET-2025-00567" mono />
          <DetailRow label="Client" value={client.name} />
          <DetailRow label="Montant retiré" value={formatFCFA(amount)} highlight />
          <DetailRow label="Frais" value={formatFCFA(fees)} />
          <DetailRow label="Cash à remettre" value={formatFCFA(cashToRemit)} highlight />
          <DetailRow label="Solde restant" value={formatFCFA(remainingBalance)} />
          <DetailRow label="Date et heure" value={`${dateStr}, ${timeStr}`} />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onPrintReceipt}
          className="flex-1 h-12 rounded-xl border border-[#E5E7EB] bg-white text-sm font-semibold text-[#111827] hover:bg-[#F9FAFB] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Imprimer reçu
        </button>
        <button
          type="button"
          onClick={onNewRetrait}
          className="flex-[2] h-12 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-[0.98] shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Nouveau retrait
        </button>
      </div>
    </div>
  )
}

function DetailRow({
  label,
  value,
  mono,
  highlight,
}: {
  label: string
  value: string
  mono?: boolean
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-[#6B7280] shrink-0">{label}</span>
      <span
        className={cn(
          'text-sm font-medium text-right truncate',
          highlight ? 'text-emerald-600 font-bold' : 'text-[#111827]',
          mono && 'font-mono text-xs'
        )}
      >
        {value}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Right Panel                                                        */
/* ------------------------------------------------------------------ */

function RightPanel({ step }: { step: number; client: ClientInfo | null }) {
  return (
    <div className="space-y-5 h-full">
      {/* Guide card */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-semibold text-amber-800">Guide Retrait</h3>
        </div>
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-amber-700 leading-relaxed">
              Recherchez le client souhaitant effectuer un retrait. Vérifiez son identité et son solde disponible.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <p className="text-xs text-amber-700">Saisissez le numéro du client</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <p className="text-xs text-amber-700">Vérifiez le solde et le niveau KYC</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                <p className="text-xs text-amber-700">Cliquez sur Suivant pour continuer</p>
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-amber-700 leading-relaxed">
              Saisissez le montant du retrait et validez avec le code PIN et OTP du client.
            </p>
            <div className="rounded-lg bg-white border border-amber-200 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-amber-700">Rappel</p>
              <p className="text-xs text-amber-600">• Frais de retrait : 500 FCFA</p>
              <p className="text-xs text-amber-600">• Montant minimum : 1 000 FCFA</p>
              <p className="text-xs text-amber-600">• Vérifiez le solde du client</p>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <p className="text-sm text-amber-700 leading-relaxed">
              Le retrait a été effectué avec succès. Remettez le cash au client.
            </p>
            <div className="rounded-lg bg-white border border-amber-200 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-amber-700">Prochaines étapes</p>
              <p className="text-xs text-amber-600">• Remettez le cash au client</p>
              <p className="text-xs text-amber-600">• Imprimez le reçu</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
            <ArrowUpFromLine className="w-4.5 h-4.5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Retraits aujourd&apos;hui</p>
            <p className="text-base font-bold text-[#111827]">12</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
            <CircleDollarSign className="w-4.5 h-4.5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Volume total</p>
            <p className="text-base font-bold text-[#111827]">1.2M</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
            <HandCoins className="w-4.5 h-4.5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Commissions</p>
            <p className="text-base font-bold text-[#111827]">6,000</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
            <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Moy. par retrait</p>
            <p className="text-base font-bold text-[#111827]">100K</p>
          </div>
        </div>
      </div>

      {/* Recent withdrawals */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex-1">
        <h3 className="text-sm font-semibold text-[#111827] mb-3">Derniers retraits</h3>
        <div className="space-y-3">
          {[
            { name: 'Ibrahim Sow', amount: '75,000 FCFA', time: '09:28', status: 'Succès' },
            { name: 'Aïcha Diallo', amount: '50,000 FCFA', time: '08:55', status: 'Succès' },
            { name: 'Kofi Mensah', amount: '25,000 FCFA', time: '08:30', status: 'Succès' },
            { name: 'Fatou Ndiaye', amount: '100,000 FCFA', time: '08:15', status: 'Succès' },
          ].map((tx, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <ArrowUpFromLine className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#111827] truncate">{tx.name}</p>
                <p className="text-xs text-[#9CA3AF]">{tx.time}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-rose-600">-{tx.amount}</p>
                <span className="inline-block px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function parseBalanceFCFA(value?: string): number {
  if (!value) return 0
  const digits = value.replace(/[^\d]/g, '')
  return Number(digits) || 0
}

function pendingToClientInfo(
  pending: NonNullable<ReturnType<typeof takePendingClient>>
): ClientInfo {
  return {
    initials: pending.initials,
    name: pending.name,
    phone: pending.phone,
    kycLevel: pending.kycLevel ?? 'Niveau 2 - Vérifié',
    kycVerified: pending.kycVerified ?? true,
    balance: parseBalanceFCFA(pending.balance),
  }
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function RetraitView() {
  const [client, setClient] = useState<ClientInfo | null>(() => {
    const pending = takePendingClient()
    return pending ? pendingToClientInfo(pending) : null
  })
  const [step, setStep] = useState(() => (client ? 2 : 1))
  const [withdrawAmount, setWithdrawAmount] = useState(0)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)

  function handleSelectClient(c: ClientInfo) {
    setClient(c)
  }

  function handleNextToValidation() {
    if (client) setStep(2)
  }

  function handleConfirmRetrait(amount: number) {
    setWithdrawAmount(amount)
    setStep(3)
    toast.success('Retrait réussi', { description: `Retrait de ${formatFCFA(amount)} effectué pour ${client?.name}` })
  }

  function handleNewRetrait() {
    setStep(1)
    setClient(null)
    setWithdrawAmount(0)
  }

  function handlePrintReceipt() {
    if (!client) return
    const fees = 500
    setReceiptData({
      type: 'Retrait Wallet',
      reference: 'RIC-RET-2025-00567',
      date: '25 Mai 2025, 09:28',
      agentName: 'Amadou Moussa',
      agentLocation: 'Bamako',
      clientName: client.name,
      clientPhone: client.phone,
      amount: withdrawAmount,
      fees: fees,
      total: withdrawAmount,
      additionalDetails: [
        { label: 'Cash à remettre', value: formatFCFA(withdrawAmount - fees) },
        { label: 'Solde restant', value: formatFCFA(client.balance - withdrawAmount) },
      ],
    })
    setReceiptOpen(true)
  }

  return (
    <div className="h-full w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Retrait Wallet</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Effectuez un retrait depuis le wallet d&apos;un client
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#9CA3AF]">
          <Clock className="w-3.5 h-3.5" />
          <span>Dernière activité : 09:28</span>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <StepIndicator currentStep={step} />
      </div>

      {/* Main content: 2-column layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
        {/* Left: Form */}
        <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-xl p-6 overflow-y-auto">
          {step === 1 && (
            <StepIdentification onSelectClient={handleSelectClient} onNext={handleNextToValidation} />
          )}
          {step === 2 && client && (
            <StepValidation
              client={client}
              onBack={() => setStep(1)}
              onConfirm={handleConfirmRetrait}
            />
          )}
          {step === 3 && client && (
            <StepConfirmation
              client={client}
              amount={withdrawAmount}
              onNewRetrait={handleNewRetrait}
              onPrintReceipt={handlePrintReceipt}
            />
          )}
        </div>

        {/* Right: Info panel */}
        <div className="lg:col-span-2 overflow-y-auto">
          <RightPanel step={step} client={client} />
        </div>
      </div>

      {/* Receipt Dialog */}
      <ReceiptDialog
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        data={receiptData}
      />
    </div>
  )
}
