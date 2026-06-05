"use client";

import { useState } from "react";
import axios from "axios";
import { Save, UserPlus, Trophy, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminDashboard() {
  const [name, setName] = useState("");
  const [score, setScore] = useState<number | "">("");
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: null, message: "" });

    try {
      // Ajusta esta ruta si tu endpoint POST en Laravel es diferente
      await axios.post("http://127.0.0.1:8000/api/participant", {
        name: name,
        total_score: Number(score)
      });

      setStatus({ type: "success", message: `¡Participante ${name} guardado con éxito!` });
      setName("");
      setScore("");
    } catch (error: any) {
      setStatus({ 
        type: "error", 
        message: error.response?.data?.message || "Error al guardar en la base de datos." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Encabezado del Panel */}
        <div className="bg-green-900 rounded-3xl p-8 mb-8 text-white shadow-xl flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
              <UserPlus className="w-8 h-8 text-yellow-400" />
              Panel de Control
            </h1>
            <p className="text-green-200 mt-2">Administración de Quiniela 2026</p>
          </div>
          <Trophy className="w-16 h-16 text-green-700 opacity-50" />
        </div>

        {/* Formulario de Captura */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Registrar / Actualizar Participante</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Campo Nombre */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Nombre del Jugador</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. JOK, Beto, Alex..."
                  // --- CORRECCIÓN DE COLOR ---
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all outline-none"
                  // -----------------------------
                  required
                />
              </div>

              {/* Campo Puntos */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Puntaje Total</label>
                <input
                  type="number"
                  value={score}
                  onChange={(e) => setScore(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="0"
                  // --- CORRECCIÓN DE COLOR ---
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all outline-none"
                  // -----------------------------
                  required
                />
              </div>
            </div>

            {/* Alertas de Éxito / Error */}
            {status.type === "success" && (
              <div className="bg-green-50 text-green-800 p-4 rounded-xl flex items-center gap-3 border border-green-200">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">{status.message}</span>
              </div>
            )}
            
            {status.type === "error" && (
              <div className="bg-red-50 text-red-800 p-4 rounded-xl flex items-center gap-3 border border-red-200">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">{status.message}</span>
              </div>
            )}

            {/* Botón de Envío */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-green-800 hover:bg-green-900 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                {isLoading ? "Guardando..." : "Guardar Participante"}
                {!isLoading && <Save className="w-5 h-5" />}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}