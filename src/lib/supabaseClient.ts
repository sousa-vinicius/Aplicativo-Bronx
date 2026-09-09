import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseKey) {
  // eslint-disable-next-line no-console
  console.error(
    "Variáveis de ambiente do Supabase não configuradas. Crie um arquivo .env com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (veja .env.example).",
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
