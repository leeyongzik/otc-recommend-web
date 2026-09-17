export type TaxonomyNode = {
  node_id: string
  label: string
  sort_order?: number | null
  child_count: number
  drug_count: number
  suggest_referral: boolean
}

export type SearchHit = TaxonomyNode & {
  path: string
  path_ids: string[]
  path_labels: string[]
  depth: number
  score: number
}

export type Recommendation = {
  link_id: string
  drug_id: string
  name: string
  ingredients: string | null
  company: string | null
  category: string | null
  drug_status: string
  tier: 'primary' | 'add_on'
  priority: number
  note: string | null
  exclude_condition: string | null
  purchase_price: number | null
  sale_price: number | null
}

export type Crumb = { id: string; label: string }
