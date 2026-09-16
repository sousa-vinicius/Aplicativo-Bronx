export type Condition = "Limpo" | "Sujo"
export type RecordStatus = "ativo" | "devolvido"
export type FrotasView = "home" | "saida" | "devolucao-select" | "devolucao-form" | "historico"

export interface FleetRecord {
  id: string
  vehicle: string
  driver: string
  departureTime: string
  condition: Condition
  fuelLevel: number
  route: string
  observations: string
  checkoutPhotos: string[]
  returnDriver?: string
  returnTime?: string
  returnCondition?: Condition
  returnFuelLevel?: number
  returnRoute?: string
  returnObservations?: string
  returnPhotos?: string[]
  status: RecordStatus
}

// ─── Solicitação GLP ─────────────────────────────────────────────────────────

export type GlpView = "home" | "nova" | "historico"

export interface GlpRecord {
  id: string
  solicitante: string
  data: string
  fornecedor: string
  quantidade: number
  etapaServico: string
  obra: string
  observacao: string
  createdAt: string
  recebido: boolean
  movimentado: boolean
}
