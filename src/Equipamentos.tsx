import { useState, useEffect } from "react"
import type { Equipamento, EquipamentoMovimentacao, EquipamentosView } from "./types"
import { fetchEquipamentos, fetchMovimentacoes, insertEquipamento, insertMovimentacao } from "./lib/equipamentoApi"
import { EquipamentosHome } from "./components/EquipamentosHome"
import { CadastroForm } from "./components/CadastroForm"
import { MovimentacaoForm } from "./components/MovimentacaoForm"
import { EquipHistorico } from "./components/EquipHistorico"

export default function Equipamentos({ onBack }: { onBack: () => void }) {
  const [equipamentos, setEquipamentos]   = useState<Equipamento[]>([])
  const [movimentacoes, setMovimentacoes] = useState<EquipamentoMovimentacao[]>([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState<string | null>(null)
  const [saving, setSaving]               = useState(false)
  const [view, setView]                   = useState<EquipamentosView>("home")
  const [selectedId, setSelectedId]       = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try {
      const [equips, movs] = await Promise.all([fetchEquipamentos(), fetchMovimentacoes()])
      setEquipamentos(equips)
      setMovimentacoes(movs)
      setError(null)
    } catch (err: any) {
      setError(err.message ?? "Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selected = selectedId ? equipamentos.find((e) => e.id === selectedId) ?? null : null

  async function handleCadastro(data: { codigo: string; descricao: string }) {
    setSaving(true)
    try {
      await insertEquipamento(data)
      await reload()
      setView("home")
    } catch (err: any) {
      setError(err.message ?? "Erro ao cadastrar equipamento")
    } finally {
      setSaving(false)
    }
  }

  async function handleMovimentacao(
    equipamentoId: string,
    data: { origem: string; destino: string; responsavel: string; data: string; observacoes: string },
  ) {
    setSaving(true)
    try {
      await insertMovimentacao({ equipamentoId, ...data })
      await reload()
      setSelectedId(null)
      setView("home")
    } catch (err: any) {
      setError(err.message ?? "Erro ao registrar movimentação")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center gap-4">
          <button onClick={onBack} className="text-slate-400 hover:text-slate-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-slate-900 text-lg leading-none" style={{ fontFamily: "var(--font-display)" }}>
              Equipamentos
            </h1>
            <div className="text-xs text-slate-400 mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
              CONTROLE DE PATRIMÔNIO
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-lg mx-auto px-5 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold ml-3">✕</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="max-w-lg mx-auto px-5 py-16 text-center text-slate-400 text-sm">Carregando equipamentos...</div>
      ) : (
        <>
          {view === "home" && (
            <EquipamentosHome
              equipamentos={equipamentos}
              onCadastro={() => setView("cadastro")}
              onMovimentar={(id) => { setSelectedId(id); setView("movimentar") }}
              onHistorico={() => setView("historico")}
            />
          )}
          {view === "cadastro" && (
            <CadastroForm onSubmit={handleCadastro} onBack={() => setView("home")} />
          )}
          {view === "movimentar" && selected && (
            <MovimentacaoForm
              equipamento={selected}
              onSubmit={handleMovimentacao}
              onBack={() => { setSelectedId(null); setView("home") }}
            />
          )}
          {view === "historico" && (
            <EquipHistorico equipamentos={equipamentos} movimentacoes={movimentacoes} onBack={() => setView("home")} />
          )}
        </>
      )}

      {saving && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
          Salvando...
        </div>
      )}
    </div>
  )
}
