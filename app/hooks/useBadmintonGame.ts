import { useState, useCallback, useEffect } from "react";

export type Player = "A" | "B";
export type GameType = "singles" | "doubles";

export interface GameState {
  scoreA: number;
  scoreB: number;
  setsWonA: number;
  setsWonB: number;
  currentSet: number;
  matchWinner: Player | null;
  currentServer: Player;
  // Doubles Specific
  gameType: GameType;
  // Index (0 or 1) of the player currently in the RIGHT service court.
  // In Singles, this can be ignored or used to just track active side if needed, but logic differs.
  teamAPlayerInRight: number;
  teamBPlayerInRight: number;
}

export interface UseBadmintonGameReturn extends GameState {
  incrementScore: (player: Player) => void;
  undo: () => void;
  resetMatch: (initialServer?: Player, type?: GameType) => void;
  history: GameState[];
}

const STORAGE_KEY = "badminton_match_history";

export const useBadmintonGame = (
  initialServer: Player = "A",
  initialGameType: GameType = "singles",
  initialServerIndex: number = 0, // 0 or 1
): UseBadmintonGameReturn => {
  const [state, setState] = useState<GameState>({
    scoreA: 0,
    scoreB: 0,
    setsWonA: 0,
    setsWonB: 0,
    currentSet: 1,
    matchWinner: null,
    currentServer: initialServer,
    gameType: initialGameType,
    // Initialize positions based on who is serving
    // The Server MUST be in the Right Court (0-0 score).
    // So if initialServer is A, and initialServerIndex is 1, then A's player 1 is in Right.
    // Non-serving team positions: standard default (0 in Right) or symmetrical?
    // Let's default non-servers to 0 in Right.
    teamAPlayerInRight: initialServer === "A" ? initialServerIndex : 0,
    teamBPlayerInRight: initialServer === "B" ? initialServerIndex : 0,
  });

  const [history, setHistory] = useState<GameState[]>([]);

  const pushHistory = () => {
    setHistory((prev) => [...prev, { ...state }]);
  };

  const incrementScore = useCallback(
    (winner: Player) => {
      if (state.matchWinner) return;

      pushHistory();

      setState((prev) => {
        let {
          scoreA,
          scoreB,
          setsWonA,
          setsWonB,
          currentSet,
          currentServer,
          teamAPlayerInRight,
          teamBPlayerInRight,
          gameType,
        } = prev;

        const servingTeam = currentServer;
        const receivingTeam = currentServer === "A" ? "B" : "A";
        const isServerWin = winner === servingTeam;

        // 1. Update Score
        if (winner === "A") scoreA++;
        else scoreB++;

        // 2. Handle Positions & Service Change

        if (gameType === "singles") {
          // Standard Singles Logic
          if (!isServerWin) {
            currentServer = winner; // Sideout
          }
          // No complex position swapping to track for singles,
          // position is purely based on score (Even=Right, Odd=Left).
        } else {
          // Doubles Logic
          if (isServerWin) {
            // Server won rally -> Same person serves again.
            // Server side SWAPS courts.
            if (servingTeam === "A") {
              // Toggle A positions
              teamAPlayerInRight = teamAPlayerInRight === 0 ? 1 : 0;
            } else {
              teamBPlayerInRight = teamBPlayerInRight === 0 ? 1 : 0;
            }
          } else {
            // Receiver won rally -> Sideout.
            // NO ONE swaps courts.
            currentServer = winner;
            // The person eligible to serve is determined by the NEW score.
            // But we don't need to calculate "who" it is here for the state 'currentServer' which is just Team A/B.
            // The UI will derive *which* player it is based on (Score is Even -> Right Player, Odd -> Left Player).
          }
        }

        let setWinner: Player | null = null;
        let matchWinner: Player | null = null;

        // Standard win: 21 points and lead by 2
        if ((scoreA >= 21 || scoreB >= 21) && Math.abs(scoreA - scoreB) >= 2) {
          setWinner = scoreA > scoreB ? "A" : "B";
        }
        // Cap at 30 (Golden point)
        else if (scoreA === 30 || scoreB === 30) {
          setWinner = scoreA === 30 ? "A" : "B";
        }

        if (setWinner) {
          if (setWinner === "A") setsWonA++;
          else setsWonB++;

          // Reset scores for next set
          scoreA = 0;
          scoreB = 0;

          // Winner of previous serves next set
          currentServer = setWinner;

          // Reset positions for new set?
          // BWF Rules: Players change ends.
          // Logically, the serving team member who served last stays?
          // Or strictly: Winner serves. We reset formations?
          // Let's reset to "Index 0 in Right" for simplicity unless we want to track physical player movement.
          // Resetting is safer for UX so it doesn't get confusing.
          teamAPlayerInRight = 0;
          teamBPlayerInRight = 0;

          // Check match winner
          if (setsWonA === 2) matchWinner = "A";
          else if (setsWonB === 2) matchWinner = "B";
          else currentSet++;
        }

        return {
          scoreA,
          scoreB,
          setsWonA,
          setsWonB,
          currentSet,
          matchWinner,
          currentServer,
          gameType,
          teamAPlayerInRight,
          teamBPlayerInRight,
        };
      });
    },
    [state.matchWinner],
  );

  const undo = useCallback(() => {
    if (history.length === 0) return;

    const previousState = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setState(previousState);
  }, [history]);

  const resetMatch = useCallback(
    (
      newInitialServer: Player = "A",
      type: GameType = "singles",
      newInitialIndex: number = 0,
    ) => {
      setHistory([]);
      setState({
        scoreA: 0,
        scoreB: 0,
        setsWonA: 0,
        setsWonB: 0,
        currentSet: 1,
        matchWinner: null,
        currentServer: newInitialServer,
        gameType: type,
        teamAPlayerInRight: newInitialServer === "A" ? newInitialIndex : 0,
        teamBPlayerInRight: newInitialServer === "B" ? newInitialIndex : 0,
      });
    },
    [],
  );

  return {
    ...state,
    history,
    incrementScore,
    undo,
    resetMatch,
  };
};
