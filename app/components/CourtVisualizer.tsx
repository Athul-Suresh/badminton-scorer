"use client";

import { GameType } from "../hooks/useBadmintonGame";

interface CourtVisualizerProps {
  server: "A" | "B";
  scoreA: number;
  scoreB: number;
  matchWinner: "A" | "B" | null;
  gameType: GameType;
  teamAPlayerInRight: number;
  teamBPlayerInRight: number;
  teamANames: string[];
  teamBNames: string[];
}

export default function CourtVisualizer({
  server,
  scoreA,
  scoreB,
  matchWinner,
  gameType,
  teamAPlayerInRight,
  teamBPlayerInRight,
  teamANames,
  teamBNames,
}: CourtVisualizerProps) {
  // Dimensions (Standard approximation)
  const width = 1340;
  const height = 610;
  const padding = 50;

  const courtX = padding;
  const courtY = padding;
  const courtW = 1340;
  const courtH = 610;
  const centerX = width / 2;
  const centerY = height / 2;
  const netX = courtX + 670;

  // Dimensions
  // Short Service Line: 1.98m from net (approx 198 units)
  const shortServiceOffset = 198;
  // Doubles Long Service Line: 0.76m from back (76 units)
  const doublesLongServiceOffset = 76;
  // Singles Side Line: 0.46m from side (46 units)
  const singlesSideOffset = 46;

  const isServerA = server === "A";
  const serverScore = isServerA ? scoreA : scoreB;
  const isEven = serverScore % 2 === 0;

  let activeBox = null;

  // Logic for Active Service Box (The SERVER'S Box)
  // We highlight where the server stands/serves from.
  if (!matchWinner) {
    let xStart = 0,
      xEnd = 0,
      yStart = 0,
      yEnd = 0;

    // 1. Determine Side (Left/Right)
    const isLeftSide = isServerA; // Highlight Server Side

    // 2. Determine Quadrant based on Score
    // Team A (Left):
    //   Even -> Right Service Court (Bottom).
    //   Odd -> Left Service Court (Top).
    // Team B (Right Facing Left):
    //   Even -> Right Service Court (Top).
    //   Odd -> Left Service Court (Bottom).

    let isTopQuadrant = false;

    if (isServerA) {
      // A (Left): Even is Bottom (Right Court), Odd is Top (Left Court)
      isTopQuadrant = !isEven;
    } else {
      // B (Right): Even is Top (Right Court), Odd is Bottom (Left Court)
      isTopQuadrant = isEven;
    }

    // 3. Determine Box Boundaries based on Singles/Doubles
    // Highlighting the Server's box implies the area they serve *from*.

    if (isLeftSide) {
      // A's Side
      xStart =
        gameType === "singles" ? courtX : courtX + doublesLongServiceOffset;
      xEnd = netX - shortServiceOffset;
    } else {
      // B's Side
      xStart = netX + shortServiceOffset;
      xEnd =
        gameType === "singles"
          ? courtX + courtW
          : courtX + courtW - doublesLongServiceOffset;
    }

    if (isTopQuadrant) {
      yStart = courtY;
      yEnd = courtY + centerY;
    } else {
      yStart = courtY + centerY;
      yEnd = courtY + courtH;
    }

    // Width constraint for Singles (Side lines)
    if (gameType === "singles") {
      if (isTopQuadrant) yStart += singlesSideOffset;
      else yEnd -= singlesSideOffset;
    }

    activeBox = { x: xStart, y: yStart, w: xEnd - xStart, h: yEnd - yStart };
  }

  // Define Styles
  const bgColor = "#10b981"; // Emerald 500
  const lineColor = "white";
  const lineWidth = 6;

  // Player Dots Helper
  const getPlayerPosition = (team: "A" | "B", index: number) => {
    // Position X:
    //   Team A (Left Side): approx 1/4 of court width.
    //   Team B (Right Side): approx 3/4 of court width.
    const baseX =
      team === "A" ? courtX + courtW / 4 : courtX + (courtW * 3) / 4;

    let isRightCourt = false;
    if (team === "A") {
      isRightCourt = index === teamAPlayerInRight;
    } else {
      isRightCourt = index === teamBPlayerInRight;
    }

    // For A: Right is Bottom. Left is Top.
    // For B: Right is Top. Left is Bottom.
    let isBottom = false;
    if (team === "A")
      isBottom = isRightCourt; // A Right is Bottom
    else isBottom = !isRightCourt; // B Right is Top. So Not Right (Left) is Bottom.

    const baseY = isBottom
      ? centerY + padding + courtH / 4
      : padding + courtH / 4;

    return { cx: baseX, cy: baseY, isBottom };
  };

  const renderPlayer = (team: "A" | "B", index: number, name: string) => {
    const { cx, cy } = getPlayerPosition(team, index);
    // Differentiate colors nicely
    const fillColor =
      team === "A"
        ? index === 0
          ? "blue"
          : "#60a5fa"
        : index === 0
          ? "red"
          : "#f87171";

    return (
      <g key={`${team}${index}`}>
        <circle
          cx={cx}
          cy={cy}
          r="20"
          fill={fillColor}
          stroke="white"
          strokeWidth="2"
        />
        <text
          x={cx}
          y={cy + 40} // Below dot
          textAnchor="middle"
          fill="white"
          fontSize="24"
          fontWeight="bold"
          style={{ textShadow: "0px 1px 3px rgba(0,0,0,0.8)" }}
        >
          {name}
        </text>
      </g>
    );
  };

  const renderPlayers = () => {
    const players = [];

    if (gameType === "singles") {
      // Singles: 1 player per side.

      // A
      const isARight = scoreA % 2 === 0; // Even -> Right (Bottom)
      const posA = isARight
        ? centerY + padding + courtH / 4
        : padding + courtH / 4;
      players.push(
        <g key="A">
          <circle
            cx={courtX + courtW / 4}
            cy={posA}
            r="20"
            fill="blue"
            stroke="white"
            strokeWidth="2"
          />
          <text
            x={courtX + courtW / 4}
            y={posA + 40}
            textAnchor="middle"
            fill="white"
            fontSize="24"
            fontWeight="bold"
            style={{ textShadow: "0px 1px 3px rgba(0,0,0,0.8)" }}
          >
            {teamANames[0] || "Player A"}
          </text>
        </g>,
      );

      // B
      const isBRight = scoreB % 2 === 0; // Even -> Right (Top)
      const posB = isBRight
        ? padding + courtH / 4
        : centerY + padding + courtH / 4;
      players.push(
        <g key="B">
          <circle
            cx={courtX + (courtW * 3) / 4}
            cy={posB}
            r="20"
            fill="red"
            stroke="white"
            strokeWidth="2"
          />
          <text
            x={courtX + (courtW * 3) / 4}
            y={posB + 40}
            textAnchor="middle"
            fill="white"
            fontSize="24"
            fontWeight="bold"
            style={{ textShadow: "0px 1px 3px rgba(0,0,0,0.8)" }}
          >
            {teamBNames[0] || "Player B"}
          </text>
        </g>,
      );
    } else {
      // Doubles
      players.push(renderPlayer("A", 0, teamANames[0] || "A1"));
      players.push(renderPlayer("A", 1, teamANames[1] || "A2"));
      players.push(renderPlayer("B", 0, teamBNames[0] || "B1"));
      players.push(renderPlayer("B", 1, teamBNames[1] || "B2"));
    }

    return players;
  };

  return (
    <div className="w-full flex items-center justify-center py-4 bg-zinc-900 border-t border-b border-zinc-800">
      <div className="w-full max-w-[500px] aspect-[2.2/1] relative">
        <svg
          viewBox={`0 0 ${width + padding * 2} ${height + padding * 2}`}
          className="w-full h-full drop-shadow-lg select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Court Background */}
          <rect
            x={courtX}
            y={courtY}
            width={courtW}
            height={courtH}
            fill={bgColor}
          />

          {/* Highlight Active Box (Server's Box) */}
          {activeBox && (
            <rect
              x={activeBox.x}
              y={activeBox.y}
              width={activeBox.w}
              height={activeBox.h}
              fill="#fbbf24"
              className="animate-pulse opacity-50"
            />
          )}

          {/* Outer Boundary Lines */}
          <rect
            x={courtX}
            y={courtY}
            width={courtW}
            height={courtH}
            fill="none"
            stroke={lineColor}
            strokeWidth={lineWidth}
          />

          {/* Singles Side Lines (Inner horizontal lines) */}
          <line
            x1={courtX}
            y1={courtY + singlesSideOffset}
            x2={courtX + courtW}
            y2={courtY + singlesSideOffset}
            stroke={lineColor}
            strokeWidth={lineWidth}
            opacity={gameType === "singles" ? 1 : 0.5}
          />
          <line
            x1={courtX}
            y1={courtY + courtH - singlesSideOffset}
            x2={courtX + courtW}
            y2={courtY + courtH - singlesSideOffset}
            stroke={lineColor}
            strokeWidth={lineWidth}
            opacity={gameType === "singles" ? 1 : 0.5}
          />

          {/* Back Service Lines (Doubles) */}
          <line
            x1={courtX + doublesLongServiceOffset}
            y1={courtY}
            x2={courtX + doublesLongServiceOffset}
            y2={courtY + courtH}
            stroke={lineColor}
            strokeWidth={lineWidth}
            opacity={gameType === "doubles" ? 1 : 0.5}
          />
          <line
            x1={courtX + courtW - doublesLongServiceOffset}
            y1={courtY}
            x2={courtX + courtW - doublesLongServiceOffset}
            y2={courtY + courtH}
            stroke={lineColor}
            strokeWidth={lineWidth}
            opacity={gameType === "doubles" ? 1 : 0.5}
          />

          {/* Short Service Lines (Near Net) */}
          <line
            x1={netX - shortServiceOffset}
            y1={courtY}
            x2={netX - shortServiceOffset}
            y2={courtY + courtH}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
          <line
            x1={netX + shortServiceOffset}
            y1={courtY}
            x2={netX + shortServiceOffset}
            y2={courtY + courtH}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />

          {/* Center Line */}
          <line
            x1={courtX}
            y1={centerY + padding}
            x2={netX - shortServiceOffset}
            y2={centerY + padding}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
          <line
            x1={netX + shortServiceOffset}
            y1={centerY + padding}
            x2={courtX + courtW}
            y2={centerY + padding}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />

          {/* The Net */}
          <line
            x1={netX}
            y1={padding - 20}
            x2={netX}
            y2={padding + courtH + 20}
            stroke="black"
            strokeWidth={8}
            strokeDasharray="10,5"
          />

          {renderPlayers()}

          {/* Shuttle Icon */}
          {activeBox && (
            <text
              x={activeBox.x + activeBox.w / 2}
              y={activeBox.y + activeBox.h / 2 + 10}
              textAnchor="middle"
              fontSize="30"
              className="animate-bounce"
            >
              🏸
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}
