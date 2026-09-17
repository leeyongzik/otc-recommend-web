import DrugCard from './DrugCard'
import type { Recommendation } from '../types/db'

export default function ResultPanel({
  nodeLabel,
  suggestReferral,
  recs,
  loading,
  showCost,
  onToggleCost,
}: {
  nodeLabel: string
  suggestReferral: boolean
  recs: Recommendation[]
  loading: boolean
  showCost: boolean
  onToggleCost: () => void
}) {
  const primary = recs.filter((r) => r.tier === 'primary')
  const addOn = recs.filter((r) => r.tier === 'add_on')

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-slate-900">{nodeLabel}</h2>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500">
          <input
            type="checkbox"
            checked={showCost}
            onChange={onToggleCost}
            className="h-4 w-4 accent-teal-600"
          />
          사입가·마진 보기
        </label>
      </div>

      {suggestReferral && (
        <div className="mt-3 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4">
          <p className="font-semibold text-amber-900">병원 진료 권유 경로</p>
          <p className="mt-1 text-sm text-amber-800">
            이 증상은 일반약으로 해결하기보다 병원 진료를 안내하는 것이 적절합니다.
          </p>
        </div>
      )}

      {loading ? (
        <p className="mt-4 text-sm text-slate-400">추천약을 불러오는 중…</p>
      ) : recs.length === 0 ? (
        <div className="mt-4 rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
          <p className="font-medium text-slate-700">추천약 준비 중</p>
          <p className="mt-1 text-sm text-slate-500">이 경로는 추천약을 아직 등록하지 않았습니다.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-5">
          {primary.length > 0 && (
            <div className="space-y-3">
              {primary.map((d) => (
                <DrugCard key={d.link_id} drug={d} showCost={showCost} />
              ))}
            </div>
          )}
          {addOn.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-500">증상에 따라 추가</h3>
              <div className="space-y-3">
                {addOn.map((d) => (
                  <DrugCard key={d.link_id} drug={d} showCost={showCost} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
