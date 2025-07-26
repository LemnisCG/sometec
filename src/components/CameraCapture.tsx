import { useEffect, useRef } from 'react';

interface Props {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Solicita la cámara apenas se monta el componente
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

    // Limpieza
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [onClose]);

  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);
    onClose();
  };

  return (
    <div className="mt-2 relative w-full max-w-xs">
      <video
        ref={videoRef}
        className="w-full rounded-lg border"
        autoPlay
        playsInline
        muted
      />
      <button
        type="button"
        onClick={handleCapture}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white border px-4 py-1 text-sm rounded-full shadow"
      >
        📸 Capturar
      </button>
    </div>
  );
}
