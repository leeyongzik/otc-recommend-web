import type { TaxonomyNode } from '../types/db'

export default function BranchSelector({
  title,
  nodes,
  onPick,
  loading,
}: {
  title: string
  nodes: TaxonomyNode[]
  onPick: (node: TaxonomyNode) => void
  loading: boolean
}) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
      {loading ? (
        <p className="mt-3 text-sm text-slate-400">불러오는 중…</p>
      ) : (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {nodes.map((n) => (
            <li key={n.node_id}>
              <button
                onClick={() => onPick(n)}
                className="flex w-full items-center justify-between gap-3 rounded-xl bg-white px-4 py-3.5 text-left shadow-sm ring-1 ring-slate-200 transition hover:ring-teal-400"
              >
                <span className="font-medium text-slate-900">{n.label}</span>
                <span className="flex shrink-0 gap-1 text-xs">
                  {n.suggest_referral && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">병원</span>
                  )}
                  {n.child_count > 0 ? (
                    <span className="text-slate-300">›</span>
                  ) : n.drug_count > 0 ? (
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-teal-700">
                      약 {n.drug_count}
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-400">준비 중</span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
