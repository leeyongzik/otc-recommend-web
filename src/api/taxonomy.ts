import { supabase } from '../lib/supabase'
import type { Recommendation, SearchHit, TaxonomyNode } from '../types/db'

export async function searchSymptoms(q: string, maxResults = 8): Promise<SearchHit[]> {
  const { data, error } = await supabase.rpc('search_taxonomy', { q, max_results: maxResults })
  if (error) throw error
  return (data ?? []) as SearchHit[]
}

export async function getChildren(parentId: string | null): Promise<TaxonomyNode[]> {
  const { data, error } = await supabase.rpc('get_taxonomy_children', { p_parent_id: parentId })
  if (error) throw error
  return (data ?? []) as TaxonomyNode[]
}

export async function getRecommendations(nodeId: string): Promise<Recommendation[]> {
  const { data, error } = await supabase.rpc('get_recommendations', { p_node_id: nodeId })
  if (error) throw error
  return (data ?? []) as Recommendation[]
}
