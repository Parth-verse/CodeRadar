import React, { useState } from 'react';

/**
 * Signature CodeRadar Hexagonal Radar Chart
 * Visualizes the 6 primary health dimensions: Bugs, Security, Quality, Testing, Dependencies, Architecture
 */
export default function RadarChart({ scores = {}, onCategoryClick }) {
  const [hoveredAxis, setHoveredAxis] = useState(null);

  const categories = [
    { key: 'bugs', label: 'Bugs', icon: '🐛', score: scores.bugs || 82, color: '#F85149' },
    { key: 'security', label: 'Security', icon: '🔐', score: scores.security || 76, color: '#D29922' },
    { key: 'quality', label: 'Quality', icon: '🧹', score: scores.quality || 71, color: '#58A6FF' },
    { key: 'testing', label: 'Testing', icon: '🧪', score: scores.testing || 43, color: '#F85149' },
    { key: 'dependencies', label: 'Dependencies', icon: '📦', score: scores.dependencies || 84, color: '#3FB950' },
    { key: 'architecture', label: 'Architecture', icon: '🏗', score: scores.architecture || 79, color: '#58A6FF' },
  ];

  const size = 320;
  const center = size / 2;
  const radius = 110;
  const levels = [0.25, 0.5, 0.75, 1.0];

  const numAxes = categories.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // Compute point for a given axis and value (0-100)
  const getCoordinates = (index, value) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Polygon points string for the data
  const dataPoints = categories.map((cat, i) => {
    const { x, y } = getCoordinates(i, cat.score);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-[#111820] border border-[#21262D] rounded-xl">
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#58A6FF] animate-pulse" />
          <h3 className="text-sm font-semibold tracking-wider uppercase text-[#E6EDF3]">Repository Radar</h3>
        </div>
        <span className="text-xs text-[#8B949E]">Click category to filter</span>
      </div>

      <svg width={size} height={size} className="overflow-visible select-none my-2">
        {/* Radar concentric web rings */}
        {levels.map((level, lvlIdx) => {
          const ringPoints = categories.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const r = level * radius;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(' ');

          return (
            <polygon
              key={`ring-${lvlIdx}`}
              points={ringPoints}
              fill="none"
              stroke="#21262D"
              strokeWidth="1"
              strokeDasharray={lvlIdx === 3 ? "none" : "3,3"}
            />
          );
        })}

        {/* Spokes / Axis lines */}
        {categories.map((cat, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const outerX = center + radius * Math.cos(angle);
          const outerY = center + radius * Math.sin(angle);
          const isHovered = hoveredAxis === cat.key;

          return (
            <line
              key={`spoke-${i}`}
              x1={center}
              y1={center}
              x2={outerX}
              y2={outerY}
              stroke={isHovered ? "#58A6FF" : "#30363D"}
              strokeWidth={isHovered ? "2" : "1"}
            />
          );
        })}

        {/* Shaded Data Polygon Area */}
        <polygon
          points={dataPoints}
          fill="rgba(88, 166, 255, 0.22)"
          stroke="#58A6FF"
          strokeWidth="2.5"
          className="transition-all duration-300 filter drop-shadow-[0_0_8px_rgba(88,166,255,0.3)]"
        />

        {/* Interactive Data Vertices & Tooltips */}
        {categories.map((cat, i) => {
          const { x, y } = getCoordinates(i, cat.score);
          const angle = i * angleStep - Math.PI / 2;
          const labelDist = radius + 32;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);
          const isHovered = hoveredAxis === cat.key;

          return (
            <g
              key={`vertex-${cat.key}`}
              className="cursor-pointer group"
              onMouseEnter={() => setHoveredAxis(cat.key)}
              onMouseLeave={() => setHoveredAxis(null)}
              onClick={() => onCategoryClick && onCategoryClick(cat.key)}
            >
              {/* Vertex Circle */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 6 : 4.5}
                fill={cat.score >= 80 ? "#3FB950" : cat.score >= 65 ? "#D29922" : "#F85149"}
                stroke="#0B0F14"
                strokeWidth="2"
                className="transition-all duration-200"
              />

              {/* Axis Label */}
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isHovered ? "#58A6FF" : "#E6EDF3"}
                fontSize="11"
                fontWeight={isHovered ? "600" : "500"}
                className="transition-colors"
              >
                {cat.icon} {cat.label}
              </text>
              <text
                x={lx}
                y={ly + 13}
                textAnchor="middle"
                dominantBaseline="central"
                fill={cat.score >= 80 ? "#3FB950" : cat.score >= 65 ? "#D29922" : "#F85149"}
                fontSize="10"
                fontFamily="ui-monospace, monospace"
                fontWeight="bold"
              >
                {cat.score}/100
              </text>
            </g>
          );
        })}

        {/* Center Bullseye */}
        <circle cx={center} cy={center} r="3" fill="#30363D" />
      </svg>

      <div className="w-full mt-1 pt-3 border-t border-[#21262D] grid grid-cols-3 gap-2 text-center text-xs">
        {categories.map(c => (
          <button
            key={c.key}
            onClick={() => onCategoryClick && onCategoryClick(c.key)}
            className="flex items-center justify-between px-2 py-1 rounded bg-[#161E27] hover:bg-[#21262D] transition border border-transparent hover:border-[#30363D]"
          >
            <span className="text-[#8B949E] text-[11px] truncate">{c.icon} {c.label}</span>
            <span className={`font-mono font-medium text-[11px] ${c.score >= 80 ? 'text-[#3FB950]' : c.score >= 65 ? 'text-[#D29922]' : 'text-[#F85149]'}`}>
              {c.score}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
