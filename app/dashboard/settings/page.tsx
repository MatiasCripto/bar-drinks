'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { ImageUpload } from '@/components/ui/ImageUpload'
import type { Bar } from '@/lib/types/database'
import { QRCodeSVG } from 'qrcode.react'

export default function SettingsPage() {
  const [bar, setBar] = useState<Bar | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [address, setAddress] = useState('')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const qrRef = useRef<HTMLDivElement>(null)
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
          if (data) {
            const barData = data as Bar
            setBar(barData)
            setName(barData.name)
            setSlug(barData.slug)
            setAddress(barData.address ?? '')
            setLogoUrl(barData.logo_url)
          }
          setLoading(false)
        })
    })
  }, [supabase])

  const isNewBar = !bar

  const validateSlug = (value: string) => {
    if (!/^[a-z0-9-]+$/.test(value)) {
      setSlugError('Solo letras minúsculas, números y guiones')
      return false
    }
    if (value.length < 3) {
      setSlugError('Mínimo 3 caracteres')
      return false
    }
    setSlugError(null)
    return true
  }

  const handleSlugChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setSlug(sanitized)
    if (sanitized) validateSlug(sanitized)
  }

  const handleSave = async () => {
    if (!name.trim()) return
    if (slug && !validateSlug(slug)) return

    setSaving(true)
    setSuccess(false)

    if (isNewBar) {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      const { error } = await supabase.from('bars').insert({
        owner_id: userData.user.id,
        name: name.trim(),
        slug: slug.trim(),
        address: address.trim() || null,
        logo_url: logoUrl,
      })

      if (error) {
        if (error.message.includes('slug')) {
          setSlugError('Este slug ya está en uso')
        }
      } else {
        setSuccess(true)
      }
    } else if (bar) {
      const { error } = await supabase
        .from('bars')
        .update({
          name: name.trim(),
          slug: slug.trim(),
          address: address.trim() || null,
          logo_url: logoUrl,
        })
        .eq('id', bar.id)

      if (error) {
        if (error.message.includes('slug')) {
          setSlugError('Este slug ya está en uso')
        }
      } else {
        setSuccess(true)
        setBar({ ...bar, name: name.trim(), slug: slug.trim(), address: address.trim() || null, logo_url: logoUrl })
      }
    }

    setSaving(false)
    setTimeout(() => setSuccess(false), 3000)
  }

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width * 2
      canvas.height = img.height * 2
      ctx?.scale(2, 2)
      ctx?.drawImage(img, 0, 0)
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `qr-${slug}.png`
      a.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const copyLink = () => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/menu/${slug}`
    navigator.clipboard.writeText(url)
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const menuUrl = slug ? `${process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/menu/${slug}` : null

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ajustes</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Configuración de tu bar
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Nombre del bar *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder="Ej: Florencio Drinks"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Slug (URL) *
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              midominio.com/menu/
            </span>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${
                slugError ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="mi-bar"
            />
          </div>
          {slugError && (
            <p className="text-xs text-red-600 mt-1">{slugError}</p>
          )}
          {slug && !slugError && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Preview: {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/menu/{slug}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Dirección (opcional)
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder="Dirección del bar"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Logo
          </label>
          <ImageUpload
            bucket="drinks"
            currentUrl={logoUrl}
            onUpload={(url) => setLogoUrl(url)}
          />
        </div>
      </div>

      {/* QR Code Section */}
      {menuUrl && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Código QR</h2>
          <div className="flex flex-col items-center gap-4">
            <div ref={qrRef} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <QRCodeSVG
                value={menuUrl}
                size={200}
                level="M"
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
              Escaneá este QR para ver la carta desde el celular
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" onClick={downloadQR}>
                Descargar QR
              </Button>
              <Button variant="secondary" size="sm" onClick={copyLink}>
                Copiar link
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving}>
          {saving ? 'Guardando...' : isNewBar ? 'Crear bar' : 'Guardar cambios'}
        </Button>
      </div>

      {success && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-up">
          Cambios guardados
        </div>
      )}
    </div>
  )
}
