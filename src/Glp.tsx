import { useState, useEffect } from "react"
import type { GlpRecord, GlpView } from "./types"
import { fetchGlpRecords, insertGlpSolicitacao, updateGlpStatus, deleteGlpSolicitacao } from "./lib/glpApi"
import { GlpHome } from "./components/GlpHome"
import { GlpForm } from "./components/GlpForm"
import { GlpHistorico } from "./components/GlpHistorico"

export default function Glp({ onBack }: { onBack: () => void }) {
  const [records, setRecords] = useState<GlpRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [saving, setSaving]   = useState(false)
  const [view, setView]       = useState<GlpView>("home")

  useEffect(() => {
    let active = true
    setLoading(true)
    fetchGlpRecords()
      .then((data) => { if (active) { setRecords(data); setError(null) } })
      .catch((err) => { if (active) setError(err.message ?? "Erro ao carregar dados") })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function handleNova(data: {
    solicitante: string
    data: string
    fornecedor: string
    quantidade: number
    etapaServico: string
    obra: string
    observacao: string
  }) {
    setSaving(true)
    try {
      const created = await insertGlpSolicitacao(data)
      setRecords((prev) => [created, ...prev])
      setView("home")
    } catch (err: any) {
      setError(err.message ?? "Erro ao salvar solicitação")
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(id: string, data: Partial<{ recebido: boolean; movimentado: boolean }>) {
    try {
      const updated = await updateGlpStatus(id, data)
      setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)))
    } catch (err: any) {
      setError(err.message ?? "Erro ao atualizar status")
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteGlpSolicitacao(id)
      setRecords((prev) => prev.filter((r) => r.id !== id))
    } catch (err: any) {
      setError(err.message ?? "Erro ao excluir solicitação")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="app-sticky-header bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center gap-4">
          <button onClick={onBack} className="text-slate-400 hover:text-slate-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-slate-900 text-lg leading-none" style={{ fontFamily: "var(--font-display)" }}>
              Solicitação de GLP
            </h1>
            <div className="text-xs text-slate-400 mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
              GÁS LIQUEFEITO DE PETRÓLEO
            </div>
          </div>
          {view === "home" && (
            <button
              onClick={() => setView("historico")}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold transition-colors"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              HISTÓRICO
            </button>
          )}
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
        <div className="max-w-lg mx-auto px-5 py-16 text-center text-slate-400 text-sm">Carregando registros...</div>
      ) : (
        <>
          {view === "home" && (
            <GlpHome records={records} onNova={() => setView("nova")} onHistorico={() => setView("historico")} />
          )}
          {view === "nova" && (
            <GlpForm onSubmit={handleNova} onBack={() => setView("home")} />
          )}
          {view === "historico" && (
            <GlpHistorico records={records} onStatusChange={handleStatusChange} onDelete={handleDelete} onBack={() => setView("home")} />
          )}
        </>
      )}

      {saving && (
        <div className="app-fixed-bottom fixed left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
          Salvando...
        </div>
      )}
    </div>
  )
}
