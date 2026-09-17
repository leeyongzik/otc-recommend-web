import { useState } from 'react'

export default function SymptomInput({
  onSearch,
  loading,
}: {
  onSearch: (q: string) => void
  loading: boolean
}) {
  const [q, setQ] = useState('')
  const examples = ['목이 쉬고 따가워요', '과식해서 속이 더부룩', '무릎이 시리고 아파요', '밤에 잠이 안 와요']

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <label className="block text-sm font-semibold text-slate-700">환자 증상</label>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (q.trim()) onSearch(q.trim())
        }}
        className="mt-2 flex flex-col gap-2 sm:flex-row"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="예: 3일째 목이 따갑고 목소리가 쉬었어요"
          className="w-full rounded-lg border border-slate-300 px-3 py-3 text-base outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
        <button
          type="submit"
          disabled={loading || !q.trim()}
          className="shrink-0 rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50 sm:w-auto"
        >
          {loading ? '검색 중…' : '검색'}
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex}
            onClick={() => {
              setQ(ex)
              onSearch(ex)
            }}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-200"
          >
            {ex}
          </button>
        ))}
      </div>
    </section>
  )
}
