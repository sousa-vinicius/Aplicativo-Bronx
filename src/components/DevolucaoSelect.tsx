import type { FleetRecord } from "../types"
import { fmt } from "../utils"
import { BackBtn, CondBadge, FuelPip } from "./ui"

export function DevolucaoSelect({
  records,
  onSelect,
  onBack,
}: {
  records: FleetRecord[]
  onSelect: (id: string) => void
  onBack: () => void
}) {
  const active = records.filter((r) => r.status === "ativo")

  return (
    <div className="max-w-lg mx-auto px-5 pt-6 pb-10">
      <div className="mb-5"><BackBtn onClick={onBack} /></div>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-1 h-6 rounded-full bg-emerald-500" />
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
          Registrar Devolução
        </h2>
      </div>
      <p className="text-sm text-slate-400 ml-4 mb-6">Selecione o veículo que está sendo devolvido</p>

      {active.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <div className="text-4xl mb-3">🚗</div>
          <p className="text-slate-500 text-sm">Nenhum veículo em campo no momento.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {active.map((rec) => (
            <button
              key={rec.id}
              onClick={() => onSelect(rec.id)}
              className="w-full bg-white rounded-2xl border border-slate-200 p-4 text-left hover:border-emerald-400 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                  {rec.vehicle}
                </div>
                <svg className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="mt-1 text-sm text-slate-600">
                <span className="text-slate-400">Condutor:</span> {rec.driver}
              </div>
              <div className="text-xs text-slate-400 mt-1" style={{ fontFamily: "var(--font-mono)" }}>
                Saída: {fmt(rec.departureTime)}
              </div>
              <div className="flex items-center gap-3 mt-2">
                <FuelPip level={rec.fuelLevel} />
                <CondBadge c={rec.condition} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
