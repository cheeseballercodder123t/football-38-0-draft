import React, { useState } from 'react';
import { HexagonSkills } from '../types/football';
import { Sparkles, Info, Shield, Target, Zap, Activity } from 'lucide-react';

interface HexagonSkillGraphProps {
  skills: HexagonSkills;
  comparisonSkills?: HexagonSkills;
  label?: string;
  comparisonLabel?: string;
  size?: number; // width/height in px, defaults to 340
  showTooltips?: boolean;
  accentColor?: 'emerald' | 'amber' | 'purple' | 'cyan';
}

const AXES: {
  key: keyof Omit<HexagonSkills, 'overallIndex'>;
  label: string;
  shortLabel: string;
  description: string;
  angleDeg: number;
}[] = [
  {
    key: 'finishing',
    label: 'Finishing',
    shortLabel: 'FIN',
    description: 'Box lethality, clinical conversion, shot power & composure',
    angleDeg: -90, // Top
  },
  {
    key: 'creation',
    label: 'Creation',
    shortLabel: 'CRE',
    description: 'Vision, key passes, assist threat & incisive through-balls',
    angleDeg: -30, // Top Right
  },
  {
    key: 'carrying',
    label: 'Carrying',
    shortLabel: 'CAR',
    description: 'Progressive ball carries, 1v1 take-ons & press resistance',
    angleDeg: 30, // Bottom Right
  },
  {
    key: 'physicality',
    label: 'Physicality',
    shortLabel: 'PHY',
    description: 'Aerial dominance, duel win rate, stamina & recovery engine',
    angleDeg: 90, // Bottom
  },
  {
    key: 'defense',
    label: 'Defense',
    shortLabel: 'DEF',
    description: 'Tackle timing, interceptions, spatial coverage & clean sheets',
    angleDeg: 150, // Bottom Left
  },
  {
    key: 'buildUp',
    label: 'Build-Up',
    shortLabel: 'BLD',
    description: 'Passing circulation, possession retention & tempo dictation',
    angleDeg: -150, // Top Left
  },
];

function getGrade(val: number): { text: string; color: string } {
  if (val >= 92) return { text: 'S+', color: 'text-amber-300 bg-amber-950/80 border-amber-500/60' };
  if (val >= 88) return { text: 'S', color: 'text-emerald-300 bg-emerald-950/80 border-emerald-500/60' };
  if (val >= 84) return { text: 'A+', color: 'text-cyan-300 bg-cyan-950/80 border-cyan-500/60' };
  if (val >= 80) return { text: 'A', color: 'text-blue-300 bg-blue-950/80 border-blue-500/60' };
  if (val >= 75) return { text: 'B+', color: 'text-purple-300 bg-purple-950/80 border-purple-500/60' };
  return { text: 'B', color: 'text-slate-300 bg-slate-900 border-slate-700' };
}

