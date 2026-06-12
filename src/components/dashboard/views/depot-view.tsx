'use client'

import React, { useState } from 'react'
import {
  Search,
  QrCode,
  Keyboard,
  Check,
  ArrowRight,
  ArrowLeft,
  Printer,
  RotateCcw,
  User,
  Phone,
  ShieldCheck,
  Wallet,
  Clock,
  TrendingUp,
  Info,
  ArrowDownToLine,
  HandCoins,
  CircleDollarSign,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { takePendingClient } from '@/components/dashboard/dashboard-context'
import { ReceiptDialog, type ReceiptData } from '@/components/dashboard/receipt-dialog'
import { QrCodeDialog } from '@/components/dashboard/qr-code-dialog'

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

interface ClientInfo {
  initials: string
  name: string
  phone: string
  kycLevel: string
  kycVerified: boolean
  balance: string
}

const mockClient: ClientInfo = {
  initials: 'KD',
  name: 'Koffi Dossou',
  phone: '+223 70 12 34 56',
  kycLevel: 'Niveau 2 - Vérifié',
  kycVerified: true,
  balance: '125,000 FCFA',
}

const quickAmounts = [5_000, 10_000, 25_000, 50_000, 100_000]

function formatFCFA(n: number): string {
  return n.toLocaleString('fr-FR') + ' FCFA'
}

/* ------------------------------------------------------------------ */
/*  Step Indicator                                                     */
/* ------------------------------------------------------------------ */

const steps = [
  { id: 1, label: 'Identification' },
  { id: 2, label: 'Montant' },
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
  const [qrScanOpen, setQrScanOpen] = useState(false)

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
        <p className="text-sm text-[#6B7280] mt-1">Recherchez le client par numéro de téléphone, nom ou scannez son QR code</p>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9CA3AF] pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Rechercher par numéro ou nom..."
          className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
        />
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setQrScanOpen(true)}
          className="flex items-center justify-center gap-2 h-12 rounded-xl border border-[#E5E7EB] bg-white text-sm font-medium text-[#111827] hover:bg-[#F9FAFB] active:scale-[0.98] transition-all"
        >
          <QrCode className="w-5 h-5 text-emerald-600" />
          Scanner QR Code
        </button>
        <button
          type="button"
          onClick={() => toast.info('Saisie manuelle', { description: 'Recherchez le client via le champ ci-dessus.' })}
          className="flex items-center justify-center gap-2 h-12 rounded-xl border border-[#E5E7EB] bg-white text-sm font-medium text-[#111827] hover:bg-[#F9FAFB] active:scale-[0.98] transition-all"
        >
          <Keyboard className="w-5 h-5 text-emerald-600" />
          Saisie manuelle
        </button>
      </div>

      <QrCodeDialog
        open={qrScanOpen}
        onOpenChange={setQrScanOpen}
        mode="scan"
        title="Scanner le QR Code du client"
        description="Simulation (frontend): saisissez le code du client pour remplir la recherche."
        scanPlaceholder="Ex: RIC-CLI-1"
        onScan={(value) => handleSearch(value)}
      />

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
              <span className="font-semibold text-[#111827]">{mockClient.balance}</span>
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
/*  Step 2 – Montant                                                   */
/* ------------------------------------------------------------------ */

