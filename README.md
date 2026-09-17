# 성빈약국 일반약 추천 (MVP)

증상 텍스트 입력 → 증상 트리 경로 선택 → 추천약·가격 표시.

- 프론트엔드: React 19 + Vite + TypeScript + Tailwind CSS
- 백엔드: Supabase (프로젝트 `letwvftkomuxxbhnswyf`, 서울 리전)
- 반응형: 모바일(<640px) 1열 / 태블릿(640~1024px) 2열 / PC(>1024px) 2~3열

## 로컬 실행 (Ubuntu)

```bash
npm install
cp .env.example .env.local   # 값 입력 (아래 참고)
npm run dev                  # http://localhost:5173
```

`.env.local`

```
VITE_SUPABASE_URL=https://letwvftkomuxxbhnswyf.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

## 로그인

성빈약국 Supabase 계정(이메일/비밀번호)으로 로그인합니다. 로그인해야 RLS 정책상
`pharmacy_taxonomy`, `taxonomy_drugs`, `pharmacy_drugs` 조회가 됩니다.

## 사용하는 DB 함수

| 함수 | 용도 |
|---|---|
| `search_taxonomy(q, max_results)` | 증상 문장 → 후보 노드(경로·추천약 수·병원권유 여부) |
| `get_taxonomy_children(p_parent_id)` | 계통/하위 분기 목록 (NULL이면 최상위 22개) |
| `get_recommendations(p_node_id)` | 노드별 추천약 + 성분 + 사입가/판매가 |

모두 `security invoker`라 기존 RLS가 그대로 적용되고, 실행 권한은 `authenticated`에만 있습니다.

## Vercel 배포

1. 이 폴더를 GitHub 저장소에 올립니다 (`.env.local`은 커밋되지 않습니다).
2. Vercel에서 New Project → 저장소 선택 (Vite 자동 인식, 빌드 `npm run build`, 출력 `dist`).
3. Settings → Environment Variables 에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` 추가.
4. Deploy. 이후 push 하면 자동 재배포됩니다.

## 남은 작업

- 증상 동의어 테이블(검색 정확도 개선)
- 빈 노드 25개 추천약 채우기
- pending 건기식 13종 정리
