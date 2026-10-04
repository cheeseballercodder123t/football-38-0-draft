import React from 'react';
import { GameMode, GameDifficulty } from '../types/football';
import { Coins, RotateCcw, Home, Sparkles, SlidersHorizontal, Volume2, VolumeX, Share2, Flame, Lock } from 'lucide-react';

interface NavbarProps {
  scoutTokens: number;
  freeRerollAvailable: boolean;
  gameMode: GameMode;
  difficulty: GameDifficulty;
  onToggleDifficulty: () => void;
  draftRound: number;
  isDraftPhase: boolean;
  onGoHome: () => void;
  onRestart: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onOpenShare?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  scoutTokens,
  freeRerollAvailable,
  gameMode,
  difficulty,
  onToggleDifficulty,
  draftRound,
  isDraftPhase,
  onGoHome,
  onRestart,
  isMuted = false,
  onToggleMute,
  onOpenShare,
}) => {
  const getModeLabel = (mode: GameMode) => {
    switch (mode) {
      case 'la_liga':
        return 'La Liga 2011-12';
      case 'premier_league':
        return 'Premier League 2018-19';
      case 'serie_a':
        return 'Serie A 1998-99';
      case 'bundesliga':
        return 'Bundesliga 2012-13';
      case 'champions_league':
        return 'UCL Knockouts';
      case 'world_cup':
        return 'FIFA World Cup';
      case 'dynasty':
        return 'Dynasty Franchise';
      case 'rivalry_derby':
        return 'Rivalry Derby Gauntlet';
      case 'salary_cap':
        return 'Salary Cap $350M';
      case 'draft_roguelike':
        return 'Roguelike Boss Tower';
      case 'on_the_money':
        return 'On The Money 🎯';
      case 'build_a_player':
        return 'Build A Player ⭐';
      case 'last_one_standing':
        return 'Last One Standing ⚔️';
      case 'teammate_chain':
        return 'Teammate Chain 🔗';
      case 'player_career':
        return 'Player Career Mode ⚽';
      default:
        return 'Invincible 38-0-0';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080d15]/92 backdrop-blur-2xl border-b border-slate-700/60 safe-top select-none font-sans shadow-[0_8px_32px_rgba(0,0,0,0.65)] relative">
      {/* Top ambient illumination hairline */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/50 via-emerald-400/40 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-3 text-xs">
        {/* Left: Home, Restart, Brand & Mode */}
        <div className="flex items-center gap-2">
          <button
            onClick={onGoHome}
            className="px-2.5 py-1.5 bg-[#121a26]/90 hover:bg-[#1a2638] text-slate-200 font-mono font-bold border border-slate-700/80 hover:border-slate-500 rounded-xl transition-all duration-150 active:scale-95 flex items-center gap-1.5 shadow-sm hover:shadow-[0_0_10px_rgba(255,255,255,0.08)]"
            title="Return to Main Menu"
          >
            <Home className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden sm:inline tracking-wider">HOME</span>
          </button>

          <button
            onClick={onRestart}
            className="px-2.5 py-1.5 bg-gradient-to-r from-rose-950/70 to-[#1f0910]/70 hover:from-rose-900/80 hover:to-[#2b0c16]/80 text-rose-300 font-mono font-bold border border-rose-800/70 hover:border-rose-500 rounded-xl transition-all duration-150 active:scale-95 flex items-center gap-1.5 shadow-sm hover:shadow-[0_0_12px_rgba(244,63,94,0.25)]"
            title="Restart current campaign"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline tracking-wider">RESET</span>
          </button>

          <div className="hidden xs:flex flex-col ml-1.5 pl-2.5 border-l border-slate-700/80">
            <span className="font-black text-white tracking-widest uppercase text-[11px] flex items-center gap-1.5 font-mono drop-shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
              </span>
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                TACTICAL DRAFT
              </span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-tight drop-shadow-[0_0_6px_rgba(52,211,153,0.3)]">
              {getModeLabel(gameMode)}
            </span>
          </div>
        </div>

        {/* Center: Draft Round Progress HUD Scorebug */}
        {isDraftPhase && (
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3.5 py-1 rounded-xl bg-gradient-to-r from-[#0b1018] via-[#101724] to-[#0b1018] border border-slate-700/80 font-mono text-xs shadow-inner shadow-black/60 relative overflow-hidden shrink-0">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-slate-400 font-bold text-[10px] tracking-wider hidden xs:inline">ROUND</span>
              <span className="font-black text-amber-300 text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                {draftRound}
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-300 font-bold text-[10px] sm:text-[11px]">
                {draftRound <= 11 ? (
                  <span className="text-emerald-400">11</span>
                ) : (
                  <span className="text-purple-400">16</span>
                )}
                <span className="hidden sm:inline"> {draftRound <= 11 ? '(XI)' : '(BENCH)'}</span>
              </span>
            </div>

            {/* Visual Mini Progress Dots (11 XI + 5 Bench) */}
            <div className="hidden md:flex items-center gap-1 ml-1.5 pl-2.5 border-l border-slate-700/80">
              {Array.from({ length: 16 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-200 ${
                    i < draftRound - 1
                      ? 'bg-emerald-400 h-2 shadow-[0_0_4px_rgba(52,211,153,0.6)]'
                      : i === draftRound - 1
                      ? 'bg-amber-400 h-3.5 shadow-[0_0_10px_rgba(245,158,11,0.9)] animate-pulse'
                      : i < 11
                      ? 'bg-slate-700 h-2'
                      : 'bg-purple-900/60 h-2'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Right: Sound, Share, Scout Tokens Vault & Difficulty */}
        <div className="flex items-center gap-1.5 sm:gap-2 font-mono shrink-0">
          {/* Sound Toggle */}
          {onToggleMute && (
            <button
              onClick={onToggleMute}
              className={`p-1.5 rounded-xl border transition-all duration-150 active:scale-95 ${
                isMuted
                  ? 'bg-slate-800/80 border-slate-700 text-slate-500'
                  : 'bg-emerald-950/60 border-emerald-500/60 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.25)]'
              }`}
              title={isMuted ? 'Unmute Stadium Sounds' : 'Mute Sounds'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Share Team */}
          {onOpenShare && !isDraftPhase && (
            <button
              onClick={onOpenShare}
              className="p-1.5 bg-[#16202e] hover:bg-[#1f2d40] text-slate-200 border border-slate-700/80 rounded-xl transition-all duration-150 active:scale-95 shadow-sm hover:border-emerald-500/50"
              title="Share Starting XI"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          )}

          {/* Scout Tokens Vault */}
          <div
            className={`px-2 sm:px-3 py-1 rounded-xl border flex items-center gap-1 sm:gap-1.5 transition-all duration-150 ${
              freeRerollAvailable
                ? 'bg-gradient-to-r from-emerald-950/90 via-teal-950/70 to-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.35)]'
                : 'bg-gradient-to-r from-amber-950/70 via-[#1c1407] to-amber-950/70 border-amber-500/60 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
            }`}
          >
            {freeRerollAvailable ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
                <span className="font-black text-xs tracking-wider hidden sm:inline">FREE REROLL</span>
                <span className="font-black text-xs tracking-wider sm:hidden">FREE</span>
              </>
            ) : (
              <>
                <Coins className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)] shrink-0" />
                <span className="text-[10px] text-amber-400/80 font-bold hidden sm:inline">SCOUT:</span>
                <span className="font-black text-xs text-amber-300 drop-shadow-[0_0_4px_rgba(245,158,11,0.4)]">
                  {scoutTokens}
                </span>
              </>
            )}
          </div>

          {/* Difficulty Toggle Button */}
          <button
            onClick={isDraftPhase ? undefined : onToggleDifficulty}
            disabled={isDraftPhase}
            className={`px-2 sm:px-2.5 py-1 rounded-xl font-bold border transition-all duration-150 flex items-center gap-1 sm:gap-1.5 shadow-sm ${
              isDraftPhase
                ? 'opacity-65 cursor-not-allowed bg-[#121924]/80 border-slate-700/60 text-slate-400'
                : difficulty === 'super_expert'
                ? 'bg-gradient-to-r from-rose-950 via-[#360812] to-amber-950 border-rose-500 text-rose-200 shadow-[0_0_16px_rgba(244,63,94,0.5)] ring-1 ring-rose-400/60 active:scale-95'
                : difficulty === 'expert'
                ? 'bg-gradient-to-r from-purple-950 via-[#230f36] to-purple-950 border-purple-500/90 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.35)] active:scale-95'
                : 'bg-[#141d2a] border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 active:scale-95'
            }`}
            title={
              isDraftPhase
                ? 'Difficulty mode is locked during an active draft. Reset or complete draft to change.'
                : 'Cycle difficulty: Classic -> Expert -> Super Expert'
            }
          >
            {isDraftPhase ? (
              <Lock className="w-3 h-3 text-amber-400 shrink-0" />
            ) : difficulty === 'super_expert' ? (
              <Flame className="w-3.5 h-3.5 text-rose-400 fill-current animate-pulse shrink-0" />
            ) : (
              <SlidersHorizontal className="w-3 h-3 text-slate-400 shrink-0" />
            )}
            <span className="tracking-wide hidden sm:inline">
              {difficulty === 'super_expert' ? 'SUPER EXPERT' : difficulty.toUpperCase()}
            </span>
            <span className="tracking-wide sm:hidden text-[11px]">
              {difficulty === 'super_expert' ? 'SUPER' : difficulty === 'expert' ? 'EXPERT' : 'CLASSIC'}
            </span>
            {isDraftPhase && (
              <span className="text-[9px] font-mono text-amber-400 font-bold tracking-wider hidden sm:inline">(LOCKED)</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
