"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ name: string; total_score: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Petición al endpoint público de Laravel
      const response = await axios.get(`http://127.0.0.1:8000/api/participant/${query}`);

      if (response.data.success) {
        setResult(response.data.data);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Participante no encontrado en la quiniela.");
      } else {
        setError("Error de conexión. Asegúrate de que el backend esté encendido.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-8 flex flex-col items-center space-y-8">
      
      {/* Barra de Búsqueda */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full"
      >
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-green-700 group-focus-within:text-yellow-600 transition-colors" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-full pl-14 pr-36 py-5 rounded-full border-2 border-transparent bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-yellow-500/30 focus:border-yellow-500 shadow-2xl text-lg transition-all"
            placeholder="Introduce tu nombre..."
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute inset-y-2 right-2 flex items-center justify-center px-8 bg-green-800 hover:bg-green-900 text-white font-bold rounded-full transition-colors shadow-md disabled:bg-gray-400"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Buscar"}
          </button>
        </form>
      </motion.div>

      {/* Visualización Restringida de Resultados */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-red-100 text-red-700 px-6 py-3 rounded-xl font-medium shadow-sm"
          >
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white px-12 py-8 rounded-3xl shadow-2xl flex flex-col items-center border-4 border-yellow-400 w-full max-w-xs relative overflow-hidden"
          >
            <div className="absolute top-0 w-full h-2 bg-linear-to-r from-yellow-400 to-yellow-600"></div>
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">
              Puntos Acumulados
            </span>
            <span className="text-7xl font-black text-green-900 drop-shadow-sm mb-2">
              {result.total_score}
            </span>
            <span className="text-gray-500 font-medium text-lg border-t-2 border-gray-100 pt-2 w-full text-center">
              {result.name}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}