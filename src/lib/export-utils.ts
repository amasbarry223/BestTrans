export function downloadTextFile(
  content: string,
  filename: string,
  mime = 'text/plain;charset=utf-8'
) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function rowsToCsv(rows: Record<string, string | number>[]): string {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const escape = (v: string | number) => {
    const s = String(v)
    return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escape(row[h] ?? '')).join(',')),
  ].join('\n')
}

export function exportCsv(
  rows: Record<string, string | number>[],
  filename: string
) {
  downloadTextFile(rowsToCsv(rows), filename, 'text/csv;charset=utf-8')
}

export function exportJson(data: unknown, filename: string) {
  downloadTextFile(JSON.stringify(data, null, 2), filename, 'application/json')
}

const PRINT_STYLES_TABLE = `
  body{font-family:system-ui,-apple-system,sans-serif;padding:24px;color:#111827;margin:0}
  table{width:100%;border-collapse:collapse}
  th,td{border:1px solid #e5e7eb;padding:8px;text-align:left;font-size:12px}
  th{background:#f9fafb}
  h2{margin:0 0 12px;font-size:18px}
`

const PRINT_STYLES_DOCUMENT = `
  @page { size: A4; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    color: #111827;
    margin: 0;
    padding: 0;
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .sheet { max-width: 210mm; margin: 0 auto; }
  .mono { font-family: ui-monospace, 'Cascadia Code', Consolas, monospace; font-size: 0.92em; }

  .sheet-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    padding-bottom: 16px;
    border-bottom: 2px solid #10b981;
    margin-bottom: 20px;
  }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand-logo {
    width: 44px; height: 44px; object-fit: contain; flex-shrink: 0;
  }
  .brand-name { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }
  .brand-tag { margin: 2px 0 0; font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.08em; }
  .sheet-meta { text-align: right; }
  .meta-label { margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #059669; }
  .meta-ref { margin: 4px 0 0; font-size: 13px; font-weight: 600; color: #111827; }
  .meta-date, .meta-agent { margin: 4px 0 0; font-size: 11px; color: #6b7280; }

  .hero {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 16px;
    align-items: center;
    padding: 18px;
    border-radius: 14px;
    background: linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 55%, #fff 100%);
    border: 1px solid #a7f3d0;
    margin-bottom: 18px;
  }
  .hero-avatar {
    width: 56px; height: 56px; border-radius: 14px;
    background: #10b981; color: #fff;
    font-weight: 800; font-size: 18px;
    display: flex; align-items: center; justify-content: center;
  }
  .hero-main h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }
  .hero-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .hero-kyc { margin: 8px 0 0; font-size: 12px; color: #4b5563; }
  .hero-balance { text-align: right; min-width: 140px; }
  .balance-label { margin: 0; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280; }
  .balance-value { margin: 4px 0 0; font-size: 20px; font-weight: 800; color: #059669; }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 18px;
  }
  .stat-card {
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    background: #fafafa;
  }
  .stat-card.highlight { border-color: #6ee7b7; background: #ecfdf5; }
  .stat-label { margin: 0; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
  .stat-value { margin: 6px 0 0; font-size: 15px; font-weight: 800; color: #111827; }
  .stat-sub { margin: 4px 0 0; font-size: 10px; color: #6b7280; }

  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 14px;
  }
  .panel {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 14px;
    page-break-inside: avoid;
  }
  .panel h2 { margin: 0; font-size: 13px; font-weight: 800; color: #111827; }
  .panel-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 10px; }
  .panel-note { font-size: 11px; color: #6b7280; }

  .info-list { margin: 10px 0 0; }
  .info-list div {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: 8px;
    padding: 7px 0;
    border-bottom: 1px solid #f3f4f6;
    font-size: 12px;
  }
  .info-list div:last-child { border-bottom: none; }
  .info-list dt { margin: 0; color: #6b7280; font-weight: 600; }
  .info-list dd { margin: 0; color: #111827; font-weight: 500; }

  .progress {
    height: 6px; border-radius: 999px; background: #f3f4f6;
    overflow: hidden; margin: 8px 0 12px;
  }
  .progress-bar { height: 100%; background: linear-gradient(90deg, #10b981, #14b8a6); border-radius: 999px; }

  .badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 700;
    line-height: 1.3;
  }
  .badge-kyc { background: #ede9fe; color: #6d28d9; }
  .badge-neutral { background: #f3f4f6; color: #4b5563; }
  .badge-success { background: #d1fae5; color: #047857; }
  .badge-warning { background: #fef3c7; color: #b45309; }
  .badge-danger { background: #ffe4e6; color: #be123c; }

  .compact-table, .data-table { width: 100%; border-collapse: collapse; font-size: 11px; }
  .compact-table th, .data-table th {
    text-align: left; padding: 8px 10px;
    font-size: 9px; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.06em; color: #6b7280;
    background: #f9fafb; border-bottom: 1px solid #e5e7eb;
  }
  .data-table th:nth-child(3), .data-table td:nth-child(3) { text-align: right; }
  .data-table th:nth-child(4), .data-table td:nth-child(4) { text-align: right; }
  .data-table th:nth-child(5), .data-table td:nth-child(5) { text-align: right; }
  .compact-table td, .data-table td {
    padding: 8px 10px; border-bottom: 1px solid #f3f4f6; vertical-align: middle;
  }
  .data-table tbody tr:nth-child(even) { background: #fafafa; }
  .op-type { font-weight: 700; color: #111827; }
  .amount { font-weight: 800; white-space: nowrap; }
  .amount-in { color: #059669; }
  .amount-out { color: #111827; }
  .empty { text-align: center; color: #9ca3af; padding: 20px !important; }

  .timeline { list-style: none; margin: 8px 0 0; padding: 0; }
  .timeline-item {
    display: grid;
    grid-template-columns: 12px 1fr;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px dashed #e5e7eb;
  }
  .timeline-item:last-child { border-bottom: none; }
  .timeline-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #10b981; margin-top: 5px;
  }
  .timeline-title { margin: 0; font-size: 12px; font-weight: 600; color: #111827; }
  .timeline-meta { margin: 3px 0 0; font-size: 10px; color: #6b7280; }

  .sheet-footer {
    margin-top: 20px;
    padding-top: 12px;
    border-top: 1px solid #e5e7eb;
    text-align: center;
    font-size: 10px;
    color: #9ca3af;
  }
  .sheet-footer p { margin: 4px 0; }

  .hero-compact { grid-template-columns: 1fr !important; padding: 14px 18px !important; }
  .hero-compact h1 { font-size: 18px !important; }
  .filter-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
  .chip {
    font-size: 10px; font-weight: 600; color: #374151;
    padding: 4px 10px; border-radius: 999px;
    background: #f3f4f6; border: 1px solid #e5e7eb;
  }
  .data-table-wide th:nth-child(5), .data-table-wide td:nth-child(5) { text-align: right; }
  .data-table-wide th:nth-child(6), .data-table-wide td:nth-child(6) { text-align: right; }
  .data-table-wide th:nth-child(7), .data-table-wide td:nth-child(7) { text-align: right; }
  .desc { max-width: 140px; font-size: 10px; color: #4b5563; }

  .receipt-page { min-height: auto; }
  .receipt-wrap {
    display: flex; justify-content: center;
    padding: 10px 0 16px;
  }
  .receipt-ticket {
    width: 88mm; max-width: 100%;
    border: 2px dashed #d1d5db; border-radius: 14px;
    padding: 18px 16px; background: #fff;
  }
  .receipt-ticket-head { text-align: center; padding-bottom: 12px; border-bottom: 1px dashed #d1d5db; }
  .receipt-type { margin: 0; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; color: #111827; }
  .receipt-ref { margin: 6px 0 0; font-size: 12px; font-weight: 700; color: #059669; }
  .receipt-section { padding: 10px 0; border-bottom: 1px dashed #e5e7eb; }
  .receipt-section-title {
    margin: 0 0 6px; font-size: 9px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af;
  }
  .receipt-row {
    display: flex; justify-content: space-between; gap: 8px;
    font-size: 11px; padding: 3px 0;
  }
  .receipt-row span:first-child { color: #6b7280; }
  .receipt-row span:last-child { font-weight: 600; text-align: right; }
  .amount-highlight { color: #059669 !important; font-weight: 800 !important; font-size: 12px !important; }
  .receipt-total {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: 10px; padding: 10px 12px; border-radius: 10px;
    background: #ecfdf5; font-size: 14px; font-weight: 800;
  }
  .receipt-total span:last-child { color: #059669; }
  .receipt-qr { display: flex; flex-direction: column; align-items: center; margin-top: 12px; gap: 4px; }
  .qr-grid { display: grid; grid-template-columns: repeat(5, 8px); gap: 2px; }
  .qr-grid span { width: 8px; height: 8px; border-radius: 1px; }
  .qr-grid span.on { background: #111827; }
  .qr-grid span.off { background: #d1d5db; }
  .receipt-qr p { margin: 0; font-size: 8px; font-weight: 700; color: #9ca3af; }
  .receipt-thanks { margin: 10px 0 0; text-align: center; font-size: 11px; font-weight: 700; color: #059669; }
  .receipt-note { margin: 4px 0 0; text-align: center; font-size: 9px; color: #9ca3af; }

  .tx-hero {
    padding: 20px; border-radius: 14px; margin-bottom: 16px;
    background: linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%);
    border: 1px solid #a7f3d0; text-align: center;
  }
  .tx-hero-top { display: flex; justify-content: center; gap: 8px; margin-bottom: 10px; }
  .tx-hero-amount { margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.02em; }
  .tx-amount-in { color: #059669; }
  .tx-amount-out { color: #111827; }
  .tx-hero-desc { margin: 8px 0 0; font-size: 13px; color: #4b5563; }
  .tx-hero-client { margin: 4px 0 0; font-size: 12px; font-weight: 600; color: #111827; }

  .sheet-clients-list .sheet-header { margin-bottom: 10px; padding-bottom: 10px; }
  .sheet-clients-list .hero-compact { margin-bottom: 10px !important; padding: 10px 14px !important; }
  .sheet-clients-list .stats-grid-5 {
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
    margin-bottom: 10px;
  }
  .sheet-clients-list .stat-card { padding: 8px 10px; }
  .sheet-clients-list .stat-value { font-size: 13px; }
  .sheet-clients-list .stat-value-sm { font-size: 10px; line-height: 1.25; }
  .sheet-clients-list .filter-chips { margin-bottom: 10px; }
  .sheet-clients-list .panel-flush { margin-bottom: 8px; padding: 10px 12px; }
  .sheet-clients-list .data-table-clients { font-size: 9px; }
  .sheet-clients-list .data-table-clients th,
  .sheet-clients-list .data-table-clients td { padding: 5px 8px; }
  .sheet-clients-list .data-table-clients th:last-child,
  .sheet-clients-list .data-table-clients td:last-child { text-align: right; }
  .sheet-clients-list .sheet-footer { margin-top: 8px; padding-top: 8px; }

  @media print {
    body { padding: 0; }
    .panel { break-inside: avoid; }
    .sheet { page-break-after: avoid; }
    .sheet-clients-list {
      page-break-after: avoid;
      page-break-inside: avoid;
    }
    .sheet-clients-list .panel,
    .sheet-clients-list .stats-grid,
    .sheet-clients-list .hero-compact {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
`

export type PrintTheme = 'table' | 'document'

export function printHtmlContent(
  html: string,
  title = 'Ricash',
  theme: PrintTheme = 'table'
) {
  const win = window.open('', '_blank', 'width=900,height=1100')
  if (!win) return false
  const styles = theme === 'document' ? PRINT_STYLES_DOCUMENT : PRINT_STYLES_TABLE
  const safeTitle = title.replace(/</g, '')
  const resolvedHtml = html.replace(
    'src="/ricash-logo.png"',
    `src="${window.location.origin}/ricash-logo.png"`
  )
  win.document.write(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${safeTitle}</title>
      <style>${styles}</style>
    </head>
    <body>${resolvedHtml}</body>
    </html>
  `)
  win.document.close()
  win.focus()
  win.print()
  return true
}

export function printDocument(html: string, title: string) {
  return printHtmlContent(html, title, 'document')
}
