import type { SearchHit } from '../types/db'

export default function CandidateList({
  hits,
  query,
  onPick,
  onBrowse,
}: {
  hits: SearchHit[]
  query: string
  onPick: (hit: SearchHit) => void
  onBrowse: () => void
}) {
  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-700">
          “{query}” 관련 경로 {hits.length > 0 && <span className="text-slate-400">{hits.length}건</span>}
        </h2>
        <button
          onClick={onBrowse}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          직접 찾기 ▸
        </button>
      </div>

      {hits.length === 0 ? (
        <p className="mt-3 rounded-xl bg-white p-5 text-sm text-slate-500 ring-1 ring-slate-200">
          일치하는 증상 경로를 찾지 못했습니다. 다른 표현으로 검색하거나 “직접 찾기”로 계통부터 선택해
          주세요.
        </p>
      ) : (
        <ul className="mt-3 grid gap-2 lg:grid-cols-2">
          {hits.map((h) => (
            <li key={h.node_id}>
              <button
                onClick={() => onPick(h)}
                className="w-full rounded-xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition hover:ring-teal-400"
              >
                <p className="text-xs text-slate-400">{h.path_labels.slice(0, -1).join(' › ')}</p>
                <p className="mt-0.5 font-semibold text-slate-900">{h.label}</p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  {h.child_count > 0 && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                      세부 선택 {h.child_count}
                    </span>
                  )}
                  {h.drug_count > 0 && (
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-teal-700">
                      추천약 {h.drug_count}
                    </span>
                  )}
                  {h.suggest_referral && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">병원 권유</span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
