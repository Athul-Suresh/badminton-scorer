"use client";

import { useState } from "react";
import HistoryList from "./HistoryList";

interface MatchSetupProps {
  onStart: (teamA: string, teamB: string, initialServer: "A" | "B") => void;
}

export default function MatchSetup({ onStart }: MatchSetupProps) {
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [initialServer, setInitialServer] = useState<"A" | "B">("A");

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamA.trim() && teamB.trim()) {
      onStart(teamA, teamB, initialServer);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-8 w-full max-w-xl mx-auto px-4">
      <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
        <div className="p-8">
          <h2 className="text-3xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            New Match
          </h2>

          <form onSubmit={handleStart} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="teamA"
                  className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex justify-between"
                >
                  <span>Player A</span>
                  <input
                    type="radio"
                    name="server"
                    checked={initialServer === "A"}
                    onChange={() => setInitialServer("A")}
                    className="accent-blue-600"
                    title="Serve First"
                  />
                </label>
                <input
                  id="teamA"
                  type="text"
                  value={teamA}
                  onChange={(e) => setTeamA(e.target.value)}
                  placeholder="Name"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 outline-none transition-all duration-200 text-lg font-semibold placeholder:font-normal"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="teamB"
                  className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex justify-between"
                >
                  <span>Player B</span>
                  <input
                    type="radio"
                    name="server"
                    checked={initialServer === "B"}
                    onChange={() => setInitialServer("B")}
                    className="accent-red-600"
                    title="Serve First"
                  />
                </label>
                <input
                  id="teamB"
                  type="text"
                  value={teamB}
                  onChange={(e) => setTeamB(e.target.value)}
                  placeholder="Name"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-red-500 focus:bg-white dark:focus:bg-zinc-900 outline-none transition-all duration-200 text-lg font-semibold placeholder:font-normal"
                  required
                />
              </div>
            </div>

            <p className="text-center text-xs text-zinc-400">
              Select the radio button next to the player who serves first.
            </p>

            <button
              type="submit"
              disabled={!teamA.trim() || !teamB.trim()}
              className="w-full py-4 mt-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Start Game
            </button>
          </form>
        </div>
      </div>

      <HistoryList />
    </div>
  );
}
