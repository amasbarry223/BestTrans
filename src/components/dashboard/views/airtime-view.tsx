'use client'

import React, { useState } from 'react'
import {
  Smartphone,
  FileText,
  Phone,
  Zap,
  CheckCircle2,
  Clock,
  Info,
  TrendingUp,
  CircleDollarSign,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const airtimeProviders = [
  { id: 'orange', name: 'Orange', color: 'bg-orange-500', textColor: 'text-white', icon: Phone },
  { id: 'moov', name: 'Moov', color: 'bg-blue-600', textColor: 'text-white', icon: Phone },
  { id: 'telecel', name: 'Telecel', color: 'bg-red-500', textColor: 'text-white', icon: Phone },
]

const billProviders = [
  { id: 'canal', name: 'Canal+', color: 'bg-blue-600', textColor: 'text-white', icon: TvIcon },
  { id: 'edm', name: 'EDM', color: 'bg-amber-500', textColor: 'text-white', icon: Zap },
  { id: 'somagep', name: 'SOMAGEP', color: 'bg-teal-600', textColor: 'text-white', icon: DropletsIcon },
]

const quickAmounts = [100, 250, 500, 1000, 2500, 5000]

/* ------------------------------------------------------------------ */
/*  Icons (inline to avoid import issues)                              */
/* ------------------------------------------------------------------ */

function TvIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="15" x="2" y="7" rx="2" ry="2" /><polyline points="17 2 12 7 7 2" />
    </svg>
  )
}

function DropletsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" /><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Right Panel                                                        */
/* ------------------------------------------------------------------ */

