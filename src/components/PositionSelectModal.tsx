import React from 'react';
import { Formation, Player } from '../types/football';
import { calculatePositionFit } from '../engine/positionEngine';
import { getShortDisplayName } from '../utils/nameUtils';
import { X, Shield, Users, Check, AlertCircle, Sparkles, ArrowRightLeft } from 'lucide-react';

interface PositionSelectModalProps {
  player: Player;
  formation: Formation;
  startingXI: (Player | null)[];
  bench: (Player | null)[];
  onAssignSlot: (slotType: 'starter' | 'bench', slotIndex: number) => void;
  onCancel: () => void;
}

export const PositionSelectModal: React.FC<PositionSelectModalProps> = ({
  player,
  formation,
  startingXI,
  bench,
  onAssignSlot,
  onCancel,
}) => {
  const isGK = player.position === 'GK';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl my-auto bg-gradient-to-b from-[#141b27] via-[#0d131d] to-[#080c14] border border-slate-700/80 rounded-3xl p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-4">
        
        {/* Top Floating Glow Beacon */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(52,211,153,0.8)]" />

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400 font-mono">
              TACTICAL DEPLOYMENT & LINEUP
            </span>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Player Dossier Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#182233] to-[#101723] border border-slate-700 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* OVR Rating Badge Shield */}
            <div
              className={`w-12 h-14 rounded-xl flex flex-col items-center justify-center font-black font-mono shadow-md border ${
                player.overall >= 92
                  ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-yellow-500 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                  : player.overall >= 88
                  ? 'bg-gradient-to-b from-cyan-300 via-sky-400 to-blue-500 text-slate-950 border-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                  : player.overall >= 84
                  ? 'bg-gradient-to-b from-purple-400 via-purple-500 to-indigo-600 text-white border-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'bg-gradient-to-b from-slate-700 to-slate-800 text-emerald-300 border-slate-600'
              }`}
            >
              <span className="text-lg leading-none">{player.overall}</span>
              <span className="text-[9px] uppercase tracking-wider">{player.specificPosition}</span>
            </div>

            <div>
              <div className="text-base sm:text-lg font-black text-white leading-tight font-sans">
                {player.name}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-300 font-mono">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  {player.clubYear}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{player.country}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${
              isGK
                ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-xs'
                : 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-xs'
            }`}>
              {player.position} SPECIALIST
            </span>
          </div>
        </div>

        {/* Starting XI Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
                STARTING XI POSITIONS ({formation.name})
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {isGK ? 'Goalkeepers can only be assigned to GK' : 'Select designated slot'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
            {formation.slots.map((slot, idx) => {
              const currentOccupant = startingXI[idx];
              const isGKSlot = slot.category === 'GK' || idx === 0;
              const isAllowed = isGK ? isGKSlot : !isGKSlot;
              const fit = calculatePositionFit(player.specificPosition, slot.label);
              const isNatural = fit.tier === 'natural';
              const isProficient = fit.tier === 'proficient';

              return (
                <button
                  key={slot.id}
                  disabled={!isAllowed}
                  onClick={() => isAllowed && onAssignSlot('starter', idx)}
                  className={`p-2.5 rounded-2xl border text-left transition-all duration-150 flex items-center justify-between gap-2.5 group ${
                    !isAllowed
                      ? 'border-slate-800/60 bg-[#090d14]/60 opacity-30 cursor-not-allowed text-slate-600'
                      : isNatural
                      ? 'border-emerald-500/70 bg-gradient-to-r from-emerald-950/50 to-[#0d2217]/50 hover:border-emerald-400 hover:shadow-[0_0_16px_rgba(52,211,153,0.35)] cursor-pointer'
                      : isProficient
                      ? 'border-cyan-500/60 bg-gradient-to-r from-[#0d2030]/50 to-[#07131d]/50 hover:border-cyan-400 hover:shadow-[0_0_16px_rgba(56,189,248,0.3)] cursor-pointer'
                      : 'border-slate-700/80 bg-[#101723] hover:border-amber-400/80 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 border ${
                      !isAllowed
                        ? 'bg-slate-900 border-slate-800 text-slate-600'
                        : isNatural
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/80 shadow-xs'
                        : isProficient
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500/80 shadow-xs'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {slot.label}
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-black text-white truncate font-sans">
                        {currentOccupant ? (
                          <span className="flex items-center gap-1.5 text-slate-200">
                            <ArrowRightLeft className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="truncate">Swap with {getShortDisplayName(currentOccupant.name)}</span>
                          </span>
                        ) : (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                            VACANT · READY
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                        {currentOccupant ? `${currentOccupant.specificPosition} · OVR ${currentOccupant.overall}` : `${slot.category} Category`}
                      </div>
                    </div>
                  </div>

                  {/* Fit Tier Badge */}
                  <div className="shrink-0 font-mono">
                    {!isAllowed ? (
                      <span className="px-2 py-0.5 rounded-md bg-rose-950/80 text-rose-400 text-[9px] font-bold border border-rose-800/60">
                        {isGK ? 'GK ONLY' : 'OUTFIELD'}
                      </span>
                    ) : isNatural ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-400 text-slate-950 text-[9px] font-black tracking-wider flex items-center gap-0.5 shadow-sm">
                        <Check className="w-2.5 h-2.5" />
                        FIT 100%
                      </span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border ${
                        fit.penaltyOvr <= 3
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60'
                          : 'bg-amber-950 text-amber-300 border-amber-500/60'
                      }`}>
                        -{fit.penaltyOvr} OVR
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dugout Bench Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-white uppercase tracking-wider font-mono">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              BENCH & RESERVES
            </div>
            <span className="text-[10px] text-purple-300 font-mono">
              Any player can be placed on bench (no penalty)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {bench.map((sub, bIdx) => {
              return (
                <button
                  key={bIdx}
                  onClick={() => onAssignSlot('bench', bIdx)}
                  className={`p-2.5 rounded-2xl border text-center transition-all duration-150 hover:scale-[1.02] active:scale-95 flex flex-col justify-between ${
                    sub
                      ? 'bg-gradient-to-b from-[#18212e] to-[#0e141d] border-slate-700 hover:border-purple-400/80 shadow-sm'
                      : 'bg-purple-950/30 border-dashed border-purple-500/60 hover:bg-purple-950/60 hover:border-purple-400 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono font-black text-purple-300 pb-1 border-b border-slate-800">
                    <span>SUB {bIdx + 1}</span>
                    {sub && <span className="text-slate-400">{sub.specificPosition}</span>}
                  </div>
                  <div className="my-1.5 truncate">
                    {sub ? (
                      <div>
                        <div className="text-xs font-bold text-white truncate font-sans">
                          {getShortDisplayName(sub.name)}
                        </div>
                        <div className="text-[10px] text-amber-400 font-mono font-bold mt-0.5">
                          OVR {sub.overall}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] font-bold text-purple-200 py-1">
                        + DEPLOY
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Tactical adjustments can be freely swapped later in Pitch View
          </span>
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-mono font-bold text-xs border border-slate-700 transition-all shadow-sm"
          >
            Cancel Selection
          </button>
        </div>

      </div>
    </div>
  );
};
