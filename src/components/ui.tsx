import { useRef, useCallback, useState, useEffect } from "react"
import type { Condition } from "../types"
import { CONDITIONS, CONDITION_STYLE } from "../constants"

export const inputCls = "w-full border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-shadow"

export function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Voltar
    </button>
  )
}

export function CondBadge({ c }: { c: Condition }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${CONDITION_STYLE[c].pill}`}>
      {c}
    </span>
  )
}

export function FuelPip({ level }: { level: number }) {
  const color = level >= 50 ? "bg-emerald-500" : level >= 25 ? "bg-amber-500" : "bg-red-500"
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-2 w-16 bg-slate-200 rounded-full overflow-hidden">
        <div className={`absolute inset-y-0 left-0 rounded-full ${color}`} style={{ width: `${level}%` }} />
      </div>
      <span className="text-xs text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>{level}%</span>
    </div>
  )
}

export function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

export function Lightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  if (!src) return null
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img
        src={src}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-full object-contain rounded-lg"
      />
    </div>
  )
}

// Redimensiona e comprime a imagem antes de transformar em base64, para não sobrecarregar
// o banco de dados com fotos de câmera em tamanho original (que podem passar de 5MB cada).
function compressImage(file: File, maxDim = 1280, quality = 0.72): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const raw = ev.target?.result as string
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) { resolve(raw); return }
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL("image/jpeg", quality))
      }
      img.onerror = () => resolve(raw)
      img.src = raw
    }
    reader.onerror = () => resolve("")
    reader.readAsDataURL(file)
  })
}

export function PhotoCapture({ label, photos, onChange }: { label: string; photos: string[]; onChange: (p: string[]) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const onFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (ref.current) ref.current.value = ""
      if (files.length === 0) return
      setProcessing(true)
      try {
        const compressed = await Promise.all(files.map((f) => compressImage(f)))
        onChange([...photos, ...compressed.filter(Boolean)])
      } finally {
        setProcessing(false)
      }
    },
    [photos, onChange],
  )

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {photos.map((src, i) => (
          <div key={i} className="relative">
            <button type="button" onClick={() => setPreview(src)}>
              <img src={src} className="w-20 h-20 object-cover rounded-xl border border-slate-200" alt="" />
            </button>
            <button
              type="button"
              onClick={() => onChange(photos.filter((_, j) => j !== i))}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold shadow"
            >×</button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={processing}
          className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-amber-400 hover:text-amber-500 transition-colors disabled:opacity-50"
        >
          {processing ? (
            <span className="text-xs font-medium">...</span>
          ) : (
            <>
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-medium">Foto</span>
            </>
          )}
        </button>
      </div>
      <input ref={ref} type="file" accept="image/*" capture="environment" multiple className="hidden" onChange={onFile} />
      <Lightbox src={preview} onClose={() => setPreview(null)} />
    </div>
  )
}

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
}) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { setQuery(value) }, [value])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="relative" ref={ref}>
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); onChange(""); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder ?? "Buscar..."}
        className={inputCls}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg">
          {filtered.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => { onChange(o); setQuery(o); setOpen(false) }}
              className="w-full text-left px-3.5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {o}
            </button>
          ))}
        </div>
      )}
      {open && query && filtered.length === 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg px-3.5 py-2.5 text-sm text-slate-400">
          Nenhuma opção encontrada
        </div>
      )}
    </div>
  )
}

export function ConditionPicker({ value, onChange }: { value: Condition; onChange: (c: Condition) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {CONDITIONS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={`py-3 text-sm font-semibold rounded-xl border-2 transition-all ${
            value === c
              ? `${CONDITION_STYLE[c].border} ${CONDITION_STYLE[c].pill}`
              : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  )
}
