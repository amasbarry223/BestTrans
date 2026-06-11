'use client'

import React, { useState } from 'react'
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Printer,
  RotateCcw,
  QrCode,
  ShieldCheck,
  ChevronDown,
  Send,
  User,
  CreditCard,
  Clock,
  Info,
  ArrowUpFromLine,
  CircleDollarSign,
  TrendingUp,
  HandCoins,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { ReceiptDialog, type ReceiptData } from '@/components/dashboard/receipt-dialog'
import { QrCodeDialog } from '@/components/dashboard/qr-code-dialog'

/* ------------------------------------------------------------------ */
/*  Types & Helpers                                                    */
/* ------------------------------------------------------------------ */

interface TransferDetails {
  reference: string
  expediteur: string
  beneficiaire: string
  montant: number
  statut: string
  dateCreation: string
}

const mockTransfer: TransferDetails = {
  reference: 'RIC-TRF-2025-00890',
  expediteur: 'Ibrahim Saka',
  beneficiaire: 'Aminata Diallo',
  montant: 50_000,
  statut: 'En attente',
  dateCreation: '25 Mai 2025',
}

const idTypes = [
  'Carte nationale d\'identité',
  'Passeport',
  'Permis de conduire',
]

function formatFCFA(n: number): string {
  return n.toLocaleString('fr-FR') + ' FCFA'
}

function onlyDigits(val: string, maxLen: number) {
  return val.replace(/\D/g, '').slice(0, maxLen)
}

/* ------------------------------------------------------------------ */
/*  Step Indicator                                                     */
/* ------------------------------------------------------------------ */

