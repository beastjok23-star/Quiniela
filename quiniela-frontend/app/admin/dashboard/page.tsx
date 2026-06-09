"use client";

import { useState } from "react";
import axios from "axios";
import { Trophy, CalendarDays, ArrowLeft, Plus, Trash2, Clock, CheckCircle2, Users } from "lucide-react";

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
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/games/${qNum}`);
      setGames(res.data.data);
      setView(targetView);
    } catch (error) {
      console.error("Error al cargar partidos", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadGlobalScores = async (qNum: number) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leaderboard/${qNum}`);
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
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/games`, {
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
      console.error("Error al guardar:", (error as any).response?.data || error);
      alert("Error al guardar. Revisa la consola (F12).");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/games/${id}`);
      await loadGames(selectedQ, "manage_games");
    } catch (error) {
      console.error("Error al eliminar", error);
    }
  };

  const handleSetWinner = async (gameId: number, winner: string) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/games/${gameId}/winner`, { real_winner: winner });
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
        <div className="bg-green-900 rounded-3xl p-8 mb-8 text-white shadow-xl">
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" /> Panel de Control Admin
          </h1>
        </div>

        {/* --- MENU PRINCIPAL --- */}
        {view === "main" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button onClick={() => setView("quinielas")} className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-green-600 transition-all flex flex-col items-center">
              <CalendarDays className="w-16 h-16 text-green-800 mb-4" />
              <h2 className="text-xl font-bold">Quinielas</h2>
            </button>
            <button onClick={() => setView("puntuacion")} className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-yellow-500 transition-all flex flex-col items-center">
              <CheckCircle2 className="w-16 h-16 text-yellow-500 mb-4" />
              <h2 className="text-xl font-bold">Puntuación</h2>
            </button>
            <button onClick={() => setView("ver_global")} className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-blue-600 transition-all flex flex-col items-center">
              <Users className="w-16 h-16 text-blue-600 mb-4" />
              <h2 className="text-xl font-bold">Puntajes Globales</h2>
            </button>
          </div>
        )}

        {/* --- SELECCIÓN DE QUINIELA --- */}
        {(view === "quinielas" || view === "puntuacion" || view === "ver_global") && (
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <button onClick={() => setView("main")} className="mb-6 p-2"><ArrowLeft /></button>
            <h2 className="text-2xl font-bold mb-6">Selecciona Quiniela</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((num) => (
                <button key={num} onClick={() => {
                  setSelectedQ(num);
                  if (view === "quinielas") loadGames(num, "manage_games");
                  if (view === "puntuacion") loadGames(num, "manage_scores");
                  if (view === "ver_global") loadGlobalScores(num);
                }} className="py-8 bg-green-50 rounded-2xl font-bold text-xl">Quiniela {num}</button>
              ))}
            </div>
          </div>
        )}

        {/* --- GESTIÓN DE PARTIDOS --- */}
        {view === "manage_games" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <button onClick={() => setView("quinielas")} className="mb-6 p-2"><ArrowLeft /></button>
            <h2 className="text-2xl font-bold mb-6">Partidos - Q{selectedQ}</h2>
            <form onSubmit={handleAddGame} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <input type="text" placeholder="Local" value={teamA} onChange={(e) => setTeamA(e.target.value)} required className="p-3 border rounded-xl" />
              <input type="text" placeholder="Visitante" value={teamB} onChange={(e) => setTeamB(e.target.value)} required className="p-3 border rounded-xl" />
              <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="p-3 border rounded-xl" />
              <button type="submit" className="bg-green-800 text-white rounded-xl font-bold">Registrar</button>
            </form>
            {games.map((game) => (
              <div key={game.id} className="flex justify-between items-center p-4 border-b">
                <span>{game.team_a} vs {game.team_b}</span>
                <button onClick={() => handleDelete(game.id)} className="text-red-500"><Trash2 /></button>
              </div>
            ))}
          </div>
        )}

        {/* --- ASIGNAR GANADORES --- */}
        {view === "manage_scores" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <button onClick={() => setView("puntuacion")} className="mb-6 p-2"><ArrowLeft /></button>
            <h2 className="text-2xl font-bold mb-6">Ganadores - Q{selectedQ}</h2>
            {games.map((game) => (
              <div key={game.id} className="p-4 border rounded-xl flex justify-between items-center mb-2">
                <span>{game.team_a} vs {game.team_b}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleSetWinner(game.id, game.team_a)} className="bg-gray-100 p-2 rounded text-xs">Local</button>
                  <button onClick={() => handleSetWinner(game.id, 'Empate')} className="bg-gray-100 p-2 rounded text-xs">Empate</button>
                  <button onClick={() => handleSetWinner(game.id, game.team_b)} className="bg-gray-100 p-2 rounded text-xs">Visita</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- RANKING --- */}
        {view === "view_global_scores" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <button onClick={() => setView("ver_global")} className="mb-6 p-2"><ArrowLeft /></button>
            <h2 className="text-2xl font-bold mb-6">Ranking - Q{selectedQ}</h2>
            {globalScores.map((score, idx) => (
              <div key={score.id} className="p-4 border-b flex justify-between">
                <span>{idx + 1}. {score.participant_name}</span>
                <span className="font-bold">{score.total_score} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}