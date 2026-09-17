import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.')
    setLoading(false)
  }

  return (
    <div className="flex min-h-full items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8"
      >
        <h1 className="text-xl font-bold text-slate-900">성빈약국 일반약 추천</h1>
        <p className="mt-1 text-sm text-slate-500">약국 계정으로 로그인하세요.</p>

        <label className="mt-6 block text-sm font-medium text-slate-700">이메일</label>
        <input
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />

        <label className="mt-4 block text-sm font-medium text-slate-700">비밀번호</label>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-teal-600 px-4 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? '로그인 중…' : '로그인'}
        </button>
      </form>
    </div>
  )
}
