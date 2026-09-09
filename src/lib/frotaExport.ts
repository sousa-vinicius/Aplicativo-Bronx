import type { FleetRecord } from "../types"
import { fmt, csvEscape, downloadBlob } from "../utils"

export function exportCSV(records: FleetRecord[]) {
  const headers = [
    "Veículo", "Status",
    "Condutor (Saída)", "Data/Hora Saída", "Condição Saída", "Combustível Saída (%)", "Rota Saída", "Obs. Saída",
    "Condutor (Devolução)", "Data/Hora Devolução", "Condição Devolução", "Combustível Devolução (%)", "Rota Devolução", "Obs. Devolução",
  ]
  const rows = records.map((r) => [
    r.vehicle,
    r.status === "ativo" ? "Ativo" : "Devolvido",
    r.driver,
    fmt(r.departureTime),
    r.condition,
    String(r.fuelLevel),
    r.route,
    r.observations,
    r.returnDriver ?? "",
    r.returnTime ? fmt(r.returnTime) : "",
    r.returnCondition ?? "",
    r.returnFuelLevel != null ? String(r.returnFuelLevel) : "",
    r.returnRoute ?? "",
    r.returnObservations ?? "",
  ])
  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(";")).join("\n")
  const stamp = new Date().toISOString().slice(0, 10)
  downloadBlob(`historico-frotas-${stamp}.csv`, "\uFEFF" + csv, "text/csv;charset=utf-8")
}

export function exportPDF(records: FleetRecord[], filterLabel: string) {
  const stamp = new Date().toLocaleString("pt-BR")
  const rowsHtml = records.map((r) => `
    <tr>
      <td>${r.vehicle}</td>
      <td>${r.status === "ativo" ? "Ativo" : "Devolvido"}</td>
      <td>${r.driver}<br/><span class="muted">${fmt(r.departureTime)}</span></td>
      <td>${r.condition} · ${r.fuelLevel}%${r.route ? `<br/><span class="muted">${r.route}</span>` : ""}</td>
      <td>${r.returnDriver ?? "—"}${r.returnTime ? `<br/><span class="muted">${fmt(r.returnTime)}</span>` : ""}</td>
      <td>${r.returnCondition ? `${r.returnCondition} · ${r.returnFuelLevel ?? 0}%` : "—"}${r.returnRoute ? `<br/><span class="muted">${r.returnRoute}</span>` : ""}</td>
    </tr>
  `).join("")

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR"><head><meta charset="utf-8" />
    <title>Relatório de Frotas</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: Arial, Helvetica, sans-serif; color: #1e293b; padding: 32px; }
      h1 { font-size: 20px; margin: 0 0 4px; }
      .sub { color: #64748b; font-size: 12px; margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; font-size: 11px; }
      th { text-align: left; background: #f1f5f9; padding: 8px 6px; border-bottom: 2px solid #cbd5e1; }
      td { padding: 8px 6px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
      .muted { color: #94a3b8; font-size: 10px; }
      footer { margin-top: 24px; font-size: 10px; color: #94a3b8; }
      @media print { body { padding: 12px; } }
    </style>
    </head><body>
      <h1>Relatório de Frotas — Histórico</h1>
      <div class="sub">Filtro: ${filterLabel} · Gerado em ${stamp} · ${records.length} registro(s)</div>
      <table>
        <thead><tr>
          <th>Veículo</th><th>Status</th><th>Saída</th><th>Cond. Saída</th><th>Devolução</th><th>Cond. Devolução</th>
        </tr></thead>
        <tbody>${rowsHtml || `<tr><td colspan="6">Nenhum registro encontrado.</td></tr>`}</tbody>
      </table>
      <footer>Bronx · Sistema de Gestão de Frotas</footer>
      <script>window.onload = () => { window.print(); }</script>
    </body></html>
  `
  const win = window.open("", "_blank")
  if (!win) return
  win.document.open()
  win.document.write(html)
  win.document.close()
}
