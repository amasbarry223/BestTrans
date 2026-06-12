'use client'

import { useState } from 'react'
import {
  FileText,
  Search,
  Upload,
  Download,
  Eye,
  Clock,
  CheckCircle2,
  FolderOpen,
  Filter,
  File,
  Image,
  FileArchive,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type DocCategory = 'Connaissement' | 'Déclaration' | 'BAE' | 'Facture' | 'Packing list' | 'Certificat' | 'Manifeste' | 'LTA' | 'Autre'
type DocStatus = 'Validé' | 'En attente' | 'Obsolète'

const docCategoryIcon: Record<string, React.ElementType> = {
  'Connaissement': FileText,
  'Déclaration': FileText,
  'BAE': CheckCircle2,
  'Facture': FileText,
  'Packing list': FileArchive,
  'Certificat': CheckCircle2,
  'Manifeste': File,
  'LTA': FileText,
  'Autre': File,
}

const mockDocuments = [
  { id: '1', name: 'BL-MAEU-123456.pdf', category: 'Connaissement' as DocCategory, dossier: 'TRS-2026-0142', client: 'SCOPEX Mali', uploadedBy: 'A. Diallo', date: '08/03/2026', size: '1.2 MB', status: 'Validé' as DocStatus, version: 1 },
  { id: '2', name: 'Decl-D6-2026-0890.pdf', category: 'Déclaration' as DocCategory, dossier: 'TRS-2026-0142', client: 'SCOPEX Mali', uploadedBy: 'M. Koné', date: '08/03/2026', size: '856 KB', status: 'Validé' as DocStatus, version: 1 },
  { id: '3', name: 'BAE-TRS-2026-0141.pdf', category: 'BAE' as DocCategory, dossier: 'TRS-2026-0141', client: 'MALI TEXTILES SA', uploadedBy: 'A. Diallo', date: '07/03/2026', size: '445 KB', status: 'Validé' as DocStatus, version: 1 },
  { id: '4', name: 'Facture-CMAU-234567.pdf', category: 'Facture' as DocCategory, dossier: 'TRS-2026-0141', client: 'MALI TEXTILES SA', uploadedBy: 'S. Diarra', date: '07/03/2026', size: '320 KB', status: 'Validé' as DocStatus, version: 2 },
  { id: '5', name: 'PL-MSKU-345678.pdf', category: 'Packing list' as DocCategory, dossier: 'TRS-2026-0140', client: 'SOMADIA', uploadedBy: 'M. Koné', date: '07/03/2026', size: '210 KB', status: 'En attente' as DocStatus, version: 1 },
  { id: '6', name: 'CO-SOMADIA-2026.pdf', category: 'Certificat' as DocCategory, dossier: 'TRS-2026-0140', client: 'SOMADIA', uploadedBy: 'A. Diallo', date: '06/03/2026', size: '678 KB', status: 'En attente' as DocStatus, version: 1 },
  { id: '7', name: 'Manifest-OOLU-456789.pdf', category: 'Manifeste' as DocCategory, dossier: 'TRS-2026-0139', client: 'CMA CGM Mali', uploadedBy: 'I. Traoré', date: '06/03/2026', size: '2.1 MB', status: 'Validé' as DocStatus, version: 1 },
  { id: '8', name: 'LTA-TCLU-567890.pdf', category: 'LTA' as DocCategory, dossier: 'TRS-2026-0138', client: 'PHARMACIE POPULAIRE', uploadedBy: 'S. Diarra', date: '06/03/2026', size: '156 KB', status: 'Obsolète' as DocStatus, version: 2 },
]

const stats = [
  { label: 'Documents stockés', value: '342', icon: FileText, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Ce mois', value: '+28', icon: Upload, color: 'text-sky-600', bg: 'bg-sky-50' },
  { label: 'En attente', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Validés', value: '318', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
]

export function GedView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCat, setFilterCat] = useState<string>('all')

  const filtered = mockDocuments.filter((d) => {
    const matchSearch = searchTerm === '' ||
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.dossier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat = filterCat === 'all' || d.category === filterCat
    return matchSearch && matchCat
  })

  return (
    <div className="h-full flex flex-col gap-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', s.bg)}>
                <Icon className={cn('w-5 h-5', s.color)} />
              </div>
              <div>
                <p className="text-xl font-bold text-[#111827]">{s.value}</p>
                <p className="text-xs text-[#6B7280]">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Search & Actions */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Rechercher par nom, dossier, client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Toutes catégories</option>
              <option value="Connaissement">Connaissement</option>
              <option value="Déclaration">Déclaration</option>
              <option value="BAE">BAE</option>
              <option value="Facture">Facture</option>
              <option value="Packing list">Packing list</option>
              <option value="Certificat">Certificat</option>
              <option value="Manifeste">Manifeste</option>
              <option value="LTA">LTA</option>
            </select>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700">
            <Upload className="w-4 h-4" /> Ajouter un document
          </button>
        </div>
      </div>

      {/* Document Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => {
            const IconComp = docCategoryIcon[doc.category] || File
            return (
              <div key={doc.id} className="bg-white border border-[#E5E7EB] rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                    doc.status === 'Validé' ? 'bg-emerald-50' : doc.status === 'En attente' ? 'bg-amber-50' : 'bg-gray-100'
                  )}>
                    <IconComp className={cn(
                      'w-5 h-5',
                      doc.status === 'Validé' ? 'text-emerald-600' : doc.status === 'En attente' ? 'text-amber-600' : 'text-gray-400'
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#111827] truncate">{doc.name}</p>
                    <p className="text-[10px] text-[#9CA3AF]">{doc.category} · v{doc.version}</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-[#6B7280]">
                  <div className="flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate font-mono text-teal-700">{doc.dossier}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{doc.client}</span>
                    <span>{doc.size}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{doc.uploadedBy} · {doc.date}</span>
                    <span className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded',
                      doc.status === 'Validé' ? 'bg-emerald-50 text-emerald-700' :
                      doc.status === 'En attente' ? 'bg-amber-50 text-amber-700' :
                      'bg-gray-100 text-gray-500'
                    )}>
                      {doc.status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-[#F3F4F6]">
                  <button className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                    <Eye className="w-3.5 h-3.5" /> Voir
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-[#6B7280] hover:bg-gray-50 rounded-lg transition-colors">
                    <Download className="w-3.5 h-3.5" /> Télécharger
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
