import type { Condition } from "./types"

export const CONDITIONS: Condition[] = ["Limpo", "Sujo"]

export const CONDITION_STYLE: Record<Condition, { pill: string; border: string }> = {
  Limpo: { pill: "bg-emerald-100 text-emerald-700", border: "border-emerald-400" },
  Sujo:  { pill: "bg-amber-100 text-amber-700",     border: "border-amber-400" },
}

export const FUEL_OPTIONS = [
  { value: 0,   label: "0% — Reserva" },
  { value: 10,  label: "10%" },
  { value: 25,  label: "25% — ¼ do tanque" },
  { value: 50,  label: "50% — Metade" },
  { value: 75,  label: "75% — ¾ do tanque" },
  { value: 100, label: "100% — Tanque cheio" },
]

export const FLEET = [
  "FIAT/ARGO DRIVE 1.0",
  "CHEVROLET/S10 LS DD4",
  "VW/SAVEIRO CS RB MPI",
  "FIAT/STRADA FREEDOM CD13",
  "CHEVROLET/ONIX 1.0MT LT",
]

// ─── Obras (compartilhado entre módulos) ────────────────────────────────────

// Lista fixa de obras/destinos.
export const OBRAS = [
  "ALAMEDA AREIÃO",
  "AMBIENTE - TERRAL",
  "ANTHOLOGY",
  "APPLAUSE NEW HOME",
  "ARTESANO",
  "AYA",
  "B GREAT BOSQUE DOS BURITIS",
  "BASILICA DIVINO PAI ETERNO",
  "BAUHAUS",
  "CASA CONCEITO",
  "CASA DA SERRA - JBJ",
  "CASA DU LAGO",
  "CINQUE TERRE",
  "CITY GARTEN",
  "CITY RICARDO PARANHOS",
  "CLOSER 23",
  "COMPLEXO ÁQUILA",
  "COND. CONFORT HOUSE",
  "COND. GREEN LIFE",
  "COOPERLUXO",
  "EUROPARK IBIRAPUERA",
  "FIORD - TERRAL",
  "GARTEN INC - CITY",
  "GAUDÍ",
  "GRAN PARIS",
  "GUARANY EMPREENDIMENTOS - SMART FIT",
  "HAUS MITRE",
  "ILHAS DO CARIBE",
  "INFINITY BUSINESS",
  "INSPIRE VACA BRAVA",
  "LE PARC",
  "LEGACY",
  "LOFT T7",
  "M CENTRAL PARK",
  "METROPOLITAN BUENO",
  "NEO VIVENDAS DO BOSQUE",
  "NURBAN",
  "ORIGYN BUENO",
  "PARADIZZO MZN",
  "PHENOM",
  "PLATZ 36",
  "POR DO SOL VACA BRAVA",
  "PRAÇA 232",
  "RESID. BEATRIZ E MÁRCIO",
  "RESID. JULIENE",
  "RESID. MATHEUS NEVES",
  "RESID. PAULO ROBERTO",
  "RESID. THAISA",
  "RESID. TIAGO E RENATA - SOMNIA",
  "SERRANO",
  "SINGAH",
  "STORYA",
  "VIGORE MARISTA",
  "VISTTA JK",
  "WISH 37",
]

// ─── Solicitação GLP ─────────────────────────────────────────────────────────

export const FORNECEDORES_GLP = [
  "Circular Gás",
  "União Gás",
  "Jato Gás",
  "Capital Gás",
  "São Fernando",
  "Lira Gás",
]
