import React, { useMemo } from 'react';
import { Formation, FormationName, Player, GameDifficulty, PlayerFormArrow, SetPieceTakers } from '../types/football';
import { calculateTeamChemistry, calculateLaserChemistryLinks } from '../engine/chemistryEngine';
import { calculatePositionFit } from '../engine/positionEngine';
import { getShortDisplayName } from '../utils/nameUtils';
import { Lock, Sparkles, Flame, ArrowUpDown, X, Check, Users, Shield, Zap } from 'lucide-react';

interface PitchViewProps {
  formation: Formation;
  draftedPlayers: (Player | null)[];
  bench?: (Player | null)[];
  difficulty: GameDifficulty;
  onSlotClick?: (index: number) => void;
  selectedSlotIndex?: number | null;
  swapSelection?: { type: 'starter' | 'bench'; index: number } | null;
  onSelectForSwap?: (type: 'starter' | 'bench', index: number) => void;
  onChangeFormation?: (fmt: FormationName) => void;
  swapNotice?: string | null;
  playerToAssign?: Player | null;
  onAssignToSlot?: (slotType: 'starter' | 'bench', slotIndex: number) => void;
  onCancelAssign?: () => void;
  playerFormMap?: Record<string, PlayerFormArrow>;
  setPieceTakers?: SetPieceTakers;
}