export function HexagonSkillGraph({
  skills,
  comparisonSkills,
  label = 'Squad Hexagon',
  comparisonLabel = 'Opponent',
  size = 340,
  showTooltips = true,
  accentColor = 'emerald',
}: HexagonSkillGraphProps) {
  const [selectedAxis, setSelectedAxis] = useState<typeof AXES[number] | null>(null);

  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.36; // leave room for outer labels

  // Helper to convert polar to cartesian
  const getCoordinates = (angleDeg: number, radius: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  // Generate SVG polygon string for a given skills object
  const getPolygonPoints = (s: HexagonSkills) => {
    return AXES.map(axis => {
      const val = s[axis.key];
      const r = (val / 100) * maxRadius;
      const pt = getCoordinates(axis.angleDeg, r);
      return `${pt.x},${pt.y}`;
    }).join(' ');
  };

  // Concentric rings (20%, 40%, 60%, 80%, 100%)
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  const primaryPoints = getPolygonPoints(skills);
  const comparisonPoints = comparisonSkills ? getPolygonPoints(comparisonSkills) : null;

  return (
    <div className="relative flex flex-col items-center select-none font-mono">
      {/* Top Banner with Composite OVR */}
      <div className="flex items-center justify-between w-full max-w-[340px] px-2 mb-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-black uppercase text-slate-200 tracking-wider">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-950/90 border border-emerald-500/60 shadow-xs">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span className="text-xs font-black text-emerald-300">
            {skills.overallIndex} <span className="text-[10px] text-emerald-400 font-medium">INDEX</span>
          </span>
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          <defs>
            {/* Neon Glow Filter */}
            <filter id="radar-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="opp-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Gradients */}
            <radialGradient id="primary-radar-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.10" />
            </radialGradient>

            <radialGradient id="opp-radar-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.40" />
              <stop offset="100%" stopColor="#e11d48" stopOpacity="0.08" />
            </radialGradient>
          </defs>

          {/* Background Concentric Hexagon Grid Rings */}
          {rings.map((factor, idx) => {
            const ringPts = AXES.map(a => {
              const pt = getCoordinates(a.angleDeg, maxRadius * factor);
              return `${pt.x},${pt.y}`;
            }).join(' ');

            return (
              <polygon
                key={idx}
                points={ringPts}
                fill="none"
                stroke={factor === 1.0 ? '#334155' : '#1e293b'}
                strokeWidth={factor === 1.0 ? 1.5 : 1}
                strokeDasharray={factor < 1.0 ? '3 3' : 'none'}
              />
            );
          })}

          {/* Radiating Axis Spokes */}
          {AXES.map((axis, idx) => {
            const pt = getCoordinates(axis.angleDeg, maxRadius);
            return (
              <line
                key={idx}
                x1={cx}
                y1={cy}
                x2={pt.x}
                y2={pt.y}
                stroke="#334155"
                strokeWidth={1}
                strokeDasharray="2 2"
              />
            );
          })}

          {/* Comparison Polygon (if present) */}
          {comparisonPoints && (
            <polygon
              points={comparisonPoints}
              fill="url(#opp-radar-grad)"
              stroke="#fb7185"
              strokeWidth={2}
              strokeDasharray="4 3"
              filter="url(#opp-glow)"
              className="transition-all duration-300"
            />
          )}

          {/* Primary Squad / Player Polygon */}
          <polygon
            points={primaryPoints}
            fill="url(#primary-radar-grad)"
            stroke="#10b981"
            strokeWidth={2.5}
            filter="url(#radar-glow)"
            className="transition-all duration-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]"
          />

          {/* Glowing Vertex Data Points */}
          {AXES.map((axis, idx) => {
            const val = skills[axis.key];
            const r = (val / 100) * maxRadius;
            const pt = getCoordinates(axis.angleDeg, r);

            return (
              <g key={idx} className="cursor-pointer" onClick={() => setSelectedAxis(axis)}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={5.5}
                  fill="#022c22"
                  stroke="#34d399"
                  strokeWidth={2}
                  className="transition-all hover:scale-125"
                />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={2}
                  fill="#ffffff"
                />
              </g>
            );
          })}

          {/* Outer Vertex Badges */}
          {AXES.map((axis, idx) => {
            const val = skills[axis.key];
            const grade = getGrade(val);
            // Position label outside the maximum radius
            const labelDist = maxRadius + 32;
            const pt = getCoordinates(axis.angleDeg, labelDist);

            return (
              <g
                key={idx}
                transform={`translate(${pt.x}, ${pt.y})`}
                className="cursor-pointer select-none"
                onClick={() => setSelectedAxis(axis)}
              >
                {/* Metric Title */}
                <text
                  x={0}
                  y={-7}
                  textAnchor="middle"
                  className="text-[10px] font-black uppercase fill-slate-300 tracking-wider hover:fill-emerald-300 transition-colors"
                >
                  {axis.shortLabel}
                </text>

                {/* Score & Grade */}
                <text
                  x={0}
                  y={6}
                  textAnchor="middle"
                  className="text-[11px] font-black fill-emerald-400 tracking-tight"
                >
                  {val} <tspan className="text-[9px] fill-amber-300">({grade.text})</tspan>
                </text>
              </g>
            );
          })}
        </svg>

        {/* Center Bullseye Badge */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-10 h-10 rounded-full bg-slate-950/80 border border-emerald-500/40 backdrop-blur-xs flex items-center justify-center shadow-lg"
        >
          <Activity className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* Comparison Legend if enabled */}
      {comparisonSkills && (
        <div className="flex items-center gap-4 text-[10px] mt-1 font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shadow-[0_0_6px_#10b981]" />
            <span className="text-emerald-300">{label} ({skills.overallIndex})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
            <span className="text-rose-300">{comparisonLabel} ({comparisonSkills.overallIndex})</span>
          </div>
        </div>
      )}

      {/* Interactive Tooltip Card for Selected Axis */}
      {showTooltips && selectedAxis && (
        <div className="mt-2.5 p-3 rounded-xl bg-[#0f1723] border border-emerald-500/50 shadow-xl max-w-[320px] w-full text-center animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between text-xs font-black text-white">
            <span className="text-emerald-400 uppercase tracking-wide">
              {selectedAxis.label} · {skills[selectedAxis.key]} / 99
            </span>
            <button
              onClick={() => setSelectedAxis(null)}
              className="text-slate-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 leading-snug font-sans">
            {selectedAxis.description}
          </p>
        </div>
      )}
    </div>
  );
}
