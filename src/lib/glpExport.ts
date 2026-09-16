import type { GlpRecord } from "../types"
import { fmt, csvEscape, downloadBlob } from "../utils"

export function exportCSV(records: GlpRecord[]) {
  const headers = ["Solicitante", "Data", "Fornecedor", "Quantidade de gás", "Etapa do Serviço", "Obra", "Recebido", "Movimentado", "Observação"]
  const rows = records.map((r) => [
    r.solicitante,
    fmt(r.data),
    r.fornecedor,
    String(r.quantidade),
    r.etapaServico,
    r.obra,
    r.recebido ? "Sim" : "Não",
    r.movimentado ? "Sim" : "Não",
    r.observacao,
  ])
  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(";")).join("\n")
  const stamp = new Date().toISOString().slice(0, 10)
  downloadBlob(`historico-glp-${stamp}.csv`, "\uFEFF" + csv, "text/csv;charset=utf-8")
}

export function exportPDF(records: GlpRecord[], filterLabel: string) {
  const stamp = new Date().toLocaleString("pt-BR")
  const rowsHtml = records.map((r) => `
    <tr>
      <td>${r.solicitante}<br/><span class="muted">${fmt(r.data)}</span></td>
      <td>${r.fornecedor}</td>
      <td>${r.quantidade}</td>
      <td>${r.etapaServico || "—"}</td>
      <td>${r.obra}</td>
      <td class="checks">
        <div>${r.recebido ? "☑" : "☐"} Recebido</div>
        <div>${r.movimentado ? "☑" : "☐"} Movimentado</div>
      </td>
      <td>${r.observacao || "—"}</td>
    </tr>
  `).join("")

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR"><head><meta charset="utf-8" />
    <title>Relatório de Solicitações de GLP</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: Arial, Helvetica, sans-serif; color: #1e293b; padding: 32px; }
      h1 { font-size: 20px; margin: 0 0 4px; }
      .sub { color: #64748b; font-size: 12px; margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; font-size: 11px; }
      th { text-align: left; background: #f1f5f9; padding: 8px 6px; border-bottom: 2px solid #cbd5e1; }
      td { padding: 8px 6px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
      .muted { color: #94a3b8; font-size: 10px; }
      .checks { white-space: nowrap; }
      .checks div { line-height: 1.6; }
      footer { margin-top: 24px; font-size: 10px; color: #94a3b8; }
      @media print { body { padding: 12px; } tr { page-break-inside: avoid; } }
    </style>
    </head><body>
      <h1>Relatório de Solicitações de GLP</h1>
      <div class="sub">Filtro: ${filterLabel} · Gerado em ${stamp} · ${records.length} registro(s)</div>
      <table>
        <thead><tr>
          <th>Solicitante</th><th>Fornecedor</th><th>Quantidade</th><th>Etapa</th><th>Obra</th><th>Status</th><th>Observação</th>
        </tr></thead>
        <tbody>${rowsHtml || `<tr><td colspan="7">Nenhum registro encontrado.</td></tr>`}</tbody>
      </table>
      <footer>Bronx · Sistema de Solicitação de GLP</footer>
      <script>window.onload = () => { window.print(); }</script>
    </body></html>
  `
  const win = window.open("", "_blank")
  if (!win) return
  win.document.open()
  win.document.write(html)
  win.document.close()
}
