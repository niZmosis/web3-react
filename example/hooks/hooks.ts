import { useCallback, useEffect, useRef, useState } from 'react'

export const useTimeout = ({
  callback,
  startOnMount = false,
  timeout = 1_000
}: {
  callback?: () => void
  startOnMount: boolean
  timeout: number
}) => {
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout>>(null)
  const [isTimedOut, setIsTimedOut] = useState(false)

  const onFinished = useCallback(() => {
    setIsTimedOut(false)
    callback?.()
  }, [callback])

  const cancel = useCallback(() => {
    const timeoutId = timeoutIdRef.current
    if (timeoutId !== null) {
      timeoutIdRef.current = null
      setIsTimedOut(false)
      clearTimeout(timeoutId)
    }
  }, [])

  const start = useCallback(() => {
    cancel() // Clear any existing timeout before starting a new one
    timeoutIdRef.current = setTimeout(onFinished, timeout)
    setIsTimedOut(true)
  }, [onFinished, timeout, cancel])

  const reset = useCallback(() => {
    cancel()
    start()
  }, [cancel, start])

  useEffect(() => {
    if (startOnMount) start()
    return cancel
  }, [callback, timeout, cancel, startOnMount, start])

  return { start, cancel, reset, isTimedOut }
}
