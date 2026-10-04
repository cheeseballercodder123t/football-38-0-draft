import React, { useState } from 'react';
import { ManagerDNAProfile } from '../types/football';
import { soundEngine } from '../utils/soundEngine';
import {
  Crown,
  Shield,
  Sparkles,
  Trophy,
  Flame,
  Zap,
  CheckCircle2,
  Share2,
  X,
  Compass,
  Award,
} from 'lucide-react';

interface ManagerProfileCardModalProps {
  managerName?: string;
  formationName?: string;
  onClose: () => void;
}

export function ManagerProfileCardModal({
  managerName = 'Alex Ferguson Jr',
  formationName = '4-3-3 Attacking',
  onClose,
}: ManagerProfileCardModalProps) {
  const [profile] = useState<ManagerDNAProfile>(() => {
    return {
      managerName: managerName || 'Pep Klopp',
      tacticalPhilosophy: 'Heavy-Metal Press',
      archetypeBadge: 'MASTER TACTICIAN 5★',
      riskAppetite: 'Calculated Risk-Taker',
      luckIndex: 88,
      favoriteFormation: formationName,
      totalMatchesManaged: 152,
      winRatePercent: 84.2,
      trophiesLifted: 14,
      perfectSeasonsCount: 2,
      scoutEfficiencyRating: 94,
    };
  });

  const [copied, setCopied] = useState(false);

  const handleCopyProfile = () => {
    soundEngine.playCoins();
    navigator.clipboard?.writeText(
      `👔 Tactical Draft Manager Profile: ${profile.managerName} | Philosophy: ${profile.tacticalPhilosophy} | Win Rate: ${profile.winRatePercent}% | 38-0 Invincibles: ${profile.perfectSeasonsCount} | Trophies: ${profile.trophiesLifted}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Escape key handler
  React.useEffect(() => {
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
        className="relative w-full max-w-md rounded-3xl bg-slate-950 border border-amber-500/40 p-6 shadow-2xl text-white overflow-hidden text-center cursor-default"
        onClick={e => e.stopPropagation()}
      >
        {/* Holographic background sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-emerald-500/10 to-purple-500/10 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          One Two Manager DNA Card
        </div>

        {/* Holographic Manager Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-amber-950/30 border-2 border-amber-400/60 shadow-2xl relative overflow-hidden text-left mb-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                {profile.archetypeBadge}
              </span>
              <h3 className="text-xl font-black text-white">{profile.managerName}</h3>
              <span className="text-xs text-slate-400">Favoured Shape: {profile.favoriteFormation}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/30">
              <Crown className="w-6 h-6" />
            </div>
          </div>

          {/* Tactical Traits Grid */}
          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Philosophy</span>
              <span className="text-xs font-black text-emerald-400">{profile.tacticalPhilosophy}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Risk Profile</span>
              <span className="text-xs font-black text-amber-400">{profile.riskAppetite}</span>
            </div>
          </div>

          {/* Core Metrics Table */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Career Win Rate</span>
              <span className="font-mono font-black text-white">{profile.winRatePercent}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">38-0 Perfect Invincibles</span>
              <span className="font-mono font-black text-amber-400">{profile.perfectSeasonsCount} Trophies</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Silverware Cabinet</span>
              <span className="font-mono font-black text-emerald-400">{profile.trophiesLifted} Titles</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Tactical Luck Index</span>
              <span className="font-mono font-black text-cyan-400">{profile.luckIndex} / 100</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyProfile}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>COPIED TO CLIPBOARD!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>SHARE MANAGER DNA CARD</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
