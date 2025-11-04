import React from "react";
import CancelIcon from "@/assets/icons/acciones/cancel.svg";
import DownloadIcon from "@/assets/icons/acciones/download.svg";
interface DocumentViewerProps {
  fileUrl: string;
  title?: string;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ fileUrl, title, onClose }) => {

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center backdrop-blur-[2px] bg-[rgba(0,42,65,0.70)]">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center pl-4">
          <h2 className="text-white text-s1">
            {title || "Vista previa del documento"}
          </h2>
          <div className="flex gap-3 items-center">
            <a
              href={fileUrl}
              download
              className="text-gray-300 hover:text-white transition"
              title="Descargar"
            >
            <DownloadIcon />
            </a>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition text-xl"
            >
              <CancelIcon />
            </button>
          </div>
        </div>        

        {/* Document preview */}
        <div className="p-4 flex justify-center">
          <iframe
            src={fileUrl}
            className="w-[600px] h-[80vh] rounded-lg"
            title={title}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
