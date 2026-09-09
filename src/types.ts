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
