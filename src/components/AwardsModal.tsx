import React from 'react';
import { SeasonAwards } from '../types/football';
import { Trophy, Flame, Sparkles, Shield, Award, CheckCircle2, Crown, Star } from 'lucide-react';

interface AwardsModalProps {
  awards: SeasonAwards;
  onClose: () => void;
  isInvincible?: boolean;
}

export const AwardsModal: React.FC<AwardsModalProps> = ({
  awards,
  onClose,
  isInvincible = false,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/92 backdrop-blur-xl overflow-y-auto font-sans select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg my-auto bg-gradient-to-b from-[#1c2536] via-[#101826] to-[#060a12] border-2 border-amber-500/80 rounded-3xl p-5 sm:p-6 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.95)] animate-in zoom-in-95 duration-200">
        
        {/* Top ambient golden hairline */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 via-yellow-200 to-transparent pointer-events-none" />

        {/* Rotating Divine God Rays */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none opacity-25 animate-divine-rays">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-400/40 via-yellow-200/30 to-transparent blur-3xl" />
        </div>

        {/* Holographic Gala Glow */}
        <div className="absolute inset-0 pointer-events-none holo-sheen opacity-25 z-0" />

        {/* Header Gala Ceremony */}
        <div className="relative z-10 text-center mb-5 pb-4 border-b border-slate-800">
          <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-gradient-to-br from-amber-400/30 to-yellow-500/10 border-2 border-amber-400/60 text-amber-300 mb-2 shadow-[0_0_30px_rgba(245,158,11,0.45)]">
            <Crown className="w-9 h-9 text-amber-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
          </div>
          <div className="text-[10px] font-mono text-amber-300 font-black uppercase tracking-widest mt-1 flex items-center justify-center gap-1.5 drop-shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            BALLON D'OR THEATRE DU CHATELET GALA
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase mt-1 drop-shadow-md font-sans">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent">
              END OF SEASON AWARDS
            </span>
          </h2>
          {isInvincible && (
            <div className="mt-3 px-4 py-1.5 bg-gradient-to-r from-amber-950 via-[#3a2507] to-amber-950 border-2 border-amber-400 text-amber-200 font-black text-xs rounded-xl inline-flex items-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.6)] font-mono animate-pulse">
              <Trophy className="w-4 h-4 text-amber-400 fill-current" />
              <span>IMMORTAL: 38-0-0 INVINCIBLE CAMPAIGN</span>
            </div>
          )}
        </div>

        {/* Awards Cards Showcase */}
        <div className="relative z-10 space-y-3 font-mono text-xs">
          {/* Ballon d'Or Centerpiece Card with Prismatic Sheen */}
          <div className="relative p-4 sm:p-5 bg-gradient-to-r from-[#332208] via-[#1c1305] to-[#332208] border-2 border-amber-400 rounded-2xl flex items-center justify-between shadow-[0_8px_35px_rgba(245,158,11,0.4)] overflow-hidden">
            <div className="absolute inset-0 pointer-events-none holo-sheen opacity-30" />
            <div className="min-w-0 pr-3 relative z-10">
              <div className="text-[10px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                BALLON D'OR WORLD PLAYER OF THE YEAR
              </div>
              <div className="text-lg sm:text-2xl font-black text-white truncate mt-1 font-sans drop-shadow-md">
                {awards.ballonDor.player}
              </div>
              <div className="text-xs text-amber-200 mt-1 flex items-center gap-2">
                <span className="font-bold">{awards.ballonDor.goals} Goals</span>
                <span>·</span>
                <span className="font-bold">{awards.ballonDor.assists} Assists</span>
              </div>
            </div>
            <div className="text-right shrink-0 pl-4 border-l border-amber-500/50 relative z-10">
              <div className="text-2xl font-black text-amber-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.7)]">
                {awards.ballonDor.rating.toFixed(2)}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-amber-200/80 font-black">
                MATCH AVG
              </div>
            </div>
          </div>

          {/* Golden Boot & Playmaker Side-by-Side */}
          <div className="grid grid-cols-2 gap-3">
            {/* Golden Boot */}
            <div className="p-3.5 bg-gradient-to-b from-[#240c11] to-[#120608] border-2 border-rose-500/60 rounded-2xl flex flex-col justify-between shadow-md">
              <div className="text-[10px] font-black text-rose-300 uppercase flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-400" />
                GOLDEN BOOT
              </div>
              <div className="text-sm font-black text-white truncate mt-2 font-sans">
                {awards.goldenBoot.player}
              </div>
              <div className="text-base font-black text-amber-400 mt-1 font-mono">
                {awards.goldenBoot.goals} GOALS
              </div>
            </div>

            {/* Playmaker Award */}
            <div className="p-3.5 bg-gradient-to-b from-[#0c2317] to-[#06120b] border-2 border-emerald-500/60 rounded-2xl flex flex-col justify-between shadow-md">
              <div className="text-[10px] font-black text-emerald-300 uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                PLAYMAKER AWARD
              </div>
              <div className="text-sm font-black text-white truncate mt-2 font-sans">
                {awards.playmakerAward.player}
              </div>
              <div className="text-base font-black text-emerald-300 mt-1 font-mono">
                {awards.playmakerAward.assists} ASSISTS
              </div>
            </div>
          </div>

          {/* Golden Glove */}
          <div className="p-3.5 bg-gradient-to-r from-[#0c1a2d] to-[#07101c] border-2 border-blue-500/60 rounded-2xl flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-950/90 border border-blue-400/60 flex items-center justify-center shrink-0 shadow-sm">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-black text-blue-300 uppercase">
                  GOLDEN GLOVE
                </div>
                <div className="text-sm font-black text-white truncate mt-0.5 font-sans">
                  {awards.goldenGlove.player}
                </div>
              </div>
            </div>
            <div className="text-xs font-black text-blue-200 shrink-0 font-mono">
              {awards.goldenGlove.cleanSheets} CLEAN SHEETS
            </div>
          </div>

          {/* Team of the Season (TOTS) Summary */}
          <div className="p-4 bg-gradient-to-br from-[#141d2c] via-[#0f1520] to-[#0a0e16] border-2 border-slate-700/80 rounded-2xl shadow-md">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-amber-300 mb-2.5 pb-2 border-b border-slate-800">
              <Award className="w-4 h-4 text-amber-400" />
              EA FC / FUT TEAM OF THE SEASON XI
            </div>
            <div className="text-xs text-slate-200 space-y-1.5 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-500/50 shrink-0">
                  GK
                </span>
                <span className="text-white font-black truncate">{awards.tots.gk}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-500/50 shrink-0 mt-0.5">
                  DEF
                </span>
                <span className="text-slate-200 font-medium leading-relaxed">{awards.tots.defenders.join(', ')}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/50 shrink-0 mt-0.5">
                  MID
                </span>
                <span className="text-slate-200 font-medium leading-relaxed">{awards.tots.midfielders.join(', ')}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-950 text-rose-300 border border-rose-500/50 shrink-0 mt-0.5">
                  FWD
                </span>
                <span className="text-slate-200 font-medium leading-relaxed">{awards.tots.forwards.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="relative z-10 w-full mt-5 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_24px_rgba(52,211,153,0.5)] transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span>CONFIRM & RETURN TO CAMPAIGN HUB</span>
        </button>
      </div>
    </div>
  );
};