const steps = [
  { id: 1, label: 'Vérification' },
  { id: 2, label: 'Validation' },
  { id: 3, label: 'Paiement' },
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
/*  Step 1 – Vérification du code                                      */
/* ------------------------------------------------------------------ */

function StepVerification({
  onNext,
}: {
  onNext: () => void
}) {
  const [code, setCode] = useState('')
  const [transferFound, setTransferFound] = useState(false)
  const [qrScanOpen, setQrScanOpen] = useState(false)

  function handleCodeChange(value: string) {
    const raw = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    let formatted = raw
    if (raw.length > 3) {
      formatted = raw.slice(0, 3) + '-' + raw.slice(3)
    }
    if (raw.length > 7) {
      formatted = raw.slice(0, 3) + '-' + raw.slice(3, 7) + '-' + raw.slice(7, 11)
    }
    setCode(formatted)

    if (raw.length >= 10) {
      setTransferFound(true)
    } else {
      setTransferFound(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-[#111827]">Vérification du code de retrait</h3>
        <p className="text-sm text-[#6B7280] mt-1">Saisissez le code de retrait fourni par l&apos;expéditeur ou scannez le QR code</p>
      </div>

      {/* Code input */}
      <div>
        <label className="block text-sm font-medium text-[#111827] mb-1.5">Code de retrait</label>
        <div className="relative">
          <input
            type="text"
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="TRF-XXXX-XXXX"
            className="w-full h-16 px-4 rounded-xl border border-[#E5E7EB] bg-white text-xl font-semibold text-[#111827] text-center tracking-widest placeholder:text-[#9CA3AF] placeholder:text-base placeholder:tracking-wider placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow font-mono"
          />
        </div>
      </div>

      {/* OR divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#E5E7EB]" />
        <span className="text-xs font-medium text-[#9CA3AF]">OU</span>
        <div className="flex-1 h-px bg-[#E5E7EB]" />
      </div>

      {/* QR Code scanner button */}
      <button
        type="button"
        onClick={() => setQrScanOpen(true)}
        className="w-full h-12 rounded-xl border-2 border-dashed border-[#E5E7EB] bg-[#F9FAFB] text-sm font-semibold text-[#6B7280] hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <QrCode className="w-5 h-5" />
        Scanner QR Code
      </button>

      <QrCodeDialog
        open={qrScanOpen}
        onOpenChange={setQrScanOpen}
        mode="scan"
        title="Scanner le QR Code du retrait"
        description="Simulation (frontend): saisissez le code de retrait pour remplir automatiquement le champ."
        scanPlaceholder="Ex: TRF-2025-00890"
        onScan={(value) => handleCodeChange(value)}
      />

      {/* Transfer details card (shown when code is found) */}
      {transferFound && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-3.5 animate-[scaleIn_0.3s_ease-out]">
          <h4 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Détails du transfert
          </h4>

          <div className="space-y-3">
            <DetailRow label="Référence" value={mockTransfer.reference} mono />
            <DetailRow label="Expéditeur" value={mockTransfer.expediteur} />
            <DetailRow label="Bénéficiaire" value={mockTransfer.beneficiaire} />
            <DetailRow label="Montant" value={formatFCFA(mockTransfer.montant)} highlight />
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-[#6B7280] shrink-0">Statut</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
                {mockTransfer.statut}
              </span>
            </div>
            <DetailRow label="Date de création" value={mockTransfer.dateCreation} />
          </div>
        </div>
      )}

      {/* Suivant button */}
      <button
        type="button"
        disabled={!transferFound}
        onClick={onNext}
        className={cn(
          'w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all',
          transferFound
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
/*  Step 2 – Vérification identité & Validation                        */
/* ------------------------------------------------------------------ */

function StepValidation({
  onBack,
  onConfirm,
}: {
  onBack: () => void
  onConfirm: () => void
}) {
  const [numeroPiece, setNumeroPiece] = useState('')
  const [typePiece, setTypePiece] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')

  const isFormValid =
    numeroPiece.trim().length > 0 &&
    typePiece.length > 0 &&
    otpSent &&
    otp.length === 6

  return (
    <div className="space-y-5">
      {/* Vérification de l'identité */}
      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-[#111827]">
            Vérification de l&apos;identité du bénéficiaire
          </span>
        </div>

        {/* Nom du bénéficiaire (pre-filled) */}
        <div>
          <label className="block text-sm font-medium text-[#111827] mb-1.5">
            Nom du bénéficiaire
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
            <input
              type="text"
              value={mockTransfer.beneficiaire}
              disabled
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#111827] font-medium cursor-not-allowed"
            />
          </div>
        </div>

        {/* Numéro pièce d'identité */}
        <div>
          <label className="block text-sm font-medium text-[#111827] mb-1.5">
            Numéro pièce d&apos;identité
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
            <input
              type="text"
              value={numeroPiece}
              onChange={(e) => setNumeroPiece(e.target.value)}
              placeholder="Ex: 1234567890123"
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
            />
          </div>
        </div>

        {/* Type pièce dropdown */}
        <div>
          <label className="block text-sm font-medium text-[#111827] mb-1.5">
            Type de pièce
          </label>
          <div className="relative">
            <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
            <select
              value={typePiece}
              onChange={(e) => setTypePiece(e.target.value)}
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

      {/* Validation OTP */}
      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Send className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-[#111827]">Validation OTP</span>
        </div>

        {/* Envoyer OTP button */}
        <button
          type="button"
          onClick={() => setOtpSent(true)}
          disabled={otpSent}
          className={cn(
            'h-10 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all',
            otpSent
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] shadow-sm'
          )}
        >
          <Send className="w-3.5 h-3.5" />
          {otpSent ? 'OTP envoyé ✓' : 'Envoyer OTP au bénéficiaire'}
        </button>

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
          Valider
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Step 3 – Paiement effectué                                         */
/* ------------------------------------------------------------------ */

function StepPaiement({
  onNewRetrait,
  onPrintReceipt,
}: {
  onNewRetrait: () => void
  onPrintReceipt: () => void
}) {
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
        <h3 className="text-lg font-bold text-[#111827]">Paiement effectué avec succès !</h3>
        <p className="text-sm text-[#6B7280]">Le transfert a été payé au bénéficiaire</p>
      </div>

      {/* Details card */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-3.5">
        <h4 className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
          Détails du paiement
        </h4>

        <div className="space-y-3">
          <DetailRow label="Référence" value={mockTransfer.reference} mono />
          <DetailRow label="Bénéficiaire" value={mockTransfer.beneficiaire} />
          <DetailRow label="Montant payé" value={formatFCFA(mockTransfer.montant)} highlight />
          <DetailRow label="Mode" value="Cash" />
          <DetailRow label="Date / Heure" value={`${dateStr}, ${timeStr}`} />
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-[#6B7280] shrink-0">Statut</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              Complété
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

/* ------------------------------------------------------------------ */
/*  Right Panel                                                        */
/* ------------------------------------------------------------------ */

function RightPanel({ step }: { step: number }) {
  return (
    <div className="space-y-5 h-full">
      {/* Guide card */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-violet-600" />
          <h3 className="text-sm font-semibold text-violet-800">Guide Retrait Transfert</h3>
        </div>
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-violet-700 leading-relaxed">
              Saisissez le code de retrait communiqué par l&apos;expéditeur ou scannez le QR code pour retrouver le transfert.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-violet-200 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <p className="text-xs text-violet-700">Saisissez le code TRF-XXXX-XXXX</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-violet-200 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <p className="text-xs text-violet-700">Vérifiez les détails du transfert</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-violet-200 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                <p className="text-xs text-violet-700">Cliquez sur Suivant pour continuer</p>
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-violet-700 leading-relaxed">
              Vérifiez l&apos;identité du bénéficiaire et validez avec un code OTP.
            </p>
            <div className="rounded-lg bg-white border border-violet-200 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-violet-700">Sécurité</p>
              <p className="text-xs text-violet-600">• Vérifiez la pièce d&apos;identité</p>
              <p className="text-xs text-violet-600">• Envoyez un OTP au bénéficiaire</p>
              <p className="text-xs text-violet-600">• Le code est valable 5 minutes</p>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <p className="text-sm text-violet-700 leading-relaxed">
              Le paiement a été effectué avec succès. Remettez le cash au bénéficiaire.
            </p>
            <div className="rounded-lg bg-white border border-violet-200 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-violet-700">Prochaines étapes</p>
              <p className="text-xs text-violet-600">• Comptez et remettez le cash</p>
              <p className="text-xs text-violet-600">• Imprimez le reçu</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center">
            <ArrowUpFromLine className="w-4.5 h-4.5 text-violet-600" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Retraits aujourd&apos;hui</p>
            <p className="text-base font-bold text-[#111827]">8</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center">
            <CircleDollarSign className="w-4.5 h-4.5 text-violet-600" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Volume total</p>
            <p className="text-base font-bold text-[#111827]">850K</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
            <HandCoins className="w-4.5 h-4.5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Commissions</p>
            <p className="text-base font-bold text-[#111827]">12,750</p>
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

      {/* Recent withdrawal transfers */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex-1">
        <h3 className="text-sm font-semibold text-[#111827] mb-3">Derniers retraits transfert</h3>
        <div className="space-y-3">
          {[
            { name: 'Ousmane Bah', amount: '50,000 FCFA', time: '08:58', status: 'Complété' },
            { name: 'Fatou Ndiaye', amount: '25,000 FCFA', time: '08:30', status: 'Complété' },
            { name: 'Aminata Diallo', amount: '75,000 FCFA', time: '08:10', status: 'Complété' },
            { name: 'Ibrahim Saka', amount: '100,000 FCFA', time: '07:50', status: 'Complété' },
          ].map((tx, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                <ArrowUpFromLine className="w-4 h-4 text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#111827] truncate">{tx.name}</p>
                <p className="text-xs text-[#9CA3AF]">{tx.time}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-600">{tx.amount}</p>
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

export function RetraitTransfertView() {
  const [step, setStep] = useState(1)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)

  function handleNewRetrait() {
    setStep(1)
  }

  function handlePrintReceipt() {
    setReceiptData({
      type: 'Retrait Transfert',
      reference: mockTransfer.reference,
      date: '25 Mai 2025, 08:58',
      agentName: 'Amadou Moussa',
      agentLocation: 'Bamako',
      clientName: mockTransfer.beneficiaire,
      clientPhone: '+223 96 55 44 33',
      amount: mockTransfer.montant,
      fees: 0,
      total: mockTransfer.montant,
      additionalDetails: [
        { label: 'Expéditeur', value: mockTransfer.expediteur },
        { label: 'Mode', value: 'Cash' },
        { label: 'Statut', value: 'Complété' },
      ],
    })
    setReceiptOpen(true)
  }

  return (
    <div className="h-full w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Retrait Transfert</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Payez un transfert au bénéficiaire
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#9CA3AF]">
          <Clock className="w-3.5 h-3.5" />
          <span>Dernière activité : 08:58</span>
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
            <StepVerification onNext={() => setStep(2)} />
          )}
          {step === 2 && (
            <StepValidation
              onBack={() => setStep(1)}
              onConfirm={() => {
                setStep(3)
                toast.success('Retrait transfert effectué', { description: `Paiement de ${formatFCFA(mockTransfer.montant)} effectué pour ${mockTransfer.beneficiaire}` })
              }}
            />
          )}
          {step === 3 && (
            <StepPaiement
              onNewRetrait={handleNewRetrait}
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
