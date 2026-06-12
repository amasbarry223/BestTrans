# Task: Create 6 BestTrans Dashboard View Files

## Summary
Created 6 view files for the BestTrans VTC/ride-hailing admin dashboard, all with `'use client'` directive and blue color theme (blue-50/100/600/700).

## Files Created

### 1. `/src/components/dashboard/views/kyc-validation-view.tsx`
- KYC document validation for drivers
- Stats: En attente: 18, Validés aujourd'hui: 5, Rejetés: 2
- 6 mock pending documents with driver name, document type, submitted date
- Preview, Validate, Reject buttons per document
- AlertDialog for validate/reject confirmation with reason textarea for rejection
- Search and filter functionality
- Desktop table + mobile card layout

### 2. `/src/components/dashboard/views/carte-operations-view.tsx`
- Real-time operations map placeholder
- Stats: Chauffeurs en ligne: 132, Courses en cours: 47, Zone la plus active: Kalaban-Coura
- Large styled placeholder div (min-h-[500px]) with gradient background and decorative grid/pins
- Center overlay showing "Carte opérations en temps réel — Intégration Google Maps / Mapbox"
- Below map: 5 active drivers with name, location, status badge, "Voir course" button
- Imports: MapPin, Car, Map from lucide-react

### 3. `/src/components/dashboard/views/chauffeur-detail-view.tsx`
- Driver detail/profile view using useDashboard (pendingChauffeur, clearPendingChauffeur, setActiveView)
- "Aucun chauffeur sélectionné" fallback with return button
- Header: Back button, driver name, status badge, Valider/Suspendre buttons
- Info grid: Personal (name, phone, email, N° permis), Vehicle (marque, modèle, immatriculation, couleur)
- KYC docs: 4 cards (Permis, Carte grise, Assurance, Pièce d'identité) with status badges and action buttons
- Performance: Taux d'acceptation 87%, Ponctualité 92%, Note moyenne 4.5/5, Courses totales 845
- Revenue: Solde disponible, Dernier versement, Revenus ce mois
- Recent courses mini table (5 entries)

### 4. `/src/components/dashboard/views/ticket-detail-view.tsx`
- Ticket detail view using useDashboard for navigation
- "Fonctionnalité en cours de développement" notice
- Ticket info: client, course, date, priority
- Mock conversation with 4 messages between support agent and user
- Chat bubbles with avatars and timestamps
- Reply textarea with attach file button
- Action buttons: Répondre, Escalader, Clôturer, Rembourser

### 5. `/src/components/dashboard/views/faq-view.tsx`
- FAQ management with 4 categories: Compte, Courses, Paiements, Technique
- 10 mock FAQ entries in French about BestTrans
- Expandable categories and questions (toggle-based, no accordion import needed)
- Search filtering across questions and answers
- "Ajouter une question" placeholder button
- Blue-themed answer boxes

### 6. `/src/components/dashboard/views/rapports-view.tsx`
- Replaces existing rapports-view with BestTrans-specific reports
- 3 tabs: Activité | Zones | Export
- **Activity tab**: 4 stat cards + AreaChart of daily courses over 30 days with gradient
- **Zones tab**: Top 5 zones (Kalaban-Coura, Badalabougou, Hamdallaye, Sébenikoro, Lafiabougou) with inline bars + BarChart
- **Export tab**: Date range selector + PDF/CSV/Excel export buttons + recent exports list
- Uses Recharts (AreaChart, BarChart) with ChartContainer from shadcn/ui

## Design Choices
- **Color theme**: Blue (blue-50, blue-100, blue-600, blue-700) — no teal/emerald used
- **Responsive**: Desktop table + mobile card layouts
- **Consistent**: Follows existing project patterns (same border colors, text colors, rounded corners)
- **All views already registered** in dashboard-app.tsx ViewKey and viewComponents map
