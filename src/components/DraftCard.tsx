import React from 'react';
import { Player, GameDifficulty, PlayerPosition } from '../types/football';
import { Flame, Sparkles, Shield, Coins, Check, AlertTriangle, X } from 'lucide-react';

interface DraftCardProps {
  player: Player;
  difficulty: GameDifficulty;
  isCompatible: boolean;
  onSelect: (player: Player) => void;
  isDrafted?: boolean;
  isDuplicate?: boolean;
  isSelected?: boolean;
  chemistrySynergies?: string[];
  bestFitNotice?: { penaltyOvr: number; label: string } | null;
  salaryValue?: number;
}

const DraftCardComponent: React.FC<DraftCardProps> = ({
  player,
  difficulty,
  isCompatible,
  onSelect,
  isDrafted = false,
  isDuplicate = false,
  isSelected = false,
  chemistrySynergies = [],
  bestFitNotice = null,
  salaryValue,
}) => {
  const isExpert = difficulty === 'expert' || difficulty === 'super_expert';
  const hasAura = Boolean(player.auraTrait) && !isExpert;

  const getPositionGradient = (pos: PlayerPosition) => {
    switch (pos) {
      case 'GK':
        return 'from-amber-400 to-yellow-500 text-slate-950 shadow-amber-500/20';
      case 'DEF':
        return 'from-blue-500 to-cyan-400 text-white shadow-blue-500/20';
      case 'MID':
        return 'from-emerald-400 to-teal-400 text-slate-950 shadow-emerald-500/20';
      case 'FWD':
        return 'from-rose-500 to-red-500 text-white shadow-rose-500/20';
    }
  };

  const getCardThemeClasses = () => {
    if (isDuplicate) {
      return 'border-rose-900/60 bg-[#160b0b]/90 opacity-40 cursor-not-allowed';
    }
    if (isDrafted) {
      return 'border-[#21262d] bg-[#0b0e14]/90 opacity-45 cursor-not-allowed';
    }
    if (isSelected) {
      return 'border-2 border-emerald-400 bg-gradient-to-b from-[#0e2718] to-[#07150c] shadow-[0_0_24px_rgba(52,211,153,0.35)] ring-2 ring-emerald-400/80 scale-[1.02] cursor-pointer';
    }
    if (!isCompatible) {
      return 'border-[#21262d] bg-[#0c1017]/85 opacity-40 cursor-not-allowed';
    }

    // In Expert & Super Expert, hide card tier foils to keep ratings classified
    if (isExpert) {
      return 'card-foil-standard hover:border-slate-500 hover:bg-[#141b24] hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] hover:scale-[1.015] cursor-pointer';
    }

    if (player.auraTrait?.rarity === 'Legendary' || player.overall >= 91) {
      return 'card-foil-gold prismatic-foil hover:border-amber-400 hover:shadow-[0_8px_36px_rgba(245,158,11,0.35)] hover:scale-[1.02] cursor-pointer ring-1 ring-amber-400/40';
    }
    if (player.auraTrait?.rarity === 'Epic' || player.overall >= 87) {
      return 'card-foil-epic hover:border-purple-400 hover:shadow-[0_8px_32px_rgba(168,85,247,0.35)] hover:scale-[1.02] cursor-pointer ring-1 ring-purple-400/30';
    }
    if (player.auraTrait?.rarity === 'Rare' || player.overall >= 84) {
      return 'card-foil-rare hover:border-sky-400 hover:shadow-[0_8px_30px_rgba(56,189,248,0.3)] hover:scale-[1.02] cursor-pointer ring-1 ring-sky-400/30';
    }
    return 'card-foil-standard hover:border-emerald-500/80 hover:bg-[#141b24] hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] hover:scale-[1.015] cursor-pointer';
  };

  const getStatBarColor = (val: number) => {
    if (val >= 90) return 'bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_8px_rgba(52,211,153,0.7)]';
    if (val >= 80) return 'bg-gradient-to-r from-cyan-400 to-blue-400 shadow-[0_0_6px_rgba(56,189,248,0.5)]';
    if (val >= 70) return 'bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_4px_rgba(245,158,11,0.3)]';
    return 'bg-slate-600';
  };

  const getStatTextColor = (val: number) => {
    if (val >= 90) return 'text-emerald-300 font-black drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]';
    if (val >= 80) return 'text-cyan-200 font-bold';
    if (val >= 70) return 'text-amber-200 font-semibold';
    return 'text-slate-400';
  };

  return (
    <div
      onClick={() => isCompatible && !isDrafted && !isDuplicate && onSelect(player)}
      className={`relative flex flex-col justify-between p-3.5 rounded-2xl transition-all duration-200 select-none overflow-hidden ${getCardThemeClasses()}`}
    >
      {/* Dynamic Holographic Reflection for Elite/Aura Cards */}
      {(hasAura || player.overall >= 88) && !isDrafted && !isDuplicate && (
        <div className="absolute inset-0 pointer-events-none holo-sheen opacity-40 z-0" />
      )}

      {/* Top Bar: FUT Rating Badge & Position Shield & Value */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* OVR Shield */}
          {isDuplicate ? (
            <span className="px-2 py-0.5 rounded-lg bg-rose-950 border border-rose-600/80 text-rose-200 text-[10px] font-black font-mono tracking-wider flex items-center gap-1 shadow-sm">
              <X className="w-3 h-3" />
              DUPLICATE
            </span>
          ) : isExpert ? (
            <span className="px-2.5 py-0.5 rounded-lg bg-[#1a2332] border border-slate-700 text-slate-300 text-xs font-black font-mono shadow-inner">
              ?
            </span>
          ) : (
            <div
              className={`flex items-baseline gap-1 px-2.5 py-0.5 rounded-lg font-black font-mono shadow-md border ${
                player.overall >= 92
                  ? 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 border-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.5)]'
                  : player.overall >= 88
                  ? 'bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 text-slate-950 border-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                  : player.overall >= 84
                  ? 'bg-gradient-to-r from-purple-300 via-fuchsia-400 to-purple-500 text-slate-950 border-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.35)]'
                  : 'bg-[#18212f] text-emerald-300 border-emerald-500/50 shadow-emerald-500/10'
              }`}
            >
              <span className="text-sm font-black">{player.overall}</span>
              <span className="text-[9px] uppercase font-bold tracking-wider opacity-85">OVR</span>
            </div>
          )}

          {/* Position Shield */}
          <span
            className={`px-2 py-0.5 text-xs font-black rounded-lg font-mono uppercase tracking-wide bg-gradient-to-r shadow-xs ${getPositionGradient(
              player.position
            )}`}
          >
            {player.specificPosition}
          </span>

          {/* Dynamic Best Fit Indicator */}
          {bestFitNotice && !isDuplicate && !isDrafted && !isExpert && (
            <span
              className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-black border flex items-center gap-1 shadow-xs ${
                bestFitNotice.penaltyOvr === 0
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                  : bestFitNotice.penaltyOvr <= 3
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/60'
                  : 'bg-amber-950/80 text-amber-300 border-amber-500/60'
              }`}
            >
              {bestFitNotice.penaltyOvr === 0 ? (
                <>
                  <Check className="w-2.5 h-2.5 text-emerald-400" />
                  FIT
                </>
              ) : (
                `-${bestFitNotice.penaltyOvr} OVR`
              )}
            </span>
          )}
        </div>

        {/* Country & Salary Cap Pill */}
        <div className="flex items-center gap-1.5 font-mono text-right shrink-0">
          {salaryValue !== undefined && (
            <span className="px-2 py-0.5 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-500/60 text-[10px] font-mono font-black shadow-sm flex items-center gap-1">
              <Coins className="w-3 h-3 text-amber-400" />
              ${salaryValue}M
            </span>
          )}
          <span className="text-[11px] text-slate-300 font-bold tracking-tight truncate max-w-[110px] sm:max-w-[140px] bg-[#121824] px-2 py-0.5 rounded-md border border-slate-700/60">
            {player.country}
          </span>
        </div>
      </div>

      {/* Center: Player Name & Club Badge */}
      <div className="relative z-10 my-2.5">
        <div className="flex items-center justify-between gap-1.5 min-w-0">
          <div className="text-base sm:text-lg font-black text-white tracking-tight truncate font-sans drop-shadow-sm min-w-0">
            {player.name}
          </div>
          {hasAura && (
            <span className="text-[9px] font-black font-mono px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 flex items-center gap-1 shadow-md shadow-amber-500/30 shrink-0">
              <Flame className="w-3 h-3 text-slate-950 fill-current" />
              AURA
            </span>
          )}
        </div>
        <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-400/90" />
          <span className="font-medium text-slate-300">{player.clubYear}</span>
        </div>

        {/* Real-time Ultimate Team Chemistry Diamond Pill */}
        {chemistrySynergies.length > 0 && !isDuplicate && !isDrafted && !isExpert && (
          <div className="mt-2 px-2.5 py-1 bg-gradient-to-r from-emerald-950/80 to-[#0e2718]/80 border border-emerald-500/50 rounded-xl text-[10px] text-emerald-200 font-mono font-bold truncate flex items-center gap-1.5 shadow-sm">
            <span className="text-emerald-400 text-xs tracking-tighter">◆◆◆</span>
            <span className="truncate">{chemistrySynergies[0]}</span>
          </div>
        )}
      </div>

      {/* Hex Attributes Bar with Visualizer Progress Mini-Bars */}
      {!isExpert ? (
        <div className="relative z-10 grid grid-cols-6 gap-1.5 my-2 text-center font-mono bg-[#090e16]/95 p-2 rounded-xl border border-slate-800 shadow-inner">
          {[
            { label: 'PAC', val: player.pace },
            { label: 'SHO', val: player.shooting },
            { label: 'PAS', val: player.passing },
            { label: 'DRI', val: player.dribbling },
            { label: 'DEF', val: player.defending },
            { label: 'PHY', val: player.physical },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className="text-slate-400 text-[8px] font-bold tracking-wider">{stat.label}</div>
              <div className={`text-xs mt-0.5 ${getStatTextColor(stat.val)}`}>{stat.val}</div>
              {/* Mini visualizer bar */}
              <div className="w-full bg-slate-800/90 h-1.5 rounded-full overflow-hidden mt-1 shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getStatBarColor(stat.val)}`}
                  style={{ width: `${Math.min(100, Math.max(12, stat.val))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative z-10 my-1.5 py-2 px-2.5 bg-[#090e16]/95 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 text-center flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-slate-500" />
          <span>Tactical Scout Active (Expert Mode)</span>
        </div>
      )}

      {/* Aura Trait Card Ribbon */}
      {player.auraTrait && !isExpert && (
        <div
          className={`relative z-10 mt-1.5 p-2.5 rounded-xl border text-left font-mono text-[10px] shadow-sm overflow-hidden ${
            player.auraTrait.rarity === 'Legendary'
              ? 'bg-gradient-to-r from-amber-950/70 via-[#261706]/60 to-yellow-950/40 border-amber-500/70 text-amber-200'
              : 'bg-gradient-to-r from-purple-950/70 via-[#1f0d2b]/60 to-fuchsia-950/40 border-purple-500/70 text-purple-200'
          }`}
        >
          <div className="font-black truncate text-amber-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {player.auraTrait.name}
            </span>
            <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold px-1.5 py-0.5 rounded bg-black/40 border border-white/10">
              {player.auraTrait.rarity}
            </span>
          </div>
          <p className="text-slate-300 leading-snug line-clamp-2 mt-1 text-[9px] font-sans">
            {player.auraTrait.description}
          </p>
        </div>
      )}

      {/* Action CTA Button */}
      <button
        disabled={!isCompatible || isDrafted || isDuplicate}
        className={`relative z-10 w-full mt-2.5 py-2.5 px-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all duration-150 shadow-md ${
          isDuplicate
            ? 'bg-rose-950/60 text-rose-300 border border-rose-800/80 cursor-not-allowed shadow-none'
            : isDrafted
            ? 'bg-[#18202d] text-slate-500 border border-slate-800 cursor-not-allowed shadow-none'
            : isSelected
            ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 text-slate-950 font-black shadow-[0_0_22px_rgba(52,211,153,0.7)] scale-[1.01]'
            : isCompatible
            ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black border border-emerald-400/50 hover:shadow-[0_0_18px_rgba(16,185,129,0.5)] active:scale-95'
            : 'bg-[#18202d] text-slate-500 border border-slate-800 cursor-not-allowed shadow-none'
        }`}
      >
        {isDuplicate
          ? 'DUPLICATE PLAYER'
          : isDrafted
          ? 'ALREADY DRAFTED'
          : isSelected
          ? 'TARGETING PITCH...'
          : isCompatible
          ? 'SELECT TO PLACE'
          : 'POSITIONS OCCUPIED'}
      </button>
    </div>
  );
};

export const DraftCard = React.memo(DraftCardComponent);
