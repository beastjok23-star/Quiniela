"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import axios from "axios";

// Definimos cómo se ve un participante
interface ParticipantRecord {
  id: number;
  name: string;
  total_score: number;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ParticipantRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/participant/${query}`);

      if (response.data.success) {
        setResults(response.data.data);
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
      <div className="w-full">
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
      </div>

      {/* Visualización de Resultados Múltiples */}
      {error && (
        <div className="bg-red-100 text-red-700 px-6 py-3 rounded-xl font-medium shadow-sm animate-pulse">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="w-full flex flex-col items-center gap-4">
          {/* Mapeo para mostrar una tarjeta por cada registro */}
          {results.map((item, index) => (
            <div
              key={index}
              className="bg-white px-10 py-6 rounded-3xl shadow-xl flex flex-col items-center border-4 border-yellow-400 w-full max-w-xs relative overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
              <span className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">
                Entrada #{index + 1}
              </span>
              <span className="text-6xl font-black text-green-900 drop-shadow-sm mb-2">
                {item.total_score}
              </span>
              <span className="text-gray-500 font-medium text-lg border-t-2 border-gray-100 pt-2 w-full text-center">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}