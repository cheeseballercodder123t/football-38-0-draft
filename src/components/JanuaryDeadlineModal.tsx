import React, { useState } from 'react';
import {
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Users,
  AlertTriangle,
  CheckCircle2,
  X,
  Coins,
  ArrowUpDown,
} from 'lucide-react';
import { Player } from '../types/football';
import { SQUADS } from '../data/squads';
import { soundEngine } from '../utils/soundEngine';

interface JanuaryDeadlineModalProps {
  startingXI: (Player | null)[];
  scoutTokens: number;
  onSignReplacement: (newPlayer: Player, slotIndex: number) => void;
  onApplyMoraleBoost: () => void;
  onClose: () => void;
}

export function JanuaryDeadlineModal({
  startingXI,
  scoutTokens,
  onSignReplacement,
  onApplyMoraleBoost,
  onClose,
}: JanuaryDeadlineModalProps) {
  // Find the lowest-rated starter to recommend for upgrade
  const lowestSlot = (() => {
    let lowestIdx = -1;
    let lowestOvr = 100;
    startingXI.forEach((p, idx) => {
      if (p && p.overall < lowestOvr) {
        lowestOvr = p.overall;
        lowestIdx = idx;
      }
    });
    return {
      index: lowestIdx >= 0 ? lowestIdx : 0,
      player: lowestIdx >= 0 ? startingXI[lowestIdx] : null,
    };
  })();

  const [activeTab, setActiveTab] = useState<'options' | 'shortlist' | 'superspin' | 'loan'>('options');
  const [selectedSlotIdx, setSelectedSlotIdx] = useState<number>(lowestSlot.index);
  const [loanPlayer, setLoanPlayer] = useState<Player | null>(null);

  const handleRollLoan = () => {
    setActiveTab('loan');
    const eliteSquads = SQUADS.filter(s => s.tier === 'elite');
    const sq = eliteSquads[Math.floor(Math.random() * eliteSquads.length)] || SQUADS[0];
    const topStars = sq.players.filter(p => p.overall >= 89);
    const chosen = topStars[Math.floor(Math.random() * topStars.length)] || sq.players[0];
    setLoanPlayer(chosen);
    soundEngine.playCardDraft();
  };

  // Generate 3 curated shortlist targets matching the target slot's position
  const [curatedTargets] = useState<Player[]>(() => {
    const targetPos = lowestSlot.player?.position || 'MID';
    const allMatches: Player[] = [];
    SQUADS.forEach(sq => {
      sq.players.forEach(p => {
        if (p.position === targetPos && p.overall >= 86 && p.overall <= 94) {
          allMatches.push(p);
        }
      });
    });
    // Shuffle & take 3
    return allMatches.sort(() => Math.random() - 0.5).slice(0, 3);
  });

  const [superSpunPlayer, setSuperSpunPlayer] = useState<Player | null>(null);
  const [isSuperSpinning, setIsSuperSpinning] = useState<boolean>(false);

  React.useEffect(() => {
    soundEngine.playDeadlineBuzzer();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSuperSpin = () => {
    setIsSuperSpinning(true);
    soundEngine.playSpinWheel();

    const eliteSquads = SQUADS.filter(s => s.tier === 'elite');
    const sq = eliteSquads[Math.floor(Math.random() * eliteSquads.length)] || SQUADS[0];
    const highTierPlayers = sq.players.filter(p => p.overall >= 88);
    const chosen = highTierPlayers[Math.floor(Math.random() * highTierPlayers.length)] || sq.players[0];

    setTimeout(() => {
      setSuperSpunPlayer(chosen);
      setIsSuperSpinning(false);
      soundEngine.playCardDraft();
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300 cursor-pointer"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-yellow-500/40 p-5 sm:p-6 shadow-2xl shadow-yellow-500/10 text-white cursor-default"
        onClick={e => e.stopPropagation()}
      >
        {/* Sky Sports Deadline Yellow Ticker */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500 text-slate-950 font-black text-xs tracking-wider uppercase mb-4 shadow">
          <Clock className="w-4 h-4 animate-spin" />
          <span>BREAKING NEWS: JANUARY TRANSFER WINDOW · DEADLINE DAY (MATCHDAY 19)</span>
        </div>

        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Deadline Day <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300">Drama</span> 🚨
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              At the season midpoint, will you stick or twist? Reinforce your title charge with an emergency upgrade or rally squad morale.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {activeTab === 'options' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-4">
            {/* Option 1: Curated Scout Shortlist */}
            <div
              onClick={() => setActiveTab('shortlist')}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-yellow-400/60 hover:bg-slate-850 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 flex items-center justify-center font-bold mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-sm text-white group-hover:text-yellow-300 transition-colors">
                  Scout Shortlist
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Shortlist of 3 elite targets to upgrade your lowest-rated starter (
                  <b className="text-white">{lowestSlot.player?.name}</b>, {lowestSlot.player?.overall} OVR).
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-400 mt-4 group-hover:translate-x-1 transition-transform">
                Inspect Shortlist <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Option 2: High-Stakes Super-Spin */}
            <div
              onClick={() => {
                setActiveTab('superspin');
                if (!superSpunPlayer) handleSuperSpin();
              }}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/60 hover:bg-slate-850 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold mb-3">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors">
                  Super-Spin Gamble
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Raid Europe's elite giants in a last-minute midnight bid for a 88+ marquee superstar.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 mt-4 group-hover:translate-x-1 transition-transform">
                Take The Gamble <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Option 3: Emergency Loan Deal */}
            <div
              onClick={() => handleRollLoan()}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-400/60 hover:bg-slate-850 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold mb-3">
                  <ArrowUpDown className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-sm text-white group-hover:text-cyan-300 transition-colors">
                  Emergency Loan Deal
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Bring in a 89+ superstar on loan for the title run-in at ZERO Scout Token cost!
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 mt-4 group-hover:translate-x-1 transition-transform">
                Sign Loan Star <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Option 4: Lock Dressing Room (Morale Boost) */}
            <div
              onClick={() => {
                onApplyMoraleBoost();
                soundEngine.playCoins();
                onClose();
              }}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-400/60 hover:bg-slate-850 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold mb-3">
                  <Shield className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-300 transition-colors">
                  Squad Harmony Camp
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Reject all transfer rumors! Rally the locker room with a camp granting <b className="text-emerald-400">+10% Form & +15 Stamina</b>.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 mt-4 group-hover:translate-x-1 transition-transform">
                Lock Squad <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        )}

        {/* Sub-view: Scout Shortlist */}
        {activeTab === 'shortlist' && (
          <div className="my-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                Select One Star To Sign:
              </span>
              <button
                onClick={() => setActiveTab('options')}
                className="text-xs text-slate-400 hover:text-white"
              >
                ← Back to options
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {curatedTargets.map(player => (
                <div
                  key={player.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-yellow-500/50 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center font-black text-yellow-400 font-mono text-base">
                      {player.overall}
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-white">{player.name}</h5>
                      <span className="text-xs text-slate-400">
                        {player.clubName} ({player.year}) · {player.position}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSignReplacement(player, selectedSlotIdx);
                      soundEngine.playCardDraft();
                      onClose();
                    }}
                    className="px-4 py-2 rounded-lg font-bold text-xs bg-yellow-500 hover:bg-yellow-400 text-slate-950 transition-all cursor-pointer"
                  >
                    Sign & Replace ({lowestSlot.player?.name})
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-view: Super Spin */}
        {activeTab === 'superspin' && (
          <div className="my-4 text-center animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Deadline Day Midnight Super-Spin
              </span>
              <button
                onClick={() => setActiveTab('options')}
                className="text-xs text-slate-400 hover:text-white"
              >
                ← Back to options
              </button>
            </div>

            {superSpunPlayer && !isSuperSpinning ? (
              <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/40 my-3 inline-block w-full max-w-sm">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center font-black text-2xl text-amber-300 font-mono mb-2">
                  {superSpunPlayer.overall}
                </div>
                <h4 className="font-extrabold text-base text-white">{superSpunPlayer.name}</h4>
                <p className="text-xs text-slate-400">
                  {superSpunPlayer.clubName} ({superSpunPlayer.year}) · {superSpunPlayer.position}
                </p>

                <button
                  onClick={() => {
                    onSignReplacement(superSpunPlayer, selectedSlotIdx);
                    soundEngine.playCardDraft();
                    onClose();
                  }}
                  className="mt-4 w-full py-2.5 rounded-lg font-bold text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all cursor-pointer"
                >
                  Confirm Blockbuster Signing
                </button>
              </div>
            ) : (
              <div className="py-8 text-amber-400 font-bold animate-pulse text-sm">
                Scouring European transfer market...
              </div>
            )}
          </div>
        )}

        {/* Sub-view: Emergency Loan */}
        {activeTab === 'loan' && (
          <div className="my-4 p-5 rounded-xl bg-slate-900 border border-cyan-500/40 text-center animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-3 text-left">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Emergency 6-Month Loan Target:
              </span>
              <button
                onClick={() => setActiveTab('options')}
                className="text-xs text-slate-400 hover:text-white"
              >
                ← Back to options
              </button>
            </div>

            {loanPlayer ? (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center font-black text-2xl text-cyan-300 font-mono mb-2">
                  {loanPlayer.overall}
                </div>
                <h4 className="font-extrabold text-base text-white">{loanPlayer.name}</h4>
                <p className="text-xs text-slate-400">
                  {loanPlayer.clubName} ({loanPlayer.year}) · {loanPlayer.position}
                </p>

                <div className="my-3 text-xs text-cyan-400 font-bold">
                  ✓ Loan Fee Waived · 0 Scout Tokens Required
                </div>

                <button
                  onClick={() => {
                    onSignReplacement(loanPlayer, selectedSlotIdx);
                    soundEngine.playCardDraft();
                    onClose();
                  }}
                  className="mt-2 w-full py-2.5 rounded-lg font-bold text-xs bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all cursor-pointer"
                >
                  Confirm 6-Month Loan Deal
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* Skip / Close Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Current Matchday: 19 / 38 · Window closes tonight
          </span>
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white font-semibold cursor-pointer"
          >
            Pass Window & Continue Season →
          </button>
        </div>
      </div>
    </div>
  );
}
