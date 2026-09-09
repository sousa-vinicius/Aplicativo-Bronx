import type { FleetRecord } from "../types"
import { FLEET } from "../constants"
import { fmt } from "../utils"
import { CondBadge, FuelPip } from "./ui"

export function FrotasHome({
  records,
  onSaida,
  onDevolucao,
  onHistorico,
}: {
  records: FleetRecord[]
  onSaida: () => void
  onDevolucao: () => void
  onHistorico: () => void
}) {
  const active   = records.filter((r) => r.status === "ativo")
  const returned = records.filter((r) => r.status === "devolvido").slice(0, 5)
  const availableCount = FLEET.filter((v) => !active.find((r) => r.vehicle === v)).length

  return (
    <div className="max-w-lg mx-auto px-5 pt-6 pb-24">
      {/* Stats row — only 2 cards */}
      <div className="grid grid-cols-2 gap-3 mb-7">
        <div className="bg-white rounded-2xl border border-slate-200 p-3">
          <div className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
            {active.length}
          </div>
          <div className="text-xs text-slate-400 mt-0.5 leading-tight">Em campo</div>
          <div className="w-6 h-1 rounded-full bg-amber-400 mt-2" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-3">
          <div className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
            {availableCount}
          </div>
          <div className="text-xs text-slate-400 mt-0.5 leading-tight">Disponíveis</div>
          <div className="w-6 h-1 rounded-full bg-emerald-400 mt-2" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 mb-7">
        <button
          onClick={onSaida}
          className="bg-amber-400 text-slate-900 rounded-2xl p-4 text-left hover:bg-amber-300 active:scale-[0.97] transition-all"
        >
          <div className="w-8 h-8 bg-slate-900/10 rounded-xl flex items-center justify-center mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
          <div className="font-bold text-sm" style={{ fontFamily: "var(--font-display)" }}>Nova Saída</div>
          <div className="text-xs text-slate-700 mt-0.5">Registrar retirada</div>
        </button>

        <button
          onClick={onDevolucao}
          className="bg-emerald-500 text-white rounded-2xl p-4 text-left hover:bg-emerald-400 active:scale-[0.97] transition-all"
        >
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
          </div>
          <div className="font-bold text-sm" style={{ fontFamily: "var(--font-display)" }}>Devolução</div>
          <div className="text-xs text-emerald-100 mt-0.5">Registrar retorno</div>
        </button>
      </div>

      {/* Fleet status — all vehicles */}
      <div className="mb-7">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3" style={{ fontFamily: "var(--font-mono)" }}>
          Situação da frota
        </span>
        <div className="space-y-2">
          {FLEET.map((v) => {
            const rec = active.find((r) => r.vehicle === v)
            return (
              <div
                key={v}
                className={`bg-white rounded-xl border px-4 py-3 flex items-center justify-between ${rec ? "border-amber-200" : "border-slate-200"}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">{v}</div>
                  {rec && (
                    <div className="text-xs text-slate-400 mt-0.5 truncate">
                      {rec.driver} · saída {fmt(rec.departureTime)}
                    </div>
                  )}
                </div>
                {rec ? (
                  <span className="ml-3 flex-shrink-0 text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">EM CAMPO</span>
                ) : (
                  <span className="ml-3 flex-shrink-0 text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">DISPONÍVEL</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent returned */}
      {returned.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              Devolvidos recentemente
            </span>
            <button onClick={onHistorico} className="text-xs text-slate-400 hover:text-slate-700 transition-colors font-medium">
              Ver todos →
            </button>
          </div>
          <div className="space-y-2">
            {returned.map((rec) => (
              <div key={rec.id} className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-3">
                <div className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">✓</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">{rec.vehicle}</div>
                  <div className="text-xs text-slate-400">{rec.driver} · {fmt(rec.returnTime || "")}</div>
                </div>
                <CondBadge c={rec.returnCondition || rec.condition} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
