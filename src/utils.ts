export function fmt(dt: string) {
  if (!dt) return "—"
  return new Date(dt).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "2-digit",
    hour: "2-digit", minute: "2-digit",
  })
}

export function nowLocal() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

// Converte o valor "ingênuo" de um <input type="datetime-local"> (ex: "2026-09-10T14:30",
// sem fuso horário) para um timestamp UTC correto, respeitando o fuso do navegador do usuário.
// Sem isso, o banco (timestamptz) assume UTC e o horário salvo fica deslocado.
export function localToISO(local: string | undefined): string | undefined {
  if (!local) return local
  const d = new Date(local)
  if (isNaN(d.getTime())) return local
  return d.toISOString()
}

export function csvEscape(value: string) {
  const v = value ?? ""
  if (/[",\n;]/.test(v)) return `"${v.replace(/"/g, '""')}"`
  return v
}

export function downloadBlob(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
