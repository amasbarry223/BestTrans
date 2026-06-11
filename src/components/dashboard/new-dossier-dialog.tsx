'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const regimes = ['Consommation', 'Entrepôt', 'AT', 'Transit T1']
const bureaux = ['Bamako-Sénou', 'Bamako-City', 'Kayes', 'Sikasso']
const types = ['Import', 'Export', 'Transit', 'Réexportation']
const corridors = ['Dakar-Bamako', 'Abidjan-Bamako', 'Lomé-Bamako', 'Tema-Bamako', 'Conakry-Bamako']

export function NewDossierDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    type: 'Import',
    clientName: '',
    regime: 'Consommation',
    blLta: '',
    bureau: 'Bamako-Sénou',
    merchandise: '',
    colis: '',
    poids: '',
    containerInfo: '',
    corridor: 'Dakar-Bamako',
    honoraires: '',
    droitsTaxes: '',
    observations: '',
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.clientName || !form.blLta || !form.merchandise) {
      toast.error('Veuillez remplir les champs obligatoires')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/dossiers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Erreur')

      const dossier = await res.json()
      toast.success('Dossier créé', {
        description: `Le dossier ${dossier.number} a été créé avec succès.`,
      })
      setOpen(false)
      setForm({
        type: 'Import',
        clientName: '',
        regime: 'Consommation',
        blLta: '',
        bureau: 'Bamako-Sénou',
        merchandise: '',
        colis: '',
        poids: '',
        containerInfo: '',
        corridor: 'Dakar-Bamako',
        honoraires: '',
        droitsTaxes: '',
        observations: '',
      })
    } catch {
      toast.error('Erreur lors de la création du dossier')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="w-4 h-4" /> Nouveau Dossier
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-teal-600" />
            Nouveau dossier de transit
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Type d&apos;opération *</label>
              <select
                value={form.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Client *</label>
              <input
                type="text"
                required
                value={form.clientName}
                onChange={(e) => handleChange('clientName', e.target.value)}
                placeholder="Raison sociale du client"
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Régime douanier *</label>
              <select
                value={form.regime}
                onChange={(e) => handleChange('regime', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {regimes.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">BL / LTA *</label>
              <input
                type="text"
                required
                value={form.blLta}
                onChange={(e) => handleChange('blLta', e.target.value)}
                placeholder="N° connaissement"
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Bureau de douane</label>
              <select
                value={form.bureau}
                onChange={(e) => handleChange('bureau', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {bureaux.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Corridor</label>
              <select
                value={form.corridor}
                onChange={(e) => handleChange('corridor', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {corridors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Description marchandise *</label>
              <input
                type="text"
                required
                value={form.merchandise}
                onChange={(e) => handleChange('merchandise', e.target.value)}
                placeholder="Nature et description des marchandises"
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Nombre de colis</label>
              <input
                type="number"
                value={form.colis}
                onChange={(e) => handleChange('colis', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Poids</label>
              <input
                type="text"
                value={form.poids}
                onChange={(e) => handleChange('poids', e.target.value)}
                placeholder="ex: 8,5 T"
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Conteneur(s)</label>
              <input
                type="text"
                value={form.containerInfo}
                onChange={(e) => handleChange('containerInfo', e.target.value)}
                placeholder="N° TC, type (ex: MSKU-123 40'HC)"
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Honoraires (FCFA)</label>
              <input
                type="text"
                value={form.honoraires}
                onChange={(e) => handleChange('honoraires', e.target.value)}
                placeholder="ex: 2 500 000"
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Droits & taxes (FCFA)</label>
              <input
                type="text"
                value={form.droitsTaxes}
                onChange={(e) => handleChange('droitsTaxes', e.target.value)}
                placeholder="ex: 8 400 000"
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Observations</label>
              <textarea
                value={form.observations}
                onChange={(e) => handleChange('observations', e.target.value)}
                placeholder="Notes complémentaires..."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  Création...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1.5" />
                  Créer le dossier
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
