import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import Icon from './Icon'
import Button from './ui/button'
import { Skeleton } from './ui/skeleton'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl

// Renders a PDF entirely as <canvas> pixels — no iframe, no native browser
// PDF plugin, and therefore no built-in download/print/"open in new tab"
// controls anywhere, since we own 100% of the UI ourselves.
export default function PdfCanvasViewer({ url, className = '' }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const pdfRef = useRef(null)
  const renderTaskRef = useRef(null)

  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [errorMessage, setErrorMessage] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setPageNumber(1)

    const loadingTask = pdfjsLib.getDocument({ url })
    loadingTask.promise
      .then((pdf) => {
        if (cancelled) return
        pdfRef.current = pdf
        setNumPages(pdf.numPages)
        setStatus('ready')
      })
      .catch((error) => {
        console.error('PdfCanvasViewer: failed to load document', url, error)
        if (!cancelled) {
          setStatus('error')
          setErrorMessage(error?.message || String(error))
        }
      })

    return () => {
      cancelled = true
      loadingTask.destroy()
    }
  }, [url, retryCount])

  useEffect(() => {
    if (status !== 'ready' || !pdfRef.current) return
    let cancelled = false

    pdfRef.current.getPage(pageNumber).then((page) => {
      if (cancelled) return

      const unscaledWidth = page.getViewport({ scale: 1 }).width
      const containerWidth = containerRef.current?.clientWidth || unscaledWidth
      const fitScale = Math.min(containerWidth / unscaledWidth, 2)
      const viewport = page.getViewport({ scale: fitScale })

      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      canvas.width = viewport.width
      canvas.height = viewport.height

      renderTaskRef.current?.cancel()
      const task = page.render({ canvasContext: context, viewport })
      renderTaskRef.current = task
      task.promise.catch(() => {})
    })

    return () => {
      cancelled = true
    }
  }, [status, pageNumber])

  if (status === 'error') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-slate-500">Couldn't load this document.</p>
        {errorMessage && <p className="max-w-md text-xs text-slate-400">{errorMessage}</p>}
        <Button variant="outline" size="sm" onClick={() => setRetryCount((c) => c + 1)}>
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div className={`flex flex-1 flex-col ${className}`}>
      <div ref={containerRef} className="flex flex-1 justify-center overflow-auto bg-slate-100 p-4">
        {status === 'loading' ? (
          <Skeleton className="h-[70vh] w-full max-w-2xl rounded-md" />
        ) : (
          <canvas
            ref={canvasRef}
            className="h-fit rounded-md bg-white shadow-card"
            onContextMenu={(e) => e.preventDefault()}
          />
        )}
      </div>

      {status === 'ready' && numPages > 1 && (
        <div className="flex items-center justify-center gap-3 border-t border-slate-200 bg-white px-4 py-2.5">
          <Button
            variant="outline"
            size="icon"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((p) => p - 1)}
            aria-label="Previous page"
          >
            <Icon name="chevron-back" size={16} />
          </Button>
          <span className="min-w-[6rem] text-center text-sm font-medium text-slate-600">
            Page {pageNumber} of {numPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber((p) => p + 1)}
            aria-label="Next page"
          >
            <Icon name="chevron-forward" size={16} />
          </Button>
        </div>
      )}
    </div>
  )
}
