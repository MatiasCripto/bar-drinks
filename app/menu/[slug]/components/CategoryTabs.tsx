import type { Category } from '@/lib/types/database'

interface CategoryTabsProps {
  categories: Category[]
  onCategoryClick: (categoryId: string) => void
}

export default function CategoryTabs({
  categories,
  onCategoryClick,
}: CategoryTabsProps) {
  return (
    <div className="sticky top-[104px] z-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 overflow-x-auto">
      <div className="flex gap-1 px-4 py-2 max-w-lg mx-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryClick(cat.id)}
            className="flex-shrink-0 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-800 dark:hover:text-amber-400 rounded-full transition-colors whitespace-nowrap"
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
