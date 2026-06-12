function esc(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatPrintDate() {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date())
}

function formatFcfa(n: number) {
  return n.toLocaleString('fr-FR') + ' FCFA'
}

export const RICASH_LOGO_PATH = '/ricash-logo.png'

const opStatusClass: Record<string, string> = {
  Succès: 'badge-success',
  Payé: 'badge-success',
  'En cours': 'badge-warning',
  Échoué: 'badge-danger',
}

function sheetHeader(meta: {
  label: string
  ref?: string
  agentLine?: string
}) {
  const printedAt = formatPrintDate()
  const agentLine = meta.agentLine ?? 'Ricash Web Agent'
  return `
    <header class="sheet-header">
      <div class="brand">
        <img src="${RICASH_LOGO_PATH}" alt="Ricash" class="brand-logo" width="44" height="44" />
        <div>
          <p class="brand-name">Ricash</p>
          <p class="brand-tag">Web Agent Platform</p>
        </div>
      </div>
      <div class="sheet-meta">
        <p class="meta-label">${esc(meta.label)}</p>
        ${meta.ref ? `<p class="meta-ref mono">${esc(meta.ref)}</p>` : ''}
        <p class="meta-date">Imprimé le ${esc(printedAt)}</p>
        <p class="meta-agent">${agentLine}</p>
      </div>
    </header>
  `
}

function sheetFooter(footerRef: string) {
  const printedAt = formatPrintDate()
  return `
    <footer class="sheet-footer">
      <p>Document confidentiel — usage interne agent Ricash uniquement.</p>
      <p class="mono">${esc(footerRef)} · ${esc(printedAt)}</p>
    </footer>
  `
}

/* ------------------------------------------------------------------ */
/*  Client sheet                                                       */
/* ------------------------------------------------------------------ */

export type ClientPrintDoc = {
  label: string
  status: 'verified' | 'pending' | 'rejected'
  statusLabel: string
}

export type ClientPrintOp = {
  type: string
  amount: string
  date: string
  status: string
  reference: string
}

export type ClientPrintActivity = {
  description: string
  date: string
  meta?: string
}

export type ClientPrintData = {
  reference: string
  name: string
  initials: string
  phone: string
  email: string
  address: string
  dateOfBirth: string
  joinedDate: string
  balance: string
  kycLabel: string
  kycShortLabel: string
  totalDeposits: string
  totalWithdrawals: string
  totalTransfers: string
  totalOps: number
  docs: ClientPrintDoc[]
  ops: ClientPrintOp[]
  activities: ClientPrintActivity[]
  agentName?: string
  agentLocation?: string
}

const docStatusClass: Record<ClientPrintDoc['status'], string> = {
  verified: 'badge-success',
  pending: 'badge-warning',
  rejected: 'badge-danger',
}

