'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Drink, Category } from '@/lib/types/database'

export function useDrinks(barId: string | null) {
  const [drinks, setDrinks] = useState<Drink[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const load = useCallback(async () => {
    if (!barId) return
    setLoading(true)

    const [drinksRes, categoriesRes] = await Promise.all([
      supabase
        .from('drinks')
        .select('*')
        .eq('bar_id', barId)
        .order('sort_order'),
      supabase
        .from('categories')
        .select('*')
        .eq('bar_id', barId)
        .order('sort_order'),
    ])

    if (!drinksRes.error && drinksRes.data) {
      setDrinks(drinksRes.data as Drink[])
    }
    if (!categoriesRes.error && categoriesRes.data) {
      setCategories(categoriesRes.data as Category[])
    }
    setLoading(false)
  }, [barId, supabase])

  useEffect(() => {
    load()
  }, [load])

  const addDrink = useCallback(
    async (drink: Omit<Drink, 'id' | 'created_at'>) => {
      const { error } = await supabase.from('drinks').insert(drink)
      if (!error) await load()
      return error
    },
    [supabase, load]
  )

  const updateDrink = useCallback(
    async (id: string, updates: Partial<Drink>) => {
      const { error } = await supabase
        .from('drinks')
        .update(updates)
        .eq('id', id)
      if (!error) await load()
      return error
    },
    [supabase, load]
  )

  const deleteDrink = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('drinks').delete().eq('id', id)
      if (!error) await load()
      return error
    },
    [supabase, load]
  )

  const toggleAvailability = useCallback(
    async (id: string, available: boolean) => {
      await updateDrink(id, { available })
    },
    [updateDrink]
  )

  const addCategory = useCallback(
    async (name: string) => {
      if (!barId) return null
      const { data, error } = await supabase
        .from('categories')
        .insert({ bar_id: barId, name })
        .select()
        .single()
      if (!error) await load()
      return { data, error }
    },
    [barId, supabase, load]
  )

  const updateCategory = useCallback(
    async (id: string, updates: Partial<Category>) => {
      const { error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
      if (!error) await load()
      return error
    },
    [supabase, load]
  )

  const deleteCategory = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
      if (!error) await load()
      return error
    },
    [supabase, load]
  )

  return {
    drinks,
    categories,
    loading,
    addDrink,
    updateDrink,
    deleteDrink,
    toggleAvailability,
    addCategory,
    updateCategory,
    deleteCategory,
  }
}
