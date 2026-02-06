"use client";

import { useBadmintonGame, Player } from "../hooks/useBadmintonGame";
import { useEffect } from "react";
import CourtVisualizer from "./CourtVisualizer";

interface ScoreboardProps {
  teamA: string;
  teamB: string;
  onReset: () => void;
  initialServer: Player;
}

export default function Scoreboard({
  teamA,
  teamB,
  onReset,
  initialServer,
}: ScoreboardProps) {
  const {
    scoreA,
    scoreB,
    setsWonA,
    setsWonB,
    currentSet,
    matchWinner,
    currentServer,
    incrementScore,
    undo,
    resetMatch,
  } = useBadmintonGame(initialServer);

  const handleReset = () => {
    resetMatch(initialServer);
    onReset();
  };

  useEffect(() => {
    if (matchWinner) {
      const historyItem = {
        date: new Date().toISOString(),
        teamA,
        teamB,
        scoreA,
        scoreB,
        setsWonA,
        setsWonB,
        matchWinner,
      };

      try {
        const existing = localStorage.getItem("badminton_match_history");
        const data = existing ? JSON.parse(existing) : [];
        data.unshift(historyItem);
        localStorage.setItem("badminton_match_history", JSON.stringify(data));
      } catch (e) {
        console.error("Failed to save history", e);
      }
    }
  }, [matchWinner, scoreA, scoreB, setsWonA, setsWonB, teamA, teamB]);

  return (
    <div className="flex flex-col h-[90vh] w-full max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 relative border border-zinc-800">
      {/* Top Bar Info */}
      <div className="w-full z-10 flex justify-between items-center p-4 bg-zinc-900 border-b border-zinc-800">
        <div className="flex gap-2">
          <span className="font-mono bg-zinc-800 text-zinc-300 px-3 py-1 rounded-lg">
            SET {matchWinner ? "END" : currentSet}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={undo}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors text-zinc-300"
          >
            Undo
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900/50 rounded-lg text-sm font-medium transition-colors"
          >
            End
          </button>
        </div>
      </div>

      {/* Main Scoring Area */}
      <div className="flex-1 flex flex-col md:flex-row h-full relative">
        {/* Team A Panel */}
        <button
          onClick={() => incrementScore("A")}
          disabled={!!matchWinner}
          className="relative flex-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-colors flex flex-col items-center justify-center p-8 group overflow-hidden h-1/2 md:h-full"
        >
          <div className="z-10 flex flex-col items-center gap-2 md:gap-4">
            <h2 className="text-2xl md:text-5xl font-bold text-blue-100 tracking-wider uppercase drop-shadow-md">
              {teamA}
            </h2>
            <div className="text-[6rem] md:text-[10rem] lg:text-[14rem] leading-none font-black text-white drop-shadow-2xl tabular-nums">
              {scoreA}
            </div>

            <div className="flex gap-3 mt-4">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 border-white/50 ${i < setsWonA ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "bg-transparent"}`}
                />
              ))}
            </div>
          </div>
        </button>

        {/* Court Visualizer Integration */}

        <div className="hidden md:flex flex-col justify-center bg-zinc-900 border-l border-r border-zinc-800 z-20 shadow-2xl p-4 min-w-[300px] lg:min-w-[400px]">
          <CourtVisualizer
            server={currentServer}
            scoreA={scoreA}
            scoreB={scoreB}
            matchWinner={matchWinner}
          />
        </div>

        {/* Mobile: Stacked */}
        <div className="md:hidden w-full bg-zinc-900 p-2">
          <CourtVisualizer
            server={currentServer}
            scoreA={scoreA}
            scoreB={scoreB}
            matchWinner={matchWinner}
          />
        </div>

        {/* Team B Panel */}
        <button
          onClick={() => incrementScore("B")}
          disabled={!!matchWinner}
          className="relative flex-1 bg-red-600 hover:bg-red-500 active:bg-red-700 transition-colors flex flex-col items-center justify-center p-8 group overflow-hidden h-1/2 md:h-full"
        >
          <div className="z-10 flex flex-col items-center gap-2 md:gap-4">
            <h2 className="text-2xl md:text-5xl font-bold text-red-100 tracking-wider uppercase drop-shadow-md">
              {teamB}
            </h2>
            <div className="text-[6rem] md:text-[10rem] lg:text-[14rem] leading-none font-black text-white drop-shadow-2xl tabular-nums">
              {scoreB}
            </div>

            <div className="flex gap-3 mt-4">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 border-white/50 ${i < setsWonB ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "bg-transparent"}`}
                />
              ))}
            </div>
          </div>
        </button>
      </div>

      {/* Winner Overlay */}
      {matchWinner && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-3xl shadow-2xl text-center max-w-lg mx-4">
            <h3 className="text-xl text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest mb-2">
              Match Winner
            </h3>
            <div
              className={`text-4xl md:text-6xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r ${matchWinner === "A" ? "from-blue-500 to-indigo-500" : "from-red-500 to-orange-500"}`}
            >
              {matchWinner === "A" ? teamA : teamB}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleReset}
                className="w-full py-3 px-6 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl font-bold hover:scale-105 transition-transform"
              >
                Start New Match
              </button>
              <button
                onClick={undo}
                className="w-full py-3 px-6 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Undo Last Point
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
