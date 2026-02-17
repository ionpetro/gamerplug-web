'use client'

import { useEffect, useMemo, useState } from 'react'

type ResourceItem = {
  name: string
  type: string
  duration: number
  transferSize: number
}

type LongTaskItem = {
  duration: number
  startTime: number
}

const MAX_ITEMS = 60

function isEnabledFromUrl(): boolean | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  if (params.get('perf') === '1') return true
  if (params.get('perf') === '0') return false
  return null
}

function shortName(url: string) {
  try {
    const { pathname } = new URL(url, window.location.origin)
    return pathname
  } catch {
    return url
  }
}

function pushLimited<T>(current: T[], next: T): T[] {
  const copy = [next, ...current]
  return copy.slice(0, MAX_ITEMS)
}

export function PerformanceDebugPanel() {
  const [enabled, setEnabled] = useState(false)
  const [open, setOpen] = useState(false)
  const [resources, setResources] = useState<ResourceItem[]>([])
  const [longTasks, setLongTasks] = useState<LongTaskItem[]>([])

  useEffect(() => {
    const fromUrl = isEnabledFromUrl()
    if (fromUrl === true) {
      localStorage.setItem('gp_perf_debug', '1')
      setEnabled(true)
      setOpen(true)
      return
    }
    if (fromUrl === false) {
      localStorage.removeItem('gp_perf_debug')
      setEnabled(false)
      setOpen(false)
      return
    }
    setEnabled(localStorage.getItem('gp_perf_debug') === '1')
  }, [])

  useEffect(() => {
    if (!enabled) return

    const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    setResources(
      resourceEntries
        .map((entry) => ({
          name: shortName(entry.name),
          type: entry.initiatorType || 'other',
          duration: Math.round(entry.duration),
          transferSize: entry.transferSize || 0,
        }))
        .sort((a, b) => b.duration - a.duration)
        .slice(0, MAX_ITEMS)
    )

    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as PerformanceResourceTiming[]) {
        setResources((current) =>
          pushLimited(current, {
            name: shortName(entry.name),
            type: entry.initiatorType || 'other',
            duration: Math.round(entry.duration),
            transferSize: entry.transferSize || 0,
          })
        )
      }
    })
    resourceObserver.observe({ type: 'resource', buffered: true })

    let longTaskObserver: PerformanceObserver | null = null
    if (PerformanceObserver.supportedEntryTypes?.includes('longtask')) {
      longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          setLongTasks((current) =>
            pushLimited(current, {
              duration: Math.round(entry.duration),
              startTime: Math.round(entry.startTime),
            })
          )
        }
      })
      longTaskObserver.observe({ type: 'longtask', buffered: true })
    }

    return () => {
      resourceObserver.disconnect()
      longTaskObserver?.disconnect()
    }
  }, [enabled])

  const slowResources = useMemo(
    () => resources.filter((item) => item.duration >= 100).sort((a, b) => b.duration - a.duration).slice(0, 20),
    [resources]
  )
  const worstLongTask = longTasks.reduce((max, item) => Math.max(max, item.duration), 0)

  if (!enabled) return null

  return (
    <div className="fixed bottom-3 right-3 z-[100]">
      <button
        type="button"
        className="rounded-md border border-red-500/50 bg-black/80 px-3 py-2 text-xs font-semibold text-red-300"
        onClick={() => setOpen((v) => !v)}
      >
        Perf {open ? 'Hide' : 'Show'}
      </button>
      {open && (
        <div className="mt-2 max-h-[70vh] w-[min(94vw,420px)] overflow-auto rounded-md border border-white/15 bg-black/90 p-3 text-xs text-white">
          <div className="mb-2 font-semibold">Mobile Perf Debug</div>
          <div className="mb-2 text-white/70">
            Add `?perf=0` to disable.
          </div>
          <div className="mb-3 space-y-1">
            <div>Total resources: {resources.length}</div>
            <div>Slow resources (100ms+): {slowResources.length}</div>
            <div>Longest main-thread task: {worstLongTask}ms</div>
          </div>
          <div className="mb-2 font-semibold">Top Slow Resources</div>
          <div className="space-y-2">
            {slowResources.length === 0 && <div className="text-white/60">No slow resources yet.</div>}
            {slowResources.map((item, idx) => (
              <div key={`${item.name}-${idx}`} className="rounded border border-white/10 bg-white/5 p-2">
                <div className="truncate">{item.name}</div>
                <div className="mt-1 text-white/70">
                  {item.type} | {item.duration}ms | {Math.round(item.transferSize / 1024)}KB
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
