'use client'

import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

/* ─── Fix Leaflet default icon paths (Next.js / webpack) ─── */
if (typeof window !== 'undefined') {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })
}

/* ─── Driver marker SVG ─── */
function createDriverIcon(color: string, pulse: boolean): L.DivIcon {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      ${pulse ? `
        <circle cx="18" cy="18" r="16" fill="${color}" opacity="0.2">
          <animate attributeName="r"       values="14;22;14" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite"/>
        </circle>` : ''}
      <path d="M18 2 C9.16 2 2 9.16 2 18 C2 30 18 42 18 42 C18 42 34 30 34 18 C34 9.16 26.84 2 18 2Z"
            fill="${color}" stroke="white" stroke-width="2.5"/>
      <circle cx="18" cy="18" r="8" fill="white" opacity="0.95"/>
      <path d="M13 20.5 L14 16.5 L18 16 L22 16.5 L23 20.5 Z" fill="${color}"/>
      <path d="M14.5 16.5 L15.5 14 L20.5 14 L21.5 16.5 Z" fill="${color}"/>
      <circle cx="15" cy="21" r="1.5" fill="${color}"/>
      <circle cx="21" cy="21" r="1.5" fill="${color}"/>
    </svg>`
  return L.divIcon({
    html: svg, className: '',
    iconSize: [36, 44], iconAnchor: [18, 42], popupAnchor: [0, -44],
  })
}

/* ─── Demand (waiting passenger) marker SVG ─── */
function createDemandIcon(): L.DivIcon {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <circle cx="16" cy="16" r="14" fill="#3B82F6" opacity="0.15">
        <animate attributeName="r"       values="12;18;12" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.2;0;0.2"  dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <path d="M16 2 C8.27 2 2 8.27 2 16 C2 27 16 38 16 38 C16 38 30 27 30 16 C30 8.27 23.73 2 16 2Z"
            fill="#3B82F6" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="13" r="4.5" fill="white"/>
      <path d="M8 25 C8.5 20 23.5 20 24 25" fill="white"/>
    </svg>`
  return L.divIcon({
    html: svg, className: '',
    iconSize: [32, 40], iconAnchor: [16, 38], popupAnchor: [0, -40],
  })
}

/* ─── Auto-pan to selected item ─── */
function PanTo({ target }: { target: { lat: number; lng: number } | null }) {
  const map = useMap()
  useEffect(() => {
    if (target) map.setView([target.lat, target.lng], 15, { animate: true })
  }, [target, map])
  return null
}

/* ─── Tile layers ─── */
const TILES = {
  streets:   { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',                                                             attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' },
  satellite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: '© <a href="https://www.esri.com">Esri</a>' },
}

const STATUS_COLOR: Record<string, string> = {
  'En course':  '#F97316',
  'Disponible': '#10B981',
  'Hors ligne': '#9CA3AF',
}

/* ─── Types ─── */
export interface DriverMarker {
  id: string
  name: string
  zone: string
  status: string
  vehicle: string
  lat: number
  lng: number
  courseId?: string
  destination?: string
  note: number
}

export interface DemandMarker {
  id: string
  passager: string
  origine: string
  destination: string
  prixEstime: string
  tempsAttente: string
  lat: number
  lng: number
}

interface Props {
  drivers: DriverMarker[]
  demandes?: DemandMarker[]
  selectedId: string | null
  onSelectDriver: (id: string | null) => void
  layer: 'streets' | 'satellite'
}

/* ─── Map inner ─── */
export default function CarteMapInner({ drivers, demandes = [], selectedId, onSelectDriver, layer }: Props) {
  const selectedDriver = drivers.find(d => d.id === selectedId) ?? null

  return (
    <MapContainer
      center={[12.6392, -8.0029]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer key={layer} url={TILES[layer].url} attribution={TILES[layer].attribution} maxZoom={19} />

      <PanTo target={selectedDriver} />

      {/* Driver markers */}
      {drivers.map(d => {
        const color   = STATUS_COLOR[d.status] ?? '#9CA3AF'
        const pulse   = d.status === 'En course'
        const icon    = createDriverIcon(color, pulse)
        const isSel   = d.id === selectedId

        return (
          <React.Fragment key={d.id}>
            {isSel && (
              <Circle
                center={[d.lat, d.lng]} radius={350}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.08, weight: 1.5, dashArray: '6 4' }}
              />
            )}
            <Marker
              position={[d.lat, d.lng]}
              icon={icon}
              eventHandlers={{ click: () => onSelectDriver(isSel ? null : d.id) }}
            >
              <Popup>
                <div style={{ minWidth: 190, fontFamily: 'inherit' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, color }}>
                      {d.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>{d.name}</div>
                      <div style={{ fontSize: 10, color: '#9CA3AF' }}>{d.id}</div>
                    </div>
                  </div>
                  {[
                    ['Statut',   d.status,      color],
                    ['Véhicule', d.vehicle,     '#111827'],
                    ['Zone',     d.zone,        '#111827'],
                    d.courseId ? ['Course', d.courseId, '#F97316'] : null,
                    d.destination ? ['Destination', d.destination, '#111827'] : null,
                    ['Note', `★ ${d.note}/5`, '#F59E0B'],
                  ].filter((x): x is string[] => x !== null).map(([label, value, clr]) => (
                    <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                      <span style={{ color: '#6B7280' }}>{label}</span>
                      <span style={{ fontWeight: 600, color: clr as string }}>{value}</span>
                    </div>
                  ))}
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        )
      })}

      {/* Demand markers (waiting passengers) */}
      {demandes.map(dem => (
        <Marker key={dem.id} position={[dem.lat, dem.lng]} icon={createDemandIcon()}>
          <Popup>
            <div style={{ minWidth: 190, fontFamily: 'inherit' }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1D4ED8', marginBottom: 8 }}>
                📍 Passager en attente
              </div>
              {[
                ['Passager',    dem.passager],
                ['Prise en charge', dem.origine],
                ['Destination', dem.destination],
                ['Prix estimé', dem.prixEstime],
                ['Attente',     dem.tempsAttente],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                  <span style={{ color: '#6B7280' }}>{label}</span>
                  <span style={{ fontWeight: 600, color: '#111827' }}>{value}</span>
                </div>
              ))}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
