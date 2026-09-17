import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getChildren, getRecommendations, myTaxonomyCount, searchSymptoms } from '../api/taxonomy'
import SymptomInput from '../components/SymptomInput'
import CandidateList from '../components/CandidateList'
import BranchSelector from '../components/BranchSelector'
import Breadcrumb from '../components/Breadcrumb'
import ResultPanel from '../components/ResultPanel'
import EmptyTaxonomy from '../components/EmptyTaxonomy'
import type { Crumb, Recommendation, SearchHit, TaxonomyNode } from '../types/db'

type Stage = 'input' | 'candidates' | 'branch' | 'result'

export default function Recommend() {
  const [stage, setStage] = useState<Stage>('input')
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<SearchHit[]>([])
  const [crumbs, setCrumbs] = useState<Crumb[]>([])
  const [children, setChildren] = useState<TaxonomyNode[]>([])
  const [recs, setRecs] = useState<Recommendation[]>([])
  const [referral, setReferral] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCost, setShowCost] = useState(false)
  const [nodeCount, setNodeCount] = useState<number | null>(null)

  const fail = (e: unknown) => {
    // eslint-disable-next-line no-console
    console.error(e)
    setError('데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
  }

  const openNode = useCallback(
    async (node: { node_id: string; label: string; child_count: number; suggest_referral: boolean }, path?: Crumb[]) => {
      setError(null)
      setLoading(true)
      setCrumbs(path ?? [...crumbs, { id: node.node_id, label: node.label }])
      setReferral(node.suggest_referral)
      try {
        if (node.child_count > 0) {
          setChildren(await getChildren(node.node_id))
          setStage('branch')
        } else {
          setRecs(await getRecommendations(node.node_id))
          setStage('result')
        }
      } catch (e) {
        fail(e)
      }
      setLoading(false)
    },
    [crumbs],
  )

  async function onSearch(q: string) {
    setError(null)
    setQuery(q)
    setLoading(true)
    setStage('candidates')
    try {
      setHits(await searchSymptoms(q))
    } catch (e) {
      fail(e)
    }
    setLoading(false)
  }

  async function onPickHit(hit: SearchHit) {
    const path: Crumb[] = hit.path_ids.map((id, i) => ({ id, label: hit.path_labels[i] }))
    await openNode(hit, path)
  }

  async function browseRoots() {
    setError(null)
    setLoading(true)
    setCrumbs([])
    setReferral(false)
    try {
      setChildren(await getChildren(null))
      setStage('branch')
    } catch (e) {
      fail(e)
    }
    setLoading(false)
  }

  async function jumpTo(index: number) {
    const path = crumbs.slice(0, index + 1)
    const target = path[path.length - 1]
    setLoading(true)
    setError(null)
    setCrumbs(path)
    try {
      const kids = await getChildren(target.id)
      if (kids.length > 0) {
        setChildren(kids)
        setStage('branch')
      } else {
        setRecs(await getRecommendations(target.id))
        setStage('result')
      }
    } catch (e) {
      fail(e)
    }
    setLoading(false)
  }

  function reset() {
    setStage('input')
    setHits([])
    setCrumbs([])
    setChildren([])
    setRecs([])
    setQuery('')
    setError(null)
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [stage])

  useEffect(() => {
    myTaxonomyCount()
      .then(setNodeCount)
      .catch(() => setNodeCount(0))
  }, [])

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 lg:px-8">
          <button onClick={reset} className="text-left">
            <p className="text-base font-bold text-slate-900 sm:text-lg">성빈약국 일반약 추천</p>
            <p className="hidden text-xs text-slate-500 sm:block">증상 입력 → 경로 선택 → 추천약</p>
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            로그아웃
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-5 px-4 py-5 lg:px-8 lg:py-8">
        {nodeCount === 0 ? (
          <EmptyTaxonomy
            onSeeded={() => {
              setNodeCount(null)
              myTaxonomyCount()
                .then(setNodeCount)
                .catch(() => setNodeCount(0))
            }}
          />
        ) : (
          <>
        <SymptomInput onSearch={onSearch} loading={loading && stage === 'candidates'} />

        {error && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
            {error}
          </p>
        )}

        {crumbs.length > 0 && <Breadcrumb crumbs={crumbs} onJump={jumpTo} onReset={reset} />}

        {stage === 'candidates' &&
          (loading ? (
            <p className="text-sm text-slate-400">검색 중…</p>
          ) : (
            <CandidateList hits={hits} query={query} onPick={onPickHit} onBrowse={browseRoots} />
          ))}

        {stage === 'branch' && (
          <BranchSelector
            title={crumbs.length === 0 ? '계통을 선택하세요' : '해당하는 항목을 선택하세요'}
            nodes={children}
            onPick={(n) => openNode(n)}
            loading={loading}
          />
        )}

        {stage === 'result' && (
          <ResultPanel
            nodeLabel={crumbs[crumbs.length - 1]?.label ?? ''}
            suggestReferral={referral}
            recs={recs}
            loading={loading}
            showCost={showCost}
            onToggleCost={() => setShowCost((v) => !v)}
          />
        )}

        {stage === 'input' && (
          <button
            onClick={browseRoots}
            className="w-full rounded-xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-500 hover:border-teal-400 hover:text-teal-700"
          >
            증상 입력 대신 계통에서 직접 찾기 ▸
          </button>
        )}
          </>
        )}
      </main>
    </div>
  )
}
