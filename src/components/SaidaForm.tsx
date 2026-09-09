import { useState } from "react"
import type { FleetRecord, Condition } from "../types"
import { FUEL_OPTIONS, FLEET } from "../constants"
import { nowLocal } from "../utils"
import { BackBtn, Field, ConditionPicker, PhotoCapture, inputCls } from "./ui"

export function SaidaForm({
  activeVehicles,
  onSubmit,
  onBack,
}: {
  activeVehicles: string[]
  onSubmit: (data: Omit<FleetRecord, "id" | "status">) => void
  onBack: () => void
}) {
  const [vehicle, setVehicle]       = useState("")
  const [driver, setDriver]         = useState("")
  const [time, setTime]             = useState(nowLocal)
  const [condition, setCondition]   = useState<Condition>("Limpo")
  const [fuel, setFuel]             = useState(75)
  const [route, setRoute]           = useState("")
  const [obs, setObs]               = useState("")
  const [photos, setPhotos]         = useState<string[]>([])

  const availableFleet = FLEET.filter((v) => !activeVehicles.includes(v))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!vehicle || !driver) return
    onSubmit({ vehicle, driver, departureTime: time, condition, fuelLevel: fuel, route, observations: obs, checkoutPhotos: photos })
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="px-5 pt-6 pb-2 flex items-center gap-3">
        <BackBtn onClick={onBack} />
      </div>
      <div className="px-5 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-amber-400" />
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
            Registrar Saída
          </h2>
        </div>
        <p className="text-sm text-slate-400 ml-4">Preencha os dados do veículo e do condutor</p>
      </div>

      <form onSubmit={submit} className="px-5 pb-28 space-y-5">

        <Field label="Veículo" required>
          <select
            required
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            className={inputCls}
          >
            <option value="">Selecione o veículo</option>
            {availableFleet.length === 0 ? (
              <option disabled>Todos os veículos estão em campo</option>
            ) : (
              availableFleet.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))
            )}
          </select>
          {availableFleet.length === 0 && (
            <p className="text-xs text-amber-600 mt-1.5 font-medium">
              Todos os veículos da frota estão em campo.
            </p>
          )}
        </Field>

        <Field label="Nome do condutor" required>
          <input
            required
            type="text"
            value={driver}
            onChange={(e) => setDriver(e.target.value)}
            placeholder="Nome completo de quem está retirando"
            className={inputCls}
          />
        </Field>

        <Field label="Horário de saída" required>
          <input
            required
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={inputCls}
            style={{ fontFamily: "var(--font-mono)" }}
          />
        </Field>

        <Field label="Condição do veículo">
          <ConditionPicker value={condition} onChange={setCondition} />
        </Field>

        <Field label="Nível de combustível">
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

        <Field label="Rota">
          <input
            type="text"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            placeholder="Ex: Sede → Obra Setor A → Fornecedor"
            className={inputCls}
          />
        </Field>

        <Field label="Observações">
          <textarea
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            placeholder="Avarias, pendências, estado dos pneus..."
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </Field>

        <PhotoCapture label="Fotos da saída" photos={photos} onChange={setPhotos} />

        <button
          type="submit"
          disabled={availableFleet.length === 0}
          className="w-full bg-amber-400 text-slate-900 font-bold py-4 rounded-2xl hover:bg-amber-300 active:scale-[0.98] transition-all text-sm tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
        >
          CONFIRMAR SAÍDA
        </button>
      </form>
    </div>
  )
}
