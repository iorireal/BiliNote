import { useEffect, useRef, useState } from 'react'
import request from '@/utils/request'

const MAX_RETRIES = 3
const RETRY_INTERVAL = 10000 // 10秒

export const useCheckBackend = () => {
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    let retries = 0
    let timerId: ReturnType<typeof setTimeout> | null = null

    const safeSetInitialized = (v: boolean) => { if (mountedRef.current) setInitialized(v) }
    const safeSetLoading = (v: boolean) => { if (mountedRef.current) setLoading(v) }

    const check = async () => {
      try {
        await request.get('/sys_check')
        safeSetInitialized(true)
        safeSetLoading(false)
      } catch {
        if (retries === 0) {
          safeSetLoading(true)
        }

        if (retries < MAX_RETRIES) {
          retries++
          timerId = setTimeout(check, RETRY_INTERVAL)
        } else {
          waitUntilBackendReady()
        }
      }
    }

    const waitUntilBackendReady = async () => {
      while (mountedRef.current) {
        try {
          await request.get('/sys_health')
          safeSetInitialized(true)
          safeSetLoading(false)
          return
        } catch {
          await new Promise(res => setTimeout(res, RETRY_INTERVAL))
        }
      }
    }

    check()

    return () => {
      mountedRef.current = false
      if (timerId !== null) clearTimeout(timerId)
    }
  }, [])

  return { loading, initialized }
}