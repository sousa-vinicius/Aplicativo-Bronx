import { useState } from "react"
import { FORNECEDORES_GLP, OBRAS } from "../constants"
import { nowLocal } from "../utils"
import { BackBtn, Field, inputCls, SearchableSelect } from "./ui"

export function GlpForm({
  onSubmit,
  onBack,
}: {
  onSubmit: (data: {
    solicitante: string
    data: string
    fornecedor: string
    quantidade: number
    etapaServico: string
    obra: string
    observacao: string
  }) => void
  onBack: () => void
}) {
  const [solicitante, setSolicitante] = useState("")
  const [data, setData]               = useState(nowLocal)
  const [fornecedor, setFornecedor]   = useState("")
  const [quantidadeStr, setQuantidadeStr] = useState("1")
  const quantidade = Number(quantidadeStr) || 0
  const [etapaServico, setEtapa]      = useState("")
  const [obra, setObra]               = useState("")
  const [observacao, setObs]          = useState("")

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!solicitante || !fornecedor || !obra || quantidade < 1) return
    onSubmit({ solicitante, data, fornecedor, quantidade, etapaServico, obra, observacao })
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="px-5 pt-6 pb-5">
        <div className="mb-5"><BackBtn onClick={onBack} /></div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-orange-400" />
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
            Nova Solicitação
          </h2>
        </div>
        <p className="text-sm text-slate-400 ml-4">Preencha os dados da solicitação de GLP</p>
      </div>

      <form onSubmit={submit} className="px-5 pb-28 space-y-5">
        <Field label="Nome do solicitante" required>
          <input
            required
            type="text"
            value={solicitante}
            onChange={(e) => setSolicitante(e.target.value)}
            placeholder="Nome completo de quem está solicitando"
            className={inputCls}
          />
        </Field>

        <Field label="Data" required>
          <input
            required
            type="datetime-local"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className={inputCls}
            style={{ fontFamily: "var(--font-mono)" }}
          />
        </Field>

        <Field label="Fornecedor" required>
          <select
            required
            value={fornecedor}
            onChange={(e) => setFornecedor(e.target.value)}
            className={inputCls}
          >
            <option value="">Selecione o fornecedor</option>
            {FORNECEDORES_GLP.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </Field>

        <Field label="Quantidade de gás" required>
          <input
            required
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min={1}
            step={1}
            value={quantidadeStr}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault()
            }}
            onChange={(e) => setQuantidadeStr(e.target.value.replace(/\D/g, ""))}
            onBlur={() => { if (!quantidadeStr || Number(quantidadeStr) < 1) setQuantidadeStr("1") }}
            placeholder="Ex: 2"
            className={inputCls}
            style={{ fontFamily: "var(--font-mono)" }}
          />
        </Field>

        <Field label="Etapa do Serviço">
          <input
            type="text"
            value={etapaServico}
            onChange={(e) => setEtapa(e.target.value)}
            placeholder="Ex: Alvenaria, Acabamento, Fundação..."
            className={inputCls}
          />
        </Field>

        <Field label="Obra de destino" required>
          <SearchableSelect
            value={obra}
            onChange={setObra}
            options={OBRAS}
            placeholder="Buscar obra..."
          />
        </Field>

        <Field label="Observação">
          <textarea
            value={observacao}
            onChange={(e) => setObs(e.target.value)}
            placeholder="Urgência, instruções de entrega, detalhes adicionais..."
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </Field>

        <button
          type="submit"
          className="w-full bg-orange-400 text-slate-900 font-bold py-4 rounded-2xl hover:bg-orange-300 active:scale-[0.98] transition-all text-sm tracking-widest"
        >
          ENVIAR SOLICITAÇÃO
        </button>
      </form>
    </div>
  )
}
