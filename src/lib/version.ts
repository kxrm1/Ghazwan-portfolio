/**
 * Global in-memory version counter for data mutations.
 * Every time artworks or taxonomy data changes, the version increments.
 * SSE clients poll this to know when to re-fetch.
 * 
 * In a multi-process deployment, this would need to be backed by Redis or a file.
 * For single-process Next.js dev/production, in-memory is sufficient.
 */

let dataVersion = 1
let lastUpdated = Date.now()

// Registered SSE listeners
type Listener = (version: number) => void
const listeners = new Set<Listener>()

export function getVersion(): number {
  return dataVersion
}

export function getLastUpdated(): number {
  return lastUpdated
}

export function incrementVersion(): number {
  dataVersion++
  lastUpdated = Date.now()
  // Notify all connected SSE clients
  listeners.forEach(fn => fn(dataVersion))
  return dataVersion
}

export function addListener(fn: Listener): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}
