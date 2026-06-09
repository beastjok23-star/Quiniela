"use client";

import { useState } from "react";
import axios from "axios";
import { Trophy, CalendarDays, ArrowLeft, Plus, Trash2, Clock, CheckCircle2, Users, ListOrdered } from "lucide-react";

interface Game {
  id: number;
  team_a: string;
  team_b: string;
  start_time: string;
  real_winner: string | null;
}

interface LeaderboardEntry {
  id: number;
  participant_name: string;
  total_score: number;
}

export default function AdminDashboard() {
  // Control de pantallas (Se agregaron vistas para ver clasificaciones globales)
  const [view, setView] = useState<"main" | "quinielas" | "puntuacion" | "ver_global" | "manage_games" | "manage_scores" | "view_global_scores">("main");
  const [selectedQ, setSelectedQ] = useState<number>(1);
  const [games, setGames] = useState<Game[]>([]);
  const [globalScores, setGlobalScores] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [startTime, setStartTime] = useState("");

  const loadGames = async (qNum: number, targetView: "manage_games" | "manage_scores") => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/games/${qNum}`);
      setGames(res.data.data);
      setView(targetView);
    } catch (error) {
      console.error("Error al cargar partidos", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Nuevo: Cargar la lista completa de puntajes de los participantes para el Admin
  const loadGlobalScores = async (qNum: number) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/leaderboard/${qNum}`);
      setGlobalScores(res.data.data);
      setView("view_global_scores");
    } catch (error) {
      console.error("Error al cargar los puntajes globales", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/games", {
        quiniela_number: selectedQ,
        team_a: teamA,
        team_b: teamB,
        start_time: startTime,
      });
      setTeamA("");
      setTeamB("");
      setStartTime("");
      await loadGames(selectedQ, "manage_games");
    } catch (error) {
      console.error("Error al guardar", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/games/${id}`);
      await loadGames(selectedQ, "manage_games");
    } catch (error) {
      console.error("Error al eliminar", error);
    }
  };

  const handleSetWinner = async (gameId: number, winner: string) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/games/${gameId}/winner`, { real_winner: winner });
      await loadGames(selectedQ, "manage_scores");
    } catch (error) {
      console.error("Error al asignar ganador", error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-MX", { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* ENCABEZADO GLOBAL */}
        <div className="bg-green-900 rounded-3xl p-8 mb-8 text-white shadow-xl flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              Panel de Control Admin
            </h1>
            <p className="text-green-200 mt-2">Administración Oficial de Quinielas</p>
          </div>
        </div>

        {/* --- PANTALLA 1: MENÚ PRINCIPAL (AHORA CON 3 OPCIONES) --- */}
        {view === "main" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button onClick={() => setView("quinielas")} className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-green-600 transition-all group flex flex-col items-center text-center">
              <CalendarDays className="w-16 h-16 text-green-800 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-bold text-gray-800">Quinielas</h2>
              <p className="text-gray-500 mt-2 text-sm">Registrar, modificar o eliminar los partidos de cada jornada.</p>
            </button>

            <button onClick={() => setView("puntuacion")} className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-yellow-500 transition-all group flex flex-col items-center text-center">
              <CheckCircle2 className="w-16 h-16 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-bold text-gray-800">Puntuación</h2>
              <p className="text-gray-500 mt-2 text-sm">Declarar ganadores oficiales de los partidos de fútbol.</p>
            </button>

            <button onClick={() => setView("ver_global")} className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-blue-600 transition-all group flex flex-col items-center text-center">
              <Users className="w-16 h-16 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-bold text-gray-800">Puntajes Globales</h2>
              <p className="text-gray-500 mt-2 text-sm">Ver la tabla completa de posiciones con todos los participantes.</p>
            </button>
          </div>
        )}

        {/* --- PANTALLA 2: SELECCIÓN DE QUINIELA (PARTIDOS) --- */}
        {view === "quinielas" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex items-center mb-8 gap-4">
              <button onClick={() => setView("main")} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft className="w-6 h-6 text-gray-600" /></button>
              <h2 className="text-2xl font-bold text-gray-800">Selecciona la Quiniela a gestionar</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((num) => (
                <button key={num} onClick={() => { setSelectedQ(num); loadGames(num, "manage_games"); }} className="py-8 bg-green-50 hover:bg-green-800 hover:text-white rounded-2xl font-bold text-xl text-green-900 border border-green-200 transition-all shadow-sm">Quiniela {num}</button>
              ))}
            </div>
          </div>
        )}

        {/* --- PANTALLA 3: GESTIÓN DE PARTIDOS --- */}
        {view === "manage_games" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6 border-b pb-4">
                <button onClick={() => setView("quinielas")} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft className="w-6 h-6 text-gray-600" /></button>
                <h2 className="text-2xl font-bold text-gray-800">Quiniela {selectedQ} - Partidos</h2>
              </div>
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex items-center gap-3 mb-8 border border-blue-200">
                <Clock className="w-6 h-6 flex-shrink-0" />
                <span className="font-semibold text-sm">Las horas en las que se muestran los partidos son hora del centro de México.</span>
              </div>
              <form onSubmit={handleAddGame} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><Plus className="w-5 h-5" /> Agregar Nuevo Partido</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Local" value={teamA} onChange={(e) => setTeamA(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none text-gray-900 bg-white" />
                  <input type="text" placeholder="Visitante" value={teamB} onChange={(e) => setTeamB(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none text-gray-900 bg-white" />
                  <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none text-gray-900 bg-white" />
                </div>
                <div className="flex justify-end mt-4"><button type="submit" className="bg-green-800 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-900 transition-colors">Registrar Partido</button></div>
              </form>
              <div className="space-y-4">
                {games.length === 0 ? <p className="text-center text-gray-500 py-8">No hay partidos registrados en esta quiniela aún.</p> : games.map((game, idx) => (
                  <div key={game.id} className="flex items-center justify-between bg-white border-2 border-gray-100 p-5 rounded-2xl hover:border-yellow-400 transition-colors shadow-sm">
                    <div className="flex items-center gap-6">
                      <span className="text-gray-400 font-black text-xl w-6">{idx + 1}</span>
                      <div className="flex items-center gap-4 text-lg font-bold text-gray-800">
                        <span>{game.team_a}</span><span className="text-yellow-500">VS</span><span>{game.team_b}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2"><Clock className="w-4 h-4" /> {formatTime(game.start_time)}</span>
                      <button onClick={() => handleDelete(game.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-6"><button onClick={() => setView("main")} className="bg-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors">Regresar al Menú Principal</button></div>
          </div>
        )}

        {/* --- PANTALLA 4: SELECCIÓN DE QUINIELA (CALIFICAR) --- */}
        {view === "puntuacion" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setView("main")} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft className="w-6 h-6 text-gray-600" /></button>
              <h2 className="text-2xl font-bold text-gray-800">Selecciona la Quiniela a calificar</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((num) => (
                <button key={num} onClick={() => { setSelectedQ(num); loadGames(num, "manage_scores"); }} className="py-8 bg-yellow-50 hover:bg-yellow-500 hover:text-white rounded-2xl font-bold text-xl text-yellow-700 border border-yellow-200 transition-all shadow-sm">Quiniela {num}</button>
              ))}
            </div>
          </div>
        )}

        {/* --- PANTALLA 5: ASIGNAR GANADORES --- */}
        {view === "manage_scores" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6 border-b pb-4">
                <button onClick={() => setView("puntuacion")} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft className="w-6 h-6 text-gray-600" /></button>
                <h2 className="text-2xl font-bold text-gray-800">Asignar Ganadores - Quiniela {selectedQ}</h2>
              </div>
              <div className="space-y-4">
                {games.length === 0 ? <p className="text-center text-gray-500 py-8">No hay partidos registrados para calificar.</p> : games.map((game, idx) => (
                  <div key={game.id} className="bg-gray-50 border border-gray-200 p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-gray-500 uppercase tracking-wider text-sm">Partido {idx + 1}</span>
                      <span className="text-sm bg-white px-3 py-1 rounded-full border shadow-sm text-gray-600 font-medium flex items-center gap-2"><Clock className="w-3 h-3"/> {formatTime(game.start_time)}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button onClick={() => handleSetWinner(game.id, game.team_a)} className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${game.real_winner === game.team_a ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white text-gray-700 hover:border-green-600'}`}>Local: {game.team_a}</button>
                      <button onClick={() => handleSetWinner(game.id, 'Empate')} className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${game.real_winner === 'Empate' ? 'bg-gray-600 text-white border-gray-600 shadow-md' : 'bg-white text-gray-700 hover:border-gray-600'}`}>Empate</button>
                      <button onClick={() => handleSetWinner(game.id, game.team_b)} className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${game.real_winner === game.team_b ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white text-gray-700 hover:border-green-600'}`}>Visitante: {game.team_b}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-6"><button onClick={() => setView("main")} className="bg-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors">Regresar al Menú Principal</button></div>
          </div>
        )}

        {/* --- PANTALLA 6: SELECCIÓN DE QUINIELA (PUNTAJES GLOBALES) (NUEVO) --- */}
        {view === "ver_global" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setView("main")} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft className="w-6 h-6 text-gray-600" /></button>
              <h2 className="text-2xl font-bold text-gray-800">Selecciona la Quiniela para ver el Ranking Completo</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((num) => (
                <button key={num} onClick={() => loadGlobalScores(num)} className="py-8 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-2xl font-bold text-xl text-blue-700 border border-blue-200 transition-all shadow-sm">Quiniela {num}</button>
              ))}
            </div>
          </div>
        )}

        {/* --- PANTALLA 7: TABLA DE POSICIONES COMPLETA PARA EL ADMIN (NUEVO) --- */}
        {view === "view_global_scores" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6 border-b pb-4">
                <button onClick={() => setView("ver_global")} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft className="w-6 h-6 text-gray-600" /></button>
                <h2 className="text-2xl font-bold text-gray-800">Clasificación Completa - Quiniela {selectedQ}</h2>
              </div>

              <div className="space-y-3">
                {globalScores.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No hay participantes registrados en esta quiniela aún.</p>
                ) : (
                  globalScores.map((entry, idx) => (
                    <div key={entry.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full font-black text-sm ${idx === 0 ? 'bg-yellow-400 text-yellow-900' : idx === 1 ? 'bg-gray-300 text-gray-800' : idx === 2 ? 'bg-orange-300 text-orange-900' : 'bg-white border text-gray-400'}`}>
                          {idx + 1}
                        </div>
                        <span className="font-bold text-gray-800 text-lg">{entry.participant_name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-green-700 block">{entry.total_score}</span>
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Puntos</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="flex justify-center mt-6"><button onClick={() => setView("main")} className="bg-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors">Regresar al Menú Principal</button></div>
          </div>
        )}

      </div>
    </div>
  );
}