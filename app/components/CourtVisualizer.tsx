"use client";

interface CourtVisualizerProps {
  server: "A" | "B";
  scoreA: number;
  scoreB: number;
  matchWinner: "A" | "B" | null;
}

export default function CourtVisualizer({
  server,
  scoreA,
  scoreB,
  matchWinner,
}: CourtVisualizerProps) {
  // Dimensions (Standard approximation)
  const width = 1340;
  const height = 610;
  const padding = 50;

  // Lines relative to center
  const centerX = width / 2;
  const centerY = height / 2;
  const shortServiceDist = 198; // 1.98m from net
  const longServiceDoublesDist = 396; // 0.76m from back (back is 6.7m from net - 0.76 = 5.94? No. Back boundary is 6.7m. Long service doubles is 0.76m shorter.)
  // Actually simpler:
  // Net at 0.
  // Short Service Line: +/- 198
  // Back Boundary: +/- 670
  // Doubles Long Service: +/- 594 (670 - 76)
  // Side Lines: +/- 305 (width/2) and +/- 259 (Singles width/2 = 5.18m / 2)

  // Let's use coordinate system: 0,0 at top-left of SVG.
  // Court starts at padding, padding.
  // Total Court: 1340 x 610

  const courtX = padding;
  const courtY = padding;
  const courtW = 1340;
  const courtH = 610;

  // Net is at x = padding + 670
  const netX = courtX + 670;

  // Logic for Active Box
  // Team A (Left Side)
  // Even: Bottom-Left (Right Service Court) -> x:[0, net-198], y:[centerY, height]
  // Odd: Top-Left (Left Service Court) -> x:[0, net-198], y:[0, centerY]

  // Team B (Right Side)
  // Even: Top-Right (Right Service Court - facing net) -> x:[net+198, end], y:[0, centerY]
  // Wait, if B is on Right, facing Left (Net):
  // Right hand is Top of screen. So Top-Right quadrant.
  // Odd: Bottom-Right -> x:[net+198, end], y:[centerY, height]

  const isServerA = server === "A";
  const serverScore = isServerA ? scoreA : scoreB;
  const isEven = serverScore % 2 === 0;

  let activeBox = null;

  if (!matchWinner) {
    if (isServerA) {
      // Left Side
      if (isEven) {
        // Bottom-Left
        activeBox = { x: courtX, y: centerY + padding, w: 670 - 198, h: 305 }; // Approx
      } else {
        // Top-Left
        activeBox = { x: courtX, y: padding, w: 670 - 198, h: 305 };
      }
    } else {
      // Right Side
      if (isEven) {
        // Top-Right
        activeBox = { x: netX + 198, y: padding, w: 670 - 198, h: 305 };
      } else {
        // Bottom-Right
        activeBox = {
          x: netX + 198,
          y: centerY + padding,
          w: 670 - 198,
          h: 305,
        };
      }
    }
  }

  // Define Styles
  const bgColor = "#10b981"; // Emerald 500
  const lineColor = "white";
  const lineWidth = 6;

  return (
    <div className="w-full flex items-center justify-center py-4 bg-zinc-900 border-t border-b border-zinc-800">
      <div className="w-full max-w-[500px] aspect-[2.2/1] relative">
        <svg
          viewBox={`0 0 ${width + padding * 2} ${height + padding * 2}`}
          className="w-full h-full drop-shadow-lg"
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

          {/* Highlight Active Box */}
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

          {/* Singles Side Lines (Inner horizontal lines if landscape?) No, vertical in SVG coords? */}
          {/* Side lines are Y-axis restrictions. 6.1m vs 5.18m. Diff is 0.46m per side = 46 units */}
          <line
            x1={courtX}
            y1={courtY + 46}
            x2={courtX + courtW}
            y2={courtY + 46}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
          <line
            x1={courtX}
            y1={courtY + courtH - 46}
            x2={courtX + courtW}
            y2={courtY + courtH - 46}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />

          {/* Back Service Lines (Doubles) - Vertical lines near back */}
          {/* 76 units from back */}
          <line
            x1={courtX + 76}
            y1={courtY}
            x2={courtX + 76}
            y2={courtY + courtH}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
          <line
            x1={courtX + courtW - 76}
            y1={courtY}
            x2={courtX + courtW - 76}
            y2={courtY + courtH}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />

          {/* Short Service Lines (Near Net) */}
          {/* 198 units from Net (Center) */}
          <line
            x1={netX - 198}
            y1={courtY}
            x2={netX - 198}
            y2={courtY + courtH}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
          <line
            x1={netX + 198}
            y1={courtY}
            x2={netX + 198}
            y2={courtY + courtH}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />

          {/* Center Line (dividing Left/Right service courts) */}
          {/* From Short Service to Back Boundary */}
          <line
            x1={courtX}
            y1={centerY + padding}
            x2={netX - 198}
            y2={centerY + padding}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
          <line
            x1={netX + 198}
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

          {/* Player Icon / Shuttle */}
          {activeBox && (
            <g
              transform={`translate(${activeBox.x + activeBox.w / 2}, ${activeBox.y + activeBox.h / 2})`}
            >
              <circle r="30" fill="white" stroke="black" strokeWidth="2" />
              <text y="10" textAnchor="middle" fontSize="20" fontWeight="bold">
                🏸
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
