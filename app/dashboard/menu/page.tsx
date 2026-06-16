'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Bar } from '@/lib/types/database'
import DrinkList from './components/DrinkList'
import DrinkForm from './components/DrinkForm'
import CategoryManager from './components/CategoryManager'
import { Button } from '@/components/ui/Button'
import { useDrinks } from '@/lib/hooks/useDrinks'

export default function MenuPage() {
  const [bar, setBar] = useState<Bar | null>(null)
  const [showForm, setShowForm] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from('bars')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setBar(data as Bar)
        })
    })
  }, [supabase])

  const {
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
  } = useDrinks(bar?.id ?? null)

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Carta</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {drinks.length} {drinks.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Nuevo producto'}
        </Button>
      </div>

      {showForm && bar && (
        <div className="mb-8">
          <DrinkForm
            barId={bar.id}
            categories={categories}
            onSubmit={async (data) => {
              const err = await addDrink(data)
              if (!err) setShowForm(false)
              return err
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Lista de productos - ocupa 2/3 en desktop */}
        <div className="lg:col-span-2">
          <DrinkList
            drinks={drinks}
            categories={categories}
            onToggleAvailability={toggleAvailability}
            onDelete={deleteDrink}
            onUpdate={updateDrink}
          />
        </div>

        {/* Categorías - ocupa 1/3 en desktop */}
        <div className="lg:col-span-1">
          <CategoryManager
            categories={categories}
            onAdd={addCategory}
            onUpdate={updateCategory}
            onDelete={deleteCategory}
          />
        </div>
      </div>
    </div>
  )
}
