"use client";

import { useState } from "react";
import axios from "axios";
import { Trophy, CalendarDays, ArrowLeft, Clock, CheckCircle2, AlertCircle, ListOrdered, Edit3, Send, Search } from "lucide-react";

interface Game {
  id: number;
  team_a: string;
  team_b: string;
  start_time: string;
}

interface Entry {
  id: number;
  participant_name: string;
  total_score: number;
}

export default function Home() {
  const [view, setView] = useState<"main" | "select_registro" | "select_tabla" | "registro_games" | "registro_summary" | "tabla_leaderboard">("main");
  const [selectedQ, setSelectedQ] = useState<number>(1);
  const [games, setGames] = useState<Game[]>([]);
  const [leaderboard, setLeaderboard] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);

  // Estados de control del jugador
  const [predictions, setPredictions] = useState<{ [key: number]: string }>({});
  const [playerName, setPlayerName] = useState("");
  
  // NUEVOS ESTADOS: Separar lo que se escribe de lo que se busca
  const [searchInput, setSearchInput] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-MX", { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const loadGamesForRegistro = async (qNum: number) => {
    setIsLoading(true);
    setErrorMessage("");
    setPredictions({});
    try {
      const res = await axios.get(`https://quiniela-production-704a.up.railway.app/api/games/${qNum}`);
      setGames(res.data.data);
      setView("registro_games");
    } catch (error) {
      setErrorMessage("Error al cargar los partidos.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadLeaderboard = async (qNum: number) => {
    setIsLoading(true);
    setErrorMessage("");
    setSearchInput(""); 
    setSubmittedSearch(""); // Limpiar búsquedas anteriores
    try {
      const res = await axios.get(`https://quiniela-production-704a.up.railway.app/api/leaderboard/${qNum}`);
      setLeaderboard(res.data.data);
      setView("tabla_leaderboard");
    } catch (error) {
      setErrorMessage("Error al cargar los puntajes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPrediction = (gameId: number, selection: string) => {
    setPredictions((prev) => ({
      ...prev,
      [gameId]: selection,
    }));
  };

  const handleGoToSummary = () => {
    if (Object.keys(predictions).length < games.length) {
      setErrorMessage("Debes seleccionar un resultado para todos los partidos antes de enviar.");
      return;
    }
    setErrorMessage("");
    setView("registro_summary");
  };

  const handleSubmitPredictions = async () => {
    if (!playerName.trim()) {
      setErrorMessage("Por favor, ingresa tu nombre para registrar tu jugada.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    
    const formattedPredictions = Object.keys(predictions).map((gameId) => ({
      game_id: Number(gameId),
      predicted_winner: predictions[Number(gameId)]
    }));

    try {
      await axios.post("https://quiniela-production-704a.up.railway.app/api/participant", {
        participant_name: playerName,
        quiniela_number: selectedQ,
        predictions: formattedPredictions
      });

      setSuccessMessage(true);
      setView("main");
      setPlayerName("");
      setPredictions({});
      
      setTimeout(() => setSuccessMessage(false), 5000);

    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        setErrorMessage(error.response.data.message || "¡Tiempo agotado! La quiniela ya está cerrada.");
      } else {
        setErrorMessage("Ocurrió un error al enviar tus predicciones. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // NUEVA FUNCIÓN: Solo busca cuando se envía el formulario
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedSearch(searchInput.trim());
  };

  // NUEVA REGLA: Búsqueda exacta (ignorando mayúsculas/minúsculas) basada en la búsqueda confirmada
  const matchedEntries = leaderboard.filter(entry => 
    submittedSearch !== "" && 
    entry.participant_name.toLowerCase() === submittedSearch.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="bg-green-900 rounded-3xl p-8 mb-8 text-white shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-black uppercase tracking-tight">Quiniela 2026</h1>
          <p className="text-green-200 mt-2 text-lg">Demuestra tus conocimientos y gana</p>
        </div>

        {/* ALERTA EXITO */}
        {successMessage && (
          <div className="bg-green-100 text-green-800 p-6 rounded-2xl flex items-center justify-center gap-3 mb-8 border-2 border-green-500 shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
            <span className="font-black text-xl uppercase tracking-wider">Predicciones enviadas con éxito</span>
          </div>
        )}

        {/* ALERTA ERROR */}
        {errorMessage && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 mb-6 border border-red-200">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* --- 1. MENÚ PRINCIPAL --- */}
        {view === "main" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button onClick={() => setView("select_registro")} className="bg-white p-12 rounded-3xl shadow-sm border-2 border-transparent hover:border-green-600 transition-all group flex flex-col items-center">
              <Edit3 className="w-20 h-20 text-green-800 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold text-gray-800">Registro</h2>
              <p className="text-gray-500 mt-2 text-center">Arma tu pronóstico antes de que empiecen los partidos.</p>
            </button>

            <button onClick={() => setView("select_tabla")} className="bg-white p-12 rounded-3xl shadow-sm border-2 border-transparent hover:border-yellow-500 transition-all group flex flex-col items-center">
              <ListOrdered className="w-20 h-20 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold text-gray-800">Tabla</h2>
              <p className="text-gray-500 mt-2 text-center">Consulta los puntajes individuales ingresando tu nombre exacto.</p>
            </button>
          </div>
        )}

        {/* --- 2. SELECCIÓN DE QUINIELA (REGISTRO) --- */}
        {view === "select_registro" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Elige una Quiniela para Participar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((num) => (
                <button key={num} onClick={() => { setSelectedQ(num); loadGamesForRegistro(num); }} className="py-8 bg-green-50 hover:bg-green-800 hover:text-white rounded-2xl font-bold text-xl text-green-900 border border-green-200 transition-all shadow-sm">
                  Quiniela {num}
                </button>
              ))}
            </div>
            <button onClick={() => setView("main")} className="bg-gray-200 text-gray-800 px-8 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 mx-auto">
              <ArrowLeft className="w-5 h-5" /> Regresar
            </button>
          </div>
        )}

        {/* --- 3. PANTALLA SELECCIÓN PARTIDOS --- */}
        {view === "registro_games" && (
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm">
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex items-start gap-3 mb-8 border border-blue-200">
              <Clock className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <span className="font-bold text-sm md:text-base">Las horas en las que se muestran los partidos son hora del centro de México.</span>
            </div>

            <h2 className="text-2xl font-black text-gray-800 mb-6 text-center border-b pb-4">Jornada - Quiniela {selectedQ}</h2>

            <div className="space-y-8">
              {games.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Aún no hay partidos disponibles para esta quiniela.</p>
              ) : (
                games.map((game) => (
                  <div key={game.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="text-center mb-6">
                      <h3 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-wide">
                        {game.team_a} <span className="text-yellow-500 mx-2">VS</span> {game.team_b}
                      </h3>
                      <span className="inline-block mt-2 bg-gray-200 text-gray-700 px-4 py-1 rounded-full text-sm font-bold">
                        {formatTime(game.start_time)}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                      <button onClick={() => handleSelectPrediction(game.id, game.team_a)} className={`py-3 px-2 md:px-4 rounded-xl font-bold border-2 transition-all ${predictions[game.id] === game.team_a ? 'bg-green-600 text-white border-green-600 shadow-md transform scale-105' : 'bg-white text-gray-700 hover:border-green-600'}`}>
                        <span className="block text-xs text-gray-500 mb-1 font-normal uppercase">Local</span>
                        <span className="truncate block">{game.team_a}</span>
                      </button>
                      
                      <button onClick={() => handleSelectPrediction(game.id, 'Empate')} className={`py-3 px-2 md:px-4 rounded-xl font-bold border-2 transition-all ${predictions[game.id] === 'Empate' ? 'bg-gray-600 text-white border-gray-600 shadow-md transform scale-105' : 'bg-white text-gray-700 hover:border-gray-600'}`}>
                        <span className="block text-xs text-transparent mb-1">-</span>
                        Empate
                      </button>
                      
                      <button onClick={() => handleSelectPrediction(game.id, game.team_b)} className={`py-3 px-2 md:px-4 rounded-xl font-bold border-2 transition-all ${predictions[game.id] === game.team_b ? 'bg-green-600 text-white border-green-600 shadow-md transform scale-105' : 'bg-white text-gray-700 hover:border-green-600'}`}>
                        <span className="block text-xs text-gray-500 mb-1 font-normal uppercase">Visitante</span>
                        <span className="truncate block">{game.team_b}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-col-reverse md:flex-row justify-between items-center mt-10 gap-4">
              <button onClick={() => setView("select_registro")} className="w-full md:w-auto bg-gray-200 text-gray-800 px-8 py-4 rounded-xl font-bold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2">
                <ArrowLeft className="w-5 h-5" /> Regresar
              </button>
              
              {games.length > 0 && (
                <button onClick={handleGoToSummary} className="w-full md:w-auto bg-green-800 text-white px-10 py-4 rounded-xl font-black text-lg hover:bg-green-900 transition-colors flex items-center justify-center gap-2 shadow-lg">
                  Enviar Predicciones <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* --- 4. RESUMEN Y CONFIRMACIÓN --- */}
        {view === "registro_summary" && (
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm text-center">
            <h2 className="text-3xl font-black text-gray-800 mb-2">Resumen de tu Jugada</h2>
            <p className="text-gray-500 mb-8">Revisa tus selecciones antes de enviarlas</p>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left mb-8 space-y-4">
              {games.map((game, idx) => (
                <div key={game.id} className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                  <span className="text-gray-600 font-medium">Partido {idx + 1}:</span>
                  <span className="font-bold text-green-700 text-lg uppercase bg-green-50 px-4 py-1 rounded-lg">
                    {predictions[game.id]}
                  </span>
                </div>
              ))}
            </div>

            <div className="mb-10 text-left">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Tu Nombre de Jugador</label>
              <input 
                type="text" 
                value={playerName} 
                onChange={(e) => setPlayerName(e.target.value)} 
                placeholder="Ej. Jorge, Beto..." 
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-300 focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all outline-none text-lg text-gray-900 bg-white"
                required
              />
            </div>

            <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-4">
              <button onClick={() => setView("registro_games")} disabled={isLoading} className="w-full md:w-auto bg-gray-200 text-gray-800 px-8 py-4 rounded-xl font-bold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2">
                <Edit3 className="w-5 h-5" /> Corregir
              </button>
              
              <button onClick={handleSubmitPredictions} disabled={isLoading} className="w-full md:w-auto bg-yellow-500 text-gray-900 px-10 py-4 rounded-xl font-black text-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 shadow-lg">
                {isLoading ? "Enviando..." : "Confirmar y Enviar"} <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* --- 5. SELECCIÓN DE QUINIELA (TABLA) --- */}
        {view === "select_tabla" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Elige una Quiniela para ver tu Puntaje</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((num) => (
                <button key={num} onClick={() => { setSelectedQ(num); loadLeaderboard(num); }} className="py-8 bg-yellow-50 hover:bg-yellow-500 hover:text-white rounded-2xl font-bold text-xl text-yellow-700 border border-yellow-200 transition-all shadow-sm">
                  Quiniela {num}
                </button>
              ))}
            </div>
            <button onClick={() => setView("main")} className="bg-gray-200 text-gray-800 px-8 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 mx-auto">
              <ArrowLeft className="w-5 h-5" /> Regresar
            </button>
          </div>
        )}

        {/* --- 6. BUSCADOR EXACTO DE PUNTAJE INDIVIDUAL --- */}
        {view === "tabla_leaderboard" && (
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm">
            <h2 className="text-2xl font-black text-gray-800 text-center uppercase tracking-wide">
              Consulta tu Puntuación - Quiniela {selectedQ}
            </h2>
            <p className="text-gray-500 text-center mt-1 mb-8">Escribe tu nombre completo y presiona Buscar.</p>

            {/* Formulario de Búsqueda Bloqueada */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto mb-10 flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Escribe tu nombre exacto..."
                  className="block w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all text-base"
                />
              </div>
              <button 
                type="submit" 
                className="bg-yellow-500 hover:bg-yellow-400 text-yellow-900 px-8 py-4 rounded-xl font-bold transition-colors shadow-sm whitespace-nowrap"
              >
                Buscar
              </button>
            </form>

            {/* Resultados exactos */}
            <div className="space-y-3 min-h-[100px] mb-8">
              {submittedSearch === "" ? (
                <p className="text-center text-gray-400 italic py-4">Ingresa tu nombre y realiza la búsqueda para ver tus puntos.</p>
              ) : matchedEntries.length === 0 ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100 max-w-md mx-auto">
                  <span className="font-bold">No se encontró a "{submittedSearch}"</span>
                  <p className="text-sm mt-1">Asegúrate de haberlo escrito exactamente como te registraste en esta quiniela.</p>
                </div>
              ) : (
                matchedEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400 p-5 rounded-2xl shadow-sm max-w-md mx-auto">
                    <div className="flex items-center gap-4">
                      <Trophy className="w-6 h-6 text-yellow-600" />
                      <span className="font-bold text-gray-800 text-xl">{entry.participant_name}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-3xl font-black text-amber-600">{entry.total_score}</span>
                      <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Puntos</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-center border-t pt-6">
              <button onClick={() => setView("select_tabla")} className="bg-gray-200 text-gray-800 px-8 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2">
                <ArrowLeft className="w-5 h-5" /> Regresar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}