import { useEffect, useRef, useState } from 'react';
import type { DocumentacionCamara } from '../types/reporte.types';

interface Props {
  onCapture: (doc: DocumentacionCamara) => void; // devuelve foto+descripción
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        alert('No se pudo acceder a la cámara');
        console.error(err);
        onClose();
      }
    })();
    return () => streamRef.current?.getTracks().forEach(t => t.stop());
  }, [onClose]);

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
      <input
        type="text"
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
