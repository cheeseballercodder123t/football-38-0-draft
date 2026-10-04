import React, { useState } from 'react';
import {
  PlayerCareerState,
  CareerPosition,
  CareerArchetype,
  PlayerAttributeKey,
  BuiltPlayerResult,
} from '../types/football';
import {
  createInitialPlayerCareer,
  simulateCareerMatchday,
  resolveClutchMoment,
  advanceCareerSeason,
  calculateGOATScore,
  PLAYSTYLE_CATALOG,
  CAREER_NATIONALITIES,
  CAREER_CLUBS_POOL,
  calculateCareerOVR,
} from '../engine/playerCareerEngine';
import { soundEngine } from '../utils/soundEngine';
import {
  Trophy,
  Crown,
  Sparkles,
  Zap,
  Shield,
  Target,
  Flame,
  ArrowRight,
  TrendingUp,
  Award,
  Globe,
  Coins,
  ChevronRight,
  Play,
  RotateCcw,
  CheckCircle2,
  X,
  FastForward,
  Building2,
  Medal,
  Activity,
} from 'lucide-react';

interface PlayerCareerModeProps {
  initialBuiltPlayer?: BuiltPlayerResult | null;
  onExit: () => void;
}

export function PlayerCareerMode({ initialBuiltPlayer, onExit }: PlayerCareerModeProps) {
  const [careerState, setCareerState] = useState<PlayerCareerState | null>(() => {
    if (initialBuiltPlayer) {
      return createInitialPlayerCareer(
        initialBuiltPlayer.name,
        'England',
        initialBuiltPlayer.position as CareerPosition,
        'Poacher',
        initialBuiltPlayer.attributes
      );
    }
    return null;
  });

  // Setup form states
  const [nameInput, setNameInput] = useState('Leo Sterling');
  const [natInput, setNatInput] = useState('England');
  const [posInput, setPosInput] = useState<CareerPosition>('ST');
  const [archInput, setArchInput] = useState<CareerArchetype>('Poacher');

  // Hub tabs
  const [activeTab, setActiveTab] = useState<'fixtures' | 'training' | 'transfers' | 'goat'>('fixtures');
  const [isSimulatingMulti, setIsSimulatingMulti] = useState(false);
  const [momentResultText, setMomentResultText] = useState<string | null>(null);
  const [seasonEndReport, setSeasonEndReport] = useState<{
    wonBallon: boolean;
    wonBoot: boolean;
    offers: typeof CAREER_CLUBS_POOL;
  } | null>(null);

  const handleStartCareer = () => {
    soundEngine.playSuccessChime();
    const newCareer = createInitialPlayerCareer(nameInput, natInput, posInput, archInput);
    setCareerState(newCareer);
  };

  const handlePlayNextMatch = () => {
    if (!careerState) return;
    soundEngine.playClick();
    const result = simulateCareerMatchday(careerState);
    setCareerState(result.updatedState);

    if (result.triggeredMoment) {
      soundEngine.playAuraSurge();
    } else {
      soundEngine.playWhistle();
    }

    // Check if season completed (38 matchdays)
    if (result.updatedState.currentMatchday >= result.updatedState.totalSeasonMatches) {
      handleCompleteSeason(result.updatedState);
    }
  };

  const handleSimBatch = (count: number) => {
    if (!careerState) return;
    setIsSimulatingMulti(true);
    let cur = { ...careerState };
    soundEngine.playClick();

    for (let i = 0; i < count; i++) {
      if (cur.currentMatchday >= cur.totalSeasonMatches) break;
      const res = simulateCareerMatchday(cur);
      cur = res.updatedState;
      if (res.triggeredMoment) {
        // Stop sim if a big moment hits so player can choose
        break;
      }
    }
    setCareerState(cur);
    setIsSimulatingMulti(false);

    if (cur.currentMatchday >= cur.totalSeasonMatches) {
      handleCompleteSeason(cur);
    }
  };

  const handleCompleteSeason = (state: PlayerCareerState) => {
    soundEngine.playBullseye();
    const { updatedState, wonBallonDor, wonGoldenBoot, transferOffers } = advanceCareerSeason(state);
    setCareerState(updatedState);
    setSeasonEndReport({
      wonBallon: wonBallonDor,
      wonBoot: wonGoldenBoot,
      offers: transferOffers,
    });
  };

  const handleChooseMomentOption = (idx: number) => {
    if (!careerState || !careerState.activeMoment) return;
    const { success, storyResult, updatedState } = resolveClutchMoment(careerState, idx);
    if (success) {
      soundEngine.playGoalCelebration();
    } else {
      soundEngine.playWoodwork();
    }
    setMomentResultText(storyResult);
    setCareerState(updatedState);
  };

  const handleUpgradeAttribute = (attr: PlayerAttributeKey) => {
    if (!careerState || careerState.skillPoints < 1) return;
    if (careerState.attributes[attr] >= 99) return;

    soundEngine.playStatAssign();
    const updatedAttrs = {
      ...careerState.attributes,
      [attr]: Math.min(99, careerState.attributes[attr] + 1),
    };
    const newOvr = calculateCareerOVR(updatedAttrs, careerState.position);

    setCareerState({
      ...careerState,
      attributes: updatedAttrs,
      overall: newOvr,
      skillPoints: careerState.skillPoints - 1,
    });
  };

  const handleUnlockPlaystyle = (styleId: string, cost: number) => {
    if (!careerState || careerState.trainingXP < cost) return;
    if (careerState.unlockedPlayStyles.includes(styleId)) return;

    soundEngine.playBullseye();
    setCareerState({
      ...careerState,
      trainingXP: careerState.trainingXP - cost,
      unlockedPlayStyles: [...careerState.unlockedPlayStyles, styleId],
    });
  };

  const handleAcceptTransfer = (newClub: (typeof CAREER_CLUBS_POOL)[0]) => {
    if (!careerState) return;
    soundEngine.playSuccessChime();
    const newWage = Math.round(careerState.weeklyWageK * 1.35);

    setCareerState({
      ...careerState,
      currentClub: newClub,
      contractYearsLeft: 4,
      weeklyWageK: newWage,
      matchLog: [
        `✈️ BLOCKBUSTER TRANSFER: Signed for ${newClub.name} (${newClub.league}) on a 4-year deal!`,
        ...careerState.matchLog,
      ],
    });
    setSeasonEndReport(null);
  };

  // 1. Setup Screen if no active career
  if (!careerState) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-slate-950/95 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl text-white">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                PLAYER CAREER MODE
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  PRO EVOLUTION 2.0
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Live 20 legendary seasons · Rise from wonderkid to Ballon d'Or GOAT
              </p>
            </div>
          </div>
          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Player Identity */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Player Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:border-amber-400 focus:outline-none"
                placeholder="Your Superstar Name"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Nationality
              </label>
              <select
                value={natInput}
                onChange={e => setNatInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:border-amber-400 focus:outline-none"
              >
                {CAREER_NATIONALITIES.map(n => (
                  <option key={n.code} value={n.name}>
                    {n.flag} {n.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Position
              </label>
              <div className="grid grid-cols-5 gap-2">
                {(['ST', 'LW', 'RW', 'CAM', 'CM', 'CDM', 'CB', 'LB', 'RB', 'GK'] as CareerPosition[]).map(pos => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setPosInput(pos)}
                    className={`py-2 text-xs font-black rounded-lg border transition-all ${
                      posInput === pos
                        ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Archetype & Career Blueprint */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
              Playing Archetype
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'Poacher', title: 'Hyper-Poacher', desc: 'Deadly finishing & penalty box predator' },
                { id: 'Playmaker', title: 'Maestro Vision', desc: 'Incisive passing & game dictation' },
                { id: 'Speedster', title: 'Electric Winger', desc: 'Blistering acceleration & 1v1 dribbles' },
                { id: 'BoxToBox', title: 'Iron Engine', desc: 'Relentless stamina & clutch duels' },
                { id: 'Anchor', title: 'Titan Shield', desc: 'Dominant tackling & aerial presence' },
                { id: 'SweeperKeeper', title: 'Wall Keeper', desc: 'Acrobatic saves & sweeper reflexes' },
              ].map(arch => (
                <button
                  key={arch.id}
                  type="button"
                  onClick={() => setArchInput(arch.id as CareerArchetype)}
                  className={`p-3 text-left rounded-xl border transition-all ${
                    archInput === arch.id
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-black text-xs text-amber-300">{arch.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">{arch.desc}</div>
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                20-Season Career Roadmap
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Start at 17 as an academy breakthrough. Play through 38-game league fixtures, face clutch 85th-min hero moments, earn weekly skill points, sign transfer deals with Real Madrid or Man City, and chase the Ballon d'Or.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
          <button
            onClick={onExit}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleStartCareer}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 flex items-center gap-2 transform active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            BEGIN CAREER PATH
          </button>
        </div>
      </div>
    );
  }

  // 2. Active Player Career Hub
  const goatAnalysis = calculateGOATScore(careerState);

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-white flex flex-col">
      {/* Top Banner & Header */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 p-5 sm:p-6 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Player Badge & Core Info */}
          <div className="flex items-center gap-4">
            <div className="relative flex flex-col items-center justify-center w-16 h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black shadow-xl shadow-amber-500/20 border-2 border-amber-300">
              <span className="text-[10px] tracking-widest uppercase font-extrabold">{careerState.position}</span>
              <span className="text-3xl leading-none">{careerState.overall}</span>
              <span className="text-[9px] font-bold opacity-80">OVR</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{careerState.playerName}</h1>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-bold border border-slate-700">
                  {careerState.nationality}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  Age {careerState.age}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1 font-bold text-white">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  {careerState.currentClub.name} ({careerState.currentClub.league})
                </span>
                <span>·</span>
                <span>Season {careerState.seasonNumber}/20</span>
                <span>·</span>
                <span className="text-emerald-400 font-semibold">€{careerState.marketValueM}M Value</span>
                <span>·</span>
                <span className="text-amber-300 font-semibold">£{careerState.weeklyWageK}k/wk</span>
              </div>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] text-slate-400">Training XP</div>
                <div className="font-black text-amber-300">{careerState.trainingXP} XP</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <Zap className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[10px] text-slate-400">Skill Points</div>
                <div className="font-black text-emerald-400">{careerState.skillPoints} PTS</div>
              </div>
            </div>

            <button
              onClick={onExit}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6">
          {[
            { id: 'fixtures', label: 'Matchday & Fixtures', icon: Play },
            { id: 'training', label: 'Training & Skill Tree', icon: Zap },
            { id: 'transfers', label: 'Club & Transfers', icon: Building2 },
            { id: 'goat', label: 'GOAT Index & Trophies', icon: Crown },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-5 sm:p-6 flex-1 overflow-y-auto">
        {/* TAB 1: MATCHDAY & FIXTURES */}
        {activeTab === 'fixtures' && (
          <div className="space-y-6">
            {/* Season Progress Bar */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-400" />
                  Season Matchday Progress
                </span>
                <span className="text-amber-400">
                  {careerState.currentMatchday} / {careerState.totalSeasonMatches} Matches Played
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
                  style={{
                    width: `${(careerState.currentMatchday / careerState.totalSeasonMatches) * 100}%`,
                  }}
                />
              </div>

              {/* Action Simulation Controls */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <button
                  onClick={handlePlayNextMatch}
                  disabled={isSimulatingMulti || careerState.currentMatchday >= careerState.totalSeasonMatches}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs tracking-wide shadow-lg shadow-amber-500/20 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-current" />
                  PLAY MATCHDAY {careerState.currentMatchday + 1}
                </button>

                <button
                  onClick={() => handleSimBatch(5)}
                  disabled={isSimulatingMulti || careerState.currentMatchday >= careerState.totalSeasonMatches}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                >
                  <FastForward className="w-4 h-4" />
                  SIM 5 MATCHES
                </button>

                <button
                  onClick={() => handleSimBatch(38)}
                  disabled={isSimulatingMulti || careerState.currentMatchday >= careerState.totalSeasonMatches}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                >
                  SIM TO SEASON END
                </button>
              </div>
            </div>

            {/* Interactive Clutch Moment Card if active */}
            {careerState.activeMoment && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/60 shadow-2xl relative overflow-hidden animate-pulse">
                <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-widest mb-1">
                  <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                  CLUTCH HERO MOMENT · {careerState.activeMoment.matchContext}
                </div>
                <h3 className="text-lg font-black text-white">{careerState.activeMoment.situation}</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  {careerState.activeMoment.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChooseMomentOption(idx)}
                      className="p-4 rounded-xl bg-slate-850 border border-slate-700 hover:border-amber-400 text-left transition-all group hover:bg-amber-500/10"
                    >
                      <div className="text-xs font-black text-amber-300 group-hover:text-amber-200">
                        {opt.label}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 leading-snug">{opt.actionDesc}</div>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                        <span>Requires {opt.requiredAttr}</span>
                        <span className="text-amber-400 font-extrabold">Diff: {opt.difficultyVal}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clutch Moment Feedback Alert */}
            {momentResultText && (
              <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 text-xs font-bold text-amber-300 flex items-center justify-between">
                <span>{momentResultText}</span>
                <button
                  onClick={() => setMomentResultText(null)}
                  className="text-slate-400 hover:text-white font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Current Season Stats Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Appearances</div>
                <div className="text-2xl font-black text-white mt-1">{careerState.seasonApps}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Goals</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">{careerState.seasonGoals}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Assists</div>
                <div className="text-2xl font-black text-cyan-400 mt-1">{careerState.seasonAssists}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Clean Sheets</div>
                <div className="text-2xl font-black text-amber-400 mt-1">{careerState.seasonCleanSheets}</div>
              </div>
            </div>

            {/* Matchday Logs */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">
                Live Season Broadcast Feed
              </h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto text-xs font-mono">
                {careerState.matchLog.map((log, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-950/60 text-slate-300 border border-slate-900">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRAINING & RPG SKILL TREE */}
        {activeTab === 'training' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white">Skill Point Allocation</h3>
                <p className="text-xs text-slate-400">
                  Upgrade your 11 attributes. Remaining Skill Points: <span className="text-emerald-400 font-bold">{careerState.skillPoints}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {(Object.keys(careerState.attributes) as PlayerAttributeKey[]).map(key => {
                const val = careerState.attributes[key];
                return (
                  <div key={key} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-300">{key}</span>
                      <span className="text-lg font-black text-amber-400">{val}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${(val / 99) * 100}%` }} />
                    </div>
                    <button
                      onClick={() => handleUpgradeAttribute(key)}
                      disabled={careerState.skillPoints < 1 || val >= 99}
                      className="w-full mt-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 disabled:opacity-30 text-white font-bold text-[11px] transition-all"
                    >
                      +1 UPGRADE
                    </button>
                  </div>
                );
              })}
            </div>

            {/* PlayStyles Catalog */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <h3 className="text-sm font-black text-white mb-3">Signature PlayStyles & Traits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {PLAYSTYLE_CATALOG.map(ps => {
                  const isUnlocked = careerState.unlockedPlayStyles.includes(ps.id);
                  return (
                    <div
                      key={ps.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isUnlocked
                          ? 'bg-amber-500/10 border-amber-500/50'
                          : 'bg-slate-900/50 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-300">{ps.name}</span>
                        {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">{ps.description}</p>
                      {!isUnlocked && (
                        <button
                          onClick={() => handleUnlockPlaystyle(ps.id, ps.costXP)}
                          disabled={careerState.trainingXP < ps.costXP}
                          className="w-full mt-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 font-black text-[11px] transition-all"
                        >
                          UNLOCK ({ps.costXP} XP)
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TRANSFERS & CONTRACTS */}
        {activeTab === 'transfers' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white">Current Contract Status</h3>
                <p className="text-xs text-slate-400">
                  {careerState.contractYearsLeft} Years Remaining · £{careerState.weeklyWageK}k / week · Release Clause: €{careerState.marketValueM * 2}M
                </p>
              </div>
            </div>

            {/* Transfer Shortlist / Market Offers */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <h3 className="text-sm font-black text-white mb-3">Incoming Club Transfer Enquiries</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CAREER_CLUBS_POOL.filter(c => c.name !== careerState.currentClub.name && c.strength >= careerState.overall - 3 && c.strength <= careerState.overall + 4).slice(0, 3).map(club => (
                  <div key={club.name} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="font-black text-sm text-white">{club.name}</div>
                      <div className="text-xs text-slate-400">{club.league} · Strength {club.strength}</div>
                      <div className="text-[11px] text-emerald-400 mt-2 font-bold">
                        Wage Offer: £{Math.round(careerState.weeklyWageK * 1.35)}k/wk
                      </div>
                    </div>
                    <button
                      onClick={() => handleAcceptTransfer(club)}
                      className="mt-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all"
                    >
                      SIGN 4-YEAR DEAL
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GOAT INDEX & TROPHIES */}
        {activeTab === 'goat' && (
          <div className="space-y-6">
            {/* GOAT Index Scorecard */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-400">
                    ALL-TIME FOOTBALL PANTHEON
                  </span>
                  <h2 className="text-2xl font-black text-white mt-0.5">{goatAnalysis.rankTitle}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Based on Ballon d'Or triumphs, European Cups, World Cups, and career legacy output
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-amber-400">{goatAnalysis.goatScore}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">GOAT Points</div>
                </div>
              </div>

              {/* Leaderboard Table vs Legends */}
              <div className="mt-6 border-t border-slate-800 pt-4">
                <h4 className="text-xs font-black uppercase text-slate-400 mb-2">Pantheon Comparison</h4>
                <div className="space-y-2">
                  {goatAnalysis.comparisonTable.map((leg, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-850 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-400">#{idx + 1}</span>
                        <span className="font-black text-white">{leg.name}</span>
                        <span className="text-[11px] text-slate-500">({leg.trophies})</span>
                      </div>
                      <span className="font-extrabold text-amber-400">{leg.score} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Silverware Cabinet */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <Crown className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                <div className="text-[10px] uppercase font-bold text-slate-400">Ballon d'Ors</div>
                <div className="text-xl font-black text-amber-400">{careerState.trophies.ballonDors}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <Trophy className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <div className="text-[10px] uppercase font-bold text-slate-400">Champions Leagues</div>
                <div className="text-xl font-black text-blue-400">{careerState.trophies.championsLeagues}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <Globe className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <div className="text-[10px] uppercase font-bold text-slate-400">World Cups</div>
                <div className="text-xl font-black text-emerald-400">{careerState.trophies.worldCups}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <Medal className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                <div className="text-[10px] uppercase font-bold text-slate-400">League Titles</div>
                <div className="text-xl font-black text-purple-400">{careerState.trophies.leagueTitles}</div>
              </div>
            </div>

            {/* Career History Table */}
            {careerState.careerHistory.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h3 className="text-xs font-black uppercase text-slate-400 mb-3">Season-by-Season Archive</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-800">
                        <th className="py-2">Season</th>
                        <th>Club</th>
                        <th>Apps</th>
                        <th>Goals</th>
                        <th>Assists</th>
                        <th>Rating</th>
                        <th>Honours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {careerState.careerHistory.map((rec, idx) => (
                        <tr key={idx} className="text-slate-300">
                          <td className="py-2 font-bold">{rec.seasonYear}</td>
                          <td>{rec.clubName}</td>
                          <td>{rec.apps}</td>
                          <td className="text-emerald-400 font-bold">{rec.goals}</td>
                          <td className="text-cyan-400 font-bold">{rec.assists}</td>
                          <td className="text-amber-400 font-bold">{rec.avgRating}</td>
                          <td className="text-amber-300">{rec.trophies.join(', ') || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Season End Celebration Modal if active */}
      {seasonEndReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-amber-500/40 text-center text-white">
            <Trophy className="w-14 h-14 text-amber-400 mx-auto mb-2 animate-bounce" />
            <h2 className="text-2xl font-black">SEASON CONCLUDED!</h2>
            <p className="text-xs text-slate-400 mt-1">
              Another year written in football history.
            </p>

            {seasonEndReport.wonBallon && (
              <div className="mt-4 p-3 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-black">
                🌟 YOU WON THE BALLON D'OR! Crowned the finest footballer on the planet!
              </div>
            )}

            {seasonEndReport.wonBoot && (
              <div className="mt-2 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-black">
                👟 EUROPEAN GOLDEN BOOT WINNER! Most league goals across Europe!
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={() => setSeasonEndReport(null)}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs"
              >
                ADVANCE TO NEXT SEASON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
