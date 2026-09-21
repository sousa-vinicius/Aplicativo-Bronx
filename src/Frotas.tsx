import { useState, useEffect } from "react"
import type { FleetRecord, FrotasView } from "./types"
import { fetchFrotaRecords, insertFrotaSaida, updateFrotaDevolucao } from "./lib/frotaApi"
import { FrotasHome } from "./components/FrotasHome"
import { SaidaForm } from "./components/SaidaForm"
import { DevolucaoSelect } from "./components/DevolucaoSelect"
import { DevolucaoForm } from "./components/DevolucaoForm"
import { Historico } from "./components/Historico"

export default function Frotas({ onBack }: { onBack: () => void }) {
  const [records, setRecords]   = useState<FleetRecord[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [saving, setSaving]     = useState(false)
  const [view, setView]         = useState<FrotasView>("home")
  const [returnId, setReturnId] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    fetchFrotaRecords()
      .then((data) => { if (active) { setRecords(data); setError(null) } })
      .catch((err) => { if (active) setError(err.message ?? "Erro ao carregar dados") })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const activeVehicles = records.filter((r) => r.status === "ativo").map((r) => r.vehicle)

  async function handleSaida(data: Omit<FleetRecord, "id" | "status">) {
    setSaving(true)
    try {
      const created = await insertFrotaSaida(data)
      setRecords((prev) => [created, ...prev])
      setView("home")
    } catch (err: any) {
      setError(err.message ?? "Erro ao salvar saída")
    } finally {
      setSaving(false)
    }
  }

  function handleReturnSelect(id: string) {
    setReturnId(id)
    setView("devolucao-form")
  }

  async function handleDevolucao(id: string, data: Partial<FleetRecord>) {
    setSaving(true)
    try {
      const updated = await updateFrotaDevolucao(id, data)
      setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)))
      setReturnId(null)
      setView("home")
    } catch (err: any) {
      setError(err.message ?? "Erro ao salvar devolução")
    } finally {
      setSaving(false)
    }
  }

  const returnRecord = returnId ? records.find((r) => r.id === returnId) ?? null : null

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
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-lg leading-none" style={{ fontFamily: "var(--font-display)" }}>
                Frotas
              </h1>
              {view !== "home" && (
                <span className="text-slate-300 text-sm">
                  / <span className="text-slate-500 text-sm">
                    {view === "saida" && "Nova Saída"}
                    {(view === "devolucao-select" || view === "devolucao-form") && "Devolução"}
                    {view === "historico" && "Histórico"}
                  </span>
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
              GESTÃO DE VEÍCULOS
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
            <FrotasHome
              records={records}
              onSaida={() => setView("saida")}
              onDevolucao={() => setView("devolucao-select")}
              onHistorico={() => setView("historico")}
            />
          )}
          {view === "saida" && (
            <SaidaForm
              activeVehicles={activeVehicles}
              onSubmit={handleSaida}
              onBack={() => setView("home")}
            />
          )}
          {view === "devolucao-select" && (
            <DevolucaoSelect
              records={records}
              onSelect={handleReturnSelect}
              onBack={() => setView("home")}
            />
          )}
          {view === "devolucao-form" && returnRecord && (
            <DevolucaoForm
              record={returnRecord}
              onSubmit={handleDevolucao}
              onBack={() => { setReturnId(null); setView("devolucao-select") }}
            />
          )}
          {view === "historico" && (
            <Historico records={records} onBack={() => setView("home")} />
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
