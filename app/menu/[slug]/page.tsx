import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Bar, Category, Drink } from '@/lib/types/database'
import MenuClient from './components/MenuClient'

export default async function MenuPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: bar } = await supabase
    .from('bars')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (!bar) {
    notFound()
  }

  const [categoriesRes, drinksRes] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .eq('bar_id', bar.id)
      .order('sort_order'),
    supabase
      .from('drinks')
      .select('*')
      .eq('bar_id', bar.id)
      .eq('available', true)
      .order('sort_order'),
  ])

  const categories = (categoriesRes.data ?? []) as Category[]
  const drinks = (drinksRes.data ?? []) as Drink[]

  return (
    <MenuClient
      bar={bar as Bar}
      categories={categories}
      drinks={drinks}
    />
  )
}
