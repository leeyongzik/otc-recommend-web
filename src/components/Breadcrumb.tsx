import type { Crumb } from '../types/db'

export default function Breadcrumb({
  crumbs,
  onJump,
  onReset,
}: {
  crumbs: Crumb[]
  onJump: (index: number) => void
  onReset: () => void
}) {
  if (crumbs.length === 0) return null
  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm text-slate-600">
      <button onClick={onReset} className="rounded px-2 py-1 font-medium text-teal-700 hover:bg-teal-50">
        처음
      </button>
      {crumbs.map((c, i) => (
        <span key={c.id} className="flex items-center gap-1">
          <span className="text-slate-300">›</span>
          <button
            onClick={() => onJump(i)}
            className={`rounded px-2 py-1 hover:bg-slate-100 ${
              i === crumbs.length - 1 ? 'font-semibold text-slate-900' : ''
            }`}
          >
            {c.label}
          </button>
        </span>
      ))}
    </nav>
  )
}
