import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SquadData, GameMode, GameDifficulty } from '../types/football';
import { SQUADS } from '../data/squads';
import { Shield, Trophy, Sparkles, Zap, Award, CheckCircle2, Lock, FastForward, Calendar, Flame, ArrowRight } from 'lucide-react';
import { getWeightedRandomSquad } from '../utils/rollEngine';
import { soundEngine } from '../utils/soundEngine';

interface SlotWheelProps {
  currentSquad: SquadData | null;
  onSpinComplete: (squad: SquadData) => void;
  isSpinning: boolean;
  disabled?: boolean;
  squadPool?: SquadData[];
  gameMode?: GameMode;
  difficulty?: GameDifficulty;
  isReroll?: boolean;
}

export type SpinPhase = 'idle' | 'spinning_both' | 'club_locked' | 'year_locked' | 'revealed';

const SlotWheelComponent: React.FC<SlotWheelProps> = ({
  currentSquad,
  onSpinComplete,
  isSpinning,
  squadPool,
  gameMode = 'premier_league',
  difficulty = 'classic',
  isReroll = false,
}) => {
  const [spinPhase, setSpinPhase] = useState<SpinPhase>('idle');
  const [reelDisplay, setReelDisplay] = useState({
    club: currentSquad?.clubName || 'Arsenal',
    year: currentSquad?.year || '2003-04',
    league: currentSquad?.league || 'Premier League',
    tactic: currentSquad?.primaryTactic || 'Tiki-Taka',
    tier: currentSquad?.tier || 'elite',
    playerCount: currentSquad?.players.length || 24,
  });

  const {
    club: displayClub,
    year: displayYear,
    league: displayLeague,
    tactic: displayTactic,
    tier: displayTier,
    playerCount: displayPlayerCount,
  } = reelDisplay;

  const targetSquadRef = useRef<SquadData | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pool = squadPool && squadPool.length > 0 ? squadPool : SQUADS;

  // Extract distinct clubs and years from current pool for realistic reels
  const uniqueClubs = useMemo(() => {
    return Array.from(new Set(pool.map(s => s.clubName)));
  }, [pool]);

  const uniqueYears = useMemo(() => {
    return Array.from(new Set(pool.map(s => s.year)));
  }, [pool]);

  const clearAllTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    timerRef.current.forEach(t => clearTimeout(t));
    timerRef.current = [];
  };

  const handleConfirmSquad = () => {
    if (!targetSquadRef.current) return;
    clearAllTimers();
    soundEngine.playSuccessChime();
    const final = targetSquadRef.current;
    setSpinPhase('idle');
    onSpinComplete(final);
  };

  const handleFastForward = () => {
    if (!targetSquadRef.current) return;
    clearAllTimers();
    const final = targetSquadRef.current;
    setReelDisplay({
      club: final.clubName,
      year: final.year,
      league: final.league,
      tactic: final.primaryTactic,
      tier: final.tier || 'mid',
      playerCount: final.players.length,
    });
    setSpinPhase('revealed');
    soundEngine.playReelLock();
    soundEngine.playSuccessChime();
  };

  // Keyboard shortcut for Space and Enter to continue or fast-forward
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSpinning && spinPhase === 'idle') return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (spinPhase === 'revealed' || spinPhase === 'year_locked') {
          handleConfirmSquad();
        } else {
          handleFastForward();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpinning, spinPhase]);

  useEffect(() => {
    if (!isSpinning) {
      if (currentSquad) {
        setReelDisplay({
          club: currentSquad.clubName,
          year: currentSquad.year,
          league: currentSquad.league,
          tactic: currentSquad.primaryTactic,
          tier: currentSquad.tier || 'mid',
          playerCount: currentSquad.players.length,
        });
      }
      setSpinPhase('idle');
      clearAllTimers();
      return;
    }

    clearAllTimers();

    // 1. Determine final squad via weighted engine
    const finalSquad = getWeightedRandomSquad(pool, gameMode, difficulty, isReroll);
    targetSquadRef.current = finalSquad;
    setSpinPhase('spinning_both');

    // Pool of years associated with final club or general pool
    const clubYears = pool.filter(s => s.clubName === finalSquad.clubName).map(s => s.year);
    const candidateYears = clubYears.length > 0 ? clubYears : uniqueYears;

    let tickCount = 0;
    // Step 1: Rapidly spin BOTH reels (Club and Year) - 65ms batched update
    intervalRef.current = setInterval(() => {
      tickCount++;
      if (tickCount % 2 === 0) {
        soundEngine.playReelTick();
      }

      const randClub = uniqueClubs[Math.floor(Math.random() * uniqueClubs.length)];
      const randSquad = pool[Math.floor(Math.random() * pool.length)];
      const randYear = uniqueYears[Math.floor(Math.random() * uniqueYears.length)];

      setReelDisplay({
        club: randClub,
        year: randYear,
        league: randSquad.league,
        tactic: randSquad.primaryTactic,
        tier: randSquad.tier || 'mid',
        playerCount: randSquad.players.length,
      });
    }, 65);

    // Step 2: At T = 1000ms -> LOCK CLUB FIRST!
    const clubLockTimer = setTimeout(() => {
      setSpinPhase('club_locked');
      setReelDisplay(prev => ({
        ...prev,
        club: finalSquad.clubName,
        league: finalSquad.league,
        tier: finalSquad.tier || 'mid',
      }));
      soundEngine.playReelLock();

      // Continue spinning ONLY the Year reel
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        tickCount++;
        if (tickCount % 2 === 0) {
          soundEngine.playReelTick();
        }
        const randYear = candidateYears[Math.floor(Math.random() * candidateYears.length)];
        setReelDisplay(prev => ({ ...prev, year: randYear }));
      }, 70);
    }, 1000);
    timerRef.current.push(clubLockTimer);

    // Step 3: At T = 2000ms -> LOCK YEAR SECOND!
    const yearLockTimer = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setSpinPhase('year_locked');
      setReelDisplay({
        club: finalSquad.clubName,
        year: finalSquad.year,
        league: finalSquad.league,
        tactic: finalSquad.primaryTactic,
        tier: finalSquad.tier || 'mid',
        playerCount: finalSquad.players.length,
      });
      soundEngine.playReelLock();
      soundEngine.playSuccessChime();
    }, 2000);
    timerRef.current.push(yearLockTimer);

    // Step 4: At T = 2300ms -> Celebration reveal state & hold until user presses to continue
    const revealTimer = setTimeout(() => {
      setSpinPhase('revealed');
      soundEngine.playAuraSurge();
    }, 2300);
    timerRef.current.push(revealTimer);

    return () => {
      clearAllTimers();
    };
  }, [isSpinning, pool, gameMode, difficulty, isReroll, uniqueClubs, uniqueYears, onSpinComplete]);

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. CINEMATIC FULL-FOCUS SPOTLIGHT OVERLAY                                */}
      {/* Centered on viewport so the user ALWAYS sees it spin, even if scrolled! */}
      {/* ========================================================================= */}
      {(isSpinning || spinPhase !== 'idle') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 select-none">
          {/* Ambient Stadium Lighting Rays */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            <div className="w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute w-[800px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl -rotate-12" />
          </div>

          <div className="relative w-full max-w-lg p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-[#182333] via-[#0f1724] to-[#090e16] border-2 border-amber-400 shadow-[0_0_60px_rgba(245,158,11,0.35)] overflow-hidden space-y-4">
            {/* Holographic Sheen overlay */}
            <div className="absolute inset-0 pointer-events-none holo-sheen opacity-20" />

            {/* Top Bar with Stage Indicator & Fast-Forward button */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
                </span>
                <span className="font-black text-amber-300 tracking-wider uppercase text-xs sm:text-sm truncate">
                  {spinPhase === 'spinning_both'
                    ? 'REEL 1: DRAWING HISTORIC CLUB...'
                    : spinPhase === 'club_locked'
                    ? 'CLUB LOCKED! DRAWING ERA YEAR...'
                    : spinPhase === 'year_locked' || spinPhase === 'revealed'
                    ? 'SQUAD DRAW COMPLETED!'
                    : 'TACTICAL SQUAD DRAW'}
                </span>
              </div>

              {spinPhase !== 'revealed' ? (
                <button
                  onClick={handleFastForward}
                  className="px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 shadow-xs shrink-0 cursor-pointer"
                  title="Fast forward draw"
                >
                  <span>SKIP</span>
                  <FastForward className="w-3 h-3" />
                </button>
              ) : (
                <button
                  onClick={handleConfirmSquad}
                  className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[11px] flex items-center gap-1 transition-all active:scale-95 shadow-md shrink-0 cursor-pointer border border-emerald-300"
                  title="Proceed to draft"
                >
                  <span>CONTINUE</span>
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </button>
              )}
            </div>

            {/* Step Progress Indicators (Step 1: Club -> Step 2: Year) */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div
                className={`p-2 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                  spinPhase === 'club_locked' || spinPhase === 'year_locked' || spinPhase === 'revealed'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.25)]'
                    : 'bg-amber-950/40 border-amber-500/50 text-amber-300 animate-pulse'
                }`}
              >
                <span className="font-black uppercase flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  REEL 1: CLUB
                </span>
                {spinPhase === 'club_locked' || spinPhase === 'year_locked' || spinPhase === 'revealed' ? (
                  <span className="flex items-center gap-1 text-[9px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-black">
                    <CheckCircle2 className="w-2.5 h-2.5" /> LOCKED
                  </span>
                ) : (
                  <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-black">
                    SPINNING...
                  </span>
                )}
              </div>

              <div
                className={`p-2 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                  spinPhase === 'year_locked' || spinPhase === 'revealed'
                    ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                    : spinPhase === 'club_locked'
                    ? 'bg-amber-950/50 border-amber-500/60 text-amber-300 animate-pulse'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}
              >
                <span className="font-black uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  REEL 2: YEAR
                </span>
                {spinPhase === 'year_locked' || spinPhase === 'revealed' ? (
                  <span className="flex items-center gap-1 text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-black">
                    <CheckCircle2 className="w-2.5 h-2.5" /> LOCKED
                  </span>
                ) : spinPhase === 'club_locked' ? (
                  <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-black">
                    SPINNING...
                  </span>
                ) : (
                  <span className="text-[9px] text-slate-500">STANDBY</span>
                )}
              </div>
            </div>

            {/* MECHANICAL REELS DUAL DISPLAY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* REEL 1: CLUB DISPLAY */}
              <div
                className={`relative p-4 rounded-2xl border flex flex-col justify-between min-h-[120px] transition-all duration-300 overflow-hidden ${
                  spinPhase === 'club_locked' || spinPhase === 'year_locked' || spinPhase === 'revealed'
                    ? 'bg-gradient-to-br from-emerald-950/50 via-[#101924] to-[#0c131d] border-emerald-500/90 shadow-[0_0_20px_rgba(52,211,153,0.3)] ring-1 ring-emerald-400/50'
                    : 'bg-gradient-to-br from-[#211707] via-[#160f04] to-[#211707] border-amber-500/70 shadow-inner'
                }`}
              >
                <div className="absolute inset-0 pointer-events-none reel-cylinder-shade opacity-60" />

                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    CLUB / NATION
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700/80 text-slate-300 font-bold">
                    {displayLeague}
                  </span>
                </div>

                <div className="relative z-10 my-2">
                  <div
                    className={`text-xl sm:text-2xl font-black font-sans tracking-tight truncate leading-tight ${
                      spinPhase === 'club_locked' || spinPhase === 'year_locked' || spinPhase === 'revealed'
                        ? 'text-white drop-shadow-md animate-in zoom-in-95'
                        : 'text-amber-200 blur-[0.4px]'
                    }`}
                  >
                    {displayClub}
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400">STATUS:</span>
                  {spinPhase === 'club_locked' || spinPhase === 'year_locked' || spinPhase === 'revealed' ? (
                    <span className="text-emerald-400 font-black flex items-center gap-1">
                      <Lock className="w-3 h-3" /> VERIFIED
                    </span>
                  ) : (
                    <span className="text-amber-400 font-bold animate-pulse">CYCLING...</span>
                  )}
                </div>
              </div>

              {/* REEL 2: ERA YEAR DISPLAY */}
              <div
                className={`relative p-4 rounded-2xl border flex flex-col justify-between min-h-[120px] transition-all duration-300 overflow-hidden ${
                  spinPhase === 'year_locked' || spinPhase === 'revealed'
                    ? 'bg-gradient-to-br from-amber-950/60 via-[#101924] to-[#0c131d] border-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.4)] ring-1 ring-amber-400/50'
                    : spinPhase === 'club_locked'
                    ? 'bg-gradient-to-br from-[#2a1b05] via-[#1a1205] to-[#2a1b05] border-amber-500 shadow-inner'
                    : 'bg-gradient-to-br from-[#121822] via-[#0c1118] to-[#121822] border-slate-800'
                }`}
              >
                <div className="absolute inset-0 pointer-events-none reel-cylinder-shade opacity-60" />

                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    HISTORIC ERA
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-black text-[9px] border ${
                      displayTier === 'elite'
                        ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                        : displayTier === 'high'
                        ? 'bg-purple-950/80 border-purple-500 text-purple-300'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    {displayTier.toUpperCase()}
                  </span>
                </div>

                <div className="relative z-10 my-2">
                  <div
                    className={`text-2xl sm:text-3xl font-black font-mono tracking-widest leading-tight ${
                      spinPhase === 'year_locked' || spinPhase === 'revealed'
                        ? 'text-amber-300 drop-shadow-md animate-in zoom-in-95'
                        : spinPhase === 'club_locked'
                        ? 'text-amber-400 blur-[0.4px]'
                        : 'text-slate-500'
                    }`}
                  >
                    {displayYear}
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400">STATUS:</span>
                  {spinPhase === 'year_locked' || spinPhase === 'revealed' ? (
                    <span className="text-amber-400 font-black flex items-center gap-1">
                      <Lock className="w-3 h-3" /> VERIFIED
                    </span>
                  ) : spinPhase === 'club_locked' ? (
                    <span className="text-amber-400 font-bold animate-pulse">SPINNING ERA...</span>
                  ) : (
                    <span className="text-slate-500 font-medium">WAITING...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Tactical Sub-Details Bar */}
            <div className="p-3 bg-[#0d141e]/90 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400 font-bold">TACTIC:</span>
                <span className="text-emerald-300 font-black">{displayTactic}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">SQUAD POOL:</span>
                <span className="px-2 py-0.5 bg-[#17202d] rounded-md border border-slate-700 font-black text-white">
                  {displayPlayerCount} PLAYERS
                </span>
              </div>
            </div>

            {/* Action Area: Interactive Press to Continue button when revealed */}
            {spinPhase === 'revealed' || spinPhase === 'year_locked' ? (
              <div className="space-y-2 pt-1 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={handleConfirmSquad}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-mono font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(52,211,153,0.55)] border-2 border-emerald-300 transition-all active:scale-98 cursor-pointer animate-pulse"
                >
                  <Sparkles className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>CONTINUE TO DRAFT BOARD — {displayYear} {displayClub}</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
                <div className="text-center text-[10px] sm:text-[11px] text-slate-400 font-mono">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-bold">Space</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-bold">Enter</kbd> to proceed
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center font-mono text-xs text-slate-400 flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>Spinning historic archive reels...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. INLINE SQUAD WHEEL WIDGET (Always embedded in drafting layout)          */}
      {/* ========================================================================= */}
      <div className="w-full max-w-md mx-auto p-4 bg-gradient-to-b from-[#18212e] via-[#121822] to-[#0d121a] border-2 border-slate-700/80 rounded-3xl relative select-none shadow-[0_12px_36px_rgba(0,0,0,0.7)]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800 text-xs font-mono gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0 shrink-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </span>
            <span className="text-slate-200 font-black uppercase tracking-wider text-[10px] sm:text-[11px] flex items-center gap-1.5 truncate">
              <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              SQUAD ARCHIVE REEL
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 overflow-hidden">
            <span
              className={`px-2 py-0.5 rounded-lg font-black text-[9px] sm:text-[10px] tracking-wide border flex items-center gap-1 shadow-xs shrink-0 ${
                displayTier === 'elite'
                  ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-400/80 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                  : displayTier === 'high'
                  ? 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border-purple-400/80 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                  : 'bg-[#182230] border-slate-700 text-slate-300'
              }`}
            >
              {displayTier === 'elite' ? (
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              ) : (
                <Award className="w-3 h-3 text-purple-400 shrink-0" />
              )}
              {displayTier.toUpperCase()}
            </span>

            <span className="px-2 py-0.5 rounded-lg bg-[#182230] border border-slate-700/80 text-slate-200 font-bold text-[9px] sm:text-[10px] tracking-wide max-w-[110px] sm:max-w-none truncate shrink-0">
              {displayLeague}
            </span>
          </div>
        </div>

        {/* 3D Cylinder Reel Window showing Club on left and Year on right */}
        <div className="relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-800 bg-gradient-to-r from-[#0c121b] via-[#090d14] to-[#0c121b] shadow-inner overflow-hidden">
          <div className="absolute inset-0 pointer-events-none reel-cylinder-shade z-0" />

          {/* Left Side: Club/Nation Crest & Name */}
          <div className="relative z-10 flex-1 min-w-0 pr-2.5 sm:pr-3 border-r border-slate-800 flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#182333] border border-slate-700 text-emerald-400 flex items-center justify-center shrink-0 shadow-md">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9px] uppercase font-mono text-slate-400 font-black tracking-wider">
                CLUB ARCHIVE
              </div>
              <div className="text-base sm:text-lg md:text-xl font-black font-sans tracking-tight truncate drop-shadow-sm text-white">
                {displayClub}
              </div>
            </div>
          </div>

          {/* Right Side: Season Counter & Year */}
          <div className="relative z-10 pl-3 sm:pl-4 text-right flex flex-col items-end shrink-0">
            <div className="text-[9px] uppercase font-mono text-slate-400 font-black tracking-wider">
              ERA SEASON
            </div>
            <div className="text-base sm:text-lg md:text-xl font-black font-mono tracking-tight drop-shadow-sm text-amber-400 whitespace-nowrap">
              {displayYear}
            </div>
          </div>
        </div>

        {/* Tactical Sub-Bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between font-mono text-[10px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span className="text-slate-400 font-bold">TACTIC:</span>
            <span className="font-black text-emerald-300">{displayTactic}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold">ROSTER:</span>
            <span className="font-black text-slate-200 bg-[#16202c] px-2 py-0.5 rounded border border-slate-700">
              {displayPlayerCount} PLAYERS
            </span>
          </span>
        </div>
      </div>
    </>
  );
};

export const SlotWheel = React.memo(SlotWheelComponent);
