import React, { useState } from 'react';
import {
  ShieldAlert,
  Flame,
  Trophy,
  Crown,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  Swords,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { Player, SurvivalRound, MatchResult, OpponentTeam } from '../types/football';
import { UCL_OPPONENTS } from '../data/opponents';
import { soundEngine } from '../utils/soundEngine';

interface SurvivalGauntletProps {
  startingXI: (Player | null)[];
  onSimulateRound: (
    roundIdx: number,
    roundData: SurvivalRound
  ) => Promise<MatchResult>;
  onCompleteGauntlet: () => void;
  onExit: () => void;
}

export function SurvivalGauntlet({
  startingXI,
  onSimulateRound,
  onCompleteGauntlet,
  onExit,
}: SurvivalGauntletProps) {
  const [rounds, setRounds] = useState<SurvivalRound[]>([
    {
      roundNumber: 1,
      title: 'Round 1: Qualifying',
      targetObjective: 'Win Match by 1+ Goal',
      targetDesc: 'Win outright against initial opposition to avoid early elimination.',
      mutator: { name: 'Standard Pitch', description: 'Clean conditions, standard fixture', effect: 'Neutral' },
      opponent: UCL_OPPONENTS[0] || {
        name: 'Ajax (2018-19)',
        rating: 83,
        attackRating: 84,
        midfieldRating: 83,
        defenseRating: 82,
        gkRating: 82,
        tactic: 'Gegenpress',
      },
      isCompleted: false,
      isPassed: false,
    },
    {
      roundNumber: 2,
      title: 'Round 2: Defensive Fortress',
      targetObjective: 'Clean Sheet OR Score 2+ Goals',
      targetDesc: 'Demonstrate tactical discipline by either keeping a shutout or netting at least twice.',
      mutator: { name: 'Torrential Rain', description: 'Heavy slick turf reduces through-ball accuracy', effect: '-10% Passing' },
      opponent: UCL_OPPONENTS[1] || {
        name: 'Inter Milan (2009-10)',
        rating: 86,
        attackRating: 86,
        midfieldRating: 86,
        defenseRating: 87,
        gkRating: 87,
        tactic: 'Low-Block Counter',
      },
      isCompleted: false,
      isPassed: false,
    },
    {
      roundNumber: 3,
      title: 'Round 3: Quarter-Final Cut',
      targetObjective: 'Win by Margin of 2+ Goals',
      targetDesc: 'The bottom tier is eliminated! Outscore the opponent by a clear two-goal gap.',
      mutator: { name: 'Hostile Ultras Stadium', description: 'Opponents gain +4 home morale advantage in 50/50 duels', effect: '+4 Opponent Morale' },
      opponent: UCL_OPPONENTS[2] || {
        name: 'Chelsea (2004-05)',
        rating: 88,
        attackRating: 87,
        midfieldRating: 89,
        defenseRating: 90,
        gkRating: 89,
        tactic: 'Low-Block Counter',
      },
      isCompleted: false,
      isPassed: false,
    },
    {
      roundNumber: 4,
      title: 'Round 4: Semi-Final Giant',
      targetObjective: 'Beat Elite Powerhouse',
      targetDesc: 'Go toe-to-toe with one of the most dominant sides in football history.',
      mutator: { name: 'High-Altitude Oxygen Thinning', description: 'Stamina decays 2x faster; tests squad depth', effect: '-15% Stamina' },
      opponent: UCL_OPPONENTS[3] || {
        name: 'Barcelona (2010-11)',
        rating: 91,
        attackRating: 94,
        midfieldRating: 93,
        defenseRating: 89,
        gkRating: 87,
        tactic: 'Tiki-Taka',
      },
      isCompleted: false,
      isPassed: false,
    },
    {
      roundNumber: 5,
      title: 'Round 5: The Grand Final',
      targetObjective: 'Last One Standing Trophy',
      targetDesc: 'Win the ultimate showdown to stand as the solitary surviving champion!',
      mutator: { name: 'Galácticos Final Atmosphere', description: 'Highest stakes in football: sudden death penalty shootout on draw', effect: 'Sudden Death' },
      opponent: UCL_OPPONENTS[4] || {
        name: 'Real Madrid (2016-17)',
        rating: 92,
        attackRating: 93,
        midfieldRating: 92,
        defenseRating: 91,
        gkRating: 90,
        tactic: 'Direct Vertical',
      },
      isCompleted: false,
      isPassed: false,
    },
  ]);

  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [hasRedemptionUsed, setHasRedemptionUsed] = useState<boolean>(false);
  const [isEliminated, setIsEliminated] = useState<boolean>(false);
  const [isGauntletWon, setIsGauntletWon] = useState<boolean>(false);
  const [lastMatchResult, setLastMatchResult] = useState<MatchResult | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  const checkObjectivePassed = (roundIdx: number, result: MatchResult): boolean => {
    const isHome = result.homeTeam === 'Your Starting XI';
    const userScore = isHome ? result.homeScore : result.awayScore;
    const oppScore = isHome ? result.awayScore : result.homeScore;
    const userWon = isHome ? result.winner === 'home' : result.winner === 'away';

    if (roundIdx === 0) {
      // Round 1: Win match
      return userWon;
    } else if (roundIdx === 1) {
      // Round 2: Clean sheet OR score 2+
      return oppScore === 0 || userScore >= 2;
    } else if (roundIdx === 2) {
      // Round 3: Win by 2+ goals
      return userWon && userScore - oppScore >= 2;
    } else if (roundIdx === 3) {
      // Round 4: Beat Elite
      return userWon;
    } else {
      // Round 5: Win final
      return userWon;
    }
  };

  const handlePlayRound = async (isRedemption = false) => {
    if (isSimulating || isEliminated || isGauntletWon) return;

    setIsSimulating(true);
    soundEngine.playWhistle();

    const currentRound = rounds[currentRoundIdx];
    try {
      const result = await onSimulateRound(currentRoundIdx, currentRound);
      setLastMatchResult(result);

      const passed = checkObjectivePassed(currentRoundIdx, result);

      if (passed) {
        soundEngine.playBullseye();
        const updated = [...rounds];
        updated[currentRoundIdx] = {
          ...currentRound,
          isCompleted: true,
          isPassed: true,
          result,
        };
        setRounds(updated);

        if (currentRoundIdx === 4) {
          setIsGauntletWon(true);
          onCompleteGauntlet();
        } else {
          setCurrentRoundIdx(prev => prev + 1);
        }
      } else {
        soundEngine.playRedCard();
        if (!hasRedemptionUsed && !isRedemption) {
          // Grant 1 redemption match!
          setHasRedemptionUsed(true);
        } else {
          setIsEliminated(true);
        }
      }
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl text-white animate-in fade-in duration-300 max-h-[92vh] overflow-y-auto my-auto overscroll-contain">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-700 flex items-center justify-center text-white font-black shadow-lg shadow-rose-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              Last One <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">Standing</span> ⚔️
            </h1>
            <p className="text-xs text-slate-400">
              Survive 5 cutthroat elimination rounds · Hit the survival targets or face instant exit
            </p>
          </div>
        </div>

        <button
          onClick={onExit}
          className="px-3.5 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Exit Mode
        </button>
      </div>

      {/* Rounds Progression Ladder */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 mb-6">
        {rounds.map((r, idx) => {
          const isCurrent = idx === currentRoundIdx && !isEliminated && !isGauntletWon;
          const isPassed = r.isPassed;
          const isFailed = r.isCompleted && !r.isPassed;

          return (
            <div
              key={r.roundNumber}
              className={`p-3 rounded-xl border transition-all ${
                isPassed
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : isCurrent
                  ? 'bg-slate-900 border-rose-500/80 shadow-lg shadow-rose-500/10 text-white'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider">
                  R{r.roundNumber}
                </span>
                {isPassed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                ) : null}
              </div>
              <h5 className="font-extrabold text-xs tracking-tight line-clamp-1">{r.title}</h5>
              <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{r.targetObjective}</p>
            </div>
          );
        })}
      </div>

      {/* Current Round Showcase */}
      {!isEliminated && !isGauntletWon ? (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5" /> Round {currentRoundIdx + 1} of 5
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight mb-1">
            {rounds[currentRoundIdx].title}
          </h2>
          <div className="inline-block px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 font-extrabold text-sm my-2">
            Target: {rounds[currentRoundIdx].targetObjective}
          </div>
          {rounds[currentRoundIdx].mutator && (
            <div className="block mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold text-xs">
                ⚡ Pitch Mutator: {rounds[currentRoundIdx].mutator.name} ({rounds[currentRoundIdx].mutator.effect})
              </span>
            </div>
          )}
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            {rounds[currentRoundIdx].targetDesc}
          </p>

          {/* Versus Matchup Card */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 my-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center font-black text-emerald-300 text-lg mx-auto mb-1">
                XI
              </div>
              <span className="font-extrabold text-xs text-white">Your Starting Squad</span>
            </div>

            <div className="text-rose-500 font-black text-xl italic tracking-wider">
              VS
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-black text-slate-300 text-lg mx-auto mb-1 font-mono">
                {rounds[currentRoundIdx].opponent.rating}
              </div>
              <span className="font-extrabold text-xs text-white">
                {rounds[currentRoundIdx].opponent.name}
              </span>
            </div>
          </div>

          {/* Redemption Badge if available */}
          {hasRedemptionUsed ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold mb-4">
              <AlertCircle className="w-3.5 h-3.5" />
              Redemption Life Spent · Sudden Death Active
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-4">
              <ShieldAlert className="w-3.5 h-3.5" />
              Redemption Playoff Available (1 free second chance)
            </div>
          )}

          {/* Play Match Button */}
          <div>
            <button
              onClick={() => handlePlayRound()}
              disabled={isSimulating}
              className="px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-rose-500 to-red-600 hover:brightness-110 active:scale-95 transition-all text-white shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 mx-auto cursor-pointer disabled:opacity-50 text-sm"
            >
              <Swords className="w-4 h-4" />
              {isSimulating ? 'Simulating Survival Clash...' : 'Play Survival Match'}
            </button>
          </div>
        </div>
      ) : isEliminated ? (
        /* Elimination Screen */
        <div className="p-8 rounded-2xl bg-rose-950/20 border border-rose-500/40 text-center animate-in zoom-in-95 duration-300">
          <XCircle className="w-16 h-16 text-rose-500 mx-auto mb-3" />
          <h2 className="text-2xl font-black text-white tracking-tight mb-2">Eliminated From Gauntlet</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            Your squad was cut in Round {currentRoundIdx + 1}. Both your primary attempt and redemption match fell short of the survival quota.
          </p>

          <button
            onClick={() => {
              setCurrentRoundIdx(0);
              setIsEliminated(false);
              setHasRedemptionUsed(false);
            }}
            className="px-6 py-3 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all text-xs cursor-pointer inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Try Survival Run Again
          </button>
        </div>
      ) : (
        /* Gauntlet Champion Screen */
        <div className="p-8 rounded-2xl bg-gradient-to-b from-amber-950/30 to-slate-900 border border-amber-500/40 text-center animate-in zoom-in-95 duration-300">
          <Crown className="w-16 h-16 text-amber-400 mx-auto mb-3 animate-bounce" />
          <h2 className="text-2xl font-black text-white tracking-tight mb-1">
            CROWNED: LAST ONE STANDING 👑
          </h2>
          <p className="text-xs text-amber-400/90 font-semibold mb-6">
            Congratulations! You conquered all 5 elimination rounds against Europe's fiercest dynasties.
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onExit}
              className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 hover:brightness-110 active:scale-95 transition-all text-sm cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Collect Rewards & Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
