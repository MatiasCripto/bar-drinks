'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ImageUploadProps {
  bucket?: string
  currentUrl?: string | null
  onUpload: (url: string) => void
}

export function ImageUpload({ bucket = 'drinks', currentUrl, onUpload }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${fileName}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    if (error) {
      setPreview(currentUrl ?? null)
      console.error('Upload error:', error)
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)
      onUpload(publicUrl)
    }

    setUploading(false)
  }

  return (
    <div className="space-y-2">
      <div
        onClick={() => inputRef.current?.click()}
        className="relative w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-amber-500 cursor-pointer flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800 transition-colors"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-400 dark:text-gray-500">
            <svg className="w-8 h-8 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs">Foto</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  )
}
