/**
 * Utility to export data as CSV file from the browser.
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers: Record<keyof T, string>
) {
  if (!data || !data.length) return

  const headerKeys = Object.keys(headers) as (keyof T)[]
  const headerLabels = headerKeys.map(key => headers[key])

  const csvRows = [
    headerLabels.join(','),
    ...data.map(row => 
      headerKeys.map(key => {
        const val = row[key]
        // Escape commas and wrap in quotes if necessary
        let cell = val === null || val === undefined ? '' : String(val)
        // Neutralize CSV formula injection (=, +, -, @ as first char)
        if (/^[=+\-@\t\r]/.test(cell)) cell = `'${cell}`
        return `"${cell.replace(/"/g, '""')}"`
      }).join(',')
    )
  ]

  const csvString = csvRows.join('\n')
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
