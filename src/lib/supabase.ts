import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

if (!url || !key) {
  // eslint-disable-next-line no-console
  console.error('Supabase 환경변수가 없습니다. .env.local 을 확인하세요.')
}

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true },
})
