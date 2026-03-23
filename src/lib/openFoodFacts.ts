import type { OFFProduct } from '@/types'

const BASE = 'https://world.openfoodfacts.org'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeProduct(raw: any): OFFProduct | null {
  if (!raw) return null
  const n = raw?.nutriments
  if (!raw?.product_name || !n) return null

  const calories =
    n['energy-kcal_100g'] ??
    n['energy-kcal'] ??
    (n['energy_100g'] ? n['energy_100g'] / 4.184 : 0)

  if (!calories || calories <= 0) return null

  return {
    id: raw.code ?? raw._id ?? String(Math.random()),
    name: raw.product_name_he ?? raw.product_name ?? 'מוצר לא ידוע',
    brand: raw.brands ?? null,
    calories_per_100g: Math.round(Number(calories) * 10) / 10,
    protein_per_100g: Math.round(Number(n['proteins_100g'] ?? 0) * 10) / 10,
    carbs_per_100g: Math.round(Number(n['carbohydrates_100g'] ?? 0) * 10) / 10,
    fat_per_100g: Math.round(Number(n['fat_100g'] ?? 0) * 10) / 10,
    image_url: raw.image_front_thumb_url ?? raw.image_thumb_url ?? null,
  }
}

export async function searchFoods(query: string): Promise<OFFProduct[]> {
  if (!query.trim()) return []

  const url = new URL(`${BASE}/cgi/search.pl`)
  url.searchParams.set('search_terms', query)
  url.searchParams.set('json', '1')
  url.searchParams.set('page_size', '25')
  url.searchParams.set(
    'fields',
    'code,product_name,product_name_he,brands,nutriments,image_front_thumb_url,image_thumb_url'
  )

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`חיפוש נכשל: ${res.status}`)
  const json = await res.json()

  return (json.products ?? [])
    .map(normalizeProduct)
    .filter((p: OFFProduct | null): p is OFFProduct => p !== null)
    .slice(0, 20)
}

export async function getProductByBarcode(barcode: string): Promise<OFFProduct | null> {
  const res = await fetch(`${BASE}/api/v0/product/${barcode}.json`)
  if (!res.ok) return null
  const json = await res.json()
  if (json.status !== 1) return null
  return normalizeProduct({ ...json.product, code: barcode })
}
