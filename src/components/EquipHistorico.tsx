import { useState } from "react"
import type { Equipamento, EquipamentoMovimentacao } from "../types"
import { fmt } from "../utils"
import { exportCSV, exportPDF, type MovComEquip } from "../lib/equipamentoExport"
import { BackBtn, inputCls } from "./ui"

export function EquipHistorico({
  equipamentos,
  movimentacoes,
  onBack,
}: {
  equipamentos: Equipamento[]
  movimentacoes: EquipamentoMovimentacao[]
  onBack: () => void
}) {
  const [q, setQ] = useState("")
  const [destinoFilter, setDestinoFilter] = useState("")
  const [equipFilter, setEquipFilter] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const equipById = new Map(equipamentos.map((e) => [e.id, e]))
  const enriched: MovComEquip[] = movimentacoes.map((m) => ({
    ...m,
    equipamentoCodigo: equipById.get(m.equipamentoId)?.codigo ?? "—",
    equipamentoDescricao: equipById.get(m.equipamentoId)?.descricao ?? "—",
  }))

  const destinoOptions = Array.from(new Set(enriched.map((m) => m.destino))).sort()
  const equipOptions = Array.from(new Set(enriched.map((m) => m.equipamentoCodigo))).sort()

  const filtered = enriched.filter((m) => {
    const matchesQ =
      m.responsavel.toLowerCase().includes(q.toLowerCase()) ||
      m.equipamentoCodigo.toLowerCase().includes(q.toLowerCase()) ||
      m.equipamentoDescricao.toLowerCase().includes(q.toLowerCase())
    const matchesDestino = !destinoFilter || m.destino === destinoFilter
    const matchesEquip = !equipFilter || m.equipamentoCodigo === equipFilter
    const dDate = m.data.slice(0, 10)
    const matchesFrom = !dateFrom || dDate >= dateFrom
    const matchesTo = !dateTo || dDate <= dateTo
    return matchesQ && matchesDestino && matchesEquip && matchesFrom && matchesTo
  })

  const hasFilters = q || destinoFilter || equipFilter || dateFrom || dateTo
  const filterLabel = [
    equipFilter || "Todos os equipamentos",
    destinoFilter || "Todos os destinos",
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
          placeholder="Buscar por responsável ou equipamento..."
          className={inputCls}
        />
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Equipamento</label>
          <select value={equipFilter} onChange={(e) => setEquipFilter(e.target.value)} className={inputCls}>
            <option value="">Todos os equipamentos</option>
            {equipOptions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Destino</label>
          <select value={destinoFilter} onChange={(e) => setDestinoFilter(e.target.value)} className={inputCls}>
            <option value="">Todos os destinos</option>
            {destinoOptions.map((o) => <option key={o} value={o}>{o}</option>)}
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
            onClick={() => { setQ(""); setDestinoFilter(""); setEquipFilter(""); setDateFrom(""); setDateTo("") }}
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
          className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold px-3 py-2.5 rounded-xl border border-amber-400 text-amber-700 bg-amber-50 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Baixar PDF
        </button>
      </div>

      <div className="text-xs text-slate-400 mb-3" style={{ fontFamily: "var(--font-mono)" }}>
        {filtered.length} registro(s) encontrado(s)
      </div>

      <div className="space-y-3">
        {filtered.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="text-xs font-bold text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>{m.equipamentoCodigo}</div>
                <div className="font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{m.equipamentoDescricao}</div>
              </div>
            </div>
            <div className="text-sm text-slate-600 mt-1">
              <span className="text-slate-400">De:</span> {m.origem} <span className="text-slate-300">→</span> <span className="text-slate-400">Para:</span> {m.destino}
            </div>
            <div className="text-sm text-slate-600">
              <span className="text-slate-400">Responsável:</span> {m.responsavel}
            </div>
            <div className="text-xs text-slate-400 mt-1" style={{ fontFamily: "var(--font-mono)" }}>{fmt(m.data)}</div>
            {m.observacoes && (
              <div className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 mt-2">{m.observacoes}</div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-10">Nenhum registro encontrado.</p>
        )}
      </div>
    </div>
  )
}
