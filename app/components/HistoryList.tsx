"use client";

import { useEffect, useState } from "react";

interface HistoryItem {
  date: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  setsWonA: number;
  setsWonB: number;
  matchWinner: "A" | "B";
}

export default function HistoryList() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("badminton_match_history");
    if (data) {
      try {
        setHistory(JSON.parse(data));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <h3 className="text-xl font-bold text-zinc-700 dark:text-zinc-300 mb-4 px-2">
        Recent Matches
      </h3>
      <div className="space-y-3">
        {history.map((game, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800 flex items-center justify-between"
          >
            <div className="flex-1">
              <div
                className={`flex justify-between items-center mb-1 ${game.matchWinner === "A" ? "font-bold text-zinc-900 dark:text-white" : "text-zinc-500"}`}
              >
                <span>{game.teamA}</span>
                <span>{game.setsWonA}</span>
              </div>
              <div
                className={`flex justify-between items-center ${game.matchWinner === "B" ? "font-bold text-zinc-900 dark:text-white" : "text-zinc-500"}`}
              >
                <span>{game.teamB}</span>
                <span>{game.setsWonB}</span>
              </div>
            </div>
            <div className="ml-4 pl-4 border-l border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400">
              {new Date(game.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
