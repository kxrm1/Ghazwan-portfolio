import { getVersion, getLastUpdated, addListener } from '@/lib/version'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const isPoll = searchParams.get('poll') === '1'
  const clientVersion = parseInt(searchParams.get('version') || '0', 10)

  // Short-polling fallback mode for environments where SSE might be blocked
  if (isPoll) {
    const currentVersion = getVersion()
    return Response.json({
      changed: clientVersion < currentVersion,
      version: currentVersion,
      lastUpdated: getLastUpdated()
    })
  }

  // Server-Sent Events (SSE) Stream
  const responseStream = new TransformStream()
  const writer = responseStream.writable.getWriter()
  const encoder = new TextEncoder()

  // Helper to send SSE event
  const sendEvent = async (event: string, data: any) => {
    try {
      const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
      await writer.write(encoder.encode(message))
    } catch {
      // Client disconnected
    }
  }

  // Helper to send heartbeat comment to keep connection alive
  const sendHeartbeat = async () => {
    try {
      await writer.write(encoder.encode(': heartbeat\n\n'))
    } catch {
      // Client disconnected
    }
  }

  // Send initial connection payload
  sendEvent('connected', {
    version: getVersion(),
    lastUpdated: getLastUpdated(),
    timestamp: Date.now()
  })

  // Listen for data version increments (artworks or taxonomy changes)
  const unsubscribe = addListener((newVersion) => {
    sendEvent('data_changed', {
      version: newVersion,
      timestamp: Date.now()
    })
  })

  // Heartbeat interval (every 15 seconds)
  const heartbeatInterval = setInterval(() => {
    sendHeartbeat()
  }, 15000)

  // Cleanup on client disconnect
  req.signal.addEventListener('abort', () => {
    unsubscribe()
    clearInterval(heartbeatInterval)
    try {
      writer.close()
    } catch {}
  })

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform, must-revalidate',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no' // Prevent Nginx reverse proxy buffering
    }
  })
}
