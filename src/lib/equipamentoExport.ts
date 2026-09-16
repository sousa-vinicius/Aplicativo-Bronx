import type { EquipamentoMovimentacao } from "../types"
import { fmt, csvEscape, downloadBlob } from "../utils"

export interface MovComEquip extends EquipamentoMovimentacao {
  equipamentoCodigo: string
  equipamentoDescricao: string
}

export function exportCSV(records: MovComEquip[]) {
  const headers = ["Código", "Descrição", "Origem", "Destino", "Responsável", "Data", "Observações"]
  const rows = records.map((r) => [
    r.equipamentoCodigo,
    r.equipamentoDescricao,
    r.origem,
    r.destino,
    r.responsavel,
    fmt(r.data),
    r.observacoes,
  ])
  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(";")).join("\n")
  const stamp = new Date().toISOString().slice(0, 10)
  downloadBlob(`historico-equipamentos-${stamp}.csv`, "\uFEFF" + csv, "text/csv;charset=utf-8")
}

export function exportPDF(records: MovComEquip[], filterLabel: string) {
  const stamp = new Date().toLocaleString("pt-BR")
  const rowsHtml = records.map((r) => `
    <tr>
      <td>${r.equipamentoCodigo}<br/><span class="muted">${r.equipamentoDescricao}</span></td>
      <td>${r.origem}</td>
      <td>${r.destino}</td>
      <td>${r.responsavel}</td>
      <td>${fmt(r.data)}</td>
    </tr>
  `).join("")

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR"><head><meta charset="utf-8" />
    <title>Relatório de Equipamentos</title>
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
      @media print { body { padding: 12px; } tr { page-break-inside: avoid; } }
    </style>
    </head><body>
      <h1>Relatório de Equipamentos — Movimentações</h1>
      <div class="sub">Filtro: ${filterLabel} · Gerado em ${stamp} · ${records.length} registro(s)</div>
      <table>
        <thead><tr>
          <th>Equipamento</th><th>Origem</th><th>Destino</th><th>Responsável</th><th>Data</th>
        </tr></thead>
        <tbody>${rowsHtml || `<tr><td colspan="5">Nenhum registro encontrado.</td></tr>`}</tbody>
      </table>
      <footer>Bronx · Sistema de Gestão de Equipamentos</footer>
      <script>window.onload = () => { window.print(); }</script>
    </body></html>
  `
  const win = window.open("", "_blank")
  if (!win) return
  win.document.open()
  win.document.write(html)
  win.document.close()
}
