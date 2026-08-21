import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { authenticateRequest, unauthorizedResponse } from '@/lib/auth'
import { incrementVersion } from '@/lib/version'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const filePath = path.join(process.cwd(), 'src/data/taxonomy.json')
const pubPath = path.join(process.cwd(), 'public/api/taxonomy.json')

const DEFAULT_TAXONOMY = {
  categories: ['Sculpture', 'Painting', 'Jewelry', 'Monument'],
  materials: [
    'Bronze',
    'Marble',
    'Wood',
    'Stone & Basalt',
    'Clay & Terracotta',
    'Silver',
    'Gold',
    'Mixed Media',
    'Oil & Charcoal',
    'Ceramics',
    'Glass',
    'Steel & Iron'
  ]
}

function getTaxonomy() {
  try {
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      return {
        categories: Array.isArray(data.categories) ? data.categories : DEFAULT_TAXONOMY.categories,
        materials: Array.isArray(data.materials) ? data.materials : DEFAULT_TAXONOMY.materials
      }
    }
  } catch (err) {
    console.error('Error reading taxonomy:', err)
  }
  return DEFAULT_TAXONOMY
}

function saveTaxonomy(data: any) {
  try {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

    const pubDir = path.dirname(pubPath)
    if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true })
    fs.writeFileSync(pubPath, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('Error saving taxonomy:', err)
    throw new Error('Failed to persist taxonomy')
  }
}

export async function GET() {
  return NextResponse.json(getTaxonomy())
}

export async function POST(req: Request) {
  const auth = authenticateRequest(req)
  if (!auth) {
    return unauthorizedResponse()
  }

  try {
    const input = await req.json()
    const { type, name } = input
    const cleanName = typeof name === 'string' ? name.trim() : ''

    if (!cleanName) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const tax = getTaxonomy()
    const key = type === 'category' ? 'categories' : 'materials'

    if (!tax[key].includes(cleanName)) {
      tax[key].push(cleanName)
      saveTaxonomy(tax)
      incrementVersion()
    }

    return NextResponse.json({ success: true, taxonomy: tax })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to add taxonomy item' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const auth = authenticateRequest(req)
  if (!auth) {
    return unauthorizedResponse()
  }

  try {
    const input = await req.json()
    const { type, oldName, newName } = input
    const cleanOld = typeof oldName === 'string' ? oldName.trim() : ''
    const cleanNew = typeof newName === 'string' ? newName.trim() : ''

    if (!cleanOld || !cleanNew) {
      return NextResponse.json({ error: 'Missing old or new name' }, { status: 400 })
    }

    const tax = getTaxonomy()
    const key = type === 'category' ? 'categories' : 'materials'
    const idx = tax[key].indexOf(cleanOld)

    if (idx !== -1) {
      tax[key][idx] = cleanNew
      saveTaxonomy(tax)
      incrementVersion()
      return NextResponse.json({ success: true, taxonomy: tax })
    }

    return NextResponse.json({ error: 'Item not found' }, { status: 404 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update taxonomy item' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const auth = authenticateRequest(req)
  if (!auth) {
    return unauthorizedResponse()
  }

  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'material'
    const name = searchParams.get('name')?.trim()

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const tax = getTaxonomy()
    const key = type === 'category' ? 'categories' : 'materials'
    const initialLen = tax[key].length
    tax[key] = tax[key].filter((item: string) => item !== name)

    if (tax[key].length === initialLen) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    saveTaxonomy(tax)
    incrementVersion()

    return NextResponse.json({ success: true, taxonomy: tax })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete taxonomy item' }, { status: 500 })
  }
}