export function buildClientSheetPrintHtml(data: ClientPrintData): string {
  const verifiedDocs = data.docs.filter((d) => d.status === 'verified').length
  const kycProgress =
    data.docs.length > 0 ? Math.round((verifiedDocs / data.docs.length) * 100) : 0
  const successOps = data.ops.filter((o) => o.status === 'Succès').length
  const successRate =
    data.ops.length > 0 ? Math.round((successOps / data.ops.length) * 100) : 0

  const agentLine =
    data.agentName || data.agentLocation
      ? `${esc(data.agentName ?? 'Agent')}${data.agentLocation ? ` · ${esc(data.agentLocation)}` : ''}`
      : 'Ricash Web Agent'

  const opsRows = data.ops
    .map((op) => {
      const statusClass = opStatusClass[op.status] ?? 'badge-neutral'
      const amountClass = op.type === 'Dépôt' ? 'amount-in' : 'amount-out'
      return `<tr>
        <td><span class="op-type">${esc(op.type)}</span></td>
        <td class="mono">${esc(op.reference)}</td>
        <td class="amount ${amountClass}">${op.type === 'Dépôt' ? '+' : '−'}${esc(op.amount)}</td>
        <td>${esc(op.date)}</td>
        <td><span class="badge ${statusClass}">${esc(op.status)}</span></td>
      </tr>`
    })
    .join('')

  const docsRows = data.docs
    .map(
      (doc) => `<tr>
        <td>${esc(doc.label)}</td>
        <td><span class="badge ${docStatusClass[doc.status]}">${esc(doc.statusLabel)}</span></td>
      </tr>`
    )
    .join('')

  const activityItems = data.activities
    .slice(0, 8)
    .map(
      (item) => `<li class="timeline-item">
        <span class="timeline-dot"></span>
        <div class="timeline-body">
          <p class="timeline-title">${esc(item.description)}</p>
          <p class="timeline-meta">${esc(item.date)}${item.meta ? ` · <span class="mono">${esc(item.meta)}</span>` : ''}</p>
        </div>
      </li>`
    )
    .join('')

  return `
    <div class="sheet">
      ${sheetHeader({ label: 'Fiche client', ref: data.reference, agentLine })}
      <section class="hero">
        <div class="hero-avatar">${esc(data.initials)}</div>
        <div class="hero-main">
          <h1>${esc(data.name)}</h1>
          <div class="hero-tags">
            <span class="badge badge-kyc">${esc(data.kycShortLabel)}</span>
            <span class="badge badge-neutral">Client depuis ${esc(data.joinedDate)}</span>
          </div>
          <p class="hero-kyc">${esc(data.kycLabel)}</p>
        </div>
        <div class="hero-balance">
          <p class="balance-label">Solde wallet</p>
          <p class="balance-value">${esc(data.balance)}</p>
        </div>
      </section>
      <section class="stats-grid">
        <div class="stat-card"><p class="stat-label">Total dépôts</p><p class="stat-value">${esc(data.totalDeposits)}</p></div>
        <div class="stat-card"><p class="stat-label">Total retraits</p><p class="stat-value">${esc(data.totalWithdrawals)}</p></div>
        <div class="stat-card"><p class="stat-label">Total transferts</p><p class="stat-value">${esc(data.totalTransfers)}</p></div>
        <div class="stat-card highlight"><p class="stat-label">Opérations</p><p class="stat-value">${data.totalOps}</p><p class="stat-sub">${successRate}% succès · ${data.ops.length} récentes</p></div>
      </section>
      <section class="two-col">
        <div class="panel">
          <h2>Informations personnelles</h2>
          <dl class="info-list">
            <div><dt>Téléphone</dt><dd>${esc(data.phone)}</dd></div>
            <div><dt>Email</dt><dd>${esc(data.email)}</dd></div>
            <div><dt>Adresse</dt><dd>${esc(data.address)}</dd></div>
            <div><dt>Date de naissance</dt><dd>${esc(data.dateOfBirth)}</dd></div>
            <div><dt>Inscription</dt><dd>${esc(data.joinedDate)}</dd></div>
          </dl>
        </div>
        <div class="panel">
          <div class="panel-head"><h2>Conformité KYC</h2><span class="badge ${verifiedDocs === data.docs.length ? 'badge-success' : 'badge-warning'}">${verifiedDocs}/${data.docs.length} vérifiés</span></div>
          <div class="progress"><div class="progress-bar" style="width:${kycProgress}%"></div></div>
          <table class="compact-table"><thead><tr><th>Document</th><th>Statut</th></tr></thead><tbody>${docsRows}</tbody></table>
        </div>
      </section>
      <section class="panel">
        <div class="panel-head"><h2>Historique des opérations</h2><span class="panel-note">${data.ops.length} opération(s)</span></div>
        <table class="data-table">
          <thead><tr><th>Type</th><th>Référence</th><th>Montant</th><th>Date</th><th>Statut</th></tr></thead>
          <tbody>${opsRows || '<tr><td colspan="5" class="empty">Aucune opération</td></tr>'}</tbody>
        </table>
      </section>
      ${data.activities.length > 0 ? `<section class="panel"><div class="panel-head"><h2>Activité récente</h2></div><ul class="timeline">${activityItems}</ul></section>` : ''}
      ${sheetFooter(data.reference)}
    </div>
  `
}

