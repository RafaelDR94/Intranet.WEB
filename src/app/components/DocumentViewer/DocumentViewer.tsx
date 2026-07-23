import React, { useCallback, useState } from 'react'
import { saveAs } from 'file-saver'
import CancelIcon from '@/assets/icons/acciones/cancel.svg'
import DownloadIcon from '@/assets/icons/acciones/download.svg'
import { useIsMobile } from '../DataTable/components/DataTableLayout/hooks/useMediaQuery'

interface DocumentViewerProps {
  fileUrl: string
  title?: string
  onClose: () => void
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  fileUrl,
  title,
  onClose
}) => {
  const isMobile = useIsMobile()
  const [downloading, setDownloading] = useState(false)
  const downloadName = title?.trim()
    ? `${title.trim().replace(/[\\/:*?"<>|]/g, '-')}.pdf`
    : undefined

  const handleDownload = useCallback(async () => {
    setDownloading(true)
    try {
      // Firebase URLs are cross-origin, so the HTML `download` attribute is
      // ignored by some browsers. Saving the fetched Blob forces a download
      // and lets us consistently apply the requested filename.
      const response = await fetch(fileUrl)
      if (!response.ok) {
        throw new Error(
          `No se pudo descargar el documento (${response.status}).`
        )
      }
      const blob = await response.blob()
      saveAs(blob, downloadName || 'documento.pdf')
    } finally {
      setDownloading(false)
    }
  }, [downloadName, fileUrl])

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center bg-[rgba(0,42,65,0.70)] backdrop-blur-[2px]">
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between pl-4">
          <h2 className="text-s1 text-white">
            {title || 'Vista previa del documento'}
          </h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void handleDownload()}
              disabled={downloading}
              className="text-gray-300 transition hover:text-white"
              title={downloading ? 'Descargando...' : 'Descargar'}
            >
              <DownloadIcon />
            </button>
            <button
              onClick={onClose}
              className="text-xl text-gray-300 transition hover:text-white"
            >
              <CancelIcon />
            </button>
          </div>
        </div>

        {/* Document preview */}
        <div className="flex items-center justify-center p-4">
          <iframe
            src={fileUrl}
            className={
              isMobile
                ? 'h-[70vh] w-[90vw] rounded-lg'
                : 'h-[80vh] w-[80vw] rounded-lg'
            }
            title={title}
          />
        </div>
      </div>
    </div>
  )
}

export default DocumentViewer
