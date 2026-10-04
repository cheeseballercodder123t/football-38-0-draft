import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  RotateCcw,
  CheckCircle2,
  Trophy,
  Award,
  Crown,
  ChevronRight,
  Shield,
  Flame,
  ArrowRight,
  UserCheck,
  Star,
} from 'lucide-react';
import { Player, PlayerPosition, OutfieldAttributeKey, BuildAPlayerAttributeSlot, BuiltPlayerResult } from '../types/football';
import { SQUADS } from '../data/squads';
import { soundEngine } from '../utils/soundEngine';

export const STAT_DEFINITIONS: {
  key: OutfieldAttributeKey;
  label: string;
  category: string;
  description: string;
}[] = [
  { key: 'PAC', label: 'Pace', category: 'Speed', description: 'Sprint speed & acceleration burst' },
  { key: 'SHO', label: 'Shooting', category: 'Attacking', description: 'Finishing, shot power & long shots' },
  { key: 'PAS', label: 'Passing', category: 'Playmaking', description: 'Vision, crossing & through-balls' },
  { key: 'SKL', label: 'Skill', category: 'Technique', description: 'Flair, dribbling moves & agility' },
  { key: 'DEF', label: 'Defending', category: 'Defending', description: 'Interceptions, marking & tackling' },
  { key: 'PHY', label: 'Physicality', category: 'Strength', description: 'Jumping, strength & aggression' },
  { key: 'HEA', label: 'Heading', category: 'Aerial', description: 'Aerial dominance & heading precision' },
  { key: 'IQ', label: 'Football IQ', category: 'Mental', description: 'Game reading, anticipation & composure' },
  { key: 'WF', label: 'Weak Foot', category: 'Technique', description: 'Finishing & delivery on opposite foot' },
  { key: 'CTL', label: 'Close Control', category: 'Technique', description: 'First touch & tight-space manipulation' },
  { key: 'STA', label: 'Stamina', category: 'Physical', description: '90-minute engine & relentless work rate' },
];

function derivePlayer11Stats(player: Player): Record<OutfieldAttributeKey, number> {
  const hash = Math.abs(
    player.name.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0)
  );

  const hea = Math.min(
    99,
    Math.max(
      45,
      Math.round(
        player.defending * 0.45 +
          player.physical * 0.45 +
          (player.position === 'FWD' || player.position === 'DEF' ? 6 : -3)
      )
    )
  );

  const iq = Math.min(
    99,
    Math.max(
      50,
      Math.round(player.composure * 0.5 + player.passing * 0.35 + player.overall * 0.15)
    )
  );

  const wf = Math.min(
    99,
    Math.max(55, Math.round(player.shooting * 0.4 + player.dribbling * 0.4 + (hash % 18)))
  );

  const ctl = Math.min(
    99,
    Math.max(50, Math.round(player.dribbling * 0.65 + player.passing * 0.35))
  );

  const sta = Math.min(
    99,
    Math.max(55, Math.round(player.physical * 0.65 + player.pace * 0.35))
  );

  return {
    PAC: player.pace,
    SHO: player.shooting,
    PAS: player.passing,
    SKL: player.dribbling,
    DEF: player.defending,
    PHY: player.physical,
    HEA: hea,
    IQ: iq,
    WF: wf,
    CTL: ctl,
    STA: sta,
  };
}

function calculateTier(overall: number): BuiltPlayerResult['tier'] {
  if (overall >= 96) return 'GOAT';
  if (overall >= 90) return 'Legend';
  if (overall >= 85) return 'World Class';
  if (overall >= 80) return 'Star';
  if (overall >= 76) return 'Fan Favourite';
  if (overall >= 72) return 'Cult Hero';
  return 'Journeyman';
}

function generateCareerStats(overall: number, stats: Record<OutfieldAttributeKey, number>) {
  const bd = overall >= 96 ? 5 : overall >= 93 ? 3 : overall >= 90 ? 1 : 0;
  const goals = Math.max(
    40,
    Math.min(950, Math.round((stats.SHO * stats.SHO) / 10.5 + (stats.HEA * stats.HEA) / 35))
  );
  const assists = Math.max(
    30,
    Math.min(650, Math.round((stats.PAS * stats.PAS) / 14 + (stats.IQ * stats.IQ) / 32))
  );
  const leagues = Math.max(1, Math.min(12, Math.round((overall - 74) * 0.55)));
  const euroCups = Math.max(0, Math.min(6, Math.round((overall - 82) * 0.35)));
  const caps = Math.max(15, Math.min(185, Math.round((overall - 58) * 3.6)));

  return {
    ballonDor: bd,
    goals,
    assists,
    leagueTitles: leagues,
    europeanCups: euroCups,
    internationalCaps: caps,
  };
}