/* ------------------------------------------------------------------ */
/*  Receipt                                                            */
/* ------------------------------------------------------------------ */

export type ReceiptPrintData = {
  type: string
  reference: string
  date: string
  agentName: string
  agentLocation: string
  clientName: string
  clientPhone: string
  amount: number
  fees: number
  total: number
  additionalDetails?: { label: string; value: string }[]
}

export function buildReceiptPrintHtml(data: ReceiptPrintData): string {
  const extraRows =
    data.additionalDetails
      ?.map(
        (d) =>
          `<div class="receipt-row"><span>${esc(d.label)}</span><span>${esc(d.value)}</span></div>`
      )
      .join('') ?? ''

  return `
    <div class="sheet receipt-page">
      ${sheetHeader({ label: 'Reçu de transaction', ref: data.reference, agentLine: `${esc(data.agentName)} · ${esc(data.agentLocation)}` })}
      <div class="receipt-wrap">
        <article class="receipt-ticket">
          <div class="receipt-ticket-head">
            <p class="receipt-type">REÇU — ${esc(data.type.toUpperCase())}</p>
            <p class="receipt-ref mono">${esc(data.reference)}</p>
          </div>
          <div class="receipt-section">
            <p class="receipt-section-title">Transaction</p>
            <div class="receipt-row"><span>Date</span><span>${esc(data.date)}</span></div>
            <div class="receipt-row"><span>Type</span><span>${esc(data.type)}</span></div>
            <div class="receipt-row"><span>Montant</span><span class="amount-highlight">${formatFcfa(data.amount)}</span></div>
            <div class="receipt-row"><span>Frais</span><span>${formatFcfa(data.fees)}</span></div>
          </div>
          <div class="receipt-section">
            <p class="receipt-section-title">Client</p>
            <div class="receipt-row"><span>Nom</span><span>${esc(data.clientName)}</span></div>
            <div class="receipt-row"><span>Téléphone</span><span class="mono">${esc(data.clientPhone)}</span></div>
          </div>
          ${extraRows ? `<div class="receipt-section">${extraRows}</div>` : ''}
          <div class="receipt-total">
            <span>Total</span>
            <span>${formatFcfa(data.total)}</span>
          </div>
          <div class="receipt-qr" aria-hidden="true">
            <div class="qr-grid">${Array.from({ length: 25 })
              .map(
                (_, i) =>
                  `<span class="${(i + Math.floor(i / 5)) % 2 === 0 ? 'on' : 'off'}"></span>`
              )
              .join('')}</div>
            <p>QR</p>
          </div>
          <p class="receipt-thanks">Merci d&apos;utiliser Ricash</p>
          <p class="receipt-note">Conservez ce reçu comme preuve de transaction</p>
        </article>
      </div>
      ${sheetFooter(data.reference)}
    </div>
  `
}

/* ------------------------------------------------------------------ */
/*  Clients list report (single A4 page)                               */
/* ------------------------------------------------------------------ */

export type ClientsListPrintRow = {
  name: string
  phone: string
  email: string
  kyc: string
  balance: string
}

export type ClientsListPrintData = {
  rows: ClientsListPrintRow[]
  stats: {
    total: number
    verified: number
    pending: number
    premium: number
    totalBalance: number
  }
  filter: string
  search: string
  agentName?: string
  agentLocation?: string
}

