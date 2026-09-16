import { useState } from "react"
import type { GlpRecord } from "../types"
import { fmt } from "../utils"
import { exportCSV, exportPDF } from "../lib/glpExport"
import { BackBtn, inputCls } from "./ui"

export function GlpHistorico({
  records,
  onStatusChange,
  onBack,
}: {
  records: GlpRecord[]
  onStatusChange: (id: string, data: Partial<{ recebido: boolean; movimentado: boolean }>) => void
  onBack: () => void
}) {
  const [q, setQ] = useState("")
  const [fornecedorFilter, setFornecedorFilter] = useState("")
  const [obraFilter, setObraFilter] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)

  const fornecedorOptions = Array.from(new Set(records.map((r) => r.fornecedor))).sort()
  const obraOptions = Array.from(new Set(records.map((r) => r.obra))).sort()

  const filtered = records.filter((r) => {
    const matchesQ =
      r.solicitante.toLowerCase().includes(q.toLowerCase()) ||
      r.obra.toLowerCase().includes(q.toLowerCase()) ||
      r.etapaServico.toLowerCase().includes(q.toLowerCase())
    const matchesFornecedor = !fornecedorFilter || r.fornecedor === fornecedorFilter
    const matchesObra = !obraFilter || r.obra === obraFilter
    const rDate = r.data.slice(0, 10)
    const matchesFrom = !dateFrom || rDate >= dateFrom
    const matchesTo = !dateTo || rDate <= dateTo
    return matchesQ && matchesFornecedor && matchesObra && matchesFrom && matchesTo
  })

  const hasFilters = q || fornecedorFilter || obraFilter || dateFrom || dateTo
  const filterLabel = [
    fornecedorFilter || "Todos os fornecedores",
    obraFilter || "Todas as obras",
    dateFrom || dateTo ? `${dateFrom || "início"} a ${dateTo || "hoje"}` : "Todo o período",
  ].join(" · ")

  return (
    <div className="max-w-lg mx-auto px-5 pt-6 pb-10">
      <div className="mb-5"><BackBtn onClick={onBack} /></div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 rounded-full bg-slate-400" />
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
          Histórico
        </h2>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 space-y-3">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por solicitante, obra ou etapa..."
          className={inputCls}
        />
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Fornecedor</label>
          <select value={fornecedorFilter} onChange={(e) => setFornecedorFilter(e.target.value)} className={inputCls}>
            <option value="">Todos os fornecedores</option>
            {fornecedorOptions.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Obra</label>
          <select value={obraFilter} onChange={(e) => setObraFilter(e.target.value)} className={inputCls}>
            <option value="">Todas as obras</option>
            {obraOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">De</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Até</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={inputCls} />
          </div>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={() => { setQ(""); setFornecedorFilter(""); setObraFilter(""); setDateFrom(""); setDateTo("") }}
            className="text-xs text-slate-400 hover:text-slate-700 font-semibold transition-colors"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 mb-5">
        <button
          type="button"
          onClick={() => exportCSV(filtered)}
          disabled={filtered.length === 0}
          className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold px-3 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Baixar CSV
        </button>
        <button
          type="button"
          onClick={() => exportPDF(filtered, filterLabel)}
          disabled={filtered.length === 0}
          className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold px-3 py-2.5 rounded-xl border border-orange-400 text-orange-700 bg-orange-50 hover:bg-orange-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Baixar PDF
        </button>
      </div>

      <div className="text-xs text-slate-400 mb-3" style={{ fontFamily: "var(--font-mono)" }}>
        {filtered.length} registro(s) encontrado(s)
      </div>

      <div className="space-y-3">
        {filtered.map((r) => {
          const isOpen = expanded === r.id
          return (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : r.id)}
                className="w-full text-left p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{r.solicitante}</div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-xs text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>{fmt(r.data)}</div>
                    <svg
                      className={`w-4 h-4 text-slate-300 transition-transform ${isOpen ? "rotate-90" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm text-slate-600"><span className="text-slate-400">Fornecedor:</span> {r.fornecedor}</div>
                <div className="text-sm text-slate-600"><span className="text-slate-400">Quantidade:</span> {r.quantidade}</div>
                {r.etapaServico && (
                  <div className="text-sm text-slate-600"><span className="text-slate-400">Etapa:</span> {r.etapaServico}</div>
                )}
                <div className="text-sm text-slate-600"><span className="text-slate-400">Obra:</span> {r.obra}</div>
                <div className="flex items-center gap-2 mt-2">
                  {r.recebido && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">RECEBIDO</span>
                  )}
                  {r.movimentado && (
                    <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">MOVIMENTADO</span>
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 px-4 pb-4 pt-3 space-y-3">
                  {r.observacao && (
                    <div className="text-sm text-slate-600 bg-slate-50 rounded-xl px-3 py-2">
                      <span className="font-semibold text-slate-500 text-xs uppercase tracking-wide block mb-1">Observação</span>
                      {r.observacao}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={r.recebido}
                        onChange={(e) => onStatusChange(r.id, { recebido: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
                      />
                      Recebido
                    </label>
                    <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={r.movimentado}
                        onChange={(e) => onStatusChange(r.id, { movimentado: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-400"
                      />
                      Movimentado
                    </label>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-10">Nenhum registro encontrado.</p>
        )}
      </div>
    </div>
  )
}
