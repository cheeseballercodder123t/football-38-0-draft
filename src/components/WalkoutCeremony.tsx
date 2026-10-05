import React, { useState, useEffect, useRef } from 'react';
import { Player } from '../types/football';
import { soundEngine } from '../utils/soundEngine';
import { Sparkles, Trophy, Shield, Flame, FastForward, Check, Crown, Star, Globe, Zap, X } from 'lucide-react';

interface WalkoutCeremonyProps {
  player: Player;
  onDismiss: () => void;
}

export const WalkoutCeremony: React.FC<WalkoutCeremonyProps> = ({ player, onDismiss }) => {
  const [stage, setStage] = useState<number>(0);
  const [strobe, setStrobe] = useState<boolean>(false);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<number>(stage);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  const clearAllTimers = () => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
  };

  const handleFastReveal = () => {
    clearAllTimers();
    setStrobe(true);
    setTimeout(() => setStrobe(false), 500);
    soundEngine.playWalkoutFirework();
    setStage(4);
    stageRef.current = 4;
  };

  const handleDirectSkip = () => {
    clearAllTimers();
    onDismiss();
  };

  useEffect(() => {
    soundEngine.playWalkoutBoom();

    const t1 = setTimeout(() => {
      setStage(1);
      stageRef.current = 1;
      soundEngine.playWalkoutStageReveal();
    }, 600); // Stage 1: Nation
    timersRef.current.push(t1);

    const t2 = setTimeout(() => {
      setStage(2);
      stageRef.current = 2;
      soundEngine.playWalkoutStageReveal();
    }, 1400); // Stage 2: Position
    timersRef.current.push(t2);

    const t3 = setTimeout(() => {
      setStage(3);
      stageRef.current = 3;
      soundEngine.playWalkoutStageReveal();
    }, 2200); // Stage 3: Club
    timersRef.current.push(t3);

    const t4 = setTimeout(() => {
      setStrobe(true);
      setTimeout(() => setStrobe(false), 500);
      setStage(4);
      stageRef.current = 4;
      soundEngine.playWalkoutFirework();
    }, 3000); // Stage 4: Grand Card Reveal & Fireworks
    timersRef.current.push(t4);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDirectSkip();
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (stageRef.current < 4) {
          handleFastReveal();
        } else {
          handleDirectSkip();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearAllTimers();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [player]);

  const handleContainerClick = () => {
    if (stage < 4) {
      handleFastReveal();
    } else {
      handleDirectSkip();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (stage < 4 || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    setTilt({ x: Math.max(-14, Math.min(14, rotateX)), y: Math.max(-14, Math.min(14, rotateY)) });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const isImmortal = player.overall >= 93;
  const isLegendary = player.overall >= 90 || player.auraTrait?.rarity === 'Legendary';

  return (
    <div
      onClick={handleContainerClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 cursor-pointer select-none overflow-hidden animate-in fade-in duration-300"
    >
      {/* Screen Strobe Flash on Reveal */}
      {strobe && (
        <div className="absolute inset-0 bg-white/40 pointer-events-none z-50 animate-strobe-flash" />
      )}

      {/* Dynamic Volumetric Stadium Floodlights & God-Rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Left floodlight beam */}
        <div
          className={`absolute -top-32 -left-20 w-[420px] h-[550px] rounded-full blur-[90px] rotate-12 animate-pulse ${
            isImmortal
              ? 'bg-gradient-to-br from-amber-500/35 via-yellow-400/15 to-transparent'
              : isLegendary
              ? 'bg-gradient-to-br from-purple-500/35 via-fuchsia-400/15 to-transparent'
              : 'bg-gradient-to-br from-emerald-500/35 via-teal-400/15 to-transparent'
          }`}
        />
        {/* Right floodlight beam */}
        <div
          className={`absolute -top-32 -right-20 w-[420px] h-[550px] rounded-full blur-[90px] -rotate-12 animate-pulse ${
            isImmortal
              ? 'bg-gradient-to-bl from-yellow-500/35 via-amber-400/15 to-transparent'
              : isLegendary
              ? 'bg-gradient-to-bl from-cyan-500/35 via-blue-400/15 to-transparent'
              : 'bg-gradient-to-bl from-teal-500/35 via-emerald-400/15 to-transparent'
          }`}
        />
        {/* Floor stadium aura */}
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-gradient-to-t from-amber-500/25 via-yellow-500/10 to-transparent rounded-full blur-[110px]" />

        {/* Sweeping Stadium Lasers */}
        <div
          className={`absolute bottom-0 left-1/4 w-3 sm:w-4 h-[120vh] origin-bottom animate-laser-left blur-[1px] opacity-70 ${
            isImmortal
              ? 'bg-gradient-to-t from-amber-400 via-yellow-300 to-transparent shadow-[0_0_20px_#f59e0b]'
              : isLegendary
              ? 'bg-gradient-to-t from-purple-400 via-fuchsia-300 to-transparent shadow-[0_0_20px_#a855f7]'
              : 'bg-gradient-to-t from-emerald-400 via-teal-300 to-transparent shadow-[0_0_20px_#10b981]'
          }`}
        />
        <div
          className={`absolute bottom-0 right-1/4 w-3 sm:w-4 h-[120vh] origin-bottom animate-laser-right blur-[1px] opacity-70 ${
            isImmortal
              ? 'bg-gradient-to-t from-yellow-400 via-amber-300 to-transparent shadow-[0_0_20px_#eab308]'
              : isLegendary
              ? 'bg-gradient-to-t from-cyan-400 via-sky-300 to-transparent shadow-[0_0_20px_#06b6d4]'
              : 'bg-gradient-to-t from-teal-400 via-emerald-300 to-transparent shadow-[0_0_20px_#14b8a6]'
          }`}
        />
      </div>

      {/* Floating Gold Confetti & Sparks on Stage 4 */}
      {stage >= 4 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={`confetti-${i}`}
              style={{
                left: `${(i * 2.8 + 2) % 96}%`,
                top: `${(i * 6.7) % 92}%`,
                animationDelay: `${(i * 0.12) % 2.5}s`,
                animationDuration: `${2.2 + (i % 3)}s`,
              }}
              className={`absolute w-2 h-2 rounded-xs animate-bounce opacity-85 shadow-[0_0_8px] ${
                isImmortal
                  ? 'bg-gradient-to-tr from-amber-300 to-yellow-100 shadow-amber-400'
                  : isLegendary
                  ? 'bg-gradient-to-tr from-purple-300 to-cyan-100 shadow-purple-400'
                  : 'bg-gradient-to-tr from-emerald-300 to-teal-100 shadow-emerald-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* Dual Pyrotechnic Flare Cannons on Stage 4 */}
      {stage >= 4 && (
        <>
          <div
            className={`absolute bottom-0 left-4 sm:left-24 w-12 sm:w-20 h-96 bg-gradient-to-t via-white/40 to-transparent blur-md pointer-events-none z-10 animate-pulse ${
              isImmortal
                ? 'from-amber-400'
                : isLegendary
                ? 'from-purple-500'
                : 'from-emerald-400'
            }`}
          />
          <div
            className={`absolute bottom-0 right-4 sm:right-24 w-12 sm:w-20 h-96 bg-gradient-to-t via-white/40 to-transparent blur-md pointer-events-none z-10 animate-pulse ${
              isImmortal
                ? 'from-yellow-400'
                : isLegendary
                ? 'from-cyan-400'
                : 'from-teal-400'
            }`}
          />
        </>
      )}

      {/* Top Controls: Fast Reveal & Direct Skip Buttons */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 z-50">
        {stage < 4 && (
          <button
            onClick={e => {
              e.stopPropagation();
              handleFastReveal();
            }}
            className="px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-white border border-amber-500/60 font-mono text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg active:scale-95 hover:border-amber-400 cursor-pointer"
            title="Reveal full player card immediately"
          >
            <span>REVEAL CARD</span>
            <FastForward className="w-3.5 h-3.5 text-amber-400" />
          </button>
        )}

        <button
          onClick={e => {
            e.stopPropagation();
            handleDirectSkip();
          }}
          className="px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-mono text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-all shadow-lg active:scale-95 hover:border-slate-500 cursor-pointer"
          title="Skip ceremony directly to draft"
        >
          <span>SKIP</span>
          <X className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Main Walkout Tunnel Arena */}
      <div className="relative z-30 flex flex-col items-center justify-center max-w-md w-full text-center space-y-4 px-2">
        {/* Walkout Banner */}
        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full border font-mono font-black text-[11px] sm:text-xs uppercase tracking-widest shadow-2xl transition-all duration-300 ${
            isImmortal
              ? 'bg-gradient-to-r from-amber-500/30 via-yellow-400/40 to-amber-500/30 border-amber-300 text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.6)] animate-pulse'
              : isLegendary
              ? 'bg-gradient-to-r from-purple-500/30 via-amber-400/30 to-purple-500/30 border-purple-400 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.5)]'
              : 'bg-gradient-to-r from-emerald-500/25 via-teal-400/30 to-emerald-500/25 border-emerald-400/80 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.5)]'
          }`}
        >
          {isImmortal ? (
            <Crown className="w-4 h-4 text-amber-300 shrink-0 animate-bounce" />
          ) : isLegendary ? (
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span className="truncate">
            {isImmortal
              ? '👑 ALL-TIME FOOTBALL IMMORTAL 👑'
              : isLegendary
              ? '★ WORLD-CLASS SQUAD WALKOUT ★'
              : '★ OFFICIAL SQUAD WALKOUT ★'}
          </span>
        </div>

        {/* Staged Clue Teaser Pillars (Nation -> Position -> Club) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 font-mono text-xs flex-wrap">
          {/* 1. Nationality */}
          <div
            className={`px-3 py-1.5 rounded-2xl border transition-all duration-300 flex items-center gap-2 shadow-lg ${
              stage >= 1
                ? 'bg-amber-950/90 border-amber-400 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-105 ring-1 ring-amber-400/60'
                : 'bg-slate-900/60 border-slate-800 text-slate-600'
            }`}
          >
            <Globe className={`w-3.5 h-3.5 ${stage >= 1 ? 'text-amber-400' : 'text-slate-600'}`} />
            <span className="text-[10px] text-slate-400 font-bold">NATION:</span>
            <span className="font-black text-white font-sans text-xs sm:text-sm">
              {stage >= 1 ? player.country : '???'}
            </span>
          </div>

          {/* 2. Position */}
          <div
            className={`px-3 py-1.5 rounded-2xl border transition-all duration-300 flex items-center gap-2 shadow-lg ${
              stage >= 2
                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-100 shadow-[0_0_20px_rgba(56,189,248,0.5)] scale-105 ring-1 ring-cyan-400/60'
                : 'bg-slate-900/60 border-slate-800 text-slate-600'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${stage >= 2 ? 'text-cyan-400' : 'text-slate-600'}`} />
            <span className="text-[10px] text-slate-400 font-bold">POS:</span>
            <span className="font-black text-white font-mono text-xs sm:text-sm">
              {stage >= 2 ? player.specificPosition : '???'}
            </span>
          </div>

          {/* 3. Club */}
          <div
            className={`px-3 py-1.5 rounded-2xl border transition-all duration-300 flex items-center gap-2 shadow-lg ${
              stage >= 3
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100 shadow-[0_0_20px_rgba(52,211,153,0.5)] scale-105 ring-1 ring-emerald-400/60'
                : 'bg-slate-900/60 border-slate-800 text-slate-600'
            }`}
          >
            <Shield className={`w-3.5 h-3.5 ${stage >= 3 ? 'text-emerald-400' : 'text-slate-600'}`} />
            <span className="text-[10px] text-slate-400 font-bold">CLUB:</span>
            <span className="font-black text-white truncate max-w-[100px] sm:max-w-[130px] text-xs sm:text-sm">
              {stage >= 3 ? player.clubName : '???'}
            </span>
          </div>
        </div>

        {/* Stadium Tunnel Silhouette Entrance while clues build up (Stage 0 - 3) */}
        {stage < 4 && (
          <div className="relative w-64 h-56 flex flex-col items-center justify-center pointer-events-none">
            {/* Illuminated Tunnel Archway */}
            <div className="relative w-40 h-48 rounded-t-full border-4 border-amber-400/40 bg-gradient-to-b from-white/20 via-amber-400/10 to-slate-950/80 shadow-[0_0_40px_rgba(245,158,11,0.3)] flex items-center justify-center overflow-hidden">
              {/* Backlight flare */}
              <div className="absolute inset-0 bg-radial from-white/40 via-amber-300/20 to-transparent blur-md" />
              {/* Footballer Silhouette emerging */}
              <div className="relative z-10 animate-tunnel-walk flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-slate-950 shadow-[0_0_15px_rgba(0,0,0,0.9)] mb-1" />
                <div className="w-24 h-28 bg-slate-950 rounded-t-3xl shadow-[0_0_20px_rgba(0,0,0,0.9)]" />
              </div>
            </div>
            <div className="text-[11px] font-mono text-amber-300 mt-2 font-bold tracking-widest animate-pulse">
              PLAYER WALKING OUT...
            </div>
          </div>
        )}

        {/* 4. Giant Walkout Card Explosion & 3D Interactive Tilt */}
        {stage >= 4 && (
          <div
            className="relative mt-2"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Divine God-Rays */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] pointer-events-none opacity-60 animate-divine-rays">
              <div
                className={`w-full h-full rounded-full blur-3xl ${
                  isImmortal
                    ? 'bg-gradient-to-tr from-amber-400/60 via-yellow-300/40 to-transparent'
                    : isLegendary
                    ? 'bg-gradient-to-tr from-purple-500/60 via-fuchsia-400/40 to-transparent'
                    : 'bg-gradient-to-tr from-emerald-500/60 via-teal-400/40 to-transparent'
                }`}
              />
            </div>

            <div
              ref={cardRef}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: 'transform 0.12s ease-out',
              }}
              className={`relative w-72 sm:w-84 rounded-3xl p-6 border-2 transition-shadow duration-700 overflow-hidden shadow-2xl ${
                isImmortal
                  ? 'card-foil-gold border-amber-300 shadow-[0_0_80px_rgba(245,158,11,0.85)] divine-glow-gold'
                  : isLegendary
                  ? 'card-foil-epic border-purple-400 shadow-[0_0_75px_rgba(168,85,247,0.75)]'
                  : 'card-foil-rare border-emerald-400 shadow-[0_0_70px_rgba(52,211,153,0.7)]'
              }`}
            >
              {/* Prismatic Rainbow Sheen */}
              <div className="absolute inset-0 pointer-events-none holo-sheen opacity-40" />

              {/* Card Top: OVR & Position */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div
                  className={`flex items-baseline gap-1 px-3.5 py-1.5 rounded-xl font-mono font-black shadow-lg ${
                    isImmortal
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-amber-950/60'
                      : isLegendary
                      ? 'bg-gradient-to-r from-purple-400 to-fuchsia-500 text-slate-950 shadow-purple-950/60'
                      : 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-emerald-950/60'
                  }`}
                >
                  <span className="text-3xl leading-none">{player.overall}</span>
                  <span className="text-[10px] uppercase font-bold">OVR</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-xl bg-slate-900/90 border border-amber-400/80 text-amber-300 font-mono font-black text-sm uppercase shadow-md">
                    {player.specificPosition}
                  </span>
                  {isImmortal && (
                    <Crown className="w-5 h-5 text-amber-300 drop-shadow animate-bounce" />
                  )}
                  {isLegendary && !isImmortal && (
                    <Star className="w-5 h-5 text-purple-300 drop-shadow animate-pulse" />
                  )}
                </div>
              </div>

              {/* Player Name & Era */}
              <div className="my-5 relative z-10">
                <div className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight drop-shadow-lg">
                  {player.name}
                </div>
                <div className="text-xs font-mono text-amber-200 mt-1.5 flex items-center justify-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-black/40 border border-white/10 font-bold">
                    {player.clubYear}
                  </span>
                  <span>•</span>
                  <span className="text-slate-200 font-semibold">{player.league}</span>
                </div>
              </div>

              {/* Six Key Attributes Grid */}
              <div className="grid grid-cols-6 gap-1.5 p-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 font-mono text-center relative z-10 shadow-inner">
                {[
                  { label: 'PAC', val: player.pace },
                  { label: 'SHO', val: player.shooting },
                  { label: 'PAS', val: player.passing },
                  { label: 'DRI', val: player.dribbling },
                  { label: 'DEF', val: player.defending },
                  { label: 'PHY', val: player.physical },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-[8px] text-slate-400 font-bold">{s.label}</div>
                    <div
                      className={`text-xs font-black ${
                        s.val >= 90
                          ? 'text-amber-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]'
                          : s.val >= 80
                          ? 'text-emerald-400'
                          : 'text-slate-200'
                      }`}
                    >
                      {s.val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Aura Trait Banner */}
              {player.auraTrait && (
                <div className="mt-3.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/25 via-yellow-400/20 to-amber-500/25 border border-amber-400/80 text-[10px] text-amber-200 font-mono font-black flex items-center justify-center gap-1.5 relative z-10 shadow-md">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-current animate-pulse" />
                  <span>AURA: {player.auraTrait.name.toUpperCase()}</span>
                  <span className="text-[8px] px-1 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/60 uppercase">
                    {player.auraTrait.rarity}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Prompt */}
        <div className="pt-2 text-xs font-mono">
          {stage >= 4 ? (
            <div
              onClick={e => {
                e.stopPropagation();
                handleDirectSkip();
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-950/80 animate-bounce cursor-pointer border-2 border-emerald-300 transition-all active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>ADD TO SQUAD (TAP ANYWHERE / PRESS SPACE)</span>
            </div>
          ) : (
            <span className="text-slate-400 animate-pulse flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Declassifying historic masterclass scouting data... (Tap to Reveal)</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
