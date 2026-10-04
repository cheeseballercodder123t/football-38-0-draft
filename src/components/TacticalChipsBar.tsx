import React from 'react';
import { TacticalChipType, TacticalChipsState } from '../types/football';
import { soundEngine } from '../utils/soundEngine';
import { Sparkles, Shield, Zap, RefreshCw, CheckCircle2 } from 'lucide-react';

interface TacticalChipsBarProps {
  chipsState: TacticalChipsState;
  onActivateChip: (chip: TacticalChipType) => void;
  captainName?: string;
}

export function TacticalChipsBar({
  chipsState,
  onActivateChip,
  captainName,
}: TacticalChipsBarProps) {
  const chips: {
    id: TacticalChipType;
    title: string;
    icon: typeof Sparkles;
    tagline: string;
    description: string;
    isUsed: boolean;
    color: string;
    activeBorder: string;
  }[] = [
    {
      id: 'triple_captain',
      title: 'Triple Captain',
      icon: Sparkles,
      tagline: '3x Captain Multiplier',
      description: `Multiplies ${captainName || 'Captain'}'s match impact & goal threat by 300% for this match!`,
      isUsed: chipsState.tripleCaptainUsed,
      color: 'from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/40',
      activeBorder: 'border-amber-400 ring-2 ring-amber-400/50 bg-amber-500/30 text-amber-200',
    },
    {
      id: 'bench_boost',
      title: 'Bench Boost',
      icon: Shield,
      tagline: '+5 Squad Rating',
      description: 'Your 5 bench substitutes lend their entire strength to boost starting XI rating by +5 OVR!',
      isUsed: chipsState.benchBoostUsed,
      color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/40',
      activeBorder: 'border-cyan-400 ring-2 ring-cyan-400/50 bg-cyan-500/30 text-cyan-200',
    },
    {
      id: 'free_hit',
      title: 'Free Hit Loan',
      icon: Zap,
      tagline: '95+ Galáctico Rent',
      description: 'Rent a temporary 95+ OVR superstar legend into your starting lineup for this fixture only!',
      isUsed: chipsState.freeHitUsed,
      color: 'from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/40',
      activeBorder: 'border-purple-400 ring-2 ring-purple-400/50 bg-purple-500/30 text-purple-200',
    },
    {
      id: 'wildcard',
      title: 'Tactical Wildcard',
      icon: RefreshCw,
      tagline: 'Full Squad Reset',
      description: 'Instant squad morale reset & stamina recovery for the entire 16-man squad!',
      isUsed: chipsState.wildcardUsed,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/40',
      activeBorder: 'border-emerald-400 ring-2 ring-emerald-400/50 bg-emerald-500/30 text-emerald-200',
    },
  ];

  return (
    <div className="w-full mb-4 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl select-none">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Tactical Power Chips (One Two Inspired)</span>
        </div>
        <span className="text-[10px] text-slate-400">1 Use Per Season · Play Before Match</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {chips.map(chip => {
          const Icon = chip.icon;
          const isActive = chipsState.activeChipForNextMatch === chip.id;
          return (
            <button
              key={chip.id}
              disabled={chip.isUsed}
              onClick={() => {
                if (chip.isUsed) return;
                soundEngine.playClick();
                onActivateChip(chip.id);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                chip.isUsed
                  ? 'bg-slate-950/60 border-slate-800/60 opacity-40 cursor-not-allowed text-slate-500'
                  : isActive
                  ? chip.activeBorder
                  : `bg-gradient-to-br ${chip.color} hover:brightness-110 active:scale-[0.98] cursor-pointer`
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-xs">{chip.title}</span>
                {chip.isUsed ? (
                  <span className="text-[9px] font-bold text-slate-500">USED</span>
                ) : isActive ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white animate-pulse" />
                ) : (
                  <Icon className="w-3 h-3 opacity-80" />
                )}
              </div>
              <span className="text-[10px] font-bold leading-tight line-clamp-1">{chip.tagline}</span>
              <span className="text-[9px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                {chip.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