const PitchViewComponent: React.FC<PitchViewProps> = ({
  formation,
  draftedPlayers,
  bench = [],
  difficulty,
  onSlotClick,
  selectedSlotIndex,
  swapSelection,
  onSelectForSwap,
  onChangeFormation,
  swapNotice,
  playerToAssign,
  onAssignToSlot,
  onCancelAssign,
  playerFormMap,
  setPieceTakers,
}) => {
  const isExpert = difficulty === 'expert' || difficulty === 'super_expert';

  // Fast memoized team chemistry calculation
  const chemResult = useMemo(
    () => calculateTeamChemistry(draftedPlayers, formation),
    [draftedPlayers, formation]
  );
  const chemistry = chemResult.percentage;

  // Memoized laser chemistry links between pitch positions
  const laserLinks = useMemo(
    () => calculateLaserChemistryLinks(formation, draftedPlayers),
    [formation, draftedPlayers]
  );
  const filledPlayers = useMemo(
    () => draftedPlayers.filter((p): p is Player => p !== null),
    [draftedPlayers]
  );
  const activeAuraCount = useMemo(
    () => filledPlayers.filter(p => Boolean(p.auraTrait)).length,
    [filledPlayers]
  );

  const handleStarterClick = (index: number) => {
    if (playerToAssign) {
      const playerInSlot = draftedPlayers[index];
      // STRICT REQUIREMENT: Cannot draft into an occupied position
      if (playerInSlot !== null) return;

      const slot = formation.slots[index];
      const fit = calculatePositionFit(playerToAssign.specificPosition, slot.label);
      if (fit.tier === 'invalid') return;

      onAssignToSlot?.('starter', index);
      return;
    }

    if (onSelectForSwap) {
      onSelectForSwap('starter', index);
    } else if (onSlotClick) {
      onSlotClick(index);
    }
  };

  const handleBenchClick = (index: number) => {
    if (playerToAssign) {
      const subInSlot = bench[index];
      // STRICT REQUIREMENT: Cannot draft into an occupied bench slot
      if (subInSlot !== null) return;

      onAssignToSlot?.('bench', index);
      return;
    }

    if (onSelectForSwap) {
      onSelectForSwap('bench', index);
    } else if (onSlotClick) {
      onSlotClick(11 + index);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none font-sans">
      {/* Interactive Deploying Active Header Banner */}
      {playerToAssign && (
        <div className="w-full mb-3 p-3.5 bg-gradient-to-r from-[#0d2a1c] via-[#091f14] to-[#0d2a1c] border-2 border-emerald-400 rounded-2xl shadow-[0_0_24px_rgba(52,211,153,0.35)] flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-black text-slate-950 text-sm shadow-md shadow-emerald-950/80">
              {playerToAssign.specificPosition}
            </div>

            <div>
              <div className="text-sm font-black text-white flex items-center gap-2">
                <span>DEPLOYING: {playerToAssign.name}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/60 font-mono font-bold shadow-xs">
                  OVR {playerToAssign.overall}
                </span>
              </div>
              <div className="text-xs text-emerald-300/90 font-medium mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                  Natural (100%)
                </span>
                <span className="text-slate-500">·</span>
                <span className="flex items-center gap-1 text-cyan-300">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block"></span>
                  Proficient (-1 to -3)
                </span>
                <span className="text-slate-500">·</span>
                <span className="flex items-center gap-1 text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                  Adaptable
                </span>
              </div>
            </div>
          </div>

          {onCancelAssign && (
            <button
              onClick={onCancelAssign}
              className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-600/80 text-rose-200 font-bold text-xs transition-colors flex items-center gap-1 shadow-sm active:scale-95"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Top Controls: Formation Selector & Chem Stats */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between p-3 mb-2.5 bg-gradient-to-r from-[#141b26] to-[#101620] border border-slate-800 rounded-2xl gap-2 text-xs font-mono shadow-md">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" />
            FORMATION:
          </span>
          {onChangeFormation ? (
            <div className="flex items-center gap-1">
              {(['4-3-3', '4-2-3-1', '3-5-2', '4-4-2', '5-3-2'] as FormationName[]).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => onChangeFormation(fmt)}
                  className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all duration-150 ${
                    formation.name === fmt
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                      : 'bg-[#1b2332] text-slate-300 border border-slate-700/60 hover:text-white hover:border-slate-600'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          ) : (
            <span className="font-black text-emerald-400 text-sm">{formation.name}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Chemistry Meter */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#090d14] border border-slate-800 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 font-bold">CHEM:</span>
            <span
              className={`font-black ${
                chemistry >= 85
                  ? 'text-emerald-400'
                  : chemistry >= 60
                  ? 'text-amber-400'
                  : 'text-slate-400'
              }`}
            >
              {chemistry}%
            </span>
            <span className="text-[10px] text-slate-500 uppercase">({chemResult.tier})</span>
          </div>

          {/* Aura Count */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#090d14] border border-slate-800 shadow-inner">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 font-bold">AURAS:</span>
            <span className="font-black text-amber-400">{activeAuraCount}</span>
          </div>
        </div>
      </div>

      {/* Chemistry Active Synergy Highlights */}
      {chemResult.synergyHighlights.length > 0 && (
        <div className="w-full mb-2.5 px-3.5 py-1.5 bg-[#0b1c12] border border-emerald-500/40 rounded-xl font-mono text-[11px] text-emerald-300 flex items-center gap-2 overflow-x-auto shadow-sm">
          <span className="text-emerald-400 font-black uppercase text-[10px] tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            SYNERGIES:
          </span>
          {chemResult.synergyHighlights.map((hl, i) => (
            <span
              key={i}
              className="whitespace-nowrap px-2.5 py-0.5 bg-emerald-950/90 border border-emerald-500/40 rounded-md text-emerald-200 font-semibold shadow-xs"
            >
              {hl}
            </span>
          ))}
        </div>
      )}

      {/* Swap Status Bar if swap is in progress */}
      {swapSelection && (
        <div className="w-full mb-2.5 p-3 bg-gradient-to-r from-[#291b07] to-[#1c1204] border border-amber-500/80 rounded-xl text-amber-200 font-mono text-xs flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 font-bold">
            <ArrowUpDown className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>
              SWAPPING: {swapSelection.type.toUpperCase()} #{swapSelection.index + 1}
            </span>
          </div>
          <span className="text-[11px] text-amber-300/90 font-medium">Click position or bench to swap</span>
        </div>
      )}

      {/* Restriction Alert / Swap Notice */}
      {swapNotice && (
        <div className="w-full mb-2.5 p-3 bg-rose-950/90 border border-rose-600 text-rose-100 font-mono text-xs font-black text-center tracking-wider rounded-xl shadow-md">
          {swapNotice}
        </div>
      )}

      {/* ========================================================================= */}
      {/* DIVINE CHAMPIONS STADIUM PITCH (VOLUMETRIC FLOODLIGHTS & 3D TURF)         */}
      {/* ========================================================================= */}
      <div className="relative w-full aspect-[3/4] max-h-[600px] rounded-3xl overflow-hidden p-3.5 select-none border-4 border-[#144222] shadow-[0_20px_60px_rgba(0,0,0,0.95)] divine-turf">
        {/* Volumetric Corner Floodlight Cones */}
        <div className="absolute top-0 left-0 w-44 h-44 bg-gradient-to-br from-emerald-300/20 via-teal-400/8 to-transparent rounded-br-full blur-2xl pointer-events-none z-0" />
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-emerald-300/20 via-teal-400/8 to-transparent rounded-bl-full blur-2xl pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-gradient-to-tr from-emerald-300/18 via-teal-400/8 to-transparent rounded-tr-full blur-2xl pointer-events-none z-0" />
        <div className="absolute bottom-0 right-0 w-44 h-44 bg-gradient-to-tl from-emerald-300/18 via-teal-400/8 to-transparent rounded-tl-full blur-2xl pointer-events-none z-0" />

        {/* Pitch Outer Boundary Line */}
        <div className="absolute inset-3 border-2 border-emerald-300/50 rounded-2xl pointer-events-none shadow-[0_0_12px_rgba(52,211,153,0.2)]" />

        {/* Corner Arcs */}
        <div className="absolute top-3 left-3 w-4.5 h-4.5 border-b-2 border-r-2 border-emerald-300/50 rounded-br-full pointer-events-none" />
        <div className="absolute top-3 right-3 w-4.5 h-4.5 border-b-2 border-l-2 border-emerald-300/50 rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-4.5 h-4.5 border-t-2 border-r-2 border-emerald-300/50 rounded-tr-full pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-4.5 h-4.5 border-t-2 border-l-2 border-emerald-300/50 rounded-tl-full pointer-events-none" />

        {/* Goal Net Outlines */}
        <div className="absolute left-1/2 top-1.5 -translate-x-1/2 w-24 h-2.5 border border-emerald-300/40 bg-emerald-950/60 goal-net-pattern rounded-b-sm pointer-events-none shadow-sm" />
        <div className="absolute left-1/2 bottom-1.5 -translate-x-1/2 w-24 h-2.5 border border-emerald-300/40 bg-emerald-950/60 goal-net-pattern rounded-t-sm pointer-events-none shadow-sm" />

        {/* Halfway Line */}
        <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-[2px] bg-emerald-300/50 pointer-events-none shadow-[0_0_8px_rgba(52,211,153,0.25)]" />

        {/* Center Circle & Spot */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-emerald-300/50 pointer-events-none shadow-[0_0_14px_rgba(52,211,153,0.15)]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-300 pointer-events-none shadow-[0_0_8px_rgba(255,255,255,0.9)]" />

        {/* Top 18-Yard Box */}
        <div className="absolute left-1/2 top-3 -translate-x-1/2 w-52 h-26 border-2 border-t-0 border-emerald-300/50 rounded-b-xl pointer-events-none" />
        {/* Top 6-Yard Box */}
        <div className="absolute left-1/2 top-3 -translate-x-1/2 w-24 h-11 border border-t-0 border-emerald-300/45 rounded-b-lg pointer-events-none" />
        {/* Top Penalty Spot */}
        <div className="absolute left-1/2 top-18 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-300/90 pointer-events-none" />
        {/* Top Penalty "D" Arc */}
        <div className="absolute left-1/2 top-20 -translate-x-1/2 w-20 h-10 border-2 border-t-0 border-emerald-300/45 rounded-b-full pointer-events-none" />

        {/* Bottom 18-Yard Box */}
        <div className="absolute left-1/2 bottom-3 -translate-x-1/2 w-52 h-26 border-2 border-b-0 border-emerald-300/50 rounded-t-xl pointer-events-none" />
        {/* Bottom 6-Yard Box */}
        <div className="absolute left-1/2 bottom-3 -translate-x-1/2 w-24 h-11 border border-b-0 border-emerald-300/45 rounded-t-lg pointer-events-none" />
        {/* Bottom Penalty Spot */}
        <div className="absolute left-1/2 bottom-18 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-300/90 pointer-events-none" />
        {/* Bottom Penalty "D" Arc */}
        <div className="absolute left-1/2 bottom-20 -translate-x-1/2 w-20 h-10 border-2 border-b-0 border-emerald-300/45 rounded-t-full pointer-events-none" />

        {/* ======================================================================= */}
        {/* CHEMISTRY LASER CONNECTIONS ACROSS FORMATION NODES (HARDWARE-ACCELERATED) */}
        {/* ======================================================================= */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {laserLinks.map((link, idx) => {
            const isStrong = link.tier === 'strong';
            const isMedium = link.tier === 'medium';
            return (
              <g key={idx}>
                {/* Ambient Laser Halo Glow (Hardware accelerated, no SVG filter) */}
                {(isStrong || isMedium) && (
                  <line
                    x1={`${link.x1}%`}
                    y1={`${link.y1}%`}
                    x2={`${link.x2}%`}
                    y2={`${link.y2}%`}
                    stroke={link.color}
                    strokeWidth={isStrong ? '4.8' : '3.2'}
                    strokeOpacity={isStrong ? 0.35 : 0.20}
                    strokeLinecap="round"
                  />
                )}
                {/* Core Laser Beam */}
                <line
                  x1={`${link.x1}%`}
                  y1={`${link.y1}%`}
                  x2={`${link.x2}%`}
                  y2={`${link.y2}%`}
                  stroke={link.color}
                  strokeWidth={isStrong ? '2.0' : isMedium ? '1.5' : '0.9'}
                  strokeOpacity={isStrong ? 0.95 : isMedium ? 0.85 : 0.45}
                  strokeDasharray={isStrong ? '6 3' : isMedium ? '4 4' : '2 2'}
                  strokeLinecap="round"
                  className={isStrong ? 'animate-laser-flow' : undefined}
                />
              </g>
            );
          })}
        </svg>

        {/* ======================================================================= */}
        {/* FORMATION PLAYER SLOTS ON THE PITCH                                     */}
        {/* ======================================================================= */}
        {formation.slots.map((slot, index) => {
          const player = draftedPlayers[index];
          const isTargeted = selectedSlotIndex === index;
          const isSwapSource = swapSelection?.type === 'starter' && swapSelection?.index === index;
          const hasAura = Boolean(player?.auraTrait);

          // Evaluating slot states when playerToAssign is active
          const isOccupied = player !== null;
          const assignFit = playerToAssign && !isOccupied
            ? calculatePositionFit(playerToAssign.specificPosition, slot.label)
            : null;

          const isEligible = assignFit && assignFit.tier !== 'invalid';
          const isNaturalFit = assignFit?.tier === 'natural';
          const isProficient = assignFit?.tier === 'proficient';
          const isAdaptable = assignFit?.tier === 'adaptable';
          const isOOP = assignFit?.tier === 'out_of_position';

          // When player is already in slot, calculate fit & effective overall
          const playerFit = player
            ? calculatePositionFit(player.specificPosition, slot.label)
            : null;
          const hasPenalty = Boolean(playerFit && playerFit.penaltyOvr > 0);
          const effectiveOvr = player && playerFit
            ? Math.max(40, player.overall - playerFit.penaltyOvr)
            : player?.overall;

          return (
            <div
              key={slot.id}
              onClick={() => handleStarterClick(index)}
              style={{
                left: `${slot.gridX}%`,
                bottom: `${slot.gridY}%`,
                transform: 'translate(-50%, 50%)',
              }}
              className={`absolute flex flex-col items-center z-10 transition-transform duration-150 ${
                playerToAssign
                  ? isOccupied
                    ? 'opacity-35 pointer-events-none cursor-not-allowed scale-95'
                    : isEligible
                    ? 'cursor-pointer z-30 scale-105'
                    : 'opacity-15 pointer-events-none'
                  : 'cursor-pointer active:scale-95'
              }`}
            >
              {player ? (
                // Occupied Player Card on Pitch
                <div
                  className={`relative flex flex-col items-center justify-between w-14 h-16 sm:w-16 sm:h-18 rounded-2xl border p-1 transition-all duration-200 shadow-lg ${
                    isSwapSource
                      ? 'border-amber-400 bg-gradient-to-b from-[#3a270c] via-[#241706] to-[#140d03] ring-2 ring-amber-400 shadow-[0_0_22px_rgba(245,158,11,0.65)] scale-105'
                      : isTargeted
                      ? 'border-emerald-400 bg-gradient-to-b from-[#143521] via-[#0d2215] to-[#06110a] ring-2 ring-emerald-400 shadow-[0_0_22px_rgba(52,211,153,0.65)] scale-105'
                      : hasPenalty
                      ? 'border-amber-500/80 bg-gradient-to-b from-[#2a1f0f] via-[#1a1308] to-[#100b05] shadow-md'
                      : player.overall >= 90
                      ? 'border-amber-400/90 bg-gradient-to-b from-[#33250b] via-[#1c1405] to-[#120d03] shadow-[0_0_18px_rgba(245,158,11,0.4)] ring-1 ring-amber-400/50'
                      : player.overall >= 85
                      ? 'border-cyan-400/90 bg-gradient-to-b from-[#0f273d] via-[#081724] to-[#040e16] shadow-[0_0_16px_rgba(56,189,248,0.35)] ring-1 ring-cyan-400/50'
                      : 'border-slate-700/90 bg-gradient-to-b from-[#161f2c] via-[#0e141d] to-[#080c12] shadow-md'
                  }`}
                >
                  {/* Rating Badge */}
                  <div
                    className={`absolute -top-2.5 -right-1.5 px-1.5 py-0.5 text-[9px] font-mono font-black rounded-lg border shadow-md ${
                      isExpert
                        ? 'bg-[#18212f] text-slate-300 border-slate-600'
                        : hasPenalty
                        ? 'bg-amber-500 text-slate-950 border-amber-300 font-black'
                        : player.overall >= 90
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-amber-300 font-black shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                        : player.overall >= 85
                        ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 border-cyan-300 font-black shadow-[0_0_8px_rgba(56,189,248,0.4)]'
                        : 'bg-[#18212f] text-emerald-300 border-emerald-500/60'
                    }`}
                  >
                    {isExpert ? '?' : effectiveOvr}
                  </div>

                  {/* Dynamic Form Arrow Indicator */}
                  {playerFormMap && playerFormMap[player.id] && (
                    <div
                      className={`absolute -top-2.5 -left-1.5 px-1.5 py-0.5 rounded-lg font-black text-[9px] shadow-md flex items-center justify-center ${
                        playerFormMap[player.id] === 'up'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/80 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                          : playerFormMap[player.id] === 'down'
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/80'
                          : 'bg-slate-900 text-slate-300 border border-slate-700'
                      }`}
                      title={`Matchday Form: ${playerFormMap[player.id].toUpperCase()}`}
                    >
                      {playerFormMap[player.id] === 'up' ? '▲' : playerFormMap[player.id] === 'down' ? '▼' : '►'}
                    </div>
                  )}

                  {/* Position Pill & Fit Badge */}
                  <div className="flex items-center gap-0.5 text-[8px] font-mono font-black">
                    <span
                      className={`px-1 rounded-sm uppercase tracking-wider ${
                        player.position === 'GK'
                          ? 'bg-amber-400/20 text-amber-300'
                          : player.position === 'DEF'
                          ? 'bg-blue-400/20 text-blue-300'
                          : player.position === 'MID'
                          ? 'bg-emerald-400/20 text-emerald-300'
                          : 'bg-rose-400/20 text-rose-300'
                      }`}
                    >
                      {player.specificPosition}
                    </span>
                    {hasPenalty && playerFit && (
                      <span className="text-[7px] px-1 rounded bg-amber-950 text-amber-300 border border-amber-600/50 font-bold">
                        -{playerFit.penaltyOvr}
                      </span>
                    )}
                  </div>

                  {/* Player Name */}
                  <div className="text-[11px] font-black text-white truncate max-w-[54px] sm:max-w-[62px] leading-tight mt-0.5 text-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                    {getShortDisplayName(player.name)}
                  </div>

                  {/* Aura Indicator */}
                  {hasAura && !isExpert && (
                    <div className="absolute -bottom-1.5 -left-1 px-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[8px] font-black shadow-xs flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5 fill-current" />
                      AURA
                    </div>
                  )}

                  {/* Set-Piece Specialist Badges */}
                  {setPieceTakers && (
                    <div className="absolute -bottom-1.5 -right-1 flex items-center gap-0.5 z-20">
                      {setPieceTakers.penalty === player.id && (
                        <span className="px-1 py-[1px] rounded-md bg-amber-400 text-slate-950 text-[7px] font-black font-mono shadow-xs">
                          PK
                        </span>
                      )}
                      {setPieceTakers.freeKick === player.id && (
                        <span className="px-1 py-[1px] rounded-md bg-emerald-400 text-slate-950 text-[7px] font-black font-mono shadow-xs">
                          FK
                        </span>
                      )}
                      {setPieceTakers.corner === player.id && (
                        <span className="px-1 py-[1px] rounded-md bg-cyan-400 text-slate-950 text-[7px] font-black font-mono shadow-xs">
                          CR
                        </span>
                      )}
                    </div>
                  )}

                  {/* Locked slot overlay when deploying */}
                  {playerToAssign && (
                    <div className="absolute inset-0 bg-[#060a12]/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </div>
              ) : playerToAssign ? (
                // Deploying State: Slot Target Highlight
                isNaturalFit ? (
                  // PERFECT NATURAL FIT (0 Penalty)
                  <div className="relative flex flex-col items-center justify-center w-15 h-16 sm:w-17 sm:h-18 rounded-2xl border-3 border-emerald-400 bg-gradient-to-b from-[#0e331c] to-[#082012] shadow-[0_0_24px_rgba(52,211,153,0.7)] ring-4 ring-emerald-400/40 cursor-pointer animate-pulse">
                    <span className="absolute -top-3.5 px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-[8px] uppercase tracking-wider flex items-center gap-0.5 shadow-md">
                      <Check className="w-2.5 h-2.5" />
                      FIT
                    </span>
                    <span className="text-xs font-black text-emerald-100 tracking-wider">
                      {slot.label}
                    </span>
                    <span className="text-[8px] font-black text-emerald-300 uppercase">
                      100%
                    </span>
                  </div>
                ) : isProficient ? (
                  // PROFICIENT FIT (-1 to -4 OVR, e.g. RM at RW, CF at ST, LB at LWB)
                  <div className="relative flex flex-col items-center justify-center w-14 h-15 sm:w-16 sm:h-17 rounded-2xl border-2 border-cyan-400 bg-gradient-to-b from-[#0c2433] to-[#071720] shadow-[0_0_18px_rgba(56,189,248,0.5)] ring-2 ring-cyan-400/40 cursor-pointer">
                    <span className="absolute -top-3 px-1.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-black text-[7px] uppercase tracking-wider shadow-sm">
                      -{assignFit.penaltyOvr} OVR
                    </span>
                    <span className="text-xs font-black text-cyan-100 tracking-wider">
                      {slot.label}
                    </span>
                    <span className="text-[7px] font-mono text-cyan-300 uppercase font-bold">
                      PLAY
                    </span>
                  </div>
                ) : isAdaptable ? (
                  // ADAPTABLE FIT (-5 to -9 OVR)
                  <div className="relative flex flex-col items-center justify-center w-14 h-15 sm:w-16 sm:h-17 rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-[#301f09] to-[#1c1204] shadow-[0_0_18px_rgba(245,158,11,0.5)] ring-2 ring-amber-400/40 cursor-pointer">
                    <span className="absolute -top-3 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[7px] uppercase tracking-wider shadow-sm">
                      -{assignFit.penaltyOvr} OVR
                    </span>
                    <span className="text-xs font-black text-amber-100 tracking-wider">
                      {slot.label}
                    </span>
                    <span className="text-[7px] font-mono text-amber-300 uppercase font-bold">
                      ADAPT
                    </span>
                  </div>
                ) : isOOP ? (
                  // OUT OF POSITION (-10+ OVR)
                  <div className="relative flex flex-col items-center justify-center w-14 h-15 sm:w-16 sm:h-17 rounded-2xl border-2 border-rose-500 bg-gradient-to-b from-[#330c13] to-[#1f060a] shadow-[0_0_18px_rgba(244,63,94,0.5)] ring-2 ring-rose-500/40 cursor-pointer">
                    <span className="absolute -top-3 px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-[7px] uppercase tracking-wider shadow-sm">
                      -{assignFit.penaltyOvr} OVR
                    </span>
                    <span className="text-xs font-black text-rose-100 tracking-wider">
                      {slot.label}
                    </span>
                    <span className="text-[7px] font-mono text-rose-300 uppercase font-bold">
                      OOP
                    </span>
                  </div>
                ) : (
                  // Ineligible / Invalid
                  <div className="relative flex flex-col items-center justify-center w-12 h-13 rounded-2xl border border-dashed border-slate-700/40 opacity-20">
                    <span className="text-[8px] font-bold text-slate-500">{slot.label}</span>
                  </div>
                )
              ) : (
                // Empty Slot (Normal View)
                <div
                  className={`flex flex-col items-center justify-center w-14 h-15 sm:w-16 sm:h-17 rounded-2xl border-2 border-dashed transition-all duration-200 backdrop-blur-xs ${
                    isTargeted
                      ? 'border-emerald-400 bg-emerald-950/90 shadow-[0_0_20px_rgba(52,211,153,0.45)] ring-2 ring-emerald-400/50 scale-105'
                      : 'border-emerald-400/40 bg-[#0a1f14]/60 hover:border-emerald-400/90 hover:bg-[#0e2c1c]/80 hover:shadow-[0_0_14px_rgba(52,211,153,0.3)] hover:scale-105 shadow-sm'
                  }`}
                >
                  <span className="text-xs font-black text-emerald-200 tracking-wider drop-shadow-sm">
                    {slot.label}
                  </span>
                  <span className="text-[8px] font-mono text-emerald-400/90 uppercase font-black tracking-wider mt-0.5">
                    {slot.category}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* DUGOUT BENCH & RESERVES (STADIUM CANOPY STYLING)                          */}
      {/* ========================================================================= */}
      <div className="w-full mt-3.5 p-4 bg-gradient-to-r from-[#141b27] via-[#101622] to-[#141b27] border-2 border-slate-700/80 rounded-3xl font-mono shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none holo-sheen opacity-10" />

        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800 text-xs relative z-10 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-purple-950/80 border border-purple-500/50 text-purple-300 shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="text-white font-black uppercase tracking-wider text-[11px] truncate">
              DUGOUT BENCH & RESERVES
            </span>
            {playerToAssign && (
              <span className="text-[10px] text-purple-200 font-bold px-2 py-0.5 rounded-md bg-purple-950/90 border border-purple-500/60 shadow-xs animate-pulse truncate hidden xs:inline">
                Tap open slot
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-medium shrink-0 text-right">
            <span className="hidden sm:inline">
              {playerToAssign ? 'Select open bench slot' : 'Click to swap into Starting XI'}
            </span>
            <span className="sm:hidden">
              {playerToAssign ? 'Select slot' : 'Tap to swap'}
            </span>
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2 relative z-10">
          {bench.map((sub, idx) => {
            const isSwapSource = swapSelection?.type === 'bench' && swapSelection?.index === idx;
            const isTargeted = selectedSlotIndex === 11 + idx;
            const isOccupied = sub !== null;

            return (
              <div
                key={idx}
                onClick={() => handleBenchClick(idx)}
                className={`p-1 sm:p-2.5 rounded-2xl border text-center transition-all duration-200 shadow-md ${
                  playerToAssign
                    ? isOccupied
                      ? 'opacity-35 pointer-events-none cursor-not-allowed border-slate-800 bg-[#090d14]'
                      : 'border-2 border-purple-400 bg-purple-950/90 shadow-[0_0_18px_rgba(168,85,247,0.5)] cursor-pointer ring-2 ring-purple-400/40 animate-pulse scale-[1.02]'
                    : isSwapSource
                    ? 'border-amber-400 bg-[#301e08] ring-2 ring-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.5)] scale-[1.02]'
                    : isTargeted
                    ? 'border-emerald-400 bg-emerald-950/90 shadow-[0_0_18px_rgba(52,211,153,0.5)] scale-[1.02]'
                    : isOccupied
                    ? 'border-slate-700/80 bg-gradient-to-b from-[#182332] to-[#0e1622] hover:border-slate-500 hover:scale-[1.02] cursor-pointer'
                    : 'border-dashed border-slate-700/60 bg-[#090d14]/70'
                }`}
              >
                {sub ? (
                  <div>
                    <div className="text-[9px] text-purple-300 font-black uppercase">
                      {sub.specificPosition}
                    </div>
                    <div className="text-[11px] text-white font-bold truncate mt-0.5">
                      {getShortDisplayName(sub.name)}
                    </div>
                    <div className="text-[10px] text-amber-400 font-bold mt-0.5">
                      {isExpert ? '?' : `OVR ${sub.overall}`}
                    </div>
                  </div>
                ) : playerToAssign ? (
                  <div className="py-1">
                    <span className="text-[10px] font-black text-purple-200 block">
                      DEPLOY
                    </span>
                    <span className="text-[8px] text-purple-300 font-bold">SUB {idx + 1}</span>
                  </div>
                ) : (
                  <div className="py-2 text-[9px] text-slate-500 font-bold">
                    SUB {idx + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const PitchView = React.memo(PitchViewComponent);
