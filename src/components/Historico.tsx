import { useState } from "react"
import type { FleetRecord } from "../types"
import { fmt } from "../utils"
import { exportCSV, exportPDF } from "../lib/frotaExport"
import { BackBtn, CondBadge, FuelPip, inputCls } from "./ui"

export function Historico({ records, onBack }: { records: FleetRecord[]; onBack: () => void }) {
  const [q, setQ] = useState("")
  const [vehicleFilter, setVehicleFilter] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)

  const vehicleOptions = Array.from(new Set(records.map((r) => r.vehicle))).sort()

  const filtered = records.filter((r) => {
    const matchesQ =
      r.driver.toLowerCase().includes(q.toLowerCase()) ||
      r.vehicle.toLowerCase().includes(q.toLowerCase())
    const matchesVehicle = !vehicleFilter || r.vehicle === vehicleFilter
    const depDate = r.departureTime.slice(0, 10)
    const matchesFrom = !dateFrom || depDate >= dateFrom
    const matchesTo = !dateTo || depDate <= dateTo
    return matchesQ && matchesVehicle && matchesFrom && matchesTo
  })

  const hasFilters = q || vehicleFilter || dateFrom || dateTo
  const filterLabel = [
    vehicleFilter || "Todos os veículos",
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

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 space-y-3">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por condutor ou veículo..."
          className={inputCls}
        />
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Veículo</label>
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className={inputCls}
          >
            <option value="">Todos os veículos</option>
            {vehicleOptions.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">De</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Até</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={() => { setQ(""); setVehicleFilter(""); setDateFrom(""); setDateTo("") }}
            className="text-xs text-slate-400 hover:text-slate-700 font-semibold transition-colors"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Ações de exportação */}
      <div className="flex items-center gap-2 mb-5">
        <button
          type="button"
          onClick={() => exportCSV(filtered)}
          disabled={filtered.length === 0}
          className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold px-3 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" />
          </svg>
          Baixar CSV
        </button>
        <button
          type="button"
          onClick={() => exportPDF(filtered, filterLabel)}
          disabled={filtered.length === 0}
          className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold px-3 py-2.5 rounded-xl border border-amber-400 text-amber-700 bg-amber-50 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" />
          </svg>
          Baixar PDF
        </button>
      </div>

      <div className="text-xs text-slate-400 mb-3" style={{ fontFamily: "var(--font-mono)" }}>
        {filtered.length} registro(s) encontrado(s)
      </div>

      <div className="space-y-3">
        {filtered.map((rec) => {
          const isOpen = expanded === rec.id
          return (
            <div key={rec.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : rec.id)}
                className="w-full text-left p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                    {rec.vehicle}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {rec.status === "ativo"
                      ? <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">ATIVO</span>
                      : <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">DEVOLVIDO</span>
                    }
                    <svg
                      className={`w-4 h-4 text-slate-300 transition-transform ${isOpen ? "rotate-90" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm text-slate-600"><span className="text-slate-400">Saiu:</span> {rec.driver}</div>
                <div className="text-xs text-slate-400 mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>↑ {fmt(rec.departureTime)}</div>
                <div className="flex items-center gap-3 mt-2">
                  <FuelPip level={rec.fuelLevel} />
                  <CondBadge c={rec.condition} />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 px-4 pb-4 pt-3 space-y-3">
                  {rec.route && (
                    <div className="text-sm text-slate-600">
                      <span className="text-slate-400">Rota (saída):</span> {rec.route}
                    </div>
                  )}
                  {rec.observations && (
                    <div className="text-sm text-slate-600 bg-slate-50 rounded-xl px-3 py-2">
                      <span className="font-semibold text-slate-500 text-xs uppercase tracking-wide block mb-1">Obs. saída</span>
                      {rec.observations}
                    </div>
                  )}
                  {rec.checkoutPhotos.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Fotos da saída</span>
                      <div className="flex gap-2 flex-wrap">
                        {rec.checkoutPhotos.map((p, i) => (
                          <a key={i} href={p} target="_blank" rel="noreferrer">
                            <img src={p} className="w-20 h-20 object-cover rounded-xl border border-slate-200" alt="" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {rec.status === "devolvido" && (
                    <div className="border-t border-slate-100 pt-3 space-y-3">
                      <div className="text-sm text-slate-600"><span className="text-slate-400">Devolveu:</span> {rec.returnDriver}</div>
                      <div className="text-xs text-slate-400 -mt-2" style={{ fontFamily: "var(--font-mono)" }}>↓ {fmt(rec.returnTime || "")}</div>
                      <div className="flex items-center gap-3">
                        <FuelPip level={rec.returnFuelLevel ?? 0} />
                        {rec.returnCondition && <CondBadge c={rec.returnCondition} />}
                      </div>
                      {rec.returnRoute && (
                        <div className="text-sm text-slate-600">
                          <span className="text-slate-400">Rota (devolução):</span> {rec.returnRoute}
                        </div>
                      )}
                      {rec.returnObservations && (
                        <div className="text-sm text-slate-600 bg-slate-50 rounded-xl px-3 py-2">
                          <span className="font-semibold text-slate-500 text-xs uppercase tracking-wide block mb-1">Obs. devolução</span>
                          {rec.returnObservations}
                        </div>
                      )}
                      {rec.returnPhotos && rec.returnPhotos.length > 0 && (
                        <div>
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Fotos da devolução</span>
                          <div className="flex gap-2 flex-wrap">
                            {rec.returnPhotos.map((p, i) => (
                              <a key={i} href={p} target="_blank" rel="noreferrer">
                                <img src={p} className="w-20 h-20 object-cover rounded-xl border border-slate-200" alt="" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
