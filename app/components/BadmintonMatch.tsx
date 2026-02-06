"use client";

import { useState } from "react";
import MatchSetup from "./MatchSetup";
import Scoreboard from "./Scoreboard";
import { GameType, Player, useBadmintonGame } from "../hooks/useBadmintonGame";

export default function BadmintonMatch() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [players, setPlayers] = useState<{
    teamA: string[];
    teamB: string[];
  }>({ teamA: [], teamB: [] });
  const [gameMode, setGameMode] = useState<GameType>("singles");
  const [initialServer, setInitialServer] = useState<Player>("A");
  const [initialServerIndex, setInitialServerIndex] = useState<number>(0);

  const handleStart = (
    mode: "singles" | "doubles",
    teamA: string[],
    teamB: string[],
    server: Player,
    serverIndex: number,
  ) => {
    setPlayers({ teamA, teamB });
    setGameMode(mode);
    setInitialServer(server);
    setInitialServerIndex(serverIndex);
    setIsPlaying(true);
  };

  const handleEndMatch = () => {
    setIsPlaying(false);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {!isPlaying ? (
        <MatchSetup onStart={handleStart} />
      ) : (
        <Scoreboard
          teamA={players.teamA}
          teamB={players.teamB}
          initialServer={initialServer}
          initialServerIndex={initialServerIndex}
          gameType={gameMode}
          onEnd={handleEndMatch}
        />
      )}
    </main>
  );
}
