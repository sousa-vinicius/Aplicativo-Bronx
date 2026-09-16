import { useState } from "react"
import { BackBtn, Field, inputCls } from "./ui"

export function CadastroForm({
  onSubmit,
  onBack,
}: {
  onSubmit: (data: { codigo: string; descricao: string }) => void
  onBack: () => void
}) {
  const [codigo, setCodigo]       = useState("")
  const [descricao, setDescricao] = useState("")

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!codigo || !descricao) return
    onSubmit({ codigo, descricao })
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="px-5 pt-6 pb-5">
        <div className="mb-5"><BackBtn onClick={onBack} /></div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-slate-900" />
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
            Cadastrar Equipamento
          </h2>
        </div>
        <p className="text-sm text-slate-400 ml-4">Entra automaticamente no Almoxarifado</p>
      </div>

      <form onSubmit={submit} className="px-5 pb-28 space-y-5">
        <Field label="Código do equipamento" required>
          <input
            required
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Ex: EQP-001"
            className={inputCls}
            style={{ fontFamily: "var(--font-mono)" }}
          />
        </Field>

        <Field label="Descrição" required>
          <input
            required
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Furadeira de Impacto Bosch"
            className={inputCls}
          />
        </Field>

        <button
          type="submit"
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all text-sm tracking-widest"
        >
          CADASTRAR
        </button>
      </form>
    </div>
  )
}
