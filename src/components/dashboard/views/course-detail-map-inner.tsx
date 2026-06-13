'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default Leaflet icons in Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

/* ------------------------------------------------------------------ */
/*  Bamako neighborhood coords                                         */
/* ------------------------------------------------------------------ */

const BAMAKO_COORDS: Record<string, [number, number]> = {
  'Kalaban-Coura':       [12.6100, -8.0150],
  'Badalabougou':        [12.6350, -7.9980],
  'Hamdallaye':          [12.6400, -8.0000],
  'Sébenikoro':          [12.6200, -8.0100],
  'Lafiabougou':         [12.6250, -8.0300],
  'Korofina':            [12.6550, -8.0050],
  'Niamakoro':           [12.5950, -7.9950],
  'ACI 2000':            [12.6450, -8.0020],
  'Bamako-Kaloum':       [12.6500, -8.0000],
  'Quartier du Fleuve':  [12.6500, -7.9970],
  'Magnambougou':        [12.5900, -7.9800],
  'Sotuba':              [12.6600, -7.9700],
  'Banconi':             [12.6700, -8.0300],
  'Dravéla':             [12.6300, -8.0200],
  'Quinzambougou':       [12.6450, -7.9900],
  'Medina Coura':        [12.6500, -8.0050],
}

const BAMAKO_CENTER: [number, number] = [12.6392, -8.0029]

function resolveCoords(location: string): [number, number] {
  for (const [key, coords] of Object.entries(BAMAKO_COORDS)) {
    if (location.toLowerCase().includes(key.toLowerCase())) return coords
  }
  // offset center slightly so two unknowns don't overlap
  return [
    BAMAKO_CENTER[0] + (Math.random() * 0.02 - 0.01),
    BAMAKO_CENTER[1] + (Math.random() * 0.02 - 0.01),
  ]
}

/* ------------------------------------------------------------------ */
/*  Custom icons                                                       */
/* ------------------------------------------------------------------ */

function makeIcon(color: string, label: string) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:32px;height:32px;border-radius:50% 50% 50% 0;
        background:${color};border:3px solid white;
        box-shadow:0 2px 6px rgba(0,0,0,0.35);
        transform:rotate(-45deg);
        display:flex;align-items:center;justify-content:center;
      ">
        <span style="
          transform:rotate(45deg);
          font-size:10px;font-weight:700;color:white;
        ">${label}</span>
      </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -36],
  })
}

const departIcon = makeIcon('#f97316', 'A')
const arriveeIcon = makeIcon('#10b981', 'B')

/* ------------------------------------------------------------------ */
/*  FitBounds helper                                                   */
/* ------------------------------------------------------------------ */

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length >= 2) {
      map.fitBounds(points, { padding: [40, 40] })
    }
  }, [map, points])
  return null
}

/* ------------------------------------------------------------------ */
/*  Main inner component                                               */
/* ------------------------------------------------------------------ */

export default function CourseDetailMapInner({
  depart,
  arrivee,
}: {
  depart: string
  arrivee: string
}) {
  const departCoords = resolveCoords(depart)
  const arriveeCoords = resolveCoords(arrivee)

  // Simple intermediate waypoints to fake a curved route
  const midLat = (departCoords[0] + arriveeCoords[0]) / 2 + 0.005
  const midLng = (departCoords[1] + arriveeCoords[1]) / 2
  const routePoints: [number, number][] = [departCoords, [midLat, midLng], arriveeCoords]

  return (
    <MapContainer
      center={departCoords}
      zoom={13}
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      zoomControl={true}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      <Marker position={departCoords} icon={departIcon} />
      <Marker position={arriveeCoords} icon={arriveeIcon} />

      <Polyline
        positions={routePoints}
        pathOptions={{ color: '#f97316', weight: 4, opacity: 0.85, dashArray: '8 4' }}
      />

      <FitBounds points={[departCoords, arriveeCoords]} />
    </MapContainer>
  )
}