function buildScoutBio(
  tier: BuiltPlayerResult['tier'],
  stats: Record<OutfieldAttributeKey, number>,
  pos: PlayerPosition
): string {
  const topStats = Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => {
      const def = STAT_DEFINITIONS.find(d => d.key === k);
      return def ? def.label.toLowerCase() : k;
    });

  const opener = {
    GOAT: 'A once-in-a-generation footballing immortal.',
    Legend: 'A certified all-time legend of the modern game.',
    'World Class': 'An elite matchwinner operating at the pinnacle of European football.',
    Star: 'An explosive gamechanger capable of winning any cup final alone.',
    'Fan Favourite': 'A tireless talisman adored by the supporters for sheer reliability.',
    'Cult Hero': 'An enigmatic virtuoso whose highlight reels live forever in folklore.',
    Journeyman: 'A battle-hardened grafter who maximized every drop of talent.',
  }[tier];

  return `${opener} This iconic ${pos === 'FWD' ? 'striker' : pos === 'MID' ? 'midfield maestro' : pos === 'DEF' ? 'defensive rock' : 'guardian'} was celebrated for outstanding ${topStats[0]}, sensational ${topStats[1]}, and world-renowned ${topStats[2]}.`;
}

interface BuildAPlayerStudioProps {
  onImportPlayerToSquad?: (player: Player) => void;
  onExportToPlayerCareer?: (builtPlayer: BuiltPlayerResult) => void;
  onExit: () => void;
}

