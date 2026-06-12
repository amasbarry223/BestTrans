'use client'

import React from 'react'
import { MapPin, Car, Map, Navigation, Clock, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const activeDrivers = [
  {
    id: 'CH-1042',
    name: 'Amadou Keïta',
    location: 'Kalaban-Coura',
    status: 'En course',
    vehicle: 'Toyota Corolla',
  },
  {
    id: 'CH-1087',
    name: 'Fatoumata Diallo',
    location: 'Badalabougou',
    status: 'En attente',
    vehicle: 'Hyundai Accent',
  },
  {
    id: 'CH-1123',
    name: 'Ibrahim Traoré',
    location: 'Hamdallaye',
    status: 'En course',
    vehicle: 'Renault Logan',
  },
  {
    id: 'CH-0956',
    name: 'Mariam Coulibaly',
    location: 'Sébenikoro',
    status: 'En course',
    vehicle: 'Peugeot 208',
  },
  {
    id: 'CH-0734',
    name: 'Oumar Sidibé',
    location: 'Lafiabougou',
    status: 'En attente',
    vehicle: 'Kia Picanto',
  },
]

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  'En course': {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  'En attente': {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CarteOperationsView() {
  return (
    <div className="h-full w-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">
            Carte opérations
          </h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Suivi en temps réel des chauffeurs et courses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280] bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5">
            <Clock className="w-3.5 h-3.5" />
            Dernière mise à jour : il y a 30s
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Car className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-[#6B7280]">Chauffeurs en ligne</p>
            <p className="text-2xl font-bold text-blue-700">132</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-[#6B7280]">Courses en cours</p>
            <p className="text-2xl font-bold text-blue-700">47</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <p className="text-sm text-[#6B7280]">Zone la plus active</p>
            <p className="text-2xl font-bold text-blue-700">Kalaban-Coura</p>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div
        className="w-full min-h-[500px] rounded-xl overflow-hidden relative"
        style={{
          background:
            'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 25%, #93c5fd 50%, #bfdbfe 75%, #dbeafe 100%)',
        }}
      >
        {/* Decorative grid lines */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute left-0 right-0 border-t border-blue-400"
              style={{ top: `${(i + 1) * 10}%` }}
            />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute top-0 bottom-0 border-l border-blue-400"
              style={{ left: `${(i + 1) * 8.33}%` }}
            />
          ))}
        </div>

        {/* Decorative road-like elements */}
        <div className="absolute top-[30%] left-0 right-0 h-[3px] bg-blue-400/30" />
        <div className="absolute top-[60%] left-0 right-0 h-[2px] bg-blue-400/20" />
        <div className="absolute top-0 bottom-0 left-[25%] w-[3px] bg-blue-400/30" />
        <div className="absolute top-0 bottom-0 left-[70%] w-[2px] bg-blue-400/20" />

        {/* Decorative "pins" on the map */}
        {[
          { top: '25%', left: '35%' },
          { top: '40%', left: '55%' },
          { top: '55%', left: '30%' },
          { top: '35%', left: '70%' },
          { top: '65%', left: '60%' },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"
            style={{ top: pos.top, left: pos.left }}
          />
        ))}

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-xl flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
              <Map className="w-7 h-7 text-blue-600" />
            </div>
            <p className="text-base font-semibold text-blue-700 text-center">
              Carte opérations en temps réel
            </p>
            <p className="text-xs text-blue-500 text-center max-w-[280px]">
              Intégration Google Maps / Mapbox
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] text-blue-600 font-medium">
                132 chauffeurs en ligne
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Drivers List */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-[#111827]">
              Chauffeurs actifs à proximité
            </h2>
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-700 text-xs"
            >
              {activeDrivers.length}
            </Badge>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-y-auto max-h-[320px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#F9FAFB] z-10">
              <tr className="border-b border-[#E5E7EB]">
                <th className="py-2.5 px-5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                  Chauffeur
                </th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                  Localisation
                </th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                  Véhicule
                </th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                  Statut
                </th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {activeDrivers.map((driver) => {
                const style = statusStyles[driver.status] || {
                  bg: 'bg-gray-100',
                  text: 'text-gray-700',
                  dot: 'bg-gray-500',
                }
                return (
                  <tr
                    key={driver.id}
                    className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs shrink-0">
                          {driver.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#111827] group-hover:text-blue-700 transition-colors">
                            {driver.name}
                          </p>
                          <p className="text-[10px] text-[#9CA3AF]">
                            {driver.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-sm text-[#111827]">
                          {driver.location}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-sm text-[#6B7280]">
                      {driver.vehicle}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
                          style.bg,
                          style.text
                        )}
                      >
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            style.dot
                          )}
                        />
                        {driver.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 text-xs gap-1.5"
                      >
                        <Map className="w-3.5 h-3.5" />
                        Voir course
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-[#F3F4F6] max-h-[320px] overflow-y-auto">
          {activeDrivers.map((driver) => {
            const style = statusStyles[driver.status] || {
              bg: 'bg-gray-100',
              text: 'text-gray-700',
              dot: 'bg-gray-500',
            }
            return (
              <div key={driver.id} className="px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs shrink-0">
                  {driver.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#111827] truncate">
                      {driver.name}
                    </p>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ml-2',
                        style.bg,
                        style.text
                      )}
                    >
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          style.dot
                        )}
                      />
                      {driver.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-[#6B7280] truncate">
                      {driver.location} · {driver.vehicle}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs gap-1 h-7 px-2 shrink-0"
                >
                  <Map className="w-3 h-3" />
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
