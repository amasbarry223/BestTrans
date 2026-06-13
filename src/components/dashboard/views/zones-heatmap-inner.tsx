'use client'

import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

/* ------------------------------------------------------------------ */
/*  Zone data with Bamako coordinates                                  */
/* ------------------------------------------------------------------ */

const ZONES: {
  name: string
  lat: number
  lng: number
  courses: number
  color: string
}[] = [
  { name: 'Kalaban-Coura',    lat: 12.6100, lng: -8.0150, courses: 1842, color: '#f97316' },
  { name: 'Hamdallaye',       lat: 12.6400, lng: -8.0000, courses: 1534, color: '#fb923c' },
  { name: 'Badalabougou',     lat: 12.6350, lng: -7.9980, courses: 1287, color: '#fdba74' },
  { name: 'Lafiabougou',      lat: 12.6250, lng: -8.0300, courses: 1056, color: '#fcd34d' },
  { name: 'ACI 2000',         lat: 12.6450, lng: -8.0020, courses:  921, color: '#86efac' },
  { name: 'Sébenikoro',       lat: 12.6200, lng: -8.0100, courses:  784, color: '#6ee7b7' },
  { name: 'Medina Coura',     lat: 12.6500, lng: -8.0050, courses:  612, color: '#67e8f9' },
  { name: 'Korofina',         lat: 12.6550, lng: -8.0050, courses:  543, color: '#93c5fd' },
  { name: 'Banconi',          lat: 12.6700, lng: -8.0300, courses:  412, color: '#c4b5fd' },
  { name: 'Niamakoro',        lat: 12.5950, lng: -7.9950, courses:  387, color: '#f9a8d4' },
]

const MAX_COURSES = 1842
const MAX_RADIUS = 900

function getRadius(courses: number) {
  return Math.max(200, (courses / MAX_COURSES) * MAX_RADIUS)
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ZonesHeatmapInner() {
  return (
    <MapContainer
      center={[12.6392, -8.0029]}
      zoom={12}
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      zoomControl={true}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {ZONES.map((zone) => (
        <Circle
          key={zone.name}
          center={[zone.lat, zone.lng]}
          radius={getRadius(zone.courses)}
          pathOptions={{
            color: zone.color,
            fillColor: zone.color,
            fillOpacity: 0.45,
            weight: 1.5,
            opacity: 0.8,
          }}
        >
          <Tooltip permanent={zone.courses > 1200} direction="top" offset={[0, -8]}>
            <div className="text-xs font-semibold">
              {zone.name}<br />
              <span className="font-normal text-[#6B7280]">{zone.courses.toLocaleString('fr-FR')} courses</span>
            </div>
          </Tooltip>
        </Circle>
      ))}
    </MapContainer>
  )
}
