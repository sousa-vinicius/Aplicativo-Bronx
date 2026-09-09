import { useState } from "react"
import type { FleetRecord, Condition } from "../types"
import { FUEL_OPTIONS } from "../constants"
import { nowLocal, fmt } from "../utils"
import { BackBtn, Field, ConditionPicker, PhotoCapture, CondBadge, FuelPip, inputCls } from "./ui"

export function DevolucaoForm({
  record,
  onSubmit,
  onBack,
}: {
  record: FleetRecord
  onSubmit: (id: string, data: Partial<FleetRecord>) => void
  onBack: () => void
}) {
  const [driver, setDriver]       = useState(record.driver)
  const [time, setTime]           = useState(nowLocal)
  const [condition, setCondition] = useState<Condition>("Limpo")
  const [fuel, setFuel]           = useState(record.fuelLevel)
  const [route, setRoute]         = useState(record.route)
  const [obs, setObs]             = useState("")
  const [photos, setPhotos]       = useState<string[]>([])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(record.id, {
      returnDriver: driver,
      returnTime: time,
      returnCondition: condition,
      returnFuelLevel: fuel,
      returnRoute: route,
      returnObservations: obs,
      returnPhotos: photos,
      status: "devolvido",
    })
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="px-5 pt-6 pb-2 flex items-center gap-3">
        <BackBtn onClick={onBack} />
      </div>
      <div className="px-5 pb-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-emerald-500" />
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
            Registrar Devolução
          </h2>
        </div>
        <p className="text-sm text-slate-400 ml-4">Preencha os dados de retorno do veículo</p>
      </div>

      {/* Vehicle info card */}
      <div className="mx-5 mb-5 bg-slate-50 rounded-2xl border border-slate-200 p-4">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)" }}>
          Veículo em campo
        </div>
        <div className="font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
          {record.vehicle}
        </div>
        <div className="mt-2 text-sm text-slate-600">
          <span className="text-slate-400">Saiu com:</span> {record.driver}
        </div>
        <div className="text-xs text-slate-400 mt-1" style={{ fontFamily: "var(--font-mono)" }}>
          Saída: {fmt(record.departureTime)}
        </div>
        <div className="flex items-center gap-3 mt-2">
          <FuelPip level={record.fuelLevel} />
          <CondBadge c={record.condition} />
        </div>
      </div>

      <form onSubmit={submit} className="px-5 pb-28 space-y-5">

        <Field label="Nome de quem está devolvendo" required>
          <input
            required
            type="text"
            value={driver}
            onChange={(e) => setDriver(e.target.value)}
            placeholder="Nome completo"
            className={inputCls}
          />
        </Field>

        <Field label="Horário de devolução" required>
          <input
            required
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={inputCls}
            style={{ fontFamily: "var(--font-mono)" }}
          />
        </Field>

        <Field label="Condição do veículo na devolução">
          <ConditionPicker value={condition} onChange={setCondition} />
        </Field>

        <Field label="Nível de combustível na devolução">
          <select
            value={fuel}
            onChange={(e) => setFuel(Number(e.target.value))}
            className={inputCls}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {FUEL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Field>

        <Field label="Rota percorrida">
          <input
            type="text"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            placeholder="Ex: Sede → Obra Setor A → Fornecedor → Sede"
            className={inputCls}
          />
        </Field>

        <Field label="Observações">
          <textarea
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            placeholder="Avarias, intercorrências, estado geral do veículo..."
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </Field>

        <PhotoCapture label="Fotos da devolução" photos={photos} onChange={setPhotos} />

        <button
          type="submit"
          className="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl hover:bg-emerald-400 active:scale-[0.98] transition-all text-sm tracking-widest"
        >
          CONFIRMAR DEVOLUÇÃO
        </button>
      </form>
    </div>
  )
}