export function buildClientsListPrintHtml(data: ClientsListPrintData): string {
  const agentLine =
    data.agentName || data.agentLocation
      ? `${esc(data.agentName ?? 'Agent')}${data.agentLocation ? ` · ${esc(data.agentLocation)}` : ''}`
      : 'Ricash Web Agent'

  const filters = [`Filtre KYC : ${data.filter}`]
  if (data.search.trim()) filters.push(`Recherche : "${data.search.trim()}"`)

  const filterChips = filters
    .map((f) => `<span class="chip">${esc(f)}</span>`)
    .join('')

  const tableRows = data.rows
    .map(
      (c) => `<tr>
        <td>${esc(c.name)}</td>
        <td class="mono">${esc(c.phone)}</td>
        <td>${esc(c.email)}</td>
        <td><span class="badge badge-kyc">${esc(c.kyc)}</span></td>
        <td class="amount amount-in">${esc(c.balance)}</td>
      </tr>`
    )
    .join('')

  const reportRef = `RPT-CLI-${Date.now().toString(36).toUpperCase()}`
  const totalBalanceLabel = formatFcfa(data.stats.totalBalance)

  return `
    <div class="sheet sheet-clients-list">
      ${sheetHeader({ label: 'Liste clients', ref: reportRef, agentLine })}
      <section class="hero hero-compact">
        <div class="hero-main" style="grid-column: 1 / -1">
          <h1>Gestion des clients</h1>
          <p class="hero-kyc">Export de la liste filtrée — ${data.rows.length} client(s)</p>
        </div>
      </section>
      <section class="stats-grid stats-grid-5">
        <div class="stat-card highlight"><p class="stat-label">Total</p><p class="stat-value">${data.stats.total}</p></div>
        <div class="stat-card"><p class="stat-label">Vérifiés</p><p class="stat-value">${data.stats.verified}</p></div>
        <div class="stat-card"><p class="stat-label">En attente</p><p class="stat-value">${data.stats.pending}</p></div>
        <div class="stat-card"><p class="stat-label">Premium</p><p class="stat-value">${data.stats.premium}</p></div>
        <div class="stat-card"><p class="stat-label">Solde total</p><p class="stat-value stat-value-sm">${esc(totalBalanceLabel)}</p></div>
      </section>
      <div class="filter-chips">${filterChips}</div>
      <section class="panel panel-flush">
        <div class="panel-head"><h2>Liste des clients</h2><span class="panel-note">${data.rows.length} ligne(s)</span></div>
        <table class="data-table data-table-clients">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>KYC</th>
              <th>Solde</th>
            </tr>
          </thead>
          <tbody>${tableRows || '<tr><td colspan="5" class="empty">Aucun client</td></tr>'}</tbody>
        </table>
      </section>
      ${sheetFooter(reportRef)}
    </div>
  `
}

/* ------------------------------------------------------------------ */
/*  Historique report                                                  */
/* ------------------------------------------------------------------ */

export type HistoriquePrintRow = {
  reference: string
  type: string
  client: string
  description: string
  amount: string
  status: string
  period: string
  date: string
  time: string
  positive: boolean
}

export type HistoriquePrintData = {
  rows: HistoriquePrintRow[]
  period: string
  type: string
  status: string
  search: string
  stats: {
    total: number
    volume: number
    successRate: string
    failed: number
  }
  agentName?: string
  agentLocation?: string
}

