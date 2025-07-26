import { useState, useRef, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";

// ... Tipos igual que antes ...

type FormData = {
  fecha: string;
  contrato: string;
  zonaTrabajo: string;
  supervisor: string;
  prevencionista: string;
  vehiculos: string;
  personal: string;
  itoMetro: string;
  acuerdos: string;
  horaIngreso: string;
  horaSalida: string;
};

type SAF = {
  titulo: string;
  detalle: string;
};

type Trabajo = {
  estacion: string;
  saf: SAF[];
  observaciones: string;
  fotoUrl?: string;
};

export default function App() {
  const [formData, setFormData] = useState<FormData>({
    fecha: "",
    contrato: "",
    zonaTrabajo: "",
    supervisor: "",
    prevencionista: "",
    vehiculos: "",
    personal: "",
    itoMetro: "",
    acuerdos: "",
    horaIngreso: "",
    horaSalida: "",
  });

  const [trabajos, setTrabajos] = useState<Trabajo[]>([
    {
      estacion: "",
      saf: [{ titulo: "", detalle: "" }],
      observaciones: "",
    },
  ]);

  const [activeCameraIndex, setActiveCameraIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTrabajoChange = (
    index: number,
    field: keyof Trabajo,
    value: string
  ) => {
    const updated = trabajos.map((trabajo, i) =>
      i === index ? { ...trabajo, [field]: value } : trabajo
    );
    setTrabajos(updated);
  };

  const handleSafChange = (
    trabajoIndex: number,
    safIndex: number,
    field: keyof SAF,
    value: string
  ) => {
    const updated = [...trabajos];
    updated[trabajoIndex] = {
      ...updated[trabajoIndex],
      saf: updated[trabajoIndex].saf.map((s, i) =>
        i === safIndex ? { ...s, [field]: value } : s
      ),
    };
    setTrabajos(updated);
  };

  const addSaf = (trabajoIndex: number) => {
    const updated = [...trabajos];
    updated[trabajoIndex].saf.push({ titulo: "", detalle: "" });
    setTrabajos(updated);
  };

  const addTrabajo = () => {
    setTrabajos([
      ...trabajos,
      {
        estacion: "",
        saf: [{ titulo: "", detalle: "" }],
        observaciones: "",
      },
    ]);
  };

  const openCamera = async (index: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      setActiveCameraIndex(index);
    } catch (err) {
      alert("No se pudo acceder a la cámara");
      console.error(err);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/png");

    const updated = [...trabajos];
    if (activeCameraIndex !== null) {
      updated[activeCameraIndex].fotoUrl = imageData;
    }
    setTrabajos(updated);
    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setActiveCameraIndex(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Datos enviados:", { ...formData, trabajos });
  };
  useEffect(() => {
  if (activeCameraIndex !== null && videoRef.current && streamRef.current) {
    videoRef.current.srcObject = streamRef.current;
    videoRef.current.play().catch((err) => {
      console.error("Error al reproducir el video:", err);
    });
  }
}, [activeCameraIndex]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Reporte Diario Sometec</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <label
                className="text-sm font-semibold capitalize"
                htmlFor={key}
              >
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                name={key}
                id={key}
                type={
                  key.includes("hora")
                    ? "time"
                    : key === "fecha"
                    ? "date"
                    : "text"
                }
                value={value}
                onChange={handleFormChange}
                className="p-2 mt-1 border border-gray-300 rounded-lg"
              />
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold">Trabajos Realizados</h3>

          {trabajos.map((trabajo, tIndex) => (
            <div
              key={tIndex}
              className="border p-4 rounded-lg space-y-4 bg-gray-50"
            >
              <div>
                <label className="font-semibold">Estación</label>
                <input
                  type="text"
                  value={trabajo.estacion}
                  onChange={(e) =>
                    handleTrabajoChange(tIndex, "estacion", e.target.value)
                  }
                  className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                />
              </div>

              {trabajo.saf.map((saf, sIndex) => (
                <div key={sIndex} className="space-y-2">
                  <input
                    type="text"
                    placeholder="Título SAF"
                    value={saf.titulo}
                    onChange={(e) =>
                      handleSafChange(tIndex, sIndex, "titulo", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  <textarea
                    placeholder="Detalle"
                    value={saf.detalle}
                    onChange={(e) =>
                      handleSafChange(tIndex, sIndex, "detalle", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addSaf(tIndex)}
                className="text-sm text-blue-600"
              >
                + Agregar SAF
              </button>

              <div className="space-y-2">
                <label className="font-semibold">Observaciones</label>
                <textarea
                  value={trabajo.observaciones}
                  onChange={(e) =>
                    handleTrabajoChange(
                      tIndex,
                      "observaciones",
                      e.target.value
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />

                <button
                  type="button"
                  onClick={() => openCamera(tIndex)}
                  className="mt-2 text-sm text-blue-600 underline"
                >
                  📷 Tomar Foto
                </button>

                {activeCameraIndex === tIndex && (
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
                      onClick={capturePhoto}
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white border px-4 py-1 text-sm rounded-full shadow"
                    >
                      📸 Capturar
                    </button>
                  </div>
                )}

                {trabajo.fotoUrl && (
                  <img
                    src={trabajo.fotoUrl}
                    alt="Foto observación"
                    className="mt-2 rounded-lg border max-w-xs"
                  />
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addTrabajo}
            className="text-blue-600 text-sm"
          >
            + Agregar Estación
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl font-semibold"
        >
          Enviar Reporte
        </button>
      </form>
    </div>
  );
}