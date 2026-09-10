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
