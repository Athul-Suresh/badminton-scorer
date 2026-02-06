"use client";

import { useState } from "react";
import MatchSetup from "./MatchSetup";
import Scoreboard from "./Scoreboard";

export default function BadmintonMatch() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [players, setPlayers] = useState({ teamA: "", teamB: "" });
  const [initialServer, setInitialServer] = useState<"A" | "B">("A");

  const startMatch = (
    teamA: string,
    teamB: string,
    initialServer: "A" | "B",
  ) => {
    setPlayers({ teamA, teamB });
    setInitialServer(initialServer);
    setIsPlaying(true);
  };

  const resetGame = () => {
    setIsPlaying(false);
    setPlayers({ teamA: "", teamB: "" });
  };

  return (
    <main className="min-h-screen bg-zinc-100 dark:bg-black p-4 md:p-6 flex items-center justify-center">
      {!isPlaying ? (
        <MatchSetup onStart={startMatch} />
      ) : (
        <Scoreboard
          teamA={players.teamA}
          teamB={players.teamB}
          initialServer={initialServer}
          onReset={resetGame}
        />
      )}
    </main>
  );
}
