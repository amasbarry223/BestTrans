'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Calculator,
  Receipt,
  TrendingUp,
  Info,
  History,
  ArrowRight,
  ArrowLeftRight,
  Landmark,
  Package,
  Trash2,
  ChevronDown,
  Percent,
  BadgeDollarSign,
  Scale,
  FileCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

type RegimeDouanier = 'Consommation' | 'Entrepôt' | 'Transit T1' | 'AT'
type OriginePays = 'UEMOA' | 'Hors UEMOA'

interface CategoryPreset {
  label: string
  hsCode: string
  dc: number
  tci: number
  icon: React.ElementType
}

interface TaxLine {
  name: string
  abbr: string
  base: number
  rate: number
  amount: number
  note?: string
}

interface CalcResult {
  taxes: TaxLine[]
  assietteTVA: number
  totalDroitsTaxes: number
  totalTTC: number
}

interface HistoryEntry {
  id: string
  timestamp: Date
  category: string
  hsCode: string
  valeurCIF: number
  origine: OriginePays
  regime: RegimeDouanier
  totalDroitsTaxes: number
  totalTTC: number
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORY_PRESETS: CategoryPreset[] = [
  { label: 'Matériel agricole',        hsCode: '8432', dc: 0.05, tci: 0.05, icon: Package },
  { label: 'Produits pharmaceutiques',  hsCode: '3004', dc: 0.05, tci: 0,    icon: FileCheck },
  { label: 'Véhicules',                hsCode: '8704', dc: 0.20, tci: 0.10, icon: Landmark },
  { label: 'Tissus & vêtements',       hsCode: '6203', dc: 0.15, tci: 0.10, icon: Scale },
  { label: 'Ciments & matériaux',      hsCode: '2523', dc: 0.10, tci: 0.05, icon: Landmark },
  { label: 'Équipements pétroliers',   hsCode: '8412', dc: 0.05, tci: 0.05, icon: Package },
  { label: 'Produits alimentaires',    hsCode: '2106', dc: 0.10, tci: 0.10, icon: Package },
  { label: 'Électronique',             hsCode: '8517', dc: 0.20, tci: 0.10, icon: Package },
]

const REGIME_OPTIONS: { value: RegimeDouanier; label: string }[] = [
  { value: 'Consommation', label: 'Mise à la consommation' },
  { value: 'Entrepôt',     label: 'Entrepôt sous douane' },
  { value: 'Transit T1',   label: 'Transit T1' },
  { value: 'AT',           label: 'Admission temporaire' },
]

const ORIGINE_OPTIONS: { value: OriginePays; label: string; desc: string }[] = [
  { value: 'UEMOA',       label: 'UEMOA',       desc: 'Bénin, Burkina, Côte d\'Ivoire, Guinée-Bissau, Mali, Niger, Sénégal, Togo' },
  { value: 'Hors UEMOA',  label: 'Hors UEMOA',  desc: 'Autres pays (CEDEAO, Europe, Asie...)' },
]

const DVI_RATE: Record<OriginePays, number> = {
  UEMOA: 0.05,
  'Hors UEMOA': 0.05,
}

const TL_RATE = 0.02
const RS_RATE = 0.01
const PU_RATE: Record<OriginePays, number> = {
  UEMOA: 0,
  'Hors UEMOA': 0.005,
}
const TVA_RATE = 0.18

const QUICK_REFS = [
  { label: 'TVA Mali', value: '18%', icon: Percent, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Franchise dépôt', value: '21 jours', icon: FileCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Droit de douane UEMOA', value: '5%', icon: Landmark, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Délai moy. dédouanement', value: '4,2 jours', icon: TrendingUp, color: 'text-sky-600', bg: 'bg-sky-50' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function fmtPct(n: number): string {
  return (n * 100).toFixed(1).replace(/\.0$/, '') + '%'
}

// ─── Calculation Engine ──────────────────────────────────────────────────────

function compute(
  valeurCIF: number,
  origine: OriginePays,
  dcRate: number,
  tciRate: number,
): CalcResult {
  const dviRate = DVI_RATE[origine]
  const puRate = PU_RATE[origine]

  const dvi = valeurCIF * dviRate
  const dc  = valeurCIF * dcRate
  const tci = valeurCIF * tciRate
  const tl  = valeurCIF * TL_RATE
  const rs  = valeurCIF * RS_RATE
  const pu  = valeurCIF * puRate

  const assietteTVA = valeurCIF + dvi + dc + tci + tl + rs + pu
  const tva = assietteTVA * TVA_RATE

  const totalDroitsTaxes = dvi + dc + tci + tl + rs + pu + tva
  const totalTTC = valeurCIF + totalDroitsTaxes

  const taxes: TaxLine[] = [
    { name: 'Droits de Douane',            abbr: 'DVI', base: valeurCIF, rate: dviRate, amount: dvi },
    { name: 'Droits Conventionnels',       abbr: 'DC',  base: valeurCIF, rate: dcRate,  amount: dc },
    { name: 'Taxe Conv. à l\'Importation', abbr: 'TCI', base: valeurCIF, rate: tciRate, amount: tci },
    { name: 'Taxe de Livraison',           abbr: 'TL',  base: valeurCIF, rate: TL_RATE, amount: tl },
    { name: 'Redevance Statistique',       abbr: 'RS',  base: valeurCIF, rate: RS_RATE, amount: rs },
    ...(puRate > 0
      ? [{ name: 'Prélèvement Union', abbr: 'PU', base: valeurCIF, rate: puRate, amount: pu }]
      : []),
    { name: 'TVA', abbr: 'TVA', base: assietteTVA, rate: TVA_RATE, amount: tva, note: `Assiette: ${fmt(assietteTVA)} FCFA` },
  ]

  return { taxes, assietteTVA, totalDroitsTaxes, totalTTC }
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CalculatriceView() {
  const [hsCode, setHsCode] = useState('')
  const [valeurCIF, setValeurCIF] = useState('')
  const [regime, setRegime] = useState<RegimeDouanier>('Consommation')
  const [origine, setOrigine] = useState<OriginePays>('UEMOA')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showComparison, setShowComparison] = useState(false)

  // Resolve DC/TCI rates from category or manual HS code
  const rates = useMemo(() => {
    const preset = CATEGORY_PRESETS.find((c) => c.label === selectedCategory)
    if (preset) return { dc: preset.dc, tci: preset.tci }
    return { dc: 0.10, tci: 0.05 } // default
  }, [selectedCategory])

  const cifNumber = parseFloat(valeurCIF.replace(/\s/g, '')) || 0

  // Main calculation
  const result = useMemo(() => {
    if (cifNumber <= 0) return null
    return compute(cifNumber, origine, rates.dc, rates.tci)
  }, [cifNumber, origine, rates.dc, rates.tci])

  // Comparison calculation
  const comparison = useMemo(() => {
    if (cifNumber <= 0) return null
    const uemoa = compute(cifNumber, 'UEMOA', rates.dc, rates.tci)
    const horsUemoa = compute(cifNumber, 'Hors UEMOA', rates.dc, rates.tci)
    return { uemoa, horsUemoa, diff: horsUemoa.totalTTC - uemoa.totalTTC }
  }, [cifNumber, rates.dc, rates.tci])

  const handleCategorySelect = useCallback((label: string) => {
    const preset = CATEGORY_PRESETS.find((c) => c.label === label)
    if (preset) {
      setSelectedCategory(label)
      setHsCode(preset.hsCode)
    }
  }, [])

  const handleSaveCalculation = useCallback(() => {
    if (!result || cifNumber <= 0) return
    const entry: HistoryEntry = {
      id: Date.now().toString(36),
      timestamp: new Date(),
      category: selectedCategory || 'Personnalisé',
      hsCode,
      valeurCIF: cifNumber,
      origine,
      regime,
      totalDroitsTaxes: result.totalDroitsTaxes,
      totalTTC: result.totalTTC,
    }
    setHistory((prev) => [entry, ...prev].slice(0, 5))
  }, [result, cifNumber, selectedCategory, hsCode, origine, regime])

  const handleClearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return (
    <div className="h-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#111827]">Calculatrice Douanière</h2>
            <p className="text-xs text-[#6B7280]">Simulation des droits et taxes — Tarifs UEMOA / Mali</p>
          </div>
        </div>
      </div>

      {/* Quick Reference Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {QUICK_REFS.map((ref) => {
          const Icon = ref.icon
          return (
            <div key={ref.label} className="bg-white border border-[#E5E7EB] rounded-xl p-3 flex items-center gap-2.5">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', ref.bg)}>
                <Icon className={cn('w-4 h-4', ref.color)} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#111827] truncate">{ref.value}</p>
                <p className="text-[10px] text-[#6B7280] leading-tight truncate">{ref.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* ─── LEFT: Form ────────────────────────────────────────────────── */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          {/* Category Presets */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <h3 className="text-sm font-semibold text-[#111827] mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-teal-600" />
              Catégorie de marchandise
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORY_PRESETS.map((cat) => {
                const Icon = cat.icon
                const active = selectedCategory === cat.label
                return (
                  <button
                    key={cat.label}
                    onClick={() => handleCategorySelect(cat.label)}
                    className={cn(
                      'flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors border text-xs font-medium',
                      active
                        ? 'bg-teal-50 border-teal-300 text-teal-800'
                        : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#374151] hover:border-teal-200 hover:bg-teal-50/50'
                    )}
                  >
                    <Icon className={cn('w-3.5 h-3.5 shrink-0', active ? 'text-teal-600' : 'text-[#9CA3AF]')} />
                    <span className="truncate">{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Form Fields */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-2">
              <Receipt className="w-4 h-4 text-teal-600" />
              Paramètres du calcul
            </h3>

            {/* Code SH */}
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1.5">
                Code SH (Système Harmonisé)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={hsCode}
                  onChange={(e) => {
                    setHsCode(e.target.value)
                    // Deselect category if user types manually
                    const matching = CATEGORY_PRESETS.find((c) => c.hsCode === e.target.value)
                    if (!matching) setSelectedCategory('')
                    else setSelectedCategory(matching.label)
                  }}
                  placeholder="ex: 8704"
                  className="w-full px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono"
                />
                {selectedCategory && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700">
                    Auto
                  </span>
                )}
              </div>
            </div>

            {/* Valeur CIF */}
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1.5">
                Valeur CIF (FCFA)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={valeurCIF}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^\d\s]/g, '')
                    setValeurCIF(raw)
                  }}
                  placeholder="ex: 10 000 000"
                  className="w-full pl-3 pr-16 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#9CA3AF]">
                  FCFA
                </span>
              </div>
              <p className="mt-1 text-[10px] text-[#9CA3AF]">
                Coût + Assurance + Fret
              </p>
            </div>

            {/* Régime douanier */}
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1.5">
                Régime douanier
              </label>
              <div className="relative">
                <select
                  value={regime}
                  onChange={(e) => setRegime(e.target.value as RegimeDouanier)}
                  className="w-full appearance-none px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white pr-8"
                >
                  {REGIME_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
              </div>
            </div>

            {/* Pays d'origine */}
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1.5">
                Pays d&apos;origine
              </label>
              <div className="space-y-2">
                {ORIGINE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setOrigine(opt.value)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors',
                      origine === opt.value
                        ? 'bg-teal-50 border-teal-300'
                        : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-teal-200'
                    )}
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                        origine === opt.value ? 'border-teal-600' : 'border-[#D1D5DB]'
                      )}
                    >
                      {origine === opt.value && (
                        <div className="w-2 h-2 rounded-full bg-teal-600" />
                      )}
                    </div>
                    <div>
                      <p className={cn(
                        'text-sm font-medium',
                        origine === opt.value ? 'text-teal-800' : 'text-[#374151]'
                      )}>
                        {opt.label}
                      </p>
                      <p className="text-[10px] text-[#9CA3AF]">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Rates display */}
            <div className="bg-[#F9FAFB] rounded-lg p-3 space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                Taux applicables
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B7280]">DVI</span>
                  <span className="font-semibold text-[#111827]">{fmtPct(DVI_RATE[origine])}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B7280]">DC</span>
                  <span className="font-semibold text-[#111827]">{fmtPct(rates.dc)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B7280]">TCI</span>
                  <span className="font-semibold text-[#111827]">{fmtPct(rates.tci)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B7280]">TL</span>
                  <span className="font-semibold text-[#111827]">{fmtPct(TL_RATE)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B7280]">RS</span>
                  <span className="font-semibold text-[#111827]">{fmtPct(RS_RATE)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B7280]">PU</span>
                  <span className={cn(
                    'font-semibold',
                    PU_RATE[origine] > 0 ? 'text-amber-600' : 'text-[#111827]'
                  )}>
                    {PU_RATE[origine] > 0 ? fmtPct(PU_RATE[origine]) : '0%'}
                  </span>
                </div>
                <div className="flex justify-between text-xs col-span-2 pt-1 border-t border-[#E5E7EB]">
                  <span className="text-[#6B7280]">TVA</span>
                  <span className="font-bold text-teal-700">{fmtPct(TVA_RATE)}</span>
                </div>
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSaveCalculation}
              disabled={!result}
              className={cn(
                'w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors',
                result
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-gray-100 text-[#9CA3AF] cursor-not-allowed'
              )}
            >
              <Receipt className="w-4 h-4" />
              Enregistrer le calcul
            </button>
          </div>
        </div>

        {/* ─── CENTER: Results ───────────────────────────────────────────── */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          {/* Results card */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex-1">
            <h3 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
              <BadgeDollarSign className="w-4 h-4 text-teal-600" />
              Décomposition des taxes
            </h3>

            {result ? (
              <div className="space-y-3">
                {/* Tax lines */}
                <div className="space-y-0">
                  {result.taxes.map((tax) => (
                    <div
                      key={tax.abbr}
                      className={cn(
                        'flex items-start justify-between py-2.5 border-b border-[#F3F4F6] last:border-b-0',
                        tax.abbr === 'TVA' && 'bg-teal-50/50 -mx-2 px-2 rounded-lg border-b-0 mt-1 py-3'
                      )}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            'text-[10px] font-bold px-1.5 py-0.5 rounded',
                            tax.abbr === 'TVA' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-[#6B7280]'
                          )}>
                            {tax.abbr}
                          </span>
                          <span className={cn(
                            'text-xs font-medium',
                            tax.abbr === 'TVA' ? 'text-teal-800' : 'text-[#374151]'
                          )}>
                            {tax.name}
                          </span>
                        </div>
                        {tax.note && (
                          <p className="text-[10px] text-[#9CA3AF] mt-0.5 ml-9">{tax.note}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className={cn(
                          'text-sm font-bold',
                          tax.abbr === 'TVA' ? 'text-teal-700' : 'text-[#111827]'
                        )}>
                          {fmt(tax.amount)} <span className="text-[10px] font-normal text-[#9CA3AF]">FCFA</span>
                        </p>
                        <p className="text-[10px] text-[#9CA3AF]">
                          {fmt(tax.base)} × {fmtPct(tax.rate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Separator */}
                <div className="border-t-2 border-teal-200" />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-[#6B7280]">Valeur CIF</span>
                    <span className="text-sm font-semibold text-[#111827]">
                      {fmt(cifNumber)} <span className="text-[10px] font-normal text-[#9CA3AF]">FCFA</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-[#6B7280]">Total droits & taxes</span>
                    <span className="text-sm font-bold text-amber-600">
                      +{fmt(result.totalDroitsTaxes)} <span className="text-[10px] font-normal text-[#9CA3AF]">FCFA</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 bg-teal-600 rounded-lg">
                    <span className="text-xs font-semibold text-teal-100">Total TTC</span>
                    <span className="text-base font-bold text-white">
                      {fmt(result.totalTTC)} <span className="text-[10px] font-normal text-teal-200">FCFA</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[10px] text-[#9CA3AF]">Taux d&apos;imposition effectif</span>
                    <span className="text-xs font-semibold text-teal-700">
                      {cifNumber > 0 ? ((result.totalDroitsTaxes / cifNumber) * 100).toFixed(1) : '0'}%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                  <Calculator className="w-7 h-7 text-[#D1D5DB]" />
                </div>
                <p className="text-sm font-medium text-[#6B7280]">Aucun calcul en cours</p>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  Entrez une valeur CIF pour voir la décomposition
                </p>
              </div>
            )}
          </div>

          {/* Regime info */}
          {regime !== 'Consommation' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-800">
                    Régime: {regime}
                  </p>
                  <p className="text-[10px] text-amber-700 mt-0.5">
                    {regime === 'Entrepôt' && 'Les droits et taxes sont suspendus tant que la marchandise reste en entrepôt sous douane.'}
                    {regime === 'Transit T1' && 'Les droits et taxes sont suspendus pendant le transit. Ils seront exigibles à destination.'}
                    {regime === 'AT' && 'Admission temporaire: les droits et taxes sont suspendus pour une durée limitée. Caution éventuelle requise.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── RIGHT: Comparison & History ───────────────────────────────── */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          {/* Comparison */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-teal-600" />
                Comparaison UEMOA
              </h3>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={cn(
                  'text-[10px] font-semibold px-2 py-1 rounded-md transition-colors',
                  showComparison
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'
                )}
              >
                {showComparison ? 'Masquer' : 'Voir détail'}
              </button>
            </div>

            {comparison ? (
              <div className="space-y-3">
                {/* Side-by-side totals */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
                    <p className="text-[10px] font-semibold text-emerald-600 uppercase">UEMOA</p>
                    <p className="text-base font-bold text-emerald-800 mt-1">
                      {fmt(comparison.uemoa.totalTTC)}
                    </p>
                    <p className="text-[10px] text-emerald-600">FCFA TTC</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                    <p className="text-[10px] font-semibold text-amber-600 uppercase">Hors UEMOA</p>
                    <p className="text-base font-bold text-amber-800 mt-1">
                      {fmt(comparison.horsUemoa.totalTTC)}
                    </p>
                    <p className="text-[10px] text-amber-600">FCFA TTC</p>
                  </div>
                </div>

                {/* Difference */}
                <div className="flex items-center justify-center gap-2 py-2 px-3 bg-rose-50 border border-rose-200 rounded-lg">
                  <ArrowRight className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-xs text-rose-700">
                    Surcoût hors UEMOA: <span className="font-bold">{fmt(comparison.diff)} FCFA</span>
                  </span>
                </div>

                {/* Detailed comparison */}
                {showComparison && (
                  <div className="mt-2 border border-[#E5E7EB] rounded-lg overflow-hidden">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr className="bg-[#F9FAFB]">
                          <th className="py-2 px-2 text-left font-semibold text-[#9CA3AF] uppercase">Taxe</th>
                          <th className="py-2 px-2 text-right font-semibold text-emerald-600 uppercase">UEMOA</th>
                          <th className="py-2 px-2 text-right font-semibold text-amber-600 uppercase">Hors</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparison.uemoa.taxes.map((tax, i) => {
                          const horsTax = comparison.horsUemoa.taxes.find((t) => t.abbr === tax.abbr)
                          return (
                            <tr key={tax.abbr} className={cn(
                              'border-t border-[#F3F4F6]',
                              tax.abbr === 'TVA' && 'bg-teal-50/30'
                            )}>
                              <td className="py-1.5 px-2 font-semibold text-[#374151]">{tax.abbr}</td>
                              <td className="py-1.5 px-2 text-right font-medium text-emerald-700">{fmt(tax.amount)}</td>
                              <td className="py-1.5 px-2 text-right font-medium text-amber-700">
                                {horsTax ? fmt(horsTax.amount) : '—'}
                              </td>
                            </tr>
                          )
                        })}
                        <tr className="border-t-2 border-teal-200 bg-teal-50/50">
                          <td className="py-2 px-2 font-bold text-teal-800">Total</td>
                          <td className="py-2 px-2 text-right font-bold text-emerald-800">
                            {fmt(comparison.uemoa.totalDroitsTaxes)}
                          </td>
                          <td className="py-2 px-2 text-right font-bold text-amber-800">
                            {fmt(comparison.horsUemoa.totalDroitsTaxes)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-xs text-[#9CA3AF]">
                  Entrez une valeur CIF pour comparer
                </p>
              </div>
            )}
          </div>

          {/* History */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                <History className="w-4 h-4 text-teal-600" />
                Historique
              </h3>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-1 text-[10px] font-medium text-rose-500 hover:text-rose-700 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Effacer
                </button>
              )}
            </div>

            {history.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-[#111827]">{entry.category}</span>
                      <span className={cn(
                        'text-[10px] font-semibold px-1.5 py-0.5 rounded',
                        entry.origine === 'UEMOA' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      )}>
                        {entry.origine}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] text-[#9CA3AF]">
                        <span className="font-mono">HS {entry.hsCode}</span>
                        <span className="mx-1">·</span>
                        <span>{fmt(entry.valeurCIF)} CIF</span>
                        <span className="mx-1">·</span>
                        <span>{entry.regime}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-[#F3F4F6]">
                      <span className="text-[10px] text-[#6B7280]">Total TTC</span>
                      <span className="text-xs font-bold text-teal-700">{fmt(entry.totalTTC)} FCFA</span>
                    </div>
                    <p className="text-[10px] text-[#9CA3AF] mt-1">
                      {entry.timestamp.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <History className="w-8 h-8 text-[#E5E7EB] mx-auto mb-2" />
                <p className="text-xs text-[#9CA3AF]">Aucun calcul enregistré</p>
                <p className="text-[10px] text-[#D1D5DB] mt-0.5">
                  Effectuez un calcul puis cliquez « Enregistrer »
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
