'use client'

import React, { useState } from 'react'
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Printer,
  RotateCcw,
  User,
  Phone,
  CreditCard,
  MapPin,
  QrCode,
  ShieldCheck,
  ChevronDown,
  Clock,
  TrendingUp,
  Info,
  Send,
  CircleDollarSign,
  HandCoins,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { takePendingClient } from '@/components/dashboard/dashboard-context'
import { ReceiptDialog, type ReceiptData } from '@/components/dashboard/receipt-dialog'
import { QrCodeDialog } from '@/components/dashboard/qr-code-dialog'

/* ------------------------------------------------------------------ */
/*  Types & Helpers                                                    */
/* ------------------------------------------------------------------ */

interface ExpediteurInfo {
  nomComplet: string
  telephone: string
  numeroPiece: string
  typePiece: string
}

interface BeneficiaireInfo {
  nomComplet: string
  telephone: string
  ville: string
}

const FEE_RATE = 0.015
const MIN_FEE = 500

function calculateFee(amount: number): number {
  return Math.max(Math.round(amount * FEE_RATE), MIN_FEE)
}

function formatFCFA(n: number): string {
  return n.toLocaleString('fr-FR') + ' FCFA'
}

const idTypes = [
  'Carte nationale d\'identité',
  'Passeport',
  'Permis de conduire',
]

const quickAmounts = [10_000, 25_000, 50_000, 100_000, 250_000]

/* ------------------------------------------------------------------ */
/*  Step Indicator                                                     */
/* ------------------------------------------------------------------ */

