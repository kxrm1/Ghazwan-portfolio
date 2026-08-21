import { useEffect, useRef, useState, useCallback } from 'react'

interface LiveSyncOptions {
  onUpdate: () => void
  enabled?: boolean
}

/**
 * Hook for instant live synchronization across clients.
 * Combines Server-Sent Events (SSE) with BroadcastChannel, Window events, and visibility polling.
 */
export function useLiveSync({ onUpdate, enabled = true }: LiveSyncOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const lastVersionRef = useRef<number>(0)
  const onUpdateRef = useRef(onUpdate)
  onUpdateRef.current = onUpdate

  const triggerUpdate = useCallback(() => {
    onUpdateRef.current()
  }, [])

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    let eventSource: EventSource | null = null
    let reconnectTimeout: NodeJS.Timeout | null = null
    let isCleanedUp = false
    let retryDelay = 1000

    function connectSSE() {
      if (isCleanedUp) return

      try {
        eventSource = new EventSource('/api/events')

        eventSource.onopen = () => {
          setIsConnected(true)
          retryDelay = 1000 // Reset retry delay on successful connection
        }

        eventSource.addEventListener('connected', (e: MessageEvent) => {
          try {
            const data = JSON.parse(e.data)
            if (data?.version) {
              lastVersionRef.current = data.version
            }
          } catch {}
        })

        eventSource.addEventListener('data_changed', (e: MessageEvent) => {
          try {
            const data = JSON.parse(e.data)
            if (data?.version && data.version !== lastVersionRef.current) {
              lastVersionRef.current = data.version
              triggerUpdate()
            } else if (!data?.version) {
              triggerUpdate()
            }
          } catch {
            triggerUpdate()
          }
        })

        eventSource.onerror = () => {
          setIsConnected(false)
          if (eventSource) {
            eventSource.close()
            eventSource = null
          }

          if (!isCleanedUp) {
            // Exponential backoff reconnect: 1s, 2s, 4s, 8s, max 15s
            reconnectTimeout = setTimeout(() => {
              retryDelay = Math.min(retryDelay * 1.5, 15000)
              connectSSE()
            }, retryDelay)
          }
        }
      } catch (err) {
        setIsConnected(false)
        reconnectTimeout = setTimeout(connectSSE, 5000)
      }
    }

    connectSSE()

    // 1. Same-browser BroadcastChannel for zero-latency local tab sync
    let channel: BroadcastChannel | null = null
    try {
      channel = new BroadcastChannel('ghazwan_artworks_channel')
      channel.onmessage = (event) => {
        if (event.data?.type === 'ARTWORKS_MUTATED') {
          triggerUpdate()
        }
      }
    } catch {}

    // 2. Custom window event for instant local component sync
    const handleLocalEvent = () => triggerUpdate()
    window.addEventListener('artworks_updated', handleLocalEvent)

    // 3. Fallback check when tab gains focus or becomes visible
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        try {
          const res = await fetch(`/api/events?poll=1&version=${lastVersionRef.current}`)
          if (res.ok) {
            const data = await res.json()
            if (data.changed) {
              lastVersionRef.current = data.version
              triggerUpdate()
            }
          }
        } catch {}
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleVisibilityChange)

    // 4. Background heartbeat poll check every 30s as secondary safety net
    const interval = setInterval(async () => {
      if (document.visibilityState === 'visible') {
        try {
          const res = await fetch(`/api/events?poll=1&version=${lastVersionRef.current}`)
          if (res.ok) {
            const data = await res.json()
            if (data.changed) {
              lastVersionRef.current = data.version
              triggerUpdate()
            }
          }
        } catch {}
      }
    }, 30000)

    return () => {
      isCleanedUp = true
      if (eventSource) {
        eventSource.close()
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
      if (channel) {
        channel.close()
      }
      window.removeEventListener('artworks_updated', handleLocalEvent)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleVisibilityChange)
      clearInterval(interval)
    }
  }, [enabled, triggerUpdate])

  return { isConnected }
}