function StepMontant({
  client,
  onBack,
  onConfirm,
}: {
  client: ClientInfo
  onBack: () => void
  onConfirm: (amount: number, note: string) => void
}) {
  const [amount, setAmount] = useState<string>('')
  const [note, setNote] = useState('')
  const numericAmount = parseInt(amount.replace(/\D/g, ''), 10) || 0
  const fees = 0
  const total = numericAmount + fees

  function handleAmountChange(val: string) {
    const digits = val.replace(/\D/g, '')
    setAmount(digits)
  }

  function selectQuickAmount(val: number) {
    setAmount(String(val))
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
        <span className="text-xs font-semibold text-emerald-600 whitespace-nowrap">{client.balance}</span>
      </div>

      {/* Amount input */}
      <div>
        <label className="block text-sm font-medium text-[#111827] mb-1.5">Montant du dépôt</label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={amount ? Number(amount).toLocaleString('fr-FR') : ''}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0"
            className="w-full h-16 pl-4 pr-20 rounded-xl border border-[#E5E7EB] bg-white text-2xl font-semibold text-[#111827] text-right placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#6B7280]">FCFA</span>
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

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-[#111827] mb-1.5">Note (optionnel)</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ajouter une note..."
          className="w-full h-11 px-3.5 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
        />
      </div>

      {/* Summary */}
      <div className="rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] p-4 space-y-2.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B7280]">Montant</span>
          <span className="font-medium text-[#111827]">{numericAmount > 0 ? formatFCFA(numericAmount) : '—'}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B7280]">Frais</span>
          <span className="font-medium text-[#111827]">{formatFCFA(fees)}</span>
        </div>
        <div className="h-px bg-[#E5E7EB]" />
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-[#111827]">Total</span>
          <span className="font-bold text-emerald-600">{total > 0 ? formatFCFA(total) : '—'}</span>
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
          disabled={numericAmount <= 0}
          onClick={() => onConfirm(numericAmount, note)}
          className={cn(
            'flex-[2] h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all',
            numericAmount > 0
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] shadow-sm'
              : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
          )}
        >
          Confirmer
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
  onNewDepot,
  onPrintReceipt,
}: {
  client: ClientInfo
  amount: number
  onNewDepot: () => void
  onPrintReceipt: () => void
}) {
  const newBalance = 125_000 + amount

  return (
    <div className="space-y-5">
      {/* Success animation placeholder */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center animate-[scaleIn_0.4s_ease-out]">
          <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center">
            <Check className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
        </div>
        <h3 className="text-lg font-bold text-[#111827]">Dépôt réussi !</h3>
        <p className="text-sm text-[#6B7280]">Le dépôt a été effectué avec succès</p>
      </div>

      {/* Transaction details card */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-3.5">
        <h4 className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Détails de la transaction</h4>

        <div className="space-y-3">
          <DetailRow label="Référence" value="RIC-2025-001234" mono />
          <DetailRow label="Client" value={client.name} />
          <DetailRow label="Montant déposé" value={formatFCFA(amount)} highlight />
          <DetailRow label="Nouveau solde" value={formatFCFA(newBalance)} />
          <DetailRow label="Date" value="25 Mai 2025, 14:30" />
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
          onClick={onNewDepot}
          className="flex-[2] h-12 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-[0.98] shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Nouveau dépôt
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
/*  Right Panel – Contextual Info per step                             */
/* ------------------------------------------------------------------ */

function RightPanel({ step }: { step: number; client: ClientInfo | null; amount: number }) {
  return (
    <div className="space-y-5 h-full">
      {/* Guide card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-semibold text-emerald-800">Guide</h3>
        </div>
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-emerald-700 leading-relaxed">
              Recherchez le client en saisissant son numéro de téléphone ou son nom. Vous pouvez aussi scanner son QR code pour une identification rapide.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <p className="text-xs text-emerald-700">Saisissez le numéro ou scannez le QR</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <p className="text-xs text-emerald-700">Vérifiez les informations client</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                <p className="text-xs text-emerald-700">Cliquez sur Suivant pour continuer</p>
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-emerald-700 leading-relaxed">
              Saisissez le montant du dépôt et ajoutez une note si nécessaire. Les frais de dépôt wallet sont gratuits.
            </p>
            <div className="rounded-lg bg-white border border-emerald-200 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-emerald-700">Rappel</p>
              <p className="text-xs text-emerald-600">• Aucun frais sur les dépôts wallet</p>
              <p className="text-xs text-emerald-600">• Montant minimum : 500 FCFA</p>
              <p className="text-xs text-emerald-600">• Montant maximum : 2 000 000 FCFA</p>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <p className="text-sm text-emerald-700 leading-relaxed">
              Le dépôt a été effectué avec succès. Vous pouvez imprimer le reçu ou effectuer un nouveau dépôt.
            </p>
            <div className="rounded-lg bg-white border border-emerald-200 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-emerald-700">Prochaines étapes</p>
              <p className="text-xs text-emerald-600">• Remettez le reçu au client</p>
              <p className="text-xs text-emerald-600">• Confirmez la notification SMS</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
            <ArrowDownToLine className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Dépôts aujourd&apos;hui</p>
            <p className="text-base font-bold text-[#111827]">18</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
            <CircleDollarSign className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Volume total</p>
            <p className="text-base font-bold text-[#111827]">1.8M</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
            <HandCoins className="w-4.5 h-4.5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Commissions</p>
            <p className="text-base font-bold text-[#111827]">0 FCFA</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
            <TrendingUp className="w-4.5 h-4.5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Moy. par dépôt</p>
            <p className="text-base font-bold text-[#111827]">100K</p>
          </div>
        </div>
      </div>

      {/* Recent deposits */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex-1">
        <h3 className="text-sm font-semibold text-[#111827] mb-3">Derniers dépôts</h3>
        <div className="space-y-3">
          {[
            { name: 'Aïcha Diallo', amount: '150,000 FCFA', time: '09:42', status: 'Succès' },
            { name: 'Ibrahim Saka', amount: '75,000 FCFA', time: '09:28', status: 'Succès' },
            { name: 'Mariam Koné', amount: '200,000 FCFA', time: '09:15', status: 'Succès' },
            { name: 'Ousmane Bah', amount: '50,000 FCFA', time: '08:58', status: 'Succès' },
          ].map((tx, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <ArrowDownToLine className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#111827] truncate">{tx.name}</p>
                <p className="text-xs text-[#9CA3AF]">{tx.time}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-600">+{tx.amount}</p>
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

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

function pendingToClientInfo(pending: NonNullable<ReturnType<typeof takePendingClient>>): ClientInfo {
  return {
    initials: pending.initials,
    name: pending.name,
    phone: pending.phone,
    kycLevel: pending.kycLevel ?? 'Niveau 2 - Vérifié',
    kycVerified: pending.kycVerified ?? true,
    balance: pending.balance ?? '0 FCFA',
  }
}

export function DepotView() {
  const [step, setStep] = useState(() => (takePendingClient() ? 2 : 1))
  const [client, setClient] = useState<ClientInfo | null>(() => {
    const pending = takePendingClient()
    return pending ? pendingToClientInfo(pending) : null
  })
  const [depositAmount, setDepositAmount] = useState(0)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)

  function handleSelectClient(c: ClientInfo) {
    setClient(c)
  }

  function handleNextToAmount() {
    if (client) setStep(2)
  }

  function handleConfirmAmount(amount: number, _note: string) {
    setDepositAmount(amount)
    setStep(3)
    toast.success('Dépôt réussi', { description: `Dépôt de ${formatFCFA(amount)} effectué pour ${client?.name}` })
  }

  function handleNewDepot() {
    setStep(1)
    setClient(null)
    setDepositAmount(0)
  }

  function handlePrintReceipt() {
    if (!client) return
    setReceiptData({
      type: 'Dépôt Wallet',
      reference: 'RIC-2025-001234',
      date: '25 Mai 2025, 14:30',
      agentName: 'Amadou Moussa',
      agentLocation: 'Bamako',
      clientName: client.name,
      clientPhone: client.phone,
      amount: depositAmount,
      fees: 0,
      total: depositAmount,
    })
    setReceiptOpen(true)
  }

  return (
    <div className="h-full w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Dépôt Wallet</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Effectuez un dépôt dans le wallet d&apos;un client</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#9CA3AF]">
          <Clock className="w-3.5 h-3.5" />
          <span>Dernière activité : 14:30</span>
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
            <StepIdentification onSelectClient={handleSelectClient} onNext={handleNextToAmount} />
          )}
          {step === 2 && client && (
            <StepMontant
              client={client}
              onBack={() => setStep(1)}
              onConfirm={handleConfirmAmount}
            />
          )}
          {step === 3 && client && (
            <StepConfirmation
              client={client}
              amount={depositAmount}
              onNewDepot={handleNewDepot}
              onPrintReceipt={handlePrintReceipt}
            />
          )}
        </div>

        {/* Right: Info panel */}
        <div className="lg:col-span-2 overflow-y-auto">
          <RightPanel step={step} client={client} amount={depositAmount} />
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
