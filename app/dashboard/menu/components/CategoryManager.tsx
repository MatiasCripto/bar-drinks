'use client'

import { useState } from 'react'
import type { Category } from '@/lib/types/database'
import { Button } from '@/components/ui/Button'

interface CategoryManagerProps {
  categories: Category[]
  onAdd: (name: string) => Promise<any>
  onUpdate: (id: string, updates: Partial<Category>) => Promise<any>
  onDelete: (id: string) => Promise<any>
}

export default function CategoryManager({
  categories,
  onAdd,
  onUpdate,
  onDelete,
}: CategoryManagerProps) {
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleAdd = async () => {
    if (!newName.trim()) return
    setAdding(true)
    await onAdd(newName.trim())
    setNewName('')
    setAdding(false)
  }

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return
    await onUpdate(id, { name: editName.trim() })
    setEditingId(null)
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Categorías</h3>

      <div className="space-y-2 mb-4">
        {categories.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
            Sin categorías todavía
          </p>
        )}
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-2">
            {editingId === cat.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUpdate(cat.id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-800 dark:text-white"
                  autoFocus
                />
                <button
                  onClick={() => handleUpdate(cat.id)}
                  className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-400 p-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-gray-700 dark:text-gray-200">{cat.name}</span>
                <button
                  onClick={() => {
                    setEditingId(cat.id)
                    setEditName(cat.name)
                  }}
                  className="text-gray-400 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 p-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (deletingId === cat.id) {
                      onDelete(cat.id)
                      setDeletingId(null)
                    } else {
                      setDeletingId(cat.id)
                      setTimeout(() => setDeletingId(null), 3000)
                    }
                  }}
                  className={`p-1 ${
                    deletingId === cat.id
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd()
          }}
          placeholder="Nueva categoría"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
        />
        <Button
          size="sm"
          onClick={handleAdd}
          loading={adding}
          disabled={!newName.trim()}
        >
          Agregar
        </Button>
      </div>
    </div>
  )
}
