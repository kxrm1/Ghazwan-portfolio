'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Artwork } from '@/data/artworks'
import { 
  getAuthToken, 
  clearAuthToken, 
  fetchArtworks, 
  createArtwork, 
  updateArtwork, 
  deleteArtwork,
  uploadImages,
  fetchTaxonomy,
  addTaxonomyItem,
  editTaxonomyItem,
  deleteTaxonomyItem,
  Taxonomy
} from '@/lib/api'
import { useLiveSync } from '@/lib/live-sync'
import PlaceholderImage from '@/components/PlaceholderImage'

interface Toast {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'inventory' | 'taxonomy'>('inventory')
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [taxonomy, setTaxonomy] = useState<Taxonomy>({ categories: [], materials: [] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  
  // Artwork Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Artwork | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Taxonomy Management State
  const [newMaterialInput, setNewMaterialInput] = useState('')
  const [newCategoryInput, setNewCategoryInput] = useState('')
  const [editingTaxItem, setEditingTaxItem] = useState<{ type: 'category' | 'material', name: string } | null>(null)
  const [editTaxValue, setEditTaxValue] = useState('')

  // Artwork Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Sculpture',
    material: 'Bronze',
    selectedMaterials: ['Bronze'] as string[],
    year: new Date().getFullYear(),
    status: 'Available' as 'Available' | 'Sold' | 'Reserved',
    dimensions: '60 x 40 x 30 cm',
    location: 'Studio Damascus',
    series: 'Contemporary Series',
    aspectRatio: 'aspect-[3/4]',
    imageUrl: '',
    imagesList: [] as string[]
  })

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4500)
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [list, tax] = await Promise.all([fetchArtworks(), fetchTaxonomy()])
      setArtworks(list)
      setTaxonomy(tax)
    } catch {
      showToast('Error loading archive data. Please refresh.', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  // Auth Guard
  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push('/admin/login')
      return
    }
    loadData()
  }, [router, loadData])

  // Live Sync for multi-window / multi-device admin updates
  const { isConnected } = useLiveSync({ onUpdate: loadData })

  const handleLogout = () => {
    clearAuthToken()
    router.push('/admin/login')
  }

  // --- Taxonomy CRUD Operations ---
  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newMaterialInput.trim()
    if (!trimmed) return
    
    setSaving(true)
    const res = await addTaxonomyItem('material', trimmed)
    setSaving(false)

    if (res.success && res.taxonomy) {
      setTaxonomy(res.taxonomy)
      setNewMaterialInput('')
      showToast(`Added material: "${trimmed}"`, 'success')
    } else {
      if (res.error?.includes('Unauthorized')) {
        clearAuthToken()
        router.push('/admin/login')
      } else {
        showToast(res.error || 'Failed to add material', 'error')
      }
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newCategoryInput.trim()
    if (!trimmed) return
    
    setSaving(true)
    const res = await addTaxonomyItem('category', trimmed)
    setSaving(false)

    if (res.success && res.taxonomy) {
      setTaxonomy(res.taxonomy)
      setNewCategoryInput('')
      showToast(`Added category: "${trimmed}"`, 'success')
    } else {
      if (res.error?.includes('Unauthorized')) {
        clearAuthToken()
        router.push('/admin/login')
      } else {
        showToast(res.error || 'Failed to add category', 'error')
      }
    }
  }

  const handleSaveTaxEdit = async (type: 'category' | 'material') => {
    if (!editingTaxItem || !editTaxValue.trim()) return
    setSaving(true)
    const res = await editTaxonomyItem(type, editingTaxItem.name, editTaxValue.trim())
    setSaving(false)

    if (res.success && res.taxonomy) {
      setTaxonomy(res.taxonomy)
      showToast(`Renamed ${type} to "${editTaxValue.trim()}"`, 'success')
      setEditingTaxItem(null)
      setEditTaxValue('')
    } else {
      showToast(res.error || `Failed to update ${type}`, 'error')
    }
  }

  const handleDeleteTax = async (type: 'category' | 'material', name: string) => {
    if (confirm(`Are you sure you want to delete ${type} "${name}"?`)) {
      setSaving(true)
      const res = await deleteTaxonomyItem(type, name)
      setSaving(false)

      if (res.success && res.taxonomy) {
        setTaxonomy(res.taxonomy)
        showToast(`Deleted ${type}: "${name}"`, 'success')
      } else {
        showToast(res.error || `Failed to delete ${type}`, 'error')
      }
    }
  }

  // --- Artwork Form Handlers ---
  const openCreateModal = () => {
    setEditingItem(null)
    const defaultCat = taxonomy.categories[0] || 'Sculpture'
    const defaultMat = taxonomy.materials[0] || 'Bronze'

    setFormData({
      title: '',
      category: defaultCat,
      material: defaultMat,
      selectedMaterials: [defaultMat],
      year: new Date().getFullYear(),
      status: 'Available',
      dimensions: '60 x 40 x 30 cm',
      location: 'Studio Damascus',
      series: 'Contemporary Series',
      aspectRatio: 'aspect-[3/4]',
      imageUrl: '',
      imagesList: []
    })
    setModalOpen(true)
  }

  const openEditModal = (item: Artwork) => {
    setEditingItem(item)
    const imgs = item.images && item.images.length > 0 
      ? item.images 
      : (item.imageUrl ? [item.imageUrl] : [])

    const parsedMats = item.material
      ? item.material.split(/[,/&+]|\band\b/i).map(m => m.trim()).filter(m => m.length > 0)
      : []

    setFormData({
      title: item.title,
      category: item.category,
      material: item.material,
      selectedMaterials: parsedMats.length > 0 ? parsedMats : [taxonomy.materials[0] || 'Bronze'],
      year: item.year,
      status: item.status,
      dimensions: item.dimensions,
      location: item.location,
      series: item.series,
      aspectRatio: item.aspectRatio || 'aspect-[3/4]',
      imageUrl: item.imageUrl || imgs[0] || '',
      imagesList: imgs
    })
    setModalOpen(true)
  }

  const toggleMaterial = (mat: string) => {
    setFormData(prev => {
      const exists = prev.selectedMaterials.includes(mat)
      const next = exists 
        ? prev.selectedMaterials.filter(m => m !== mat)
        : [...prev.selectedMaterials, mat]
      const finalMaterials = next.length > 0 ? next : [mat]
      return {
        ...prev,
        selectedMaterials: finalMaterials,
        material: finalMaterials.join(', ')
      }
    })
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const fileArray = Array.from(files)
      const uploadedUrls = await uploadImages(fileArray)
      if (uploadedUrls.length > 0) {
        setFormData(prev => {
          const combined = [...prev.imagesList, ...uploadedUrls]
          return {
            ...prev,
            imageUrl: prev.imageUrl || combined[0] || '',
            imagesList: combined
          }
        })
        showToast(`Successfully uploaded ${uploadedUrls.length} image(s)`, 'success')
      }
    } catch (err: any) {
      showToast(err.message || 'Error uploading images. Please check file sizes (max 10MB).', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const removeImage = (index: number) => {
    setFormData(prev => {
      const updated = prev.imagesList.filter((_, i) => i !== index)
      return {
        ...prev,
        imageUrl: updated[0] || '',
        imagesList: updated
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const mainImageUrl = formData.imageUrl.trim() || formData.imagesList[0] || ''
    const allImages = formData.imagesList.length > 0 
      ? formData.imagesList 
      : (mainImageUrl ? [mainImageUrl] : [])

    const payload: Partial<Artwork> = {
      title: formData.title,
      category: formData.category,
      material: formData.material,
      year: Number(formData.year),
      status: formData.status,
      dimensions: formData.dimensions,
      location: formData.location,
      series: formData.series,
      aspectRatio: formData.aspectRatio,
      imageUrl: mainImageUrl,
      images: allImages
    }

    if (editingItem) {
      const res = await updateArtwork(editingItem.id, payload)
      setSaving(false)
      if (res.success) {
        showToast(`Artwork "${formData.title}" updated successfully`, 'success')
        setModalOpen(false)
        await loadData()
      } else {
        if (res.error?.includes('Unauthorized')) {
          clearAuthToken()
          router.push('/admin/login')
        } else {
          showToast(res.error || 'Failed to update artwork', 'error')
        }
      }
    } else {
      const res = await createArtwork(payload)
      setSaving(false)
      if (res.success) {
        showToast(`Artwork "${formData.title}" created successfully`, 'success')
        setModalOpen(false)
        await loadData()
      } else {
        if (res.error?.includes('Unauthorized')) {
          clearAuthToken()
          router.push('/admin/login')
        } else {
          showToast(res.error || 'Failed to create artwork', 'error')
        }
      }
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      setSaving(true)
      const res = await deleteArtwork(id)
      setSaving(false)
      if (res.success) {
        showToast(`Deleted artwork "${title}"`, 'success')
        await loadData()
      } else {
        if (res.error?.includes('Unauthorized')) {
          clearAuthToken()
          router.push('/admin/login')
        } else {
          showToast(res.error || 'Failed to delete artwork', 'error')
        }
      }
    }
  }

  const toggleStatus = async (item: Artwork) => {
    const nextStatus = item.status === 'Available' ? 'Sold' : 'Available'
    const res = await updateArtwork(item.id, { status: nextStatus as 'Available' | 'Sold' })
    if (res.success) {
      showToast(`Status updated to ${nextStatus}`, 'success')
      await loadData()
    } else {
      showToast(res.error || 'Failed to update status', 'error')
    }
  }

  const filtered = artworks.filter(a => {
    if (statusFilter !== 'All' && a.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        a.title.toLowerCase().includes(q) || 
        a.material.toLowerCase().includes(q) || 
        a.series.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <main className="min-h-screen bg-white text-[#1c1c1c] font-serif p-6 md:p-12">
      {/* Toast Notifications Overlay */}
      <div className="fixed top-6 right-6 z-50 space-y-2 max-w-sm pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`p-3 text-[12px] shadow-lg border pointer-events-auto transition-all ${
              t.type === 'success'
                ? 'bg-[#111] text-white border-[#111]'
                : t.type === 'error'
                ? 'bg-[#b00] text-white border-[#b00]'
                : 'bg-white text-[#111] border-[#d0d0d0]'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>

      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 border-b border-[#111] pb-4 mb-6">
        <div>
          <div className="text-[11px] text-[#888] uppercase tracking-wider flex items-center gap-2">
            <span>Management Panel</span>
          </div>
          <h1 className="text-[20px] md:text-[22px] font-normal text-[#111] tracking-tight">
            Ghazwan Allaf — Archive Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-6 text-[13px]">
          <Link href="/" target="_blank" className="text-[#666] hover:text-[#111] underline">
            View Live Site ↗
          </Link>
          <button
            onClick={openCreateModal}
            className="bg-[#111] text-white px-3.5 py-1.5 hover:bg-[#333] transition-colors"
          >
            + New Artwork
          </button>
          <button
            onClick={handleLogout}
            className="text-[#999] hover:text-[#111] transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs: Inventory vs Categories & Materials */}
      <div className="flex gap-8 border-b border-[#e0e0e0] mb-6 text-[13px]">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-2.5 transition-colors ${
            activeTab === 'inventory'
              ? 'text-[#111] font-semibold border-b-2 border-[#111]'
              : 'text-[#888] hover:text-[#111]'
          }`}
        >
          Artwork Inventory ({artworks.length})
        </button>
        <button
          onClick={() => setActiveTab('taxonomy')}
          className={`pb-2.5 transition-colors ${
            activeTab === 'taxonomy'
              ? 'text-[#111] font-semibold border-b-2 border-[#111]'
              : 'text-[#888] hover:text-[#111]'
          }`}
        >
          Manage Categories & Materials
        </button>
      </div>

      {/* TAB 1: INVENTORY TABLE */}
      {activeTab === 'inventory' && (
        <section className="space-y-6">
          {/* Control Bar */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 text-[13px]">
            <input
              type="text"
              placeholder="Search by title, material, or series..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-[#e0e0e0] px-3 py-1.5 w-full sm:w-80 outline-none focus:border-[#111]"
            />

            <div className="flex items-center gap-3">
              <span className="text-[#888] text-[12px]">Filter:</span>
              {['All', 'Available', 'Sold'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`transition-colors ${
                    statusFilter === st ? 'text-[#111] font-semibold underline' : 'text-[#666] hover:text-[#111]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-24 text-center text-[#888] text-[13px]">
              Loading inventory...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center text-[#888] text-[13px]">
              No artworks found.
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#f0f0f0]">
              <table className="w-full text-left text-[12px] md:text-[13px] border-collapse">
                <thead>
                  <tr className="border-b border-[#111] bg-white text-[#666] text-[11px] uppercase tracking-wider">
                    <th className="p-3 w-16">Preview</th>
                    <th className="p-3">Title & Series</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Material</th>
                    <th className="p-3">Dimensions</th>
                    <th className="p-3">Shots</th>
                    <th className="p-3">Year</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => {
                    const previewImg = item.imageUrl || (item.images && item.images[0]) || ''
                    const shotsCount = item.images ? item.images.length : (item.imageUrl ? 1 : 0)

                    return (
                      <tr key={item.id} className="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors">
                        <td className="p-3">
                          <div className="w-12 h-12 bg-[#f0f0f0] overflow-hidden">
                            <PlaceholderImage
                              src={previewImg}
                              aspectRatio="aspect-[1/1]"
                              label="•"
                              alt={item.title}
                            />
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-[#111]">{item.title}</div>
                          <div className="text-[11px] text-[#888]">{item.series}</div>
                        </td>
                        <td className="p-3 text-[#555]">{item.category}</td>
                        <td className="p-3 text-[#555]">{item.material}</td>
                        <td className="p-3 text-[#555]">{item.dimensions}</td>
                        <td className="p-3 text-[#555]">
                          <span className="text-[11px] bg-[#f0f0f0] px-2 py-0.5">{shotsCount} shot{shotsCount !== 1 ? 's' : ''}</span>
                        </td>
                        <td className="p-3 text-[#555]">{item.year}</td>
                        <td className="p-3">
                          <button
                            onClick={() => toggleStatus(item)}
                            className={`text-[11px] underline ${
                              item.status === 'Available' ? 'text-green-700' : 'text-[#888]'
                            }`}
                          >
                            {item.status}
                          </button>
                        </td>
                        <td className="p-3 text-right space-x-3">
                          <button
                            onClick={() => openEditModal(item)}
                            className="text-[#111] underline hover:opacity-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            className="text-[#b00] underline hover:opacity-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB 2: TAXONOMY MANAGEMENT */}
      {activeTab === 'taxonomy' && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 text-[13px]">
          
          {/* Categories Section */}
          <div className="border border-[#f0f0f0] p-6 space-y-5 bg-white">
            <div className="border-b border-[#111] pb-2 flex justify-between items-baseline">
              <h2 className="text-[16px] font-normal text-[#111]">
                Artwork Categories ({taxonomy.categories.length})
              </h2>
              <span className="text-[11px] text-[#888]">(category tags)</span>
            </div>

            {/* Add Category Form */}
            <form onSubmit={handleAddCategory} className="flex gap-2">
              <input
                type="text"
                placeholder="New category name (e.g. Relief)..."
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                className="flex-1 border border-[#d0d0d0] px-3 py-1.5 outline-none focus:border-[#111]"
              />
              <button
                type="submit"
                disabled={saving}
                className="bg-[#111] text-white px-3 py-1.5 hover:bg-[#333] transition-colors disabled:opacity-50"
              >
                + Add
              </button>
            </form>

            {/* Category List */}
            <div className="divide-y divide-[#f0f0f0]">
              {taxonomy.categories.map((cat) => (
                <div key={cat} className="py-2.5 flex justify-between items-center group">
                  {editingTaxItem?.type === 'category' && editingTaxItem.name === cat ? (
                    <div className="flex gap-2 flex-1 mr-2">
                      <input
                        type="text"
                        value={editTaxValue}
                        onChange={(e) => setEditTaxValue(e.target.value)}
                        className="border border-[#111] px-2 py-0.5 text-[12px] flex-1 outline-none"
                      />
                      <button
                        onClick={() => handleSaveTaxEdit('category')}
                        className="text-[11px] bg-[#111] text-white px-2 py-0.5"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTaxItem(null)}
                        className="text-[11px] text-[#888] px-1"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <> 
                      <span className="text-[#111] font-medium">{cat}</span>
                      <div className="space-x-3 text-[11px]">
                        <button
                          onClick={() => {
                            setEditingTaxItem({ type: 'category', name: cat })
                            setEditTaxValue(cat)
                          }}
                          className="text-[#555] hover:text-[#111] underline"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => handleDeleteTax('category', cat)}
                          className="text-[#b00] hover:opacity-60 underline"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Materials Section */}
          <div className="border border-[#f0f0f0] p-6 space-y-5 bg-white">
            <div className="border-b border-[#111] pb-2 flex justify-between items-baseline">
              <h2 className="text-[16px] font-normal text-[#111]">
                Artwork Materials ({taxonomy.materials.length})
              </h2>
              <span className="text-[11px] text-[#888]">(material filters)</span>
            </div>

            {/* Add Material Form */}
            <form onSubmit={handleAddMaterial} className="flex gap-2">
              <input
                type="text"
                placeholder="New material (e.g. Terracotta)..."
                value={newMaterialInput}
                onChange={(e) => setNewMaterialInput(e.target.value)}
                className="flex-1 border border-[#d0d0d0] px-3 py-1.5 outline-none focus:border-[#111]"
              />
              <button
                type="submit"
                disabled={saving}
                className="bg-[#111] text-white px-3 py-1.5 hover:bg-[#333] transition-colors disabled:opacity-50"
              >
                + Add
              </button>
            </form>

            {/* Material List */}
            <div className="divide-y divide-[#f0f0f0] max-h-[480px] overflow-y-auto pr-1">
              {taxonomy.materials.map((mat) => (
                <div key={mat} className="py-2.5 flex justify-between items-center group">
                  {editingTaxItem?.type === 'material' && editingTaxItem.name === mat ? (
                    <div className="flex gap-2 flex-1 mr-2">
                      <input
                        type="text"
                        value={editTaxValue}
                        onChange={(e) => setEditTaxValue(e.target.value)}
                        className="border border-[#111] px-2 py-0.5 text-[12px] flex-1 outline-none"
                      />
                      <button
                        onClick={() => handleSaveTaxEdit('material')}
                        className="text-[11px] bg-[#111] text-white px-2 py-0.5"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTaxItem(null)}
                        className="text-[11px] text-[#888] px-1"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-[#111] font-medium">{mat}</span>
                      <div className="space-x-3 text-[11px]">
                        <button
                          onClick={() => {
                            setEditingTaxItem({ type: 'material', name: mat })
                            setEditTaxValue(mat)
                          }}
                          className="text-[#555] hover:text-[#111] underline"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => handleDeleteTax('material', mat)}
                          className="text-[#b00] hover:opacity-60 underline"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

        </section>
      )}

      {/* Modal: Create / Edit Artwork */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6 text-[13px] my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-baseline border-b border-[#111] pb-3">
              <h2 className="text-[17px] font-normal text-[#111]">
                {editingItem ? 'Edit Artwork' : 'New Artwork Entry'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-[#888] hover:text-[#111]">
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-[#888] block uppercase">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-[#d0d0d0] p-2 outline-none focus:border-[#111]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#888] block uppercase">Series</label>
                  <input
                    type="text"
                    value={formData.series}
                    onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                    className="w-full border border-[#d0d0d0] p-2 outline-none focus:border-[#111]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#888] block uppercase">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-[#d0d0d0] p-2 outline-none focus:border-[#111]"
                  >
                    {taxonomy.categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#888] block uppercase">Dimensions</label>
                  <input
                    type="text"
                    required
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="w-full border border-[#d0d0d0] p-2 outline-none focus:border-[#111]"
                  />
                </div>

                {/* Materials Multi-Picker rendered from dynamic taxonomy */}
                <div className="space-y-2 md:col-span-2 border border-[#f0f0f0] p-3 bg-[#fafafa]">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[11px] text-[#888] block uppercase">
                      Select Materials (Click to toggle multiple)
                    </label>
                    <span className="text-[11px] text-[#666]">
                      Selected: <strong className="text-[#111]">{formData.selectedMaterials.join(', ') || 'None'}</strong>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {taxonomy.materials.map((mat) => {
                      const isSelected = formData.selectedMaterials.includes(mat)
                      return (
                        <button
                          type="button"
                          key={mat}
                          onClick={() => toggleMaterial(mat)}
                          className={`text-[12px] px-2.5 py-1 border transition-colors ${
                            isSelected
                              ? 'bg-[#111] text-white border-[#111]'
                              : 'bg-white text-[#555] border-[#d0d0d0] hover:border-[#111]'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{mat}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#888] block uppercase">Year</label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full border border-[#d0d0d0] p-2 outline-none focus:border-[#111]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#888] block uppercase">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full border border-[#d0d0d0] p-2 outline-none focus:border-[#111]"
                  >
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] text-[#888] block uppercase">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full border border-[#d0d0d0] p-2 outline-none focus:border-[#111]"
                  />
                </div>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div className="space-y-3 pt-3 border-t border-[#f0f0f0]">
                <label className="text-[11px] text-[#888] block uppercase">
                  Artwork Images & Perspectives (Drag & Drop or Browse)
                </label>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#ccc] hover:border-[#111] bg-[#fafafa] p-6 text-center cursor-pointer transition-colors space-y-2"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                  />
                  <div className="text-[13px] text-[#333]">
                    {uploading ? 'Uploading images...' : 'Drag & drop image files here, or click to browse'}
                  </div>
                  <p className="text-[11px] text-[#888]">
                    Supports JPG, PNG, WEBP, GIF (Max 10MB per file). You can upload multiple angle shots together.
                  </p>
                </div>

                {/* Uploaded Images Preview Strip */}
                {formData.imagesList.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[11px] text-[#888]">
                      Uploaded Shots ({formData.imagesList.length}):
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {formData.imagesList.map((imgUrl, i) => (
                        <div key={i} className="relative group border border-[#e0e0e0] bg-[#f4f4f4]">
                          <img
                            src={imgUrl}
                            alt={`Preview ${i + 1}`}
                            className="w-full aspect-square object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeImage(i)
                            }}
                            className="absolute top-1 right-1 bg-black/70 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove"
                          >
                            ✕
                          </button>
                          <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] text-center py-0.5 truncate">
                            {i === 0 ? 'Cover' : `Shot ${i + 1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#f0f0f0]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#d0d0d0] hover:border-[#111]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || saving}
                  className="px-4 py-2 bg-[#111] text-white hover:bg-[#333] disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                  <span>{editingItem ? 'Save Changes' : 'Create Artwork'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
