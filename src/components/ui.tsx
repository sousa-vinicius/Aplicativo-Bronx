import { useRef, useCallback } from "react"
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

export function PhotoCapture({ label, photos, onChange }: { label: string; photos: string[]; onChange: (p: string[]) => void }) {
  const ref = useRef<HTMLInputElement>(null)

  const onFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      Array.from(e.target.files || []).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (ev) => onChange([...photos, ev.target?.result as string])
        reader.readAsDataURL(file)
      })
      if (ref.current) ref.current.value = ""
    },
    [photos, onChange],
  )

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {photos.map((src, i) => (
          <div key={i} className="relative">
            <img src={src} className="w-20 h-20 object-cover rounded-xl border border-slate-200" alt="" />
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
          className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-amber-400 hover:text-amber-500 transition-colors"
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs font-medium">Foto</span>
        </button>
      </div>
      <input ref={ref} type="file" accept="image/*" capture="environment" multiple className="hidden" onChange={onFile} />
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
