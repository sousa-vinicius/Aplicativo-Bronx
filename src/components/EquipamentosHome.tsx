import { useState } from "react"
import type { Equipamento } from "../types"
import { ALMOXARIFADO } from "../types"
import { fmt } from "../utils"

export function EquipamentosHome({
  equipamentos,
  onCadastro,
  onMovimentar,
  onHistorico,
}: {
  equipamentos: Equipamento[]
  onCadastro: () => void
  onMovimentar: (id: string) => void
  onHistorico: () => void
}) {
  const [q, setQ] = useState("")

  const filtered = equipamentos.filter((e) =>
    e.codigo.toLowerCase().includes(q.toLowerCase()) ||
    e.descricao.toLowerCase().includes(q.toLowerCase()) ||
    e.localAtual.toLowerCase().includes(q.toLowerCase()),
  )

  const noAlmoxarifado = equipamentos.filter((e) => e.localAtual === ALMOXARIFADO).length
  const emObra = equipamentos.length - noAlmoxarifado

  return (
    <div className="max-w-lg mx-auto px-5 pt-6 pb-24">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-3">
          <div className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{noAlmoxarifado}</div>
          <div className="text-xs text-slate-400 mt-0.5 leading-tight">No almoxarifado</div>
          <div className="w-6 h-1 rounded-full bg-slate-300 mt-2" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-3">
          <div className="text-2xl font-bold text-amber-600" style={{ fontFamily: "var(--font-display)" }}>{emObra}</div>
          <div className="text-xs text-slate-400 mt-0.5 leading-tight">Em obra</div>
          <div className="w-6 h-1 rounded-full bg-amber-400 mt-2" />
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={onCadastro}
          className="bg-slate-900 text-white rounded-2xl p-4 text-left hover:bg-slate-800 active:scale-[0.97] transition-all"
        >
          <div className="font-bold text-sm" style={{ fontFamily: "var(--font-display)" }}>+ Cadastrar</div>
          <div className="text-xs text-slate-300 mt-0.5">Novo equipamento</div>
        </button>
        <button
          onClick={onHistorico}
          className="bg-white border border-slate-200 rounded-2xl p-4 text-left hover:border-slate-300 active:scale-[0.97] transition-all"
        >
          <div className="font-bold text-sm text-slate-800" style={{ fontFamily: "var(--font-display)" }}>Histórico</div>
          <div className="text-xs text-slate-400 mt-0.5">Movimentações</div>
        </button>
      </div>

      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por código, descrição ou local..."
        className="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 mb-4"
      />

      <div className="space-y-2">
        {filtered.map((eq) => (
          <div key={eq.id} className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="text-xs font-bold text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>{eq.codigo}</div>
                <div className="font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{eq.descricao}</div>
              </div>
              {eq.localAtual === ALMOXARIFADO ? (
                <span className="text-xs bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full flex-shrink-0">ALMOXARIFADO</span>
              ) : (
                <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full flex-shrink-0">EM OBRA</span>
              )}
            </div>
            <div className="text-sm text-slate-600 mt-1">
              <span className="text-slate-400">Local:</span> {eq.localAtual}
            </div>
            {eq.responsavelAtual && (
              <div className="text-sm text-slate-600">
                <span className="text-slate-400">Com:</span> {eq.responsavelAtual}
              </div>
            )}
            {eq.dataUltimaMovimentacao && (
              <div className="text-xs text-slate-400 mt-1" style={{ fontFamily: "var(--font-mono)" }}>
                Última movimentação: {fmt(eq.dataUltimaMovimentacao)}
              </div>
            )}
            <button
              onClick={() => onMovimentar(eq.id)}
              className="w-full mt-3 bg-amber-400 text-slate-900 text-xs font-bold py-2.5 rounded-xl hover:bg-amber-300 transition-colors"
            >
              Registrar movimentação
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <div className="text-4xl mb-3">🧰</div>
            <p className="text-sm">Nenhum equipamento cadastrado ainda.</p>
          </div>
        )}
      </div>
    </div>
  )
}
