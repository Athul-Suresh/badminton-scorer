"use client";

import { useState } from "react";
import HistoryList from "./HistoryList";

interface MatchSetupProps {
  onStart: (
    mode: "singles" | "doubles",
    teamA: string[],
    teamB: string[],
    initialServerTeam: "A" | "B",
    initialServerIndex: number,
  ) => void;
}

export default function MatchSetup({ onStart }: MatchSetupProps) {
  const [mode, setMode] = useState<"singles" | "doubles">("singles");
  const [teamA1, setTeamA1] = useState("");
  const [teamA2, setTeamA2] = useState("");
  const [teamB1, setTeamB1] = useState("");
  const [teamB2, setTeamB2] = useState("");
  const [initialServerTeam, setInitialServerTeam] = useState<"A" | "B">("A");
  const [initialServerIndex, setInitialServerIndex] = useState<number>(0);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const teamA = mode === "singles" ? [teamA1] : [teamA1, teamA2];
    const teamB = mode === "singles" ? [teamB1] : [teamB1, teamB2];

    if (teamA.every((n) => n.trim()) && teamB.every((n) => n.trim())) {
      onStart(mode, teamA, teamB, initialServerTeam, initialServerIndex);
    }
  };

  const setServer = (team: "A" | "B", index: number) => {
    setInitialServerTeam(team);
    setInitialServerIndex(index);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-8 w-full max-w-xl mx-auto px-4">
      <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
        <div className="p-8">
          <h2 className="text-3xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            New Match
          </h2>

          {/* Mode Toggle */}
          <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-8">
            <button
              type="button"
              onClick={() => setMode("singles")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === "singles"
                  ? "bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              Singles 👤
            </button>
            <button
              type="button"
              onClick={() => setMode("doubles")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === "doubles"
                  ? "bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              Doubles 👥
            </button>
          </div>

          <form onSubmit={handleStart} className="space-y-8">
            {/* Team A Section */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex justify-between items-center">
                <span className="text-blue-600 dark:text-blue-400">
                  Team A (Blue)
                </span>
                <span className="text-xs font-normal normal-case text-zinc-400">
                  Select server 🏸
                </span>
              </label>
              <div className="grid gap-3">
                <div className="relative">
                  <input
                    type="text"
                    value={teamA1}
                    onChange={(e) => setTeamA1(e.target.value)}
                    placeholder={
                      mode === "singles" ? "Player Name" : "Player 1 Name"
                    }
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 outline-none transition-all font-medium"
                    required
                  />
                  <input
                    type="radio"
                    name="server"
                    checked={
                      initialServerTeam === "A" && initialServerIndex === 0
                    }
                    onChange={() => setServer("A", 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 accent-blue-600 cursor-pointer"
                    title="Serve First"
                  />
                </div>
                {mode === "doubles" && (
                  <div className="relative">
                    <input
                      type="text"
                      value={teamA2}
                      onChange={(e) => setTeamA2(e.target.value)}
                      placeholder="Player 2 Name"
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 outline-none transition-all font-medium"
                      required
                    />
                    <input
                      type="radio"
                      name="server"
                      checked={
                        initialServerTeam === "A" && initialServerIndex === 1
                      }
                      onChange={() => setServer("A", 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 accent-blue-600 cursor-pointer"
                      title="Serve First"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Team B Section */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex justify-between items-center">
                <span className="text-red-600 dark:text-red-400">
                  Team B (Red)
                </span>
                <span className="text-xs font-normal normal-case text-zinc-400">
                  Select server 🏸
                </span>
              </label>
              <div className="grid gap-3">
                <div className="relative">
                  <input
                    type="text"
                    value={teamB1}
                    onChange={(e) => setTeamB1(e.target.value)}
                    placeholder={
                      mode === "singles" ? "Player Name" : "Player 1 Name"
                    }
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-red-500 focus:bg-white dark:focus:bg-zinc-900 outline-none transition-all font-medium"
                    required
                  />
                  <input
                    type="radio"
                    name="server"
                    checked={
                      initialServerTeam === "B" && initialServerIndex === 0
                    }
                    onChange={() => setServer("B", 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 accent-red-600 cursor-pointer"
                    title="Serve First"
                  />
                </div>
                {mode === "doubles" && (
                  <div className="relative">
                    <input
                      type="text"
                      value={teamB2}
                      onChange={(e) => setTeamB2(e.target.value)}
                      placeholder="Player 2 Name"
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-red-500 focus:bg-white dark:focus:bg-zinc-900 outline-none transition-all font-medium"
                      required
                    />
                    <input
                      type="radio"
                      name="server"
                      checked={
                        initialServerTeam === "B" && initialServerIndex === 1
                      }
                      onChange={() => setServer("B", 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 accent-red-600 cursor-pointer"
                      title="Serve First"
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={
                !teamA1.trim() ||
                !teamB1.trim() ||
                (mode === "doubles" && (!teamA2.trim() || !teamB2.trim()))
              }
              className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Start Match
            </button>
          </form>
        </div>
      </div>

      <HistoryList />
    </div>
  );
}
