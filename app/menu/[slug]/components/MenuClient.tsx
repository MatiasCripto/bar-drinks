'use client'

import { useState, useRef } from 'react'
import type { Bar, Category, Drink } from '@/lib/types/database'
import { useCart } from '@/lib/hooks/useCart'
import MenuHeader from './MenuHeader'
import CategoryTabs from './CategoryTabs'
import DrinkCard from './DrinkCard'
import Cart from './Cart'
import OrderModal from './OrderModal'

interface MenuClientProps {
  bar: Bar
  categories: Category[]
  drinks: Drink[]
}

export default function MenuClient({ bar, categories, drinks }: MenuClientProps) {
  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const [customerNote, setCustomerNote] = useState('')
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const cart = useCart()

  const drinksByCategory = categories.map((cat) => ({
    category: cat,
    drinks: drinks.filter((d) => d.category_id === cat.id),
  }))

  const uncategorizedDrinks = drinks.filter((d) => !d.category_id)

  const handleCategoryClick = (categoryId: string) => {
    const el = sectionRefs.current[categoryId]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleOrderSuccess = () => {
    setSuccess(true)
    setTimeout(() => {
      setOrderModalOpen(false)
      setSuccess(false)
      cart.clearCart()
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <MenuHeader
        barName={bar.name}
        logoUrl={bar.logo_url}
        tableIdentifier={cart.tableIdentifier}
        onTableChange={cart.setTableIdentifier}
      />

      {categories.length > 0 && (
        <CategoryTabs
          categories={categories}
          onCategoryClick={handleCategoryClick}
        />
      )}

      <main className="max-w-lg mx-auto px-4 py-4 space-y-8">
        {drinksByCategory.map(({ category, drinks: catDrinks }) =>
          catDrinks.length > 0 ? (
            <section
              key={category.id}
              ref={(el) => { sectionRefs.current[category.id] = el }}
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 px-1">
                {category.name}
              </h2>
              <div className="space-y-2">
                {catDrinks.map((drink) => (
                  <DrinkCard
                    key={drink.id}
                    drink={drink}
                    onAdd={cart.addItem}
                  />
                ))}
              </div>
            </section>
          ) : null
        )}

        {uncategorizedDrinks.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 px-1">
              Otros
            </h2>
            <div className="space-y-2">
              {uncategorizedDrinks.map((drink) => (
                <DrinkCard
                  key={drink.id}
                  drink={drink}
                  onAdd={cart.addItem}
                />
              ))}
            </div>
          </section>
        )}

        {drinks.length === 0 && (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <p className="text-lg">No hay productos disponibles</p>
          </div>
        )}
      </main>

      {cart.totalItems > 0 && (
        <Cart
          totalItems={cart.totalItems}
          totalPrice={cart.totalPrice}
          onOpen={() => setOrderModalOpen(true)}
        />
      )}

      <OrderModal
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        success={success}
        items={cart.items}
        totalPrice={cart.totalPrice}
        tableIdentifier={cart.tableIdentifier}
        customerNote={customerNote}
        barId={bar.id}
        onSuccess={handleOrderSuccess}
        onRemoveItem={cart.removeItem}
        onNoteChange={setCustomerNote}
      />
    </div>
  )
}
