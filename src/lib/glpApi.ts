import { supabase } from "./supabaseClient"
import type { GlpRecord } from "../types"
import { localToISO } from "../utils"

function fromDb(row: any): GlpRecord {
  return {
    id: row.id,
    solicitante: row.solicitante,
    data: row.data,
    fornecedor: row.fornecedor,
    quantidade: row.quantidade,
    etapaServico: row.etapa_servico ?? "",
    obra: row.obra,
    observacao: row.observacao ?? "",
    createdAt: row.created_at,
    recebido: row.recebido ?? false,
    movimentado: row.movimentado ?? false,
  }
}

export async function fetchGlpRecords(): Promise<GlpRecord[]> {
  const { data, error } = await supabase
    .from("glp_solicitacoes")
    .select("*")
    .order("data", { ascending: false })
  if (error) throw error
  return (data ?? []).map(fromDb)
}

export async function insertGlpSolicitacao(data: {
  solicitante: string
  data: string
  fornecedor: string
  quantidade: number
  etapaServico: string
  obra: string
  observacao: string
}): Promise<GlpRecord> {
  const { data: row, error } = await supabase
    .from("glp_solicitacoes")
    .insert({
      solicitante: data.solicitante,
      data: localToISO(data.data),
      fornecedor: data.fornecedor,
      quantidade: data.quantidade,
      etapa_servico: data.etapaServico,
      obra: data.obra,
      observacao: data.observacao,
    })
    .select()
    .single()
  if (error) throw error
  return fromDb(row)
}

export async function updateGlpStatus(
  id: string,
  data: Partial<{ recebido: boolean; movimentado: boolean }>,
): Promise<GlpRecord> {
  const { data: row, error } = await supabase
    .from("glp_solicitacoes")
    .update(data)
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return fromDb(row)
}

export async function deleteGlpSolicitacao(id: string): Promise<void> {
  const { error } = await supabase
    .from("glp_solicitacoes")
    .delete()
    .eq("id", id)
  if (error) throw error
}