export function buildHistoriqueReportPrintHtml(data: HistoriquePrintData): string {
  const agentLine =
    data.agentName || data.agentLocation
      ? `${esc(data.agentName ?? 'Agent')}${data.agentLocation ? ` · ${esc(data.agentLocation)}` : ''}`
      : 'Ricash Web Agent'

  const volumeLabel = `${data.stats.volume.toLocaleString('fr-FR')} FCFA`
  const filters = [
    `Période : ${data.period}`,
    `Type : ${data.type}`,
    `Statut : ${data.status}`,
  ]
  if (data.search.trim()) filters.push(`Recherche : "${data.search.trim()}"`)

  const filterChips = filters
    .map((f) => `<span class="chip">${esc(f)}</span>`)
    .join('')

  const tableRows = data.rows
    .map((tx) => {
      const statusClass = opStatusClass[tx.status] ?? 'badge-neutral'
      const amountClass = tx.positive ? 'amount-in' : 'amount-out'
      const sign = tx.positive ? '+' : '−'
      return `<tr>
        <td class="mono">${esc(tx.reference)}</td>
        <td><span class="op-type">${esc(tx.type)}</span></td>
        <td>${esc(tx.client)}</td>
        <td class="desc">${esc(tx.description)}</td>
        <td class="amount ${amountClass}">${sign}${esc(tx.amount)}</td>
        <td>${esc(tx.date)} ${esc(tx.time)}</td>
        <td><span class="badge ${statusClass}">${esc(tx.status)}</span></td>
      </tr>`
    })
    .join('')

  const reportRef = `RPT-HIST-${Date.now().toString(36).toUpperCase()}`

  return `
    <div class="sheet">
      ${sheetHeader({ label: 'Rapport historique', ref: reportRef, agentLine })}
      <section class="hero hero-compact">
        <div class="hero-main" style="grid-column: 1 / -1">
          <h1>Historique des transactions</h1>
          <p class="hero-kyc">Synthèse des opérations filtrées — ${data.rows.length} transaction(s)</p>
        </div>
      </section>
      <section class="stats-grid">
        <div class="stat-card highlight"><p class="stat-label">Transactions</p><p class="stat-value">${data.stats.total}</p></div>
        <div class="stat-card"><p class="stat-label">Volume</p><p class="stat-value">${esc(volumeLabel)}</p></div>
        <div class="stat-card"><p class="stat-label">Taux de succès</p><p class="stat-value">${esc(data.stats.successRate)}%</p></div>
        <div class="stat-card"><p class="stat-label">Échouées</p><p class="stat-value">${data.stats.failed}</p></div>
      </section>
      <div class="filter-chips">${filterChips}</div>
      <section class="panel">
        <div class="panel-head"><h2>Liste des transactions</h2><span class="panel-note">${data.rows.length} ligne(s)</span></div>
        <table class="data-table data-table-wide">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Type</th>
              <th>Client</th>
              <th>Description</th>
              <th>Montant</th>
              <th>Date</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>${tableRows || '<tr><td colspan="7" class="empty">Aucune transaction</td></tr>'}</tbody>
        </table>
      </section>
      ${sheetFooter(reportRef)}
    </div>
  `
}

/* ------------------------------------------------------------------ */
/*  Transaction detail                                                 */
/* ------------------------------------------------------------------ */

export type TransactionPrintData = {
  reference: string
  type: string
  status: string
  period: string
  date: string
  time: string
  amount: string
  positive: boolean
  description: string
  client: string
}

export function buildTransactionDetailPrintHtml(data: TransactionPrintData): string {
  const statusClass = opStatusClass[data.status] ?? 'badge-neutral'
  const amountClass = data.positive ? 'tx-amount-in' : 'tx-amount-out'
  const sens = data.positive ? 'Crédit' : 'Débit'
  const sign = data.positive ? '+' : '−'

  return `
    <div class="sheet">
      ${sheetHeader({ label: 'Détail transaction', ref: data.reference })}
      <section class="tx-hero">
        <div class="tx-hero-top">
          <span class="badge badge-neutral">${esc(data.type)}</span>
          <span class="badge ${statusClass}">${esc(data.status)}</span>
        </div>
        <p class="tx-hero-amount ${amountClass}">${sign}${esc(data.amount)}</p>
        <p class="tx-hero-desc">${esc(data.description)}</p>
        <p class="tx-hero-client">${esc(data.client)}</p>
      </section>
      <section class="panel">
        <h2>Informations</h2>
        <dl class="info-list">
          <div><dt>Référence</dt><dd class="mono">${esc(data.reference)}</dd></div>
          <div><dt>Type</dt><dd>${esc(data.type)}</dd></div>
          <div><dt>Statut</dt><dd>${esc(data.status)}</dd></div>
          <div><dt>Sens</dt><dd>${esc(sens)}</dd></div>
          <div><dt>Période</dt><dd>${esc(data.period)}</dd></div>
          <div><dt>Date / Heure</dt><dd>${esc(data.date)} à ${esc(data.time)}</dd></div>
          <div><dt>Client</dt><dd>${esc(data.client)}</dd></div>
          <div><dt>Description</dt><dd>${esc(data.description)}</dd></div>
        </dl>
      </section>
      ${sheetFooter(data.reference)}
    </div>
  `
}
