import type { Recommendation } from '../types/db'

export default function DrugCard({
  drug,
  showCost,
}: {
  drug: Recommendation
  showCost: boolean
}) {
  const isPrimary = drug.tier === 'primary'
  const margin =
    drug.sale_price != null && drug.purchase_price != null
      ? drug.sale_price - drug.purchase_price
      : null

  return (
    <article
      className={`rounded-xl bg-white p-4 shadow-sm ring-1 sm:p-5 ${
        isPrimary ? 'ring-teal-200' : 'ring-slate-200'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                isPrimary ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {isPrimary ? '기본 추천' : '추가 권유'}
            </span>
            {drug.category && drug.category !== '일반의약품' && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                {drug.category}
              </span>
            )}
            {drug.drug_status === 'pending' && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                등록 확인 필요
              </span>
            )}
          </div>
          <h3 className="mt-2 text-lg font-bold text-slate-900">{drug.name}</h3>
          {drug.ingredients && (
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{drug.ingredients}</p>
          )}
          {drug.company && <p className="mt-1 text-xs text-slate-400">{drug.company}</p>}
        </div>

        <div className="text-right">
          <p className="text-xl font-bold text-slate-900">
            {drug.sale_price != null ? `${drug.sale_price.toLocaleString()}원` : '가격 미입력'}
          </p>
          {showCost && drug.purchase_price != null && (
            <p className="mt-0.5 text-xs text-slate-500">
              사입 {drug.purchase_price.toLocaleString()}원
              {margin != null && ` · 마진 ${margin.toLocaleString()}원`}
            </p>
          )}
        </div>
      </div>

      {drug.note && (
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">💡 {drug.note}</p>
      )}
      {drug.exclude_condition && (
        <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
          ⚠ 제외 조건: {drug.exclude_condition}
        </p>
      )}
    </article>
  )
}