function RightPanel({ activeTab }: { activeTab: 'airtime' | 'factures' }) {
  return (
    <div className="space-y-5 h-full">
      {/* Guide card */}
      <div className={cn(
        'border rounded-xl p-5 space-y-4',
        activeTab === 'airtime'
          ? 'bg-orange-50 border-orange-200'
          : 'bg-blue-50 border-blue-200'
      )}>
        <div className="flex items-center gap-2">
          <Info className={cn('w-5 h-5', activeTab === 'airtime' ? 'text-orange-600' : 'text-blue-600')} />
          <h3 className={cn('text-sm font-semibold', activeTab === 'airtime' ? 'text-orange-800' : 'text-blue-800')}>
            {activeTab === 'airtime' ? 'Guide Airtime' : 'Guide Factures'}
          </h3>
        </div>
        {activeTab === 'airtime' ? (
          <div className="space-y-3">
            <p className="text-sm text-orange-700 leading-relaxed">
              Rechargez le compte mobile d&apos;un client en sélectionnant l&apos;opérateur et le montant.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <p className="text-xs text-orange-700">Sélectionnez l&apos;opérateur</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <p className="text-xs text-orange-700">Entrez le numéro de téléphone</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                <p className="text-xs text-orange-700">Choisissez le montant et confirmez</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-blue-700 leading-relaxed">
              Payez les factures de services (électricité, eau, TV) pour vos clients.
            </p>
            <div className="rounded-lg bg-white border border-blue-200 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-blue-700">Services disponibles</p>
              <p className="text-xs text-blue-600">• Canal+ — Abonnements TV</p>
              <p className="text-xs text-blue-600">• EDM — Électricité</p>
              <p className="text-xs text-blue-600">• SOMAGEP — Eau</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
            <Smartphone className="w-4.5 h-4.5 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Recharges aujourd&apos;hui</p>
            <p className="text-base font-bold text-[#111827]">32</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
            <FileText className="w-4.5 h-4.5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Factures payées</p>
            <p className="text-base font-bold text-[#111827]">15</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
            <CircleDollarSign className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Commissions</p>
            <p className="text-base font-bold text-[#111827]">8,500</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
            <TrendingUp className="w-4.5 h-4.5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Volume total</p>
            <p className="text-base font-bold text-[#111827]">285K</p>
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex-1">
        <h3 className="text-sm font-semibold text-[#111827] mb-3">Opérations récentes</h3>
        <div className="space-y-3">
          {[
            { type: 'Airtime', name: 'Orange - 70 12 34 56', amount: '5,000 FCFA', time: '09:42' },
            { type: 'Facture', name: 'EDM - Compteur #4521', amount: '15,000 FCFA', time: '09:28' },
            { type: 'Airtime', name: 'Moov - 96 55 44 33', amount: '1,000 FCFA', time: '09:15' },
            { type: 'Facture', name: 'Canal+ - Abonnement', amount: '25,000 FCFA', time: '08:58' },
            { type: 'Airtime', name: 'Telecel - 95 22 11 00', amount: '2,500 FCFA', time: '08:45' },
          ].map((tx, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                tx.type === 'Airtime' ? 'bg-orange-100' : 'bg-blue-100'
              )}>
                {tx.type === 'Airtime' 
                  ? <Smartphone className={cn('w-4 h-4', 'text-orange-600')} />
                  : <FileText className={cn('w-4 h-4', 'text-blue-600')} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#111827] truncate">{tx.name}</p>
                <p className="text-xs text-[#9CA3AF]">{tx.time}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-600">{tx.amount}</p>
                <span className={cn(
                  'inline-block px-1.5 py-0.5 rounded-full text-[10px] font-medium',
                  tx.type === 'Airtime' ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'
                )}>
                  {tx.type}
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
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AirtimeView() {
  const [activeTab, setActiveTab] = useState<'airtime' | 'factures'>('airtime')
  const [selectedProvider, setSelectedProvider] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [billRef, setBillRef] = useState('')
  const [billAmount, setBillAmount] = useState('')
  const [success, setSuccess] = useState(false)

  const handleQuickAmount = (val: number) => {
    setAmount(String(val))
  }

  const handleConfirmAirtime = () => {
    toast.success('Rechargement effectué', { description: `Numéro ${phoneNumber} rechargé de ${Number(amount).toLocaleString('fr-FR')} FCFA` })
    setSuccess(true)
  }

  const handleConfirmBill = () => {
    toast.success('Paiement effectué', { description: `Facture payée: ${Number(billAmount).toLocaleString('fr-FR')} FCFA` })
    setSuccess(true)
  }

  const reset = () => {
    setSelectedProvider('')
    setPhoneNumber('')
    setAmount('')
    setBillRef('')
    setBillAmount('')
    setSuccess(false)
  }

  if (success) {
    return (
      <div className="h-full w-full flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#111827]">
              {activeTab === 'airtime' ? 'Airtime' : 'Factures'}
            </h1>
            <p className="text-sm text-[#6B7280] mt-0.5">
              {activeTab === 'airtime' ? 'Rechargez un numéro de téléphone' : 'Payez les factures de services'}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#9CA3AF]">
            <Clock className="w-3.5 h-3.5" />
            <span>14:30</span>
          </div>
        </div>

        {/* Success content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
          <div className="lg:col-span-3 flex items-center justify-center">
            <div className="w-full max-w-lg">
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] mb-1">
                  {activeTab === 'airtime' ? 'Rechargement effectué !' : 'Paiement effectué !'}
                </h3>
                <p className="text-sm text-[#6B7280] mb-6">
                  {activeTab === 'airtime'
                    ? `Le numéro ${phoneNumber || '+223 ...'} a été rechargé de ${Number(amount || 0).toLocaleString('fr-FR')} FCFA`
                    : 'La facture a été payée avec succès'
                  }
                </p>
                <div className="bg-[#F9FAFB] rounded-xl p-4 mb-6 text-left space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">Référence</span>
                    <span className="font-mono text-[#111827]">RIC-AIR-2025-00321</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">Montant</span>
                    <span className="font-semibold text-[#111827]">{Number(amount || billAmount || 0).toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">Date</span>
                    <span className="text-[#111827]">25 Mai 2025, 14:30</span>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="w-full h-12 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Nouvelle opération
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 overflow-y-auto">
            <RightPanel activeTab={activeTab} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">
            {activeTab === 'airtime' ? 'Airtime' : 'Factures'}
          </h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            {activeTab === 'airtime' ? 'Rechargez un numéro de téléphone' : 'Payez les factures de services'}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#9CA3AF]">
          <Clock className="w-3.5 h-3.5" />
          <span>14:30</span>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="bg-[#F9FAFB] rounded-xl p-1 flex max-w-xs">
        <button
          onClick={() => setActiveTab('airtime')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors',
            activeTab === 'airtime'
              ? 'bg-white shadow-sm text-[#111827]'
              : 'text-[#6B7280] hover:text-[#111827]'
          )}
        >
          <Smartphone className="w-4 h-4" />
          Airtime
        </button>
        <button
          onClick={() => setActiveTab('factures')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors',
            activeTab === 'factures'
              ? 'bg-white shadow-sm text-[#111827]'
              : 'text-[#6B7280] hover:text-[#111827]'
          )}
        >
          <FileText className="w-4 h-4" />
          Factures
        </button>
      </div>

      {/* Main content: 2-column layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
        {/* Left: Form */}
        <div className="lg:col-span-3 space-y-5 overflow-y-auto">
          {activeTab === 'airtime' && (
            <>
              {/* Provider selector */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <label className="text-sm font-medium text-[#111827] mb-3 block">Opérateur</label>
                <div className="grid grid-cols-3 gap-3">
                  {airtimeProviders.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProvider(p.id)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                        selectedProvider === p.id
                          ? 'border-emerald-500 bg-emerald-50/50'
                          : 'border-[#E5E7EB] hover:border-[#9CA3AF]'
                      )}
                    >
                      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', p.color)}>
                        <p.icon className={cn('w-5 h-5', p.textColor)} />
                      </div>
                      <span className="text-sm font-medium text-[#111827]">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone number */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <label className="text-sm font-medium text-[#111827] mb-1.5 block">Numéro de téléphone</label>
                <div className="flex items-center gap-2">
                  <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#6B7280] font-medium">
                    +223
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="70 12 34 56"
                    className="flex-1 h-11 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Amount */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <label className="text-sm font-medium text-[#111827] mb-1.5 block">Montant</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full h-14 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 pr-16 text-xl font-semibold text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#9CA3AF]">FCFA</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {quickAmounts.map((qa) => (
                    <button
                      key={qa}
                      onClick={() => handleQuickAmount(qa)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                        amount === String(qa)
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#9CA3AF] hover:text-[#111827]'
                      )}
                    >
                      {qa.toLocaleString('fr-FR')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirm button */}
              <button
                onClick={handleConfirmAirtime}
                disabled={!selectedProvider || !phoneNumber || !amount}
                className={cn(
                  'w-full h-12 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2',
                  selectedProvider && phoneNumber && amount
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                <Smartphone className="w-4 h-4" />
                Confirmer le rechargement
              </button>
            </>
          )}

          {activeTab === 'factures' && (
            <>
              {/* Provider selector */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <label className="text-sm font-medium text-[#111827] mb-3 block">Service</label>
                <div className="grid grid-cols-3 gap-3">
                  {billProviders.map((p) => {
                    const IconComp = p.icon
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProvider(p.id)}
                        className={cn(
                          'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                          selectedProvider === p.id
                            ? 'border-emerald-500 bg-emerald-50/50'
                            : 'border-[#E5E7EB] hover:border-[#9CA3AF]'
                        )}
                      >
                        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', p.color)}>
                          <IconComp className={cn('w-5 h-5', p.textColor)} />
                        </div>
                        <span className="text-sm font-medium text-[#111827]">{p.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Référence */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <label className="text-sm font-medium text-[#111827] mb-1.5 block">
                  Référence / N° compteur
                </label>
                <input
                  type="text"
                  value={billRef}
                  onChange={(e) => setBillRef(e.target.value)}
                  placeholder="Entrez la référence"
                  className="w-full h-11 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Montant */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <label className="text-sm font-medium text-[#111827] mb-1.5 block">Montant</label>
                <div className="relative">
                  <input
                    type="number"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    placeholder="0"
                    className="w-full h-14 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 pr-16 text-xl font-semibold text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#9CA3AF]">FCFA</span>
                </div>
              </div>

              {/* Confirm button */}
              <button
                onClick={handleConfirmBill}
                disabled={!selectedProvider || !billRef || !billAmount}
                className={cn(
                  'w-full h-12 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2',
                  selectedProvider && billRef && billAmount
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                <FileText className="w-4 h-4" />
                Payer la facture
              </button>
            </>
          )}
        </div>

        {/* Right: Info panel */}
        <div className="lg:col-span-2 overflow-y-auto">
          <RightPanel activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}
