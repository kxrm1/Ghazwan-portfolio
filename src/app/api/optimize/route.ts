import { authenticateRequest, unauthorizedResponse } from '@/lib/auth'
import { incrementVersion } from '@/lib/version'
import { optimizeUploadsDir } from '@/lib/image-optimizer'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: Request) {
  const auth = authenticateRequest(req)
  if (!auth) {
    return unauthorizedResponse()
  }

  try {
    const url = new URL(req.url)
    const apply = url.searchParams.get('apply') === 'true' || url.searchParams.get('apply') === '1'

    const result = await optimizeUploadsDir({ apply })

    if (apply && result.processed > 0) {
      incrementVersion()
    }

    return Response.json({
      success: true,
      message: apply
        ? 'Optimization applied. Originals backed up in /uploads/_originals.'
        : 'Dry run complete — no files modified. Add ?apply=1 to write changes.',
      ...result
    })
  } catch (err: any) {
    return Response.json(
      { success: false, error: err?.message || 'Optimization failed' },
      { status: 500 }
    )
  }
}
