import { useEffect, useRef } from 'react';

export function useCamera(
  videoRef: React.RefObject<HTMLVideoElement> ,
  onError: () => void
) {
  const streamRef = useRef<MediaStream | null>(null);

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
      } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        onError(); // cerrar o mostrar error
      }
    })();

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [videoRef, onError]);

  return {
    getStream: () => streamRef.current
  };
}
