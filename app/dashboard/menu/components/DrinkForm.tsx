'use client'

import { useState } from 'react'
import type { Category, Drink } from '@/lib/types/database'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { Button } from '@/components/ui/Button'

interface DrinkFormProps {
  barId: string
  categories: Category[]
  initial?: Partial<Drink>
  onSubmit: (data: Omit<Drink, 'id' | 'created_at'>) => Promise<any>
}

export default function DrinkForm({
  barId,
  categories,
  initial,
  onSubmit,
}: DrinkFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [price, setPrice] = useState(initial?.price?.toString() ?? '')
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? null)
  const [available, setAvailable] = useState(initial?.available ?? true)
  const [sortOrder, setSortOrder] = useState(initial?.sort_order?.toString() ?? '0')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('El nombre es requerido')
      return
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError('Precio inválido')
      return
    }

    setSubmitting(true)
    const err = await onSubmit({
      bar_id: barId,
      name: name.trim(),
      category_id: categoryId || null,
      description: description.trim() || null,
      price: Number(price),
      image_url: imageUrl,
      available,
      sort_order: Number(sortOrder) || 0,
    })
    if (err) {
      setError('Error al guardar. Intentá de nuevo.')
    }
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
      <h3 className="font-semibold text-gray-900 dark:text-white">
        {initial ? 'Editar producto' : 'Nuevo producto'}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Nombre *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="Ej: Fernet con Coca"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Categoría</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">Sin categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none dark:bg-gray-800 dark:text-white"
              placeholder="Descripción breve..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Precio (ARS) *</label>
            <input
              type="number"
              required
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="1500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Orden</label>
            <input
              type="number"
              min="0"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600" />
            </label>
            <span className="text-sm text-gray-600 dark:text-gray-300">Disponible</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Foto</label>
        <ImageUpload
          currentUrl={imageUrl}
          onUpload={(url) => setImageUrl(url)}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={submitting}>
          {submitting ? 'Guardando...' : initial ? 'Guardar cambios' : 'Agregar producto'}
        </Button>
      </div>
    </form>
  )
}
