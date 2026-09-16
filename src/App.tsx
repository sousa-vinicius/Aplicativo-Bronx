import { useState, lazy, Suspense } from "react"

const Frotas = lazy(() => import("./Frotas"))
const Glp = lazy(() => import("./Glp"))

type Sector = "frotas" | "glp"

function IconFrotas() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <rect x="4" y="16" width="32" height="14" rx="3" fill="currentColor" opacity="0.15" />
      <rect x="4" y="16" width="32" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 20l4-8h24l4 8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="11" cy="30" r="3.5" fill="currentColor" />
      <circle cx="29" cy="30" r="3.5" fill="currentColor" />
      <rect x="16" y="18" width="8" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <line x1="4" y1="22" x2="36" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    </svg>
  )
}

function IconGlp() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <path d="M20 6c4 6-6 8-4 14a6 6 0 1010-2c-2 3-4 1-3-2 1-4-1-8-3-10z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

const SECTORS = [
  {
    id: "frotas" as Sector,
    label: "Frotas",
    sublabel: "Gestão de Veículos",
    description: "Controle de retiradas, devoluções, condição dos veículos e histórico de uso da frota.",
    accent: "text-amber-400",
    icon: <IconFrotas />,
    tag: "VEÍCULOS",
  },
  {
    id: "glp" as Sector,
    label: "Solicitação GLP",
    sublabel: "Gás Liquefeito de Petróleo",
    description: "Registro de solicitações de gás por obra, fornecedor, quantidade e etapa do serviço.",
    accent: "text-orange-400",
    icon: <IconGlp />,
    tag: "GLP",
  },
]

export default function App() {
  const [active, setActive] = useState<Sector | null>(null)
  const [pressed, setPressed] = useState<Sector | null>(null)

  if (active === "frotas" || active === "glp") {
    return (
      <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 text-sm">Carregando...</div>}>
        {active === "frotas" && <Frotas onBack={() => setActive(null)} />}
        {active === "glp" && <Glp onBack={() => setActive(null)} />}
      </Suspense>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="px-5 pt-10 pb-6 md:px-10 md:pt-14">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight">
            BRONX
          </h1>
        </div>
      </header>

      {/* Divider */}
      <div className="px-5 md:px-10">
        <div className="max-w-2xl mx-auto">
          <div className="h-px bg-slate-200" />
        </div>
      </div>

      {/* Sector label */}
      <div className="px-5 md:px-10 pt-6 pb-3">
        <div className="max-w-2xl mx-auto">
          <span
            className="text-xs font-bold tracking-widest text-slate-400 uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Setores
          </span>
        </div>
      </div>

      {/* Cards */}
      <main className="flex-1 px-5 md:px-10 pb-10">
        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3">
          {SECTORS.map((sector) => (
            <button
              key={sector.id}
              onClick={() => setActive(sector.id)}
              onPointerDown={() => setPressed(sector.id)}
              onPointerUp={() => setPressed(null)}
              onPointerLeave={() => setPressed(null)}
              className={`
                group relative w-full text-left rounded-2xl border bg-white
                transition-all duration-150 overflow-hidden
                ${pressed === sector.id ? "scale-[0.98]" : "hover:shadow-md"}
                border-slate-200 hover:border-slate-300
              `}
            >
              <div
                className={`absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${sector.accent.replace("text-", "bg-")}`}
              />

              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <span
                    className={`text-xs font-bold tracking-widest ${sector.accent}`}
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {sector.tag}
                  </span>
                  <div className={`w-8 h-8 flex-shrink-0 ${sector.accent} opacity-70 group-hover:opacity-100 transition-opacity`}>
                    {sector.icon}
                  </div>
                </div>

                <h2
                  className="text-lg font-bold text-slate-900 leading-snug mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {sector.label}
                </h2>
                <p className="text-xs text-slate-400 mb-3 font-medium">{sector.sublabel}</p>

                <p className="text-sm text-slate-500 leading-relaxed">{sector.description}</p>

                <div className={`mt-4 flex items-center gap-1.5 text-xs font-semibold ${sector.accent} opacity-0 group-hover:opacity-100 transition-all duration-200`}>
                  Acessar
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-5 md:px-10 pb-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span
            className="text-xs text-slate-300 font-bold tracking-widest uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Sistema Operacional
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>
              online
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
