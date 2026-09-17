import { useState } from 'react'
import { supabase } from '../lib/supabase'

type Mode = 'login' | 'signup'

export default function Login() {
  const [mode, setMode] = useState<Mode>('login')
  const [pharmacyName, setPharmacyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setNotice(null)
    setPassword('')
    setPassword2('')
  }

  async function onLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(
        error.message.includes('Email not confirmed')
          ? '이메일 인증이 완료되지 않았습니다. 메일함을 확인해 주세요.'
          : '로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.',
      )
    }
    setLoading(false)
  }

  async function onSignup(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setNotice(null)

    if (!pharmacyName.trim()) {
      setError('약국명을 입력해 주세요.')
      return
    }
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }
    if (password !== password2) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: pharmacyName.trim() } },
    })
    setLoading(false)

    if (error) {
      setError(
        error.message.toLowerCase().includes('already')
          ? '이미 등록된 이메일입니다. 로그인을 시도해 주세요.'
          : `가입에 실패했습니다: ${error.message}`,
      )
      return
    }

    // 이메일 인증이 켜져 있으면 세션이 바로 생기지 않는다
    if (!data.session) {
      setNotice('가입이 접수되었습니다. 메일함에서 인증을 완료한 뒤 로그인해 주세요.')
      setMode('login')
    }
  }

  const isSignup = mode === 'signup'

  return (
    <div className="flex min-h-full items-center justify-center p-4">
      <form
        onSubmit={isSignup ? onSignup : onLogin}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8"
      >
        <h1 className="text-xl font-bold text-slate-900">
          {isSignup ? '약국 회원가입' : '일반약 추천'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isSignup
            ? '약국별로 증상 분류와 가격을 따로 관리합니다.'
            : '약국 계정으로 로그인하세요.'}
        </p>

        {isSignup && (
          <>
            <label className="mt-6 block text-sm font-medium text-slate-700">약국명</label>
            <input
              type="text"
              value={pharmacyName}
              onChange={(e) => setPharmacyName(e.target.value)}
              placeholder="예: 성빈약국"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </>
        )}

        <label className={`${isSignup ? 'mt-4' : 'mt-6'} block text-sm font-medium text-slate-700`}>
          이메일
        </label>
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
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder={isSignup ? '8자 이상' : undefined}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />

        {isSignup && (
          <>
            <label className="mt-4 block text-sm font-medium text-slate-700">비밀번호 확인</label>
            <input
              type="password"
              autoComplete="new-password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </>
        )}

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
        {notice && <p className="mt-4 text-sm text-teal-700">{notice}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-teal-600 px-4 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? '처리 중…' : isSignup ? '가입하기' : '로그인'}
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          {isSignup ? '이미 계정이 있으신가요? ' : '계정이 없으신가요? '}
          <button
            type="button"
            onClick={() => switchMode(isSignup ? 'login' : 'signup')}
            className="font-semibold text-teal-700 hover:underline"
          >
            {isSignup ? '로그인' : '약국 가입'}
          </button>
        </p>
      </form>
    </div>
  )
}
