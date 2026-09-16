import type { GlpRecord } from "../types"
import { fmt } from "../utils"

export function GlpHome({
  records,
  onNova,
  onHistorico,
}: {
  records: GlpRecord[]
  onNova: () => void
  onHistorico: () => void
}) {
  const recent = records.slice(0, 6)

  return (
    <div className="max-w-lg mx-auto px-5 pt-6 pb-24">
      {/* Stats */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{records.length}</div>
          <div className="text-xs text-slate-400 mt-0.5">Solicitações registradas</div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl">🔥</div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mb-7">
        <button
          onClick={onNova}
          className="bg-orange-400 text-slate-900 rounded-2xl p-4 text-left hover:bg-orange-300 active:scale-[0.97] transition-all"
        >
          <div className="font-bold text-sm" style={{ fontFamily: "var(--font-display)" }}>+ Nova</div>
          <div className="text-xs text-slate-700 mt-0.5">Solicitar GLP</div>
        </button>
        <button
          onClick={onHistorico}
          className="bg-white border border-slate-200 rounded-2xl p-4 text-left hover:border-slate-300 active:scale-[0.97] transition-all"
        >
          <div className="font-bold text-sm text-slate-800" style={{ fontFamily: "var(--font-display)" }}>Histórico</div>
          <div className="text-xs text-slate-400 mt-0.5">Ver todas</div>
        </button>
      </div>

      {/* Recent list */}
      {recent.length > 0 && (
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3" style={{ fontFamily: "var(--font-mono)" }}>
            Solicitações recentes
          </span>
          <div className="space-y-2">
            {recent.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-slate-200 px-4 py-3">
                <div className="flex items-start justify-between">
                  <div className="font-semibold text-slate-800 text-sm">{r.solicitante}</div>
                  <div className="text-xs text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>{fmt(r.data)}</div>
                </div>
                <div className="text-xs text-slate-400 mt-0.5 truncate">{r.fornecedor} · {r.quantidade} un. · {r.obra}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {records.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">🔥</div>
          <p className="text-sm">Nenhuma solicitação registrada ainda.</p>
        </div>
      )}
    </div>
  )
}
