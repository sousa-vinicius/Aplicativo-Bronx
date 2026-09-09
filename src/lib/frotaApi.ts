import { supabase } from "./supabaseClient"
import type { FleetRecord } from "../types"

// Banco usa snake_case; o app usa camelCase. Estas funções convertem nos dois sentidos.

function fromDb(row: any): FleetRecord {
  return {
    id: row.id,
    vehicle: row.vehicle,
    driver: row.driver,
    departureTime: row.departure_time,
    condition: row.condition,
    fuelLevel: row.fuel_level,
    route: row.route ?? "",
    observations: row.observations ?? "",
    checkoutPhotos: row.checkout_photos ?? [],
    returnDriver: row.return_driver ?? undefined,
    returnTime: row.return_time ?? undefined,
    returnCondition: row.return_condition ?? undefined,
    returnFuelLevel: row.return_fuel_level ?? undefined,
    returnRoute: row.return_route ?? undefined,
    returnObservations: row.return_observations ?? undefined,
    returnPhotos: row.return_photos ?? undefined,
    status: row.status,
  }
}

export async function fetchFrotaRecords(): Promise<FleetRecord[]> {
  const { data, error } = await supabase
    .from("frota_registros")
    .select("*")
    .order("departure_time", { ascending: false })
  if (error) throw error
  return (data ?? []).map(fromDb)
}

export async function insertFrotaSaida(
  data: Omit<FleetRecord, "id" | "status">,
): Promise<FleetRecord> {
  const { data: row, error } = await supabase
    .from("frota_registros")
    .insert({
      vehicle: data.vehicle,
      driver: data.driver,
      departure_time: data.departureTime,
      condition: data.condition,
      fuel_level: data.fuelLevel,
      route: data.route,
      observations: data.observations,
      checkout_photos: data.checkoutPhotos,
      status: "ativo",
    })
    .select()
    .single()
  if (error) throw error
  return fromDb(row)
}

export async function updateFrotaDevolucao(
  id: string,
  data: Partial<FleetRecord>,
): Promise<FleetRecord> {
  const { data: row, error } = await supabase
    .from("frota_registros")
    .update({
      return_driver: data.returnDriver,
      return_time: data.returnTime,
      return_condition: data.returnCondition,
      return_fuel_level: data.returnFuelLevel,
      return_route: data.returnRoute,
      return_observations: data.returnObservations,
      return_photos: data.returnPhotos,
      status: data.status,
    })
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return fromDb(row)
}