export function BuildAPlayerStudio({ onImportPlayerToSquad, onExportToPlayerCareer, onExit }: BuildAPlayerStudioProps) {
  const [round, setRound] = useState<number>(1);
  const [candidatePlayer, setCandidatePlayer] = useState<Player | null>(null);
  const [candidateDerivedStats, setCandidateDerivedStats] = useState<Record<OutfieldAttributeKey, number> | null>(null);
  const [assignedSlots, setAssignedSlots] = useState<Record<OutfieldAttributeKey, {
    value: number;
    donorName: string;
    donorClub: string;
  } | null>>({
    PAC: null,
    SHO: null,
    PAS: null,
    SKL: null,
    DEF: null,
    PHY: null,
    HEA: null,
    IQ: null,
    WF: null,
    CTL: null,
    STA: null,
  });

  const [respinLeft, setRespinLeft] = useState<number>(3);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [createdPlayerName, setCreatedPlayerName] = useState<string>('Alex Hunter');
  const [createdPlayerPosition, setCreatedPlayerPosition] = useState<PlayerPosition>('FWD');
  const [finalResult, setFinalResult] = useState<BuiltPlayerResult | null>(null);

  // Roll initial candidate if none
  const rollCandidate = (isRespin = false) => {
    setIsSpinning(true);
    soundEngine.playSpinWheel();

    const randomSquad = SQUADS[Math.floor(Math.random() * SQUADS.length)];
    const randomPlayer = randomSquad.players[Math.floor(Math.random() * randomSquad.players.length)];

    setTimeout(() => {
      setCandidatePlayer(randomPlayer);
      setCandidateDerivedStats(derivePlayer11Stats(randomPlayer));
      setIsSpinning(false);
      soundEngine.playCardDraft();
      if (isRespin) {
        setRespinLeft(prev => Math.max(0, prev - 1));
      }
    }, 600);
  };

  // Escape key handler to exit cleanly
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  // Start with a spin if candidate is null
  React.useEffect(() => {
    if (!candidatePlayer && !finalResult) {
      rollCandidate();
    }
  }, []);

  const handleAssignAttribute = (key: OutfieldAttributeKey) => {
    if (!candidatePlayer || !candidateDerivedStats || assignedSlots[key] !== null) return;

    soundEngine.playStatAssign();

    const val = candidateDerivedStats[key];
    const newAssigned = {
      ...assignedSlots,
      [key]: {
        value: val,
        donorName: candidatePlayer.name,
        donorClub: `${candidatePlayer.clubName} (${candidatePlayer.year})`,
      },
    };
    setAssignedSlots(newAssigned);

    const filledCount = Object.values(newAssigned).filter(v => v !== null).length;

    if (filledCount >= 11) {
      // Completed all 11 stats!
      const values = Object.values(newAssigned).map(item => item!.value);
      const overall = Math.round(values.reduce((a, b) => a + b, 0) / 11);
      const tier = calculateTier(overall);
      const cleanStats: Record<OutfieldAttributeKey, number> = {} as any;
      Object.entries(newAssigned).forEach(([k, item]) => {
        cleanStats[k as OutfieldAttributeKey] = item!.value;
      });

      const career = generateCareerStats(overall, cleanStats);
      const scoutSummary = buildScoutBio(tier, cleanStats, createdPlayerPosition);

      // Derive Archetype based on stat weights
      let archetype = 'Poacher';
      if (cleanStats.PAS >= 80 && cleanStats.IQ >= 78) archetype = 'Playmaker';
      else if (cleanStats.PAC >= 85 && cleanStats.SKL >= 78) archetype = 'Speedster';
      else if (cleanStats.DEF >= 80 && cleanStats.PHY >= 78) archetype = 'Anchor';
      else if (cleanStats.STA >= 82 && cleanStats.PHY >= 78) archetype = 'BoxToBox';

      const result: BuiltPlayerResult = {
        name: createdPlayerName,
        position: createdPlayerPosition,
        overall,
        tier,
        archetype,
        playstyles: ['finesse_shot', 'relentless_motor'],
        attributes: cleanStats,
        career,
        scoutSummary,
      };

      // Save to localStorage Vault
      try {
        const saved = JSON.parse(localStorage.getItem('built_legends_vault') || '[]');
        localStorage.setItem('built_legends_vault', JSON.stringify([result, ...saved.slice(0, 9)]));
      } catch {}

      setFinalResult(result);
      soundEngine.playBullseye();
    } else {
      setRound(filledCount + 1);
      rollCandidate();
    }
  };

  const handleImport = () => {
    if (!finalResult || !onImportPlayerToSquad) return;

    const importedPlayer: Player = {
      id: `custom_${Date.now()}`,
      name: finalResult.name,
      clubYear: 'Ultimate Built XI (All-Time)',
      clubName: 'Ultimate XI',
      year: 'Prime',
      country: 'Global',
      league: 'Premier League',
      position: finalResult.position,
      specificPosition: finalResult.position === 'FWD' ? 'ST' : finalResult.position === 'MID' ? 'CAM' : finalResult.position === 'DEF' ? 'CB' : 'GK',
      overall: finalResult.overall,
      pace: finalResult.attributes.PAC,
      shooting: finalResult.attributes.SHO,
      passing: finalResult.attributes.PAS,
      dribbling: finalResult.attributes.SKL,
      defending: finalResult.attributes.DEF,
      physical: finalResult.attributes.PHY,
      composure: finalResult.attributes.IQ,
      auraTrait: {
        id: 'aura_built_legend',
        name: `${finalResult.tier} DNA`,
        rarity: finalResult.overall >= 92 ? 'Legendary' : 'Epic',
        description: `Synthesized from 11 historic footballers. Possesses lethal attributes in every key metric.`,
        shortDesc: `All-Attribute Hybrid Titan`,
      },
    };

    onImportPlayerToSquad(importedPlayer);
    soundEngine.playCoins();
  };

  const currentAverageOvr = (() => {
    const filled = Object.values(assignedSlots).filter((v): v is { value: number; donorName: string; donorClub: string } => v !== null);
    if (filled.length === 0) return 0;
    return Math.round(filled.reduce((acc, f) => acc + f.value, 0) / filled.length);
  })();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl text-white animate-in fade-in duration-300 max-h-[92vh] overflow-y-auto my-auto overscroll-contain">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              Build The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Perfect Player</span>
            </h1>
            <p className="text-xs text-slate-400">
              Spin 11 footballers · Pick one attribute from each · Create your ultimate football legend
            </p>
          </div>
        </div>

        <button
          onClick={onExit}
          className="px-3.5 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Exit Studio
        </button>
      </div>

      {!finalResult ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Current Spun Player Card & Attribute Chooser */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" /> Pick {round} of 11
                </span>
                <span className="text-xs text-slate-400">
                  Current Avg: <b className="text-emerald-400 font-mono">{currentAverageOvr || '--'}</b>
                </span>
              </div>

              {/* Spun Player Display */}
              {candidatePlayer ? (
                <div className="text-center py-4 bg-slate-950/80 rounded-xl border border-slate-800/80 relative">
                  <div className="w-16 h-16 rounded-full mx-auto bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-emerald-500/40 flex items-center justify-center font-black text-xl text-emerald-400 mb-2 shadow-inner">
                    {candidatePlayer.overall}
                  </div>
                  <h3 className="font-extrabold text-lg text-white tracking-tight">{candidatePlayer.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {candidatePlayer.clubName} · {candidatePlayer.year}
                  </p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-300">
                    {candidatePlayer.position} ({candidatePlayer.specificPosition})
                  </span>
                </div>
              ) : (
                <div className="h-36 flex items-center justify-center text-slate-500 text-sm">
                  Spinning player...
                </div>
              )}

              {/* Reroll Button */}
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-medium">
                  Rerolls left: <b className="text-white">{respinLeft}</b>
                </span>
                <button
                  onClick={() => rollCandidate(true)}
                  disabled={respinLeft <= 0 || isSpinning}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 border border-slate-700 hover:bg-slate-700 active:scale-95 transition-all text-slate-300 flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reroll Player
                </button>
              </div>
            </div>

            {/* Instruction banner */}
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Click any open attribute on the right to claim that stat from {candidatePlayer?.name || 'this footballer'}!</span>
            </div>
          </div>

          {/* Right Column: 11 Attribute Slots Grid */}
          <div className="lg:col-span-7">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Player Attribute Blueprint (11 Slots)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STAT_DEFINITIONS.map(def => {
                const isAssigned = assignedSlots[def.key] !== null;
                const assignedData = assignedSlots[def.key];
                const candidateVal = candidateDerivedStats ? candidateDerivedStats[def.key] : null;

                return (
                  <button
                    key={def.key}
                    disabled={isAssigned || !candidateDerivedStats || isSpinning}
                    onClick={() => handleAssignAttribute(def.key)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                      isAssigned
                        ? 'bg-slate-900/50 border-emerald-500/30 cursor-default'
                        : 'bg-slate-900/90 border-slate-800 hover:border-emerald-400 hover:bg-slate-800/80 active:scale-[0.98] cursor-pointer group shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-emerald-400 font-mono tracking-wider">
                          {def.key}
                        </span>
                        <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {def.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {isAssigned ? (
                          <span className="text-slate-400">Locked from {assignedData?.donorName}</span>
                        ) : (
                          def.description
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      {isAssigned ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg font-black font-mono text-emerald-400">
                            {assignedData?.value}
                          </span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold font-mono text-slate-400 group-hover:text-emerald-400 transition-colors">
                            {candidateVal ?? '--'}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-500/80 px-1.5 py-0.5 rounded bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
                            TAKE
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Final Showcase Screen */
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 text-center animate-in zoom-in-95 duration-300">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Crown className="w-4 h-4 text-amber-400" />
            Legend Created: {finalResult.tier} Tier
          </div>

          {/* Player Badge / Ring */}
          <div className="relative w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-4 border-emerald-400 flex flex-col items-center justify-center shadow-xl shadow-emerald-500/20 mb-4">
            <span className="text-4xl font-black font-mono text-white tracking-tight">
              {finalResult.overall}
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
              OVERALL
            </span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight mb-1">
            {finalResult.name}
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto mb-6 italic leading-relaxed">
            "{finalResult.scoutSummary}"
          </p>

          {/* Procedural Career Accolades */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ballon d'Ors</span>
              <span className="text-lg font-black text-amber-400 font-mono">{finalResult.career.ballonDor}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Career Goals</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{finalResult.career.goals}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assists</span>
              <span className="text-lg font-black text-teal-400 font-mono">{finalResult.career.assists}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">League Titles</span>
              <span className="text-lg font-black text-blue-400 font-mono">{finalResult.career.leagueTitles}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">European Cups</span>
              <span className="text-lg font-black text-purple-400 font-mono">{finalResult.career.europeanCups}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Int'l Caps</span>
              <span className="text-lg font-black text-rose-400 font-mono">{finalResult.career.internationalCaps}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {onImportPlayerToSquad && (
              <button
                onClick={handleImport}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <UserCheck className="w-4 h-4" />
                Draft Into Starting Squad
              </button>
            )}

            {onExportToPlayerCareer && (
              <button
                onClick={() => onExportToPlayerCareer(finalResult)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-black bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <Crown className="w-4 h-4" />
                Live Career in Player Mode
              </button>
            )}

            <button
              onClick={() => {
                setFinalResult(null);
                setRound(1);
                setAssignedSlots({
                  PAC: null,
                  SHO: null,
                  PAS: null,
                  SKL: null,
                  DEF: null,
                  PHY: null,
                  HEA: null,
                  IQ: null,
                  WF: null,
                  CTL: null,
                  STA: null,
                });
                setRespinLeft(3);
                rollCandidate();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-slate-800 border border-slate-700 hover:bg-slate-700 active:scale-95 transition-all text-white flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Build Another Player
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
