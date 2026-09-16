import { useState } from "react"
import type { Equipamento } from "../types"
import { ALMOXARIFADO } from "../types"
import { OBRAS } from "../constants"
import { nowLocal } from "../utils"
import { BackBtn, Field, inputCls } from "./ui"

export function MovimentacaoForm({
  equipamento,
  onSubmit,
  onBack,
}: {
  equipamento: Equipamento
  onSubmit: (equipamentoId: string, data: { origem: string; destino: string; responsavel: string; data: string; observacoes: string }) => void
  onBack: () => void
}) {
  const [destino, setDestino]         = useState("")
  const [responsavel, setResponsavel] = useState("")
  const [data, setData]               = useState(nowLocal)
  const [observacoes, setObs]         = useState("")

  const destinoOptions = [ALMOXARIFADO, ...OBRAS].filter((d) => d !== equipamento.localAtual)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!destino || !responsavel) return
    onSubmit(equipamento.id, { origem: equipamento.localAtual, destino, responsavel, data, observacoes })
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="px-5 pt-6 pb-5">
        <div className="mb-5"><BackBtn onClick={onBack} /></div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-amber-400" />
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
            Registrar Movimentação
          </h2>
        </div>
        <p className="text-sm text-slate-400 ml-4">Para onde este equipamento está indo agora</p>
      </div>

      <div className="mx-5 mb-5 bg-slate-50 rounded-2xl border border-slate-200 p-4">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-mono)" }}>
          {equipamento.codigo}
        </div>
        <div className="font-bold text-slate-900 mb-2" style={{ fontFamily: "var(--font-display)" }}>
          {equipamento.descricao}
        </div>
        <div className="text-sm text-slate-600">
          <span className="text-slate-400">Local atual:</span> {equipamento.localAtual}
        </div>
        {equipamento.responsavelAtual && (
          <div className="text-sm text-slate-600">
            <span className="text-slate-400">Com:</span> {equipamento.responsavelAtual}
          </div>
        )}
      </div>

      <form onSubmit={submit} className="px-5 pb-28 space-y-5">
        <Field label="Novo destino" required>
          <select
            required
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            className={inputCls}
          >
            <option value="">Selecione o destino</option>
            {destinoOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </Field>

        <Field label="Responsável (encarregado)" required>
          <input
            required
            type="text"
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            placeholder="Nome de quem está levando o equipamento"
            className={inputCls}
          />
        </Field>

        <Field label="Data/hora" required>
          <input
            required
            type="datetime-local"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className={inputCls}
            style={{ fontFamily: "var(--font-mono)" }}
          />
        </Field>

        <Field label="Observações">
          <textarea
            value={observacoes}
            onChange={(e) => setObs(e.target.value)}
            placeholder="Estado do equipamento, motivo da transferência..."
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </Field>

        <button
          type="submit"
          className="w-full bg-amber-400 text-slate-900 font-bold py-4 rounded-2xl hover:bg-amber-300 active:scale-[0.98] transition-all text-sm tracking-widest"
        >
          CONFIRMAR MOVIMENTAÇÃO
        </button>
      </form>
    </div>
  )
}
