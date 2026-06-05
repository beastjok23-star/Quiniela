import SearchBar from "../src/components/public/SearchBar";
import { Trophy } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-green-900 via-green-800 to-emerald-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Elementos decorativos de fondo para la temática mundialista */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-40 border-white"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full border-40 border-white"></div>
      </div>

      <div className="max-w-3xl w-full space-y-8 text-center relative z-10">
        
        {/* Cabecera y Título */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="bg-linear-to-tr from-yellow-600 to-yellow-400 p-5 rounded-full shadow-xl ring-4 ring-yellow-500/30">
            <Trophy className="w-16 h-16 text-white drop-shadow-md" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-lg uppercase italic">
              Quiniela <span className="text-yellow-400">2026</span>
            </h1>
            <p className="text-green-100 text-lg md:text-2xl font-medium max-w-2xl mx-auto">
              Ingresa tu nombre para consultar tu puntuación actual.
            </p>
          </div>
        </div>

        {/* Instancia de nuestra barra de búsqueda */}
        <SearchBar />
        
      </div>
    </main>
  );
}