import React, { useState, useEffect } from 'react';
import {
  Link2,
  Sparkles,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  RotateCcw,
  Clock,
  Coins,
  ChevronRight,
  X,
  Info,
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export interface ChainCandidate {
  id: string;
  name: string;
  club: string;
  year: string;
  sharedWith: string[]; // List of names this player shared a locker room with
  description: string;
}

export interface ChainLevel {
  id: string;
  startPlayer: string;
  startClub: string;
  targetPlayer: string;
  targetClub: string;
  targetPathLength: number; // e.g. 2 links
  candidates: ChainCandidate[];
  optimalPath: string[];
}

const CHAIN_LEVELS: ChainLevel[] = [
  {
    id: 'chain_1',
    startPlayer: 'Cristiano Ronaldo',
    startClub: 'Manchester United (2007-08)',
    targetPlayer: 'Thierry Henry',
    targetClub: 'Arsenal (2003-04)',
    targetPathLength: 2,
    candidates: [
      {
        id: 'c1_rvp',
        name: 'Robin van Persie',
        club: 'Arsenal (2004-12) & Man Utd (2012-15)',
        year: 'Multi-Club',
        sharedWith: ['Thierry Henry', 'Wayne Rooney', 'Rio Ferdinand'],
        description: 'Played with Henry at Arsenal in 2004-06, and with Rooney at Old Trafford.',
      },
      {
        id: 'c1_rooney',
        name: 'Wayne Rooney',
        club: 'Manchester United (2004-17)',
        year: '2004-2017',
        sharedWith: ['Cristiano Ronaldo', 'Robin van Persie', 'Carlos Tevez', 'Ashley Cole'],
        description: 'Teammate of Cristiano Ronaldo during the 2008 Champions League win.',
      },
      {
        id: 'c1_cole',
        name: 'Ashley Cole',
        club: 'Arsenal (1999-06) & England',
        year: 'Invincibles',
        sharedWith: ['Thierry Henry', 'Wayne Rooney', 'Rio Ferdinand'],
        description: 'Key Invincible with Henry at Arsenal; shared England international caps.',
      },
      {
        id: 'c1_tevez',
        name: 'Carlos Tevez',
        club: 'Manchester United (2007-09)',
        year: '2007-09',
        sharedWith: ['Cristiano Ronaldo', 'Wayne Rooney'],
        description: 'Part of the devastating Rooney-Ronaldo-Tevez front three.',
      },
      {
        id: 'c1_xavi',
        name: 'Xavi Hernandez',
        club: 'Barcelona (1998-15)',
        year: '2008-11',
        sharedWith: ['Thierry Henry', 'Lionel Messi', 'Andrés Iniesta'],
        description: 'Teammate of Henry during Barcelona 2008-09 treble.',
      },
    ],
    optimalPath: ['Wayne Rooney', 'Robin van Persie'],
  },
  {
    id: 'chain_2',
    startPlayer: 'Lionel Messi',
    startClub: 'Barcelona (2010-11)',
    targetPlayer: 'Zlatan Ibrahimović',
    targetClub: 'AC Milan / Inter Milan',
    targetPathLength: 1,
    candidates: [
      {
        id: 'c2_maxwell',
        name: 'Maxwell',
        club: 'Barcelona (2009-12) & PSG (2012-17)',
        year: '2009-17',
        sharedWith: ['Lionel Messi', 'Zlatan Ibrahimović'],
        description: 'Legendary Brazilian left-back who played alongside Zlatan at 4 different clubs and with Messi at Barça.',
      },
      {
        id: 'c2_pique',
        name: 'Gerard Piqué',
        club: 'Barcelona (2008-22)',
        year: '2008-22',
        sharedWith: ['Lionel Messi', 'Zlatan Ibrahimović'],
        description: 'Shared the pitch with both Messi and Zlatan during Ibrahimović’s Barcelona season (2009-10).',
      },
      {
        id: 'c2_hazard',
        name: 'Eden Hazard',
        club: 'Chelsea & Real Madrid',
        year: '2012-21',
        sharedWith: ['Thibaut Courtois', 'Luka Modrić'],
        description: 'Belgian wizard with no mutual club locker room with Zlatan.',
      },
      {
        id: 'c2_alves',
        name: 'Dani Alves',
        club: 'Barcelona & PSG & Juventus',
        year: '2008-19',
        sharedWith: ['Lionel Messi', 'Zlatan Ibrahimović'],
        description: 'Fullback icon who fed crosses to both Messi and Zlatan at Camp Nou and Paris.',
      },
    ],
    optimalPath: ['Gerard Piqué'],
  },
];

interface TeammateChainPuzzleModalProps {
  onAwardTokens: (tokens: number) => void;
  onClose: () => void;
}

export function TeammateChainPuzzleModal({
  onAwardTokens,
  onClose,
}: TeammateChainPuzzleModalProps) {
  const [levelIdx, setLevelIdx] = useState<number>(0);
  const currentLevel = CHAIN_LEVELS[levelIdx];
  const [selectedChain, setSelectedChain] = useState<ChainCandidate[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [streak, setStreak] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('teammate_chain_streak') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [revealedHint, setRevealedHint] = useState<string | null>(null);

  const handleSelectCandidate = (candidate: ChainCandidate) => {
    soundEngine.playChainLink();

    // Check if valid link
    const previousNode = selectedChain.length === 0
      ? currentLevel.startPlayer
      : selectedChain[selectedChain.length - 1].name;

    const connectsToPrev = candidate.sharedWith.includes(previousNode);

    if (!connectsToPrev) {
      soundEngine.playRedCard();
      setFeedbackError(`${candidate.name} never shared a dressing room with ${previousNode}!`);
      setTimeout(() => setFeedbackError(null), 3000);
      return;
    }

    const nextChain = [...selectedChain, candidate];
    setSelectedChain(nextChain);
    setFeedbackError(null);

    // Check if this candidate links directly to targetPlayer
    if (candidate.sharedWith.includes(currentLevel.targetPlayer)) {
      setIsSuccess(true);
      soundEngine.playBullseye();
      const newStreak = streak + 1;
      setStreak(newStreak);
      try {
        localStorage.setItem('teammate_chain_streak', String(newStreak));
      } catch {}
      const tokenReward = Math.min(6, 2 + newStreak);
      onAwardTokens(tokenReward);
    }
  };

  const handleUseHint = () => {
    soundEngine.playClick();
    const optimal = currentLevel.optimalPath[0];
    setRevealedHint(`💡 Scout Intel: Look for ${optimal} to complete the mutual locker room connection!`);
  };

  const handleResetChain = () => {
    setSelectedChain([]);
    setIsSuccess(false);
    setFeedbackError(null);
    setRevealedHint(null);
  };

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300 cursor-pointer"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-teal-500/40 p-5 sm:p-6 shadow-2xl shadow-teal-500/10 text-white cursor-default"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  Teammate <span className="text-teal-400">Chain</span>
                </h3>
                {streak > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 text-[10px]">
                    🔥 Streak: {streak}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400">
                Locker Room Connection Challenge · Earn up to 5 Scout Tokens
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {revealedHint && (
          <div className="mb-4 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-between">
            <span>{revealedHint}</span>
            <button onClick={() => setRevealedHint(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Objective Goal Card */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 mb-5">
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Start</span>
            <h4 className="font-black text-sm text-teal-400">{currentLevel.startPlayer}</h4>
            <span className="text-[10px] text-slate-400">{currentLevel.startClub}</span>
          </div>

          <div className="flex items-center gap-2 text-teal-400">
            <div className="h-0.5 w-12 bg-gradient-to-r from-teal-500 to-emerald-400 hidden sm:block" />
            <Link2 className="w-5 h-5 animate-pulse" />
            <div className="h-0.5 w-12 bg-gradient-to-r from-emerald-400 to-teal-500 hidden sm:block" />
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Target</span>
            <h4 className="font-black text-sm text-amber-400">{currentLevel.targetPlayer}</h4>
            <span className="text-[10px] text-slate-400">{currentLevel.targetClub}</span>
          </div>
        </div>

        {/* Current Linked Chain Nodes */}
        <div className="mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Active Connection Chain:
          </span>
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 min-h-[52px]">
            <span className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 font-bold text-xs border border-teal-500/30">
              {currentLevel.startPlayer}
            </span>

            {selectedChain.map((node, i) => (
              <React.Fragment key={node.id}>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                  {node.name}
                </span>
              </React.Fragment>
            ))}

            {isSuccess && (
              <>
                <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {currentLevel.targetPlayer}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Error Feedback */}
        {feedbackError && (
          <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 font-medium mb-3 flex items-center gap-2 animate-in fade-in">
            <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{feedbackError}</span>
          </div>
        )}

        {/* Success Banner */}
        {isSuccess ? (
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/50 text-center my-4 animate-in zoom-in-95">
            <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-2 animate-bounce" />
            <h4 className="font-black text-lg text-white">Chain Complete! 🌟</h4>
            <p className="text-xs text-emerald-300 mb-3">
              You linked {currentLevel.startPlayer} to {currentLevel.targetPlayer} through mutual dressing room history!
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-4">
              <Coins className="w-3.5 h-3.5" /> +3 Scout Tokens Awarded
            </div>
            <div>
              {levelIdx < CHAIN_LEVELS.length - 1 ? (
                <button
                  onClick={() => {
                    setLevelIdx(prev => prev + 1);
                    handleResetChain();
                  }}
                  className="px-5 py-2 rounded-lg font-bold text-xs bg-emerald-400 text-slate-950 hover:bg-emerald-300 transition-all cursor-pointer"
                >
                  Next Challenge →
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-lg font-bold text-xs bg-emerald-400 text-slate-950 hover:bg-emerald-300 transition-all cursor-pointer"
                >
                  Claim & Exit
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Candidate Selection Grid */
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Select Mutual Teammate:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {currentLevel.candidates.map(candidate => {
                const isAlreadySelected = selectedChain.some(c => c.id === candidate.id);
                return (
                  <button
                    key={candidate.id}
                    disabled={isAlreadySelected}
                    onClick={() => handleSelectCandidate(candidate)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isAlreadySelected
                        ? 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-default'
                        : 'bg-slate-900 border-slate-800 hover:border-teal-500/60 hover:bg-slate-850 active:scale-[0.98] cursor-pointer group'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-extrabold text-xs text-white group-hover:text-teal-300 transition-colors">
                        {candidate.name}
                      </h5>
                      <span className="text-[10px] font-mono text-slate-400">{candidate.year}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{candidate.club}</p>
                    <p className="text-[10px] text-slate-500 italic mt-1 line-clamp-1">{candidate.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer controls */}
        {!isSuccess && (
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={handleUseHint}
              className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              💡 Scout Hint
            </button>
            <button
              onClick={handleResetChain}
              className="text-slate-400 hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Chain
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
