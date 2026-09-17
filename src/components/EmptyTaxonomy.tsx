import { useState } from 'react'
import { seedMyTaxonomy } from '../api/taxonomy'

export default function EmptyTaxonomy({ onSeeded }: { onSeeded: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function run() {
    setLoading(true)
    setError(null)
    try {
      await seedMyTaxonomy()
      onSeeded()
    } catch (e) {
      setError(e instanceof Error ? e.message : '가져오기에 실패했습니다.')
      setLoading(false)
    }
  }

  return (
    <section className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 sm:p-8">
      <h2 className="text-lg font-bold text-slate-900">아직 증상 분류가 없습니다</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
        기본 증상 분류 266개를 가져와 바로 시작할 수 있습니다. 가져온 뒤에는 관리자 화면에서
        자유롭게 수정·삭제하고, 약국에서 취급하는 제품과 가격을 채워 넣으세요.
      </p>

      {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

      <button
        onClick={run}
        disabled={loading}
        className="mt-6 rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
      >
        {loading ? '가져오는 중…' : '기본 분류 가져오기'}
      </button>

      <p className="mt-4 text-xs text-slate-400">
        추천약은 포함되지 않습니다. 약국마다 취급 제품이 다르기 때문입니다.
      </p>
    </section>
  )
}
