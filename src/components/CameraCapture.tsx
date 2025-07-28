import { useRef, useState } from 'react';
import type { DocumentacionCamara } from '../types/reporte.types';
import { useCamera } from '../hooks/useCamera';

interface Props {
  onCapture: (doc: DocumentacionCamara) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const [descripcion, setDescripcion] = useState('');

  // 👇 Aquí usamos el hook
  useCamera(videoRef, onClose);

  const manejarCaptura = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');

    onCapture({ fotoUrl: dataUrl, descripcion });
    onClose();
  };

  return (
    <div className="mt-2 relative w-full max-w-xs space-y-2">
      <video
        ref={videoRef}
        className="w-full rounded-lg border"
        autoPlay
        playsInline
        muted
      />
      <textarea
        placeholder="Descripción de la imagen"
        value={descripcion}
        onChange={e => setDescripcion(e.target.value)}
        className="w-full p-2 border rounded-lg"
      />
      <button
        type="button"
        onClick={manejarCaptura}
        className="w-full bg-white border px-4 py-1 text-sm rounded-lg shadow"
      >
        📸 Capturar
      </button>
    </div>
  );
}
