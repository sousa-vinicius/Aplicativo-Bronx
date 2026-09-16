import { supabase } from "./supabaseClient"
import type { Equipamento, EquipamentoMovimentacao } from "../types"
import { ALMOXARIFADO } from "../types"
import { localToISO } from "../utils"

function movFromDb(row: any): EquipamentoMovimentacao {
  return {
    id: row.id,
    equipamentoId: row.equipamento_id,
    origem: row.origem,
    destino: row.destino,
    responsavel: row.responsavel,
    data: row.data,
    observacoes: row.observacoes ?? "",
  }
}

// Combina o cadastro do equipamento com sua última movimentação para saber onde
// ele está agora, sem precisar duplicar esse dado em duas tabelas.
function buildEquipamento(row: any, lastMov: EquipamentoMovimentacao | undefined): Equipamento {
  return {
    id: row.id,
    codigo: row.codigo,
    descricao: row.descricao,
    createdAt: row.created_at,
    localAtual: lastMov ? lastMov.destino : ALMOXARIFADO,
    responsavelAtual: lastMov?.responsavel,
    dataUltimaMovimentacao: lastMov?.data,
  }
}

export async function fetchEquipamentos(): Promise<Equipamento[]> {
  const [{ data: equipData, error: equipErr }, { data: movData, error: movErr }] = await Promise.all([
    supabase.from("equipamentos").select("*").order("codigo", { ascending: true }),
    supabase.from("equipamentos_movimentacoes").select("*").order("data", { ascending: false }),
  ])
  if (equipErr) throw equipErr
  if (movErr) throw movErr

  const movs = (movData ?? []).map(movFromDb)
  const lastMovByEquip = new Map<string, EquipamentoMovimentacao>()
  for (const m of movs) {
    if (!lastMovByEquip.has(m.equipamentoId)) lastMovByEquip.set(m.equipamentoId, m)
  }

  return (equipData ?? []).map((row) => buildEquipamento(row, lastMovByEquip.get(row.id)))
}

export async function fetchMovimentacoes(): Promise<EquipamentoMovimentacao[]> {
  const { data, error } = await supabase
    .from("equipamentos_movimentacoes")
    .select("*")
    .order("data", { ascending: false })
  if (error) throw error
  return (data ?? []).map(movFromDb)
}

export async function insertEquipamento(data: { codigo: string; descricao: string }): Promise<Equipamento> {
  const { data: row, error } = await supabase
    .from("equipamentos")
    .insert({ codigo: data.codigo, descricao: data.descricao })
    .select()
    .single()
  if (error) throw error
  return buildEquipamento(row, undefined)
}

export async function insertMovimentacao(data: {
  equipamentoId: string
  origem: string
  destino: string
  responsavel: string
  data: string
  observacoes: string
}): Promise<EquipamentoMovimentacao> {
  const { data: row, error } = await supabase
    .from("equipamentos_movimentacoes")
    .insert({
      equipamento_id: data.equipamentoId,
      origem: data.origem,
      destino: data.destino,
      responsavel: data.responsavel,
      data: localToISO(data.data),
      observacoes: data.observacoes,
    })
    .select()
    .single()
  if (error) throw error
  return movFromDb(row)
}