const steps = [
  { id: 1, label: 'Expéditeur' },
  { id: 2, label: 'Bénéficiaire' },
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
/*  Shared Input Component                                             */
/* ------------------------------------------------------------------ */

function FormInput({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = 'text',
  inputMode,
  rightAddon,
  disabled,
}: {
  label: string
  icon?: React.ElementType
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  inputMode?: string
  rightAddon?: React.ReactNode
  disabled?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#111827] mb-1.5">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
        )}
        <input
          type={type}
          inputMode={inputMode as never}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full h-11 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow',
            Icon ? 'pl-11' : 'pl-3.5',
            rightAddon ? 'pr-20' : 'pr-4'
          )}
        />
        {rightAddon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[#6B7280]">
            {rightAddon}
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Step 1 – Informations Expéditeur                                   */
/* ------------------------------------------------------------------ */

function StepExpediteur({
  expediteur,
  onUpdate,
  onNext,
}: {
  expediteur: ExpediteurInfo
  onUpdate: (field: keyof ExpediteurInfo, value: string) => void
  onNext: () => void
}) {
  const isFormValid =
    expediteur.nomComplet.trim().length > 0 &&
    expediteur.telephone.trim().length > 0 &&
    expediteur.numeroPiece.trim().length > 0 &&
    expediteur.typePiece.length > 0

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-[#111827]">Informations Expéditeur</h3>
        <p className="text-sm text-[#6B7280] mt-1">Renseignez les informations de l&apos;expéditeur du transfert</p>
      </div>

      {/* Expéditeur card */}
      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-[#111827]">Expéditeur</span>
        </div>

        <FormInput
          label="Nom complet"
          icon={User}
          value={expediteur.nomComplet}
          onChange={(v) => onUpdate('nomComplet', v)}
          placeholder="Ex: Ibrahim Saka"
        />

        <FormInput
          label="Téléphone"
          icon={Phone}
          value={expediteur.telephone}
          onChange={(v) => onUpdate('telephone', v)}
          placeholder="70 12 34 56"
          inputMode="tel"
          rightAddon={<span className="text-xs text-[#6B7280]">+223</span>}
        />

        <FormInput
          label="Numéro pièce d'identité"
          icon={CreditCard}
          value={expediteur.numeroPiece}
          onChange={(v) => onUpdate('numeroPiece', v)}
          placeholder="Ex: 1234567890123"
        />

        {/* Type pièce dropdown */}
        <div>
          <label className="block text-sm font-medium text-[#111827] mb-1.5">Type de pièce</label>
          <div className="relative">
            <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
            <select
              value={expediteur.typePiece}
              onChange={(e) => onUpdate('typePiece', e.target.value)}
              className="w-full h-11 pl-11 pr-10 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
            >
              <option value="" disabled>
                Sélectionner le type
              </option>
              {idTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Suivant button */}
      <button
        type="button"
        disabled={!isFormValid}
        onClick={onNext}
        className={cn(
          'w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all',
          isFormValid
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
/*  Step 2 – Bénéficiaire & Montant                                    */
/* ------------------------------------------------------------------ */

function StepBeneficiaire({
  beneficiaire,
  onUpdate,
  amount,
  onAmountChange,
  onBack,
  onConfirm,
}: {
  beneficiaire: BeneficiaireInfo
  onUpdate: (field: keyof BeneficiaireInfo, value: string) => void
  amount: string
  onAmountChange: (v: string) => void
  onBack: () => void
  onConfirm: () => void
}) {
  const numericAmount = parseInt(amount.replace(/\D/g, ''), 10) || 0
  const fees = calculateFee(numericAmount)
  const total = numericAmount + fees

  const isFormValid =
    beneficiaire.nomComplet.trim().length > 0 &&
    beneficiaire.telephone.trim().length > 0 &&
    beneficiaire.ville.trim().length > 0 &&
    numericAmount > 0

  function selectQuickAmount(val: number) {
    onAmountChange(String(val))
  }

  return (
    <div className="space-y-5">
      {/* Bénéficiaire card */}
      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-[#111827]">Bénéficiaire</span>
        </div>

        <FormInput
          label="Nom complet"
          icon={User}
          value={beneficiaire.nomComplet}
          onChange={(v) => onUpdate('nomComplet', v)}
          placeholder="Ex: Aminata Diallo"
        />

        <FormInput
          label="Téléphone"
          icon={Phone}
          value={beneficiaire.telephone}
          onChange={(v) => onUpdate('telephone', v)}
          placeholder="96 55 44 33"
          inputMode="tel"
          rightAddon={<span className="text-xs text-[#6B7280]">+223</span>}
        />

        <FormInput
          label="Ville"
          icon={MapPin}
          value={beneficiaire.ville}
          onChange={(v) => onUpdate('ville', v)}
          placeholder="Ex: Bamako"
        />
      </div>

      {/* Montant card */}
      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-[#111827]">Montant</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111827] mb-1.5">Montant à envoyer</label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={amount ? Number(amount).toLocaleString('fr-FR') : ''}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '')
                onAmountChange(digits)
              }}
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
                    : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-emerald-300 hover:text-emerald-600'
                )}
              >
                {qa.toLocaleString('fr-FR')}
              </button>
            ))}
          </div>
        </div>

        {/* Récapitulatif */}
        <div className="rounded-xl bg-white border border-[#E5E7EB] p-4 space-y-2.5">
          <h4 className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Récapitulatif</h4>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Montant</span>
            <span className="font-medium text-[#111827]">{numericAmount > 0 ? formatFCFA(numericAmount) : '—'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Frais de transfert (1,5%)</span>
            <span className="font-medium text-[#111827]">{numericAmount > 0 ? formatFCFA(fees) : '—'}</span>
          </div>
          <div className="h-px bg-[#E5E7EB]" />
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-[#111827]">Total à payer</span>
            <span className="font-bold text-emerald-600">{total > 0 ? formatFCFA(total) : '—'}</span>
          </div>
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
          onClick={onConfirm}
          className={cn(
            'flex-[2] h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all',
            isFormValid
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] shadow-sm'
              : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
          )}
        >
          Créer le transfert
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Detail Row                                                         */
/* ------------------------------------------------------------------ */

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
/*  Step 3 – Confirmation                                              */
/* ------------------------------------------------------------------ */

function StepConfirmation({
  onNewTransfert,
  onPrintReceipt,
}: {
  onNewTransfert: () => void
  onPrintReceipt: () => void
}) {
  const [qrOpen, setQrOpen] = useState(false)

  return (
    <div className="space-y-5">
      {/* Success animation */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center animate-[scaleIn_0.4s_ease-out]">
          <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center">
            <Check className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
        </div>
        <h3 className="text-lg font-bold text-[#111827]">Transfert créé avec succès !</h3>
        <p className="text-sm text-[#6B7280]">Le code de retrait a été généré</p>
      </div>

      {/* Code de retrait card – prominent */}
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5 space-y-4">
        <h4 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider text-center">
          Code de retrait
        </h4>
        <p className="text-center text-3xl sm:text-4xl font-extrabold text-emerald-600 tracking-widest font-mono">
          TRF-8472-3951
        </p>

        {/* QR Code placeholder */}
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={() => setQrOpen(true)}
            className="w-28 h-28 rounded-xl bg-[#E5E7EB] flex flex-col items-center justify-center gap-1.5 hover:bg-[#D1D5DB] transition-colors"
            aria-label="Afficher le QR code du transfert"
          >
            <QrCode className="w-10 h-10 text-[#9CA3AF]" />
            <span className="text-[10px] font-medium text-[#9CA3AF]">QR Code</span>
          </button>
        </div>

        <p className="text-xs text-emerald-700/70 text-center">
          Communiquez ce code au bénéficiaire pour le retrait
        </p>
      </div>

      <QrCodeDialog
        open={qrOpen}
        onOpenChange={setQrOpen}
        mode="display"
        title="QR Code du transfert"
        description="Le bénéficiaire peut le scanner pour récupérer le code de retrait."
        code="TRF-8472-3951"
      />

      {/* Transaction details card */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-3.5">
        <h4 className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
          Détails du transfert
        </h4>

        <div className="space-y-3">
          <DetailRow label="Référence" value="RIC-TRF-2025-00890" mono />
          <DetailRow label="Expéditeur" value="Ibrahim Saka" />
          <DetailRow label="Bénéficiaire" value="Aminata Diallo" />
          <DetailRow label="Montant" value={formatFCFA(50_000)} highlight />
          <DetailRow label="Frais" value={formatFCFA(750)} />
          <DetailRow label="Total payé" value={formatFCFA(50_750)} />
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-[#6B7280] shrink-0">Statut</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
              En attente de retrait
            </span>
          </div>
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
          onClick={onNewTransfert}
          className="flex-[2] h-12 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-[0.98] shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Nouveau transfert
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Right Panel                                                        */
/* ------------------------------------------------------------------ */

function RightPanel({ step }: { step: number }) {
  return (
    <div className="space-y-5 h-full">
      {/* Guide card */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-semibold text-amber-800">Guide Transfert</h3>
        </div>
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-amber-700 leading-relaxed">
              Renseignez les informations de l&apos;expéditeur. Une pièce d&apos;identité valide est requise.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <p className="text-xs text-amber-700">Nom complet de l&apos;expéditeur</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <p className="text-xs text-amber-700">Numéro de téléphone (+223)</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                <p className="text-xs text-amber-700">Pièce d&apos;identité valide</p>
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-amber-700 leading-relaxed">
              Renseignez les informations du bénéficiaire et le montant à transférer.
            </p>
            <div className="rounded-lg bg-white border border-amber-200 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-amber-700">Tarification</p>
              <p className="text-xs text-amber-600">• Frais : 1,5% du montant</p>
              <p className="text-xs text-amber-600">• Minimum de frais : 500 FCFA</p>
              <p className="text-xs text-amber-600">• Maximum : 2 000 000 FCFA</p>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <p className="text-sm text-amber-700 leading-relaxed">
              Le transfert a été créé. Communiquez le code au bénéficiaire.
            </p>
            <div className="rounded-lg bg-white border border-amber-200 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-amber-700">Important</p>
              <p className="text-xs text-amber-600">• Le code est valable 30 jours</p>
              <p className="text-xs text-amber-600">• Le bénéficiaire doit présenter sa pièce</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
            <Send className="w-4.5 h-4.5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Transferts aujourd&apos;hui</p>
            <p className="text-base font-bold text-[#111827]">15</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
            <CircleDollarSign className="w-4.5 h-4.5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Volume total</p>
            <p className="text-base font-bold text-[#111827]">2.5M</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center">
            <HandCoins className="w-4.5 h-4.5 text-violet-600" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Commissions</p>
            <p className="text-base font-bold text-[#111827]">37,500</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
            <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">En attente</p>
            <p className="text-base font-bold text-[#111827]">3</p>
          </div>
        </div>
      </div>

      {/* Recent transfers */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex-1">
        <h3 className="text-sm font-semibold text-[#111827] mb-3">Derniers transferts</h3>
        <div className="space-y-3">
          {[
            { name: 'Mariam Koné → Aminata D.', amount: '200,000 FCFA', time: '09:15', status: 'En attente' },
            { name: 'Kofi M. → Adama S.', amount: '100,000 FCFA', time: '08:50', status: 'Retiré' },
            { name: 'Ibrahim S. → Fatou N.', amount: '50,000 FCFA', time: '08:30', status: 'Retiré' },
            { name: 'Aïcha D. → Ousmane B.', amount: '75,000 FCFA', time: '08:10', status: 'Retiré' },
          ].map((tx, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Send className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#111827] truncate">{tx.name}</p>
                <p className="text-xs text-[#9CA3AF]">{tx.time}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-amber-600">{tx.amount}</p>
                <span className={cn(
                  'inline-block px-1.5 py-0.5 rounded-full text-[10px] font-medium',
                  tx.status === 'En attente' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                )}>
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

export function TransfertView() {
  const [step, setStep] = useState(1)

  const [expediteur, setExpediteur] = useState<ExpediteurInfo>(() => {
    const pending = takePendingClient()
    if (!pending) {
      return { nomComplet: '', telephone: '', numeroPiece: '', typePiece: '' }
    }
    return {
      nomComplet: pending.name,
      telephone: pending.phone,
      numeroPiece: '',
      typePiece: 'Carte nationale',
    }
  })

  const [beneficiaire, setBeneficiaire] = useState<BeneficiaireInfo>({
    nomComplet: '',
    telephone: '',
    ville: '',
  })

  const [amount, setAmount] = useState('')
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)

  function handleExpediteurUpdate(field: keyof ExpediteurInfo, value: string) {
    setExpediteur((prev) => ({ ...prev, [field]: value }))
  }

  function handleBeneficiaireUpdate(field: keyof BeneficiaireInfo, value: string) {
    setBeneficiaire((prev) => ({ ...prev, [field]: value }))
  }

  function handleNewTransfert() {
    setStep(1)
    setExpediteur({ nomComplet: '', telephone: '', numeroPiece: '', typePiece: '' })
    setBeneficiaire({ nomComplet: '', telephone: '', ville: '' })
    setAmount('')
  }

  function handlePrintReceipt() {
    const numericAmount = parseInt(amount.replace(/\D/g, ''), 10) || 50_000
    const fees = calculateFee(numericAmount)
    setReceiptData({
      type: 'Transfert National',
      reference: 'RIC-TRF-2025-00890',
      date: '25 Mai 2025, 09:15',
      agentName: 'Amadou Moussa',
      agentLocation: 'Bamako',
      clientName: expediteur.nomComplet || 'Ibrahim Saka',
      clientPhone: expediteur.telephone || '+223 70 12 34 56',
      amount: numericAmount,
      fees: fees,
      total: numericAmount + fees,
      additionalDetails: [
        { label: 'Bénéficiaire', value: beneficiaire.nomComplet || 'Aminata Diallo' },
        { label: 'Ville', value: beneficiaire.ville || 'Bamako' },
        { label: 'Code retrait', value: 'TRF-8472-3951' },
      ],
    })
    setReceiptOpen(true)
  }

  return (
    <div className="h-full w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Transfert National</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Envoyez de l&apos;argent à travers le réseau national
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#9CA3AF]">
          <Clock className="w-3.5 h-3.5" />
          <span>Dernière activité : 09:15</span>
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
            <StepExpediteur
              expediteur={expediteur}
              onUpdate={handleExpediteurUpdate}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <StepBeneficiaire
              beneficiaire={beneficiaire}
              onUpdate={handleBeneficiaireUpdate}
              amount={amount}
              onAmountChange={setAmount}
              onBack={() => setStep(1)}
              onConfirm={() => {
                const numericAmount = parseInt(amount.replace(/\D/g, ''), 10) || 0
                setStep(3)
                toast.success('Transfert créé', { description: `Transfert de ${formatFCFA(numericAmount)} créé avec succès` })
              }}
            />
          )}
          {step === 3 && (
            <StepConfirmation
              onNewTransfert={handleNewTransfert}
              onPrintReceipt={handlePrintReceipt}
            />
          )}
        </div>

        {/* Right: Info panel */}
        <div className="lg:col-span-2 overflow-y-auto">
          <RightPanel step={step} />
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
