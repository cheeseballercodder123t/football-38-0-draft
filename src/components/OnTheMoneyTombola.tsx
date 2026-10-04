import React, { useState, useEffect } from 'react';
import { Target, Zap, Trophy, Flame, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface OnTheMoneyTombolaProps {
  targetPoints: number;
  isTargetSpun: boolean;
  onSpinTarget: (target: number) => void;
  onStartDrafting: () => void;
}

export function OnTheMoneyTombola({
  targetPoints,
  isTargetSpun,
  onSpinTarget,
  onStartDrafting,
}: OnTheMoneyTombolaProps) {
  const [displayNumber, setDisplayNumber] = useState<number | string>(targetPoints || '--');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const handleSpinTombola = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    soundEngine.playSpinWheel();

    const min = 35;
    const max = 105;
    const finalTarget = Math.floor(Math.random() * (max - min + 1)) + min;
    const startTime = Date.now();
    const duration = 2400; // 2.4s tumbling

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Easing out
      if (progress < 1) {
        const randNum = Math.floor(Math.random() * (max - min + 1)) + min;
        setDisplayNumber(randNum);
        soundEngine.playTombolaTick();
      } else {
        clearInterval(interval);
        setDisplayNumber(finalTarget);
        setIsSpinning(false);
        soundEngine.playGoalCelebration();
        onSpinTarget(finalTarget);
      }
    }, 60);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 p-6 shadow-2xl shadow-amber-500/10 text-center">
        {/* Glow halo */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Target className="w-4 h-4 animate-pulse" />
          38-0-0 Signature Mode
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight mb-2">
          On The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Money</span> 🎯
        </h2>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Spin a random 38-game points target (35–105 pts). Draft an XI whose projected season lands <span className="text-amber-400 font-semibold">right on the target</span>. Hit it exactly to claim Bullseye glory!
        </p>

        {/* Tombola Reel Chamber */}
        <div className="relative my-6 py-6 px-4 rounded-xl bg-slate-950/90 border border-slate-800 shadow-inner flex flex-col items-center justify-center">
          <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-1">
            Points Target
          </span>
          <div className={`text-6xl font-black tracking-tight font-mono transition-transform duration-100 ${
            isSpinning ? 'scale-110 text-amber-400 animate-pulse' : isTargetSpun ? 'text-amber-400 scale-100' : 'text-slate-600'
          }`}>
            {displayNumber}
          </div>
          <span className="text-xs font-semibold text-amber-500/80 tracking-widest mt-2 uppercase">
            Over 38 League Games
          </span>
        </div>

        {/* Action Controls */}
        <div className="space-y-3 pt-2">
          {!isTargetSpun ? (
            <button
              onClick={handleSpinTombola}
              disabled={isSpinning}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Target className="w-5 h-5" />
              {isSpinning ? 'Rolling Points Reel...' : 'Spin Points Target'}
            </button>
          ) : (
            <button
              onClick={onStartDrafting}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lock Target ({targetPoints} pts) & Draft XI</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {isTargetSpun && (
            <button
              onClick={handleSpinTombola}
              disabled={isSpinning}
              className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Re-spin Target
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface OnTheMoneyPaceBannerProps {
  targetPoints: number;
  projectedPoints: number;
  actualPointsSoFar?: number;
  matchday?: number;
  isSeasonComplete?: boolean;
}

export function OnTheMoneyPaceBanner({
  targetPoints,
  projectedPoints,
  actualPointsSoFar,
  matchday = 1,
  isSeasonComplete = false,
}: OnTheMoneyPaceBannerProps) {
  const currentActual = actualPointsSoFar !== undefined ? actualPointsSoFar : projectedPoints;
  const comparePoints = isSeasonComplete ? currentActual : projectedPoints;
  const diff = comparePoints - targetPoints;
  const isRightOnPace = Math.abs(diff) <= 2;
  const isExactBullseye = diff === 0;

  return (
    <div className="w-full mb-3 rounded-xl bg-gradient-to-r from-slate-900/90 via-amber-950/30 to-slate-900/90 border border-amber-500/30 p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm shadow-md">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium text-xs">Target:</span>
            <span className="font-extrabold text-white">{targetPoints} pts</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-medium text-xs">{isSeasonComplete ? 'Final:' : 'Pace:'}</span>
            <span className={`font-extrabold ${isExactBullseye ? 'text-emerald-400' : isRightOnPace ? 'text-amber-300' : 'text-slate-300'}`}>
              {comparePoints} pts
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            {diff === 0 ? (
              <span className="text-emerald-400 font-bold">🎯 Right On The Money! (Bounty: +5 Scout Tokens)</span>
            ) : diff > 0 ? (
              <span className="text-yellow-400">+{diff} pts over target</span>
            ) : (
              <span className="text-rose-400">{diff} pts under target</span>
            )}
            {actualPointsSoFar !== undefined && matchday > 1 && !isSeasonComplete && (
              <span className="ml-2 text-slate-500">
                (Current: {actualPointsSoFar} pts @ MD {Math.min(38, matchday - 1)})
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400">
          <span>Bounty:</span>
          <span className="text-amber-400 font-bold">Bullseye = +5 🪙</span>
          <span>|</span>
          <span className="text-slate-300">±2 = +3 🪙</span>
        </div>
        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
          isExactBullseye
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : isRightOnPace
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            : 'bg-slate-800 text-slate-400 border border-slate-700'
        }`}>
          {isExactBullseye ? 'Bullseye Jackpot! 🏆' : isRightOnPace ? 'Within Strike Range' : 'Adjusting Pace'}
        </span>
      </div>
    </div>
  );
}
