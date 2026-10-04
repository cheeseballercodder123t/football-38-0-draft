import React, { useState } from 'react';
import {
  DynastyState,
  Player,
  FacilityUpgrades,
  TransferMarketListing,
  CommercialSponsor,
  DynastyStaffMember,
  PreSeasonTour,
} from '../types/football';
import { WONDERKIDS_POOL } from '../data/wonderkids';
import { TRANSFER_MARKET_POOL } from '../data/transferMarket';
import { SPONSORS_POOL, PRE_SEASON_TOURS } from '../data/sponsors';
import { AVAILABLE_STAFF_POOL } from '../data/staffPool';
import {
  FACILITY_INFO,
  FACILITY_UPGRADE_COSTS,
  calculatePlayerSaleValue,
} from '../engine/dynastyEngine';
import {
  Trophy,
  Coins,
  Users,
  Sparkles,
  Calendar,
  Shield,
  ArrowRight,
  Star,
  TrendingUp,
  Building2,
  Globe,
  Briefcase,
  Award,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  UserCheck,
  ChevronRight,
  Flame,
  Zap,
  Handshake,
  Plane,
  RefreshCw,
  Crown,
  X,
  Play,
  FileText,
  Dumbbell,
  Check,
  Heart,
  Newspaper,
  MessageSquare,
  Radio,
  Compass,
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface DynastyHubProps {
  dynastyState: DynastyState;
  squad: (Player | null)[];
  bench?: (Player | null)[];
  onDraftWonderkid: (wonderkid: Player) => void;
  onAdvanceSeason: () => void;
  onUpgradeFacility: (facility: keyof FacilityUpgrades) => void;
  onBuyTransferPlayer: (listing: TransferMarketListing) => void;
  onSellPlayer: (playerId: string) => void;
  onHireStaff?: (staff: DynastyStaffMember) => void;
  onSignSponsor?: (sponsor: CommercialSponsor) => void;
  onLoanPlayer?: (playerId: string, club: string) => void;
  onStartTour?: (tour: PreSeasonTour) => void;
  onEnterMatchdayHub?: () => void;
  matchday?: number;
  maxMatchdays?: number;
  isSeasonComplete?: boolean;
  onSetTrainingFocus?: (focus: 'gegenpress' | 'finishing' | 'defense' | 'tiki_taka' | 'youth' | null) => void;
  onRenewContract?: (playerId: string) => void;
  onSetCaptain?: (playerId: string) => void;
}

export const DynastyHub: React.FC<DynastyHubProps> = ({
  dynastyState,
  squad,
  bench = [],
  onDraftWonderkid,
  onAdvanceSeason,
  onUpgradeFacility,
  onBuyTransferPlayer,
  onSellPlayer,
  onHireStaff,
  onSignSponsor,
  onLoanPlayer,
  onStartTour,
  onEnterMatchdayHub,
  matchday = 1,
  maxMatchdays = 38,
  isSeasonComplete = false,
  onSetTrainingFocus,
  onRenewContract,
  onSetCaptain,
}) => {
  const [activeDynastyTab, setActiveDynastyTab] = useState<
    'facilities' | 'training' | 'transfers' | 'roster' | 'academy' | 'sponsors' | 'staff' | 'legends' | 'news'
  >('facilities');

  const [confirmSellPlayer, setConfirmSellPlayer] = useState<Player | null>(null);
  const [selectedTrophyPlaque, setSelectedTrophyPlaque] = useState<string | null>(null);

  // Media Press Room State
  const [pressQuestionIdx, setPressQuestionIdx] = useState(0);
  const [answeredPressMap, setAnsweredPressMap] = useState<Record<number, { text: string; headline: string; effect: string }>>({});
  const [pressSuccessNotice, setPressSuccessNotice] = useState<string | null>(null);

  // Chief Scout Global Talent Expedition State
  const [activeScoutMission, setActiveScoutMission] = useState<{
    region: 'South America' | 'Europe' | 'Domestic';
    discoveredPlayer: Player | null;
  } | null>(null);

  const availableWonderkids = WONDERKIDS_POOL.filter(
    w => !dynastyState.wonderkidsDrafted.includes(w.id)
  ).slice(0, 4);

  const allSquadPlayers = [...squad, ...bench].filter((p): p is Player => p !== null);
  const youngSquadPlayers = allSquadPlayers.filter(p => (p.age || 26) <= 23);
  const hasEmptySlot = squad.some(p => p === null) || bench.some(b => b === null);

  const dynastyPressQuestions = [
    {
      id: 'press-1',
      journalist: 'Fabrizio Romano',
      outlet: 'Sky Sport & Here We Go',
      topic: 'Transfer Strategy & Squad Depth',
      question: `Gaffer, with Season ${dynastyState.season} underway and $${dynastyState.budgetM}M in your war chest, are you prioritizing youth prodigies or proven world-class superstars?`,
      options: [
        {
          label: '"Youth is the bedrock of our dynasty. We will build a multi-title dynasty on generational hunger."',
          tone: 'inspirational',
          effect: '+5 Board Trust · Squad Morale Peaked',
          headline: 'GAFFER VOWS TO FORGE GENERATIONAL ERA ON YOUTH EXCELLENCE',
        },
        {
          label: '"Every single signing must elevate our competitive ceiling immediately. We do not compromise on silverware."',
          tone: 'diplomatic',
          effect: '+4 Board Trust · Elite Standards Set',
          headline: 'MANAGER DEMANDS INSTANT SILVERWARE PEDIGREE IN TRANSFER MARKET',
        },
        {
          label: '"We work with the squad we have. Outside noise and media speculation will not dictate our operations."',
          tone: 'combative',
          effect: '+6 Squad Morale · Fortress Mentality',
          headline: 'BOSS FIRES BACK AT PUNDITS: "WE WILL SILENCE THE CRITICS ON PITCH"',
        },
      ],
    },
    {
      id: 'press-2',
      journalist: 'Henry Winter',
      outlet: 'The Times Football Daily',
      topic: 'Tactical Philosophy & Squad Intensity',
      question: `Tactical analysts praise your ${dynastyState.trainingFocus ? dynastyState.trainingFocus.toUpperCase() : 'BALANCED'} training drill setup. How confident are you this system can dominate the title race?`,
      options: [
        {
          label: '"Our tactical identity is non-negotiable. Every player executes their role with elite courage and discipline."',
          tone: 'inspirational',
          effect: '+5 Squad Morale · Tactical Belief Soars',
          headline: 'MANAGER CALLS FOR FEARLESS TACTICAL COURAGE FROM FIRST MINUTE',
        },
        {
          label: '"Modern football demands continuous structural adaptation. We prepare for every scenario with microscopic detail."',
          tone: 'diplomatic',
          effect: '+4 Board Trust · Tactical Rigor Praised',
          headline: 'MASTERCLASS IN PREPARATION: GAFFER PRAISED FOR TACTICAL RIGOR',
        },
      ],
    },
    {
      id: 'press-3',
      journalist: 'Guillem Balagué',
      outlet: 'European Champions Lounge',
      topic: 'Silverware Mandate & Fan Expectations',
      question: `The boardroom confidence stands at ${dynastyState.boardConfidence}%. What is your direct message to supporters dreaming of major silverware this season?`,
      options: [
        {
          label: '"To our supporters: keep faith. We are building something truly immortal that this club has never witnessed before."',
          tone: 'inspirational',
          effect: '+6 Board Trust · Fan Sentiment Historic High',
          headline: 'SUPPORTERS RALLY AS GAFFER PROMISES IMMORTAL SILVERWARE GLORY',
        },
        {
          label: '"Trophies are not won in press conferences; they are forged in daily sweat and tactical obsession on the training pitch."',
          tone: 'diplomatic',
          effect: '+4 Board Trust · Relentless Focus Instilled',
          headline: 'GAFFER INSTILLS RELENTLESS PROFESSIONAL DISCIPLINE ACROSS SQUAD',
        },
      ],
    },
  ];

  const getAgeBadge = (age: number) => {
    if (age <= 22) {
      return { label: 'PROSPECT', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/60' };
    }
    if (age <= 31) {
      return { label: 'PRIME', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60' };
    }
    if (age <= 34) {
      return { label: 'VETERAN', color: 'bg-amber-950/80 text-amber-300 border-amber-500/60' };
    }
    return { label: 'RETIREMENT RISK', color: 'bg-rose-950/90 text-rose-300 border-rose-600/80 animate-pulse' };
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 font-sans select-none animate-in fade-in duration-200">
      {/* Executive Dynasty Stats Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 bg-gradient-to-br from-[#16202e] via-[#101724] to-[#0c121c] border-2 border-slate-700/80 rounded-2xl flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] font-bold uppercase">
            <span>DYNASTY ERA</span>
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-black text-white font-mono mt-1 drop-shadow-sm">
            Season {dynastyState.season}
          </div>
        </div>

        <div className="p-3.5 bg-gradient-to-br from-[#0c2419] via-[#081a12] to-[#05110c] border-2 border-emerald-500/60 rounded-2xl flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-emerald-300 font-mono text-[10px] font-bold uppercase">
            <span>WAR CHEST</span>
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-300 font-mono mt-1 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
            ${dynastyState.budgetM}M
          </div>
        </div>

        <div className="p-3.5 bg-gradient-to-br from-[#241a0a] via-[#171005] to-[#0d0903] border-2 border-amber-500/60 rounded-2xl flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-amber-300 font-mono text-[10px] font-bold uppercase">
            <span>TROPHIES</span>
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-300 font-mono mt-1 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
            {dynastyState.trophyCabinet.length} TITLES
          </div>
        </div>

        <div className="p-3.5 bg-gradient-to-br from-[#1a1226] via-[#120b1c] to-[#0a0610] border-2 border-purple-500/60 rounded-2xl flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-purple-300 font-mono text-[10px] font-bold uppercase">
            <span>BOARD TRUST</span>
            <Star className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-black text-purple-300 font-mono mt-1">
            {dynastyState.boardConfidence}%
          </div>
        </div>
      </div>

      {/* Campaign Navigation Banner to Play Matchdays */}
      {onEnterMatchdayHub && (
        <div className="p-4 bg-gradient-to-r from-[#141e2e] via-[#0d1624] to-[#141e2e] border-2 border-emerald-500/80 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/10 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-md shrink-0">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-emerald-400 font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                ACTIVE DYNASTY LEAGUE CAMPAIGN
              </div>
              <h3 className="text-sm sm:text-base font-black text-white">
                {matchday <= maxMatchdays ? `Matchday ${matchday} of ${maxMatchdays} Ready` : 'Season Fixtures Completed'}
              </h3>
              <p className="text-[11px] text-slate-300 font-sans">
                {matchday <= maxMatchdays
                  ? 'Jump to the pitch to deploy tactics, scout opposition, and manage live matches.'
                  : 'Season complete! Review awards or advance to the next dynasty season.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onEnterMatchdayHub();
            }}
            className="py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950/70 transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 shrink-0 font-mono"
          >
            <span>{matchday <= maxMatchdays ? `ENTER MATCHDAY HUB (MD ${matchday})` : 'VIEW LEAGUE TABLE & AWARDS'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dynasty Hub Navigation Tabs */}
      <div className="flex p-1 bg-[#121822] border border-slate-800 rounded-2xl gap-1 text-xs font-mono shadow-md overflow-x-auto no-scrollbar scroll-smooth">
        {[
          { id: 'facilities', label: 'FACILITIES', icon: Building2 },
          { id: 'training', label: 'TRAINING', icon: Dumbbell },
          { id: 'transfers', label: 'TRANSFERS', icon: Globe },
          { id: 'roster', label: 'ROSTER & CONTRACTS', icon: Users },
          { id: 'academy', label: 'ACADEMY & LOANS', icon: Sparkles },
          { id: 'sponsors', label: 'SPONSORS', icon: Handshake },
          { id: 'staff', label: 'STAFF', icon: UserCheck },
          { id: 'legends', label: 'HONOURS & TOUR', icon: Award },
          { id: 'news', label: 'NEWS & MEDIA', icon: Newspaper },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeDynastyTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.playClick();
                setActiveDynastyTab(tab.id as any);
              }}
              className={`shrink-0 py-2 px-3 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap text-[11px] sm:text-xs ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. FACILITIES & CLUB INFRASTRUCTURE UPGRADES                              */}
      {/* ========================================================================= */}
      {activeDynastyTab === 'facilities' && (
        <div className="space-y-3 font-mono">
          <div className="p-4 bg-gradient-to-r from-[#141d2c] to-[#0c131d] border border-slate-700/80 rounded-2xl">
            <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase">
              <Building2 className="w-4 h-4 text-emerald-400" />
              CLUB INFRASTRUCTURE & FACILITY INVESTMENTS
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Upgrade club facilities to permanently accelerate player growth, generate gate receipts, unlock transfer discounts, and delay veteran retirement.
            </p>
          </div>

          <div className="space-y-2.5">
            {(Object.keys(FACILITY_INFO) as (keyof FacilityUpgrades)[]).map(key => {
              const info = FACILITY_INFO[key];
              const currentLevel = dynastyState.facilities[key];
              const isMaxLevel = currentLevel >= 5;
              const nextCost = !isMaxLevel ? FACILITY_UPGRADE_COSTS[currentLevel + 1] : 0;
              const canAfford = dynastyState.budgetM >= nextCost;

              return (
                <div
                  key={key}
                  className="p-4 rounded-2xl bg-[#0e141f] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-slate-700 transition-all"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm">{info.name}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-black text-[10px]">
                        LVL {currentLevel}/5
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">
                      {info.description}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isMaxLevel ? (
                      <span className="px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500 text-amber-300 text-xs font-black flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> MAX LEVEL
                      </span>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => {
                          soundEngine.playCoins();
                          onUpgradeFacility(key);
                        }}
                        className={`py-2 px-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 flex items-center gap-1.5 ${
                          canAfford
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-slate-950 shadow-md'
                            : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        }`}
                      >
                        <span>UPGRADE</span>
                        <span>(${nextCost}M)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CLUB TRAINING GROUND REGIMENS                                          */}
      {/* ========================================================================= */}
      {activeDynastyTab === 'training' && (
        <div className="space-y-3 font-mono">
          <div className="p-4 bg-gradient-to-r from-[#141d2c] to-[#0c131d] border border-slate-700/80 rounded-2xl">
            <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase">
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              TACTICAL SQUAD TRAINING REGIMEN
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Direct club training drills to hone player attributes and confer tactical advantages during competitive matchday simulations.
            </p>
          </div>

          <div className="space-y-2.5">
            {[
              {
                id: 'gegenpress' as const,
                title: 'High-Intensity Gegenpress & Conditioning',
                tag: 'COUNTER-PRESSING & STAMINA',
                desc: 'Intense aerobic and pressing drills. Squad gains +4% territorial possession, +3 stamina reserve, and dampens opponent chance generation by -8%.',
                color: 'from-amber-600 to-yellow-500',
                badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-600',
              },
              {
                id: 'finishing' as const,
                title: 'Clinical Finishing & Final Third Overloads',
                tag: 'ATTACKING CONVERSION',
                desc: 'Specialized striking and cutback repetition. User shot conversion surges by +12% on all expected goals (xG).',
                color: 'from-rose-600 to-red-500',
                border: 'border-rose-500/70',
                badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-600',
              },
              {
                id: 'defense' as const,
                title: 'Low-Block Solidity & Aerial Set-Piece Wall',
                tag: 'DEFENSIVE STRUCTURE',
                desc: 'Drills defensive line compaction, zonal marking, and set-piece box clearance. Reduces opponent shot xG by -12%.',
                color: 'from-blue-600 to-cyan-500',
                border: 'border-blue-500/70',
                badgeBg: 'bg-blue-950/80 text-blue-300 border-blue-600',
              },
              {
                id: 'tiki_taka' as const,
                title: 'Tiki-Taka Fluidity & Positional Triangles',
                tag: 'POSSESSION MASTERY',
                desc: 'Rondo drills and one-touch recirculation. Confers +6% match possession domination and reinforces squad chemistry.',
                color: 'from-emerald-600 to-teal-500',
                border: 'border-emerald-500/70',
                badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-600',
              },
              {
                id: 'youth' as const,
                title: 'La Masia Youth Prodigy Accelerator',
                tag: 'PRODIGY DEVELOPMENT',
                desc: 'Personalized mentoring from senior stars. Doubles seasonal attribute development probability for all squad prospects age 23 and under.',
                color: 'from-purple-600 to-violet-500',
                border: 'border-purple-500/70',
                badgeBg: 'bg-purple-950/80 text-purple-300 border-purple-600',
              },
            ].map(regimen => {
              const isSelected = dynastyState.trainingFocus === regimen.id;
              return (
                <div
                  key={regimen.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md ${
                    isSelected
                      ? `bg-emerald-950/40 border-emerald-400 ring-2 ring-emerald-400/40 shadow-[0_0_20px_rgba(52,211,153,0.3)]`
                      : 'bg-[#0e141f] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-white text-sm">{regimen.title}</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${regimen.badgeBg}`}>
                        {regimen.tag}
                      </span>
                      {isSelected && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded bg-emerald-500 text-slate-950 flex items-center gap-1 shadow-sm">
                          <Check className="w-3 h-3" /> ACTIVE DRILL
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-300 font-sans mt-1.5 leading-relaxed">
                      {regimen.desc}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isSelected ? (
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          onSetTrainingFocus?.(null);
                        }}
                        className="py-2 px-3.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all active:scale-95"
                      >
                        DEACTIVATE
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          soundEngine.playSuccessChime();
                          onSetTrainingFocus?.(regimen.id);
                        }}
                        className={`py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 flex items-center gap-1.5 bg-gradient-to-r ${regimen.color} text-slate-950 shadow-md hover:brightness-110`}
                      >
                        <span>ACTIVATE REGIMEN</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. GLOBAL TRANSFER MARKET & PLAYER SALES                                   */}
      {/* ========================================================================= */}
      {activeDynastyTab === 'transfers' && (
        <div className="space-y-4 font-mono">
          <div className="p-4 bg-gradient-to-r from-[#141d2c] to-[#0c131d] border border-slate-700/80 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase">
                <Globe className="w-4 h-4 text-cyan-400" />
                GLOBAL TRANSFER MARKET LISTINGS
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Sign elite stars, bargains, and expiring contracts directly into your squad.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
              {hasEmptySlot ? 'Slot Available' : 'Squad Full (Sell to Sign)'}
            </span>
          </div>

          {/* Transfer Listings */}
          <div className="space-y-2.5">
            {TRANSFER_MARKET_POOL.slice(0, 5).map(listing => {
              const p = listing.player;
              const canAfford = dynastyState.budgetM >= listing.askingPriceM;
              const canBuy = hasEmptySlot && canAfford;

              return (
                <div
                  key={listing.player.id}
                  className="p-4 rounded-2xl bg-[#0e141f] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-slate-700 transition-all"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm">{p.name}</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-emerald-400 font-black text-[10px]">
                        {p.specificPosition} · {p.age}yo
                      </span>
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase border ${
                          listing.reason === 'Star Target'
                            ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                            : listing.reason === 'Contract Expiring'
                            ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                            : 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                        }`}
                      >
                        {listing.reason}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-300 mt-1.5 flex-wrap">
                      <span>OVR <strong className="text-white">{p.overall}</strong></span>
                      <span className="text-slate-600">·</span>
                      <span>Buyout: <strong className="text-emerald-400 font-black">${listing.askingPriceM}M</strong></span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 italic font-sans text-[11px]">Club: {listing.sellerClub}</span>
                    </div>
                  </div>

                  <button
                    disabled={!canBuy}
                    onClick={() => {
                      soundEngine.playCoins();
                      onBuyTransferPlayer(listing);
                    }}
                    className={`py-2 px-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shrink-0 ${
                      canBuy
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    SIGN STAR
                  </button>
                </div>
              );
            })}
          </div>

          {/* Sell Players Section */}
          <div className="p-4 bg-gradient-to-r from-[#141d2c] to-[#0c131d] border border-slate-700/80 rounded-2xl mt-6">
            <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              PLAYER SALES & CONTRACT BUYOUTS
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Cash in on squad players to raise war chest funds for stadium upgrades or marquee signings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allSquadPlayers.map(p => {
              const saleVal = calculatePlayerSaleValue(p);
              const badge = getAgeBadge(p.age || 26);

              return (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl bg-[#0e141f] border border-slate-800 flex items-center justify-between gap-2 shadow-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400">
                        {p.specificPosition}
                      </span>
                      <span className="text-xs font-black text-white truncate">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] text-slate-400">{p.overall} OVR</span>
                      <span className={`text-[8px] font-black px-1 rounded border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setConfirmSellPlayer(p)}
                    className="py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-rose-950 hover:border-rose-500 border border-slate-700 text-slate-200 hover:text-rose-200 text-xs font-black transition-all active:scale-95 shrink-0"
                  >
                    SELL (${saleVal}M)
                  </button>
                </div>
              );
            })}
          </div>

          {/* Sell Confirmation Modal */}
          {confirmSellPlayer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-mono">
              <div className="p-5 rounded-3xl bg-[#141d2c] border-2 border-rose-500 max-w-sm w-full space-y-3 shadow-2xl">
                <div className="text-sm font-black text-white uppercase flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  CONFIRM PLAYER TRANSFER SALE
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Sell <strong className="text-white">{confirmSellPlayer.name}</strong> ({confirmSellPlayer.overall} OVR) to recoup{' '}
                  <strong className="text-emerald-400 font-black">${calculatePlayerSaleValue(confirmSellPlayer)}M</strong> into your war chest?
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setConfirmSellPlayer(null)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playCoins();
                      onSellPlayer(confirmSellPlayer.id);
                      setConfirmSellPlayer(null);
                    }}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 text-white font-black text-xs shadow-md"
                  >
                    CONFIRM SALE
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SQUAD ROSTER, MORALE & CONTRACT EXPIRATIONS                            */}
      {/* ========================================================================= */}
      {activeDynastyTab === 'roster' && (
        <div className="space-y-4 font-mono">
          <div className="p-4 bg-gradient-to-r from-[#141d2c] to-[#0c131d] border border-slate-700/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase">
                <Users className="w-4 h-4 text-emerald-400" />
                SQUAD ROSTER & CONTRACT NEGOTIATIONS
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Maintain dressing room harmony, extend expiring contracts (+3 yrs / $4M signing fee), and designate the on-pitch squad captain.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
              {allSquadPlayers.length} Contracted Players
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {allSquadPlayers.map(p => {
              const contractInfo = dynastyState.playerContracts?.[p.id] || {
                yearsLeft: Math.max(1, 4 - ((p.age || 26) > 31 ? 2 : 1)),
                morale: 'superb' as const,
              };
              const isCaptain = dynastyState.selectedCaptainId === p.id;
              const isExpiring = contractInfo.yearsLeft <= 1;
              const ageBadge = getAgeBadge(p.age || 26);
              const canAffordExtension = dynastyState.budgetM >= 4;

              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 shadow-sm ${
                    isCaptain
                      ? 'bg-gradient-to-b from-[#1a1408] to-[#0d0a04] border-amber-500/80 shadow-[0_0_16px_rgba(245,158,11,0.25)]'
                      : isExpiring
                      ? 'bg-gradient-to-b from-[#1c0c11] to-[#0d0508] border-rose-500/70'
                      : 'bg-[#0e141f] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400">
                          {p.specificPosition}
                        </span>
                        <span className="text-xs font-black text-white truncate">{p.name}</span>
                        {isCaptain && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-950 border border-amber-500 text-amber-300 text-[8px] font-black flex items-center gap-0.5">
                            <Crown className="w-2.5 h-2.5" /> CAPTAIN
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 flex-wrap">
                        <span>OVR <strong className="text-white">{p.overall}</strong></span>
                        <span className="text-slate-600">·</span>
                        <span>{p.age}yo</span>
                        <span className={`text-[8px] font-black px-1 rounded border ${ageBadge.color}`}>
                          {ageBadge.label}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase border ${
                          isExpiring
                            ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse'
                            : 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        }`}
                      >
                        {isExpiring ? '1 YR (EXPIRING)' : `${contractInfo.yearsLeft} YRS`}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Extend & Captaincy */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                    <button
                      disabled={!canAffordExtension || !onRenewContract}
                      onClick={() => {
                        soundEngine.playCoins();
                        onRenewContract?.(p.id);
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-black uppercase transition-all active:scale-95 flex items-center justify-center gap-1 ${
                        canAffordExtension
                          ? 'bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>EXTEND (+3 YRS / $4M)</span>
                    </button>

                    {!isCaptain && onSetCaptain && (
                      <button
                        onClick={() => {
                          soundEngine.playSuccessChime();
                          onSetCaptain(p.id);
                        }}
                        className="py-1.5 px-2.5 rounded-xl text-[10px] font-black uppercase bg-amber-950/80 hover:bg-amber-900 border border-amber-500/70 text-amber-300 transition-all active:scale-95 flex items-center gap-1 shrink-0"
                        title="Make Club Captain (+0.2 rating bonus & team composure boost)"
                      >
                        <Crown className="w-3 h-3" />
                        <span>CAPTAIN</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. YOUTH ACADEMY & LOANS SYSTEM                                           */}
      {/* ========================================================================= */}
      {activeDynastyTab === 'academy' && (
        <div className="space-y-4 font-mono">
          <div className="p-4 bg-gradient-to-r from-[#141d2c] to-[#0c131d] border border-slate-700/80 rounded-2xl">
            <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase">
              <Sparkles className="w-4 h-4 text-amber-400" />
              LA MASIA YOUTH SCOUTING DOSSIER
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Sign generational prodigies directly into your squad. Youth Academy Level {dynastyState.facilities.youthAcademy} boosts scouting accuracy.
            </p>
          </div>

          <div className="space-y-2.5">
            {availableWonderkids.map(w => {
              const cost = w.valueM || 45;
              const canAfford = dynastyState.budgetM >= cost;
              const canSign = hasEmptySlot && canAfford;

              return (
                <div
                  key={w.id}
                  className="p-4 bg-[#0d121a] border border-slate-700/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-slate-500 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-base truncate font-sans">{w.name}</span>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-black bg-[#16202d] text-emerald-300 border border-slate-700 rounded-md">
                        {w.specificPosition} · {w.age}yo
                      </span>
                    </div>

                    <div className="text-xs font-mono text-slate-300 mt-1.5 flex items-center gap-3 flex-wrap">
                      <span>OVR <strong className="text-white">{w.overall}</strong></span>
                      <span>→</span>
                      <span className="flex items-center gap-1">
                        POT <strong className="text-emerald-400">{w.potential}</strong>
                        <span className="text-amber-400 text-xs">★★★★★</span>
                      </span>
                      <span className="text-slate-600">·</span>
                      <span>Fee: <strong className="text-emerald-300 font-black">${cost}M</strong></span>
                    </div>
                  </div>

                  <button
                    disabled={!canSign}
                    onClick={() => {
                      soundEngine.playCoins();
                      onDraftWonderkid(w);
                    }}
                    className={`py-2 px-4 rounded-xl font-mono font-black text-xs uppercase tracking-wider transition-all duration-150 active:scale-95 shrink-0 ${
                      canSign
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-slate-950 shadow-md'
                        : 'bg-[#18212e] text-slate-500 border border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    SIGN PRODIGY
                  </button>
                </div>
              );
            })}
          </div>

          {/* Active Loaned Players Section */}
          <div className="p-4 bg-gradient-to-r from-[#141d2c] to-[#0c131d] border border-slate-700/80 rounded-2xl mt-6">
            <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase">
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              PARTNER CLUB LOAN NETWORK ({dynastyState.loanedPlayers?.length || 0} ACTIVE LOANS)
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Young prospects gain guaranteed +4 OVR progression during season loans without taking active squad slots.
            </p>
          </div>

          {dynastyState.loanedPlayers && dynastyState.loanedPlayers.length > 0 ? (
            <div className="space-y-2">
              {dynastyState.loanedPlayers.map((loan, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#0d1420] border border-cyan-500/50 rounded-2xl flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-xs">{loan.player.name}</span>
                      <span className="text-[10px] text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-700">
                        {loan.destinationClub}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {loan.player.specificPosition} · {loan.player.overall} OVR · Projected +{loan.projectedGrowth} OVR growth
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500">
                    ON LOAN
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-[#0e141f] border border-slate-800 rounded-2xl text-xs text-slate-400 italic text-center">
              No players currently on loan. Send young prospects below to accelerate their development!
            </div>
          )}

          {/* Loan Out Squad Prospects */}
          {youngSquadPlayers.length > 0 && onLoanPlayer && (
            <div className="space-y-2 pt-2">
              <span className="text-slate-400 text-xs font-bold uppercase">Eligible Prospects for Loan:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {youngSquadPlayers.map(p => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-[#0e141f] border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-black text-white truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.age}yo · {p.overall} OVR</div>
                    </div>
                    <button
                      onClick={() => {
                        soundEngine.playCoins();
                        onLoanPlayer(p.id, 'Girona FC');
                      }}
                      className="py-1.5 px-2.5 rounded-xl bg-cyan-950 border border-cyan-500 text-cyan-300 font-black text-[10px] hover:bg-cyan-900 transition-all active:scale-95 shrink-0"
                    >
                      LOAN (+$6M)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chief Scout Global Talent Expedition Section */}
          <div className="p-4 bg-gradient-to-r from-[#141d2c] to-[#0c131d] border border-slate-700/80 rounded-2xl mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase">
                <Compass className="w-4 h-4 text-emerald-400" />
                CHIEF SCOUT GLOBAL TALENT EXPEDITION
              </h3>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/60">
                SCOUT LEVEL {dynastyState.facilities.scoutingNetwork}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Dispatch Piet de Visser on targeted overseas scouting missions to unearth hidden wonderkids and unattached gems before European rivals notice.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                disabled={dynastyState.budgetM < 4}
                onClick={() => {
                  soundEngine.playCoins();
                  const discovered: Player = {
                    id: `wonderkid-scout-sa-${Date.now()}`,
                    name: 'Lucas "Neymar Jr" Silva',
                    position: 'FWD',
                    specificPosition: 'LW',
                    overall: 84,
                    potential: 96,
                    age: 18,
                    country: 'Brazil',
                    clubYear: 'Santos FC · 2024',
                    clubName: 'Santos FC',
                    year: '2024',
                    league: 'Other',
                    pace: 94,
                    shooting: 82,
                    passing: 84,
                    dribbling: 93,
                    defending: 38,
                    physical: 72,
                    composure: 86,
                    valueM: 28,
                    auraTrait: {
                      id: 'aura-samba-flare',
                      name: 'Samba Flare',
                      shortDesc: 'Supreme 1v1 dribbling mastery',
                      rarity: 'Legendary',
                      description: 'Supreme 1v1 dribbling mastery and box penetration.',
                    },
                  };
                  setActiveScoutMission({ region: 'South America', discoveredPlayer: discovered });
                }}
                className="p-3 rounded-2xl bg-[#0e1624] hover:bg-[#142032] border border-cyan-500/60 text-left transition-all active:scale-95 flex flex-col gap-1 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-cyan-300">🇧🇷 DISPATCH TO SOUTH AMERICA</span>
                  <span className="text-[10px] font-mono text-cyan-400 font-black">$4M FEE</span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  Scout São Paulo and Buenos Aires for 95+ potential samba prodigies.
                </p>
              </button>

              <button
                disabled={dynastyState.budgetM < 2}
                onClick={() => {
                  soundEngine.playCoins();
                  const discovered: Player = {
                    id: `free-agent-scout-eu-${Date.now()}`,
                    name: 'Mateo Kovacic Prime',
                    position: 'MID',
                    specificPosition: 'CM',
                    overall: 87,
                    potential: 89,
                    age: 26,
                    country: 'Croatia',
                    clubYear: 'Free Agent · 2024',
                    clubName: 'Free Agent',
                    year: '2024',
                    league: 'Premier League',
                    pace: 82,
                    shooting: 78,
                    passing: 88,
                    dribbling: 90,
                    defending: 79,
                    physical: 80,
                    composure: 88,
                    valueM: 18,
                    auraTrait: {
                      id: 'aura-press-resistant',
                      name: 'Press Resistant',
                      shortDesc: 'Escapes high press and traps',
                      rarity: 'Epic',
                      description: 'Escapes high traps and recycles possession cleanly.',
                    },
                  };
                  setActiveScoutMission({ region: 'Europe', discoveredPlayer: discovered });
                }}
                className="p-3 rounded-2xl bg-[#0e1624] hover:bg-[#142032] border border-purple-500/60 text-left transition-all active:scale-95 flex flex-col gap-1 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-300">🇪🇺 EUROPEAN FREE AGENT HUNT</span>
                  <span className="text-[10px] font-mono text-purple-400 font-black">$2M FEE</span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  Locate unattached international midfield anchors and veteran playmakers.
                </p>
              </button>
            </div>

            {/* Discovered Talent Modal / Card */}
            {activeScoutMission?.discoveredPlayer && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-[#0e2419] to-emerald-950/80 border-2 border-emerald-400 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-emerald-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    DISCOVERED SCOUTING TARGET ({activeScoutMission.region.toUpperCase()})
                  </span>
                  <button
                    onClick={() => setActiveScoutMission(null)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm">{activeScoutMission.discoveredPlayer.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400">
                        {activeScoutMission.discoveredPlayer.specificPosition} · {activeScoutMission.discoveredPlayer.age}yo
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                      OVR <strong className="text-white">{activeScoutMission.discoveredPlayer.overall}</strong> · POT <strong className="text-emerald-400">{activeScoutMission.discoveredPlayer.potential}</strong> · Fee: <strong className="text-emerald-300">${activeScoutMission.discoveredPlayer.valueM}M</strong>
                    </div>
                  </div>

                  <button
                    disabled={!hasEmptySlot || dynastyState.budgetM < (activeScoutMission.discoveredPlayer.valueM || 20)}
                    onClick={() => {
                      soundEngine.playCoins();
                      onDraftWonderkid(activeScoutMission.discoveredPlayer!);
                      setActiveScoutMission(null);
                    }}
                    className={`py-2 px-3.5 rounded-xl font-mono font-black text-xs uppercase tracking-wider transition-all active:scale-95 shrink-0 ${
                      hasEmptySlot && dynastyState.budgetM >= (activeScoutMission.discoveredPlayer.valueM || 20)
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    SIGN DISCOVERED TALENT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. COMMERCIAL SPONSORSHIPS & BOARD MANDATE                                */}
      {/* ========================================================================= */}
      {activeDynastyTab === 'sponsors' && (
        <div className="space-y-4 font-mono">
          {/* Active Sponsor Banner */}
          {dynastyState.activeSponsor && (
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#172235] via-[#111824] to-[#0c121c] border-2 border-emerald-500/80 rounded-3xl space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Handshake className="w-5 h-5 text-emerald-400" />
                  <span className="font-black text-white text-sm uppercase">
                    ACTIVE HEADLINE SPONSOR: {dynastyState.activeSponsor.name}
                  </span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500">
                  {dynastyState.activeSponsor.tier}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-[#0b1018] border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Guaranteed Annual Payout:</span>
                  <span className="text-emerald-400 font-black text-sm">${dynastyState.activeSponsor.basePayoutM}M / Season</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0b1018] border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Silverware Target Bonus:</span>
                  <span className="text-amber-400 font-black text-sm">+${dynastyState.activeSponsor.bonusPayoutM}M</span>
                </div>
              </div>
            </div>
          )}

          {/* Browse Sponsorship Offers */}
          <div className="p-4 bg-gradient-to-r from-[#141d2c] to-[#0c131d] border border-slate-700/80 rounded-2xl">
            <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase">
              <Handshake className="w-4 h-4 text-amber-400" />
              GLOBAL COMMERCIAL SPONSORSHIP OFFERS
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Sign a new commercial partnership to receive immediate upfront signing war chest funds and seasonal bonuses.
            </p>
          </div>

          <div className="space-y-2.5">
            {SPONSORS_POOL.map(sp => {
              const isCurrent = dynastyState.activeSponsor?.id === sp.id;
              return (
                <div
                  key={sp.id}
                  className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-emerald-950/40 border-emerald-500'
                      : 'bg-[#0e141f] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm">{sp.name}</span>
                      <span className="text-[10px] text-amber-300 font-bold px-1.5 py-0.5 rounded bg-amber-950 border border-amber-600">
                        {sp.tier}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      Base: <strong className="text-emerald-400">${sp.basePayoutM}M/yr</strong> · Target: <span className="text-slate-400 font-sans">{sp.bonusGoal} (+${sp.bonusPayoutM}M)</span>
                    </div>
                    {sp.penaltyCondition && (
                      <div className="text-[10px] text-rose-400 font-bold mt-0.5">⚠️ {sp.penaltyCondition}</div>
                    )}
                  </div>

                  {isCurrent ? (
                    <span className="text-xs font-black text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> SIGNED
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        soundEngine.playCoins();
                        onSignSponsor?.(sp);
                      }}
                      className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 text-slate-950 font-black text-xs uppercase transition-all active:scale-95 shrink-0 shadow-sm"
                    >
                      SIGN (+${Math.floor(sp.basePayoutM / 2)}M BONUS)
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Board Objectives */}
          <div className="p-4 sm:p-5 bg-gradient-to-b from-[#141b26] to-[#0f141e] border-2 border-slate-700/80 rounded-3xl space-y-3 mt-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-black text-white uppercase">
                  SEASON {dynastyState.season} BOARD MANDATE & OBJECTIVES
                </span>
              </div>
              <span className="text-[10px] text-purple-300 font-bold bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/60">
                TRUST: {dynastyState.boardConfidence}%
              </span>
            </div>

            <div className="space-y-2">
              {dynastyState.boardObjectives.map(obj => (
                <div
                  key={obj.id}
                  className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 ${
                    obj.isCompleted
                      ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200'
                      : 'bg-[#0e141f] border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-white">{obj.title}</span>
                      {obj.isCompleted && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-500">
                          ACHIEVED
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5">{obj.description}</div>
                  </div>
                  <span className="text-xs font-black text-emerald-400 shrink-0">
                    +${obj.rewardBudgetM}M
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. BACKROOM STAFF RECRUITMENT MARKET                                      */}
      {/* ========================================================================= */}
      {activeDynastyTab === 'staff' && (
        <div className="space-y-4 font-mono">
          <div className="p-4 bg-gradient-to-r from-[#141d2c] to-[#0c131d] border border-slate-700/80 rounded-2xl">
            <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              WORLD-CLASS SENIOR BACKROOM STAFF
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Hire elite tacticians, scouts, and doctors to confer matchday perks, transfer discounts, and player longevity.
            </p>
          </div>

          {/* Current Staff */}
          <div className="space-y-2">
            {[
              dynastyState.staff.assistantManager,
              dynastyState.staff.chiefScout,
              dynastyState.staff.headPhysio,
            ].map(st => (
              <div
                key={st.id}
                className="p-3.5 rounded-2xl bg-[#0e141f] border border-cyan-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-white text-xs">{st.name}</span>
                    <span className="text-[10px] text-cyan-300 font-bold px-1.5 py-0.5 bg-cyan-950 rounded border border-cyan-700">
                      {st.role} (LVL {st.level})
                    </span>
                    <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950 px-1 rounded border border-emerald-600">
                      CURRENT
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-sans mt-0.5">{st.perkDescription}</div>
                </div>
                <span className="text-xs text-slate-400 font-bold shrink-0">
                  ${st.salaryM}M/yr
                </span>
              </div>
            ))}
          </div>

          {/* Available Staff Candidates */}
          <div className="p-4 bg-gradient-to-r from-[#141d2c] to-[#0c131d] border border-slate-700/80 rounded-2xl mt-6">
            <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase">
              <Users className="w-4 h-4 text-amber-400" />
              AVAILABLE ELITE BACKROOM CANDIDATES
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Recruit proven masters to take your tactical setup to the pinnacle of world football.
            </p>
          </div>

          <div className="space-y-2.5">
            {AVAILABLE_STAFF_POOL.map(cand => {
              const currentSt =
                cand.role === 'Assistant Manager'
                  ? dynastyState.staff.assistantManager
                  : cand.role === 'Chief Scout'
                  ? dynastyState.staff.chiefScout
                  : dynastyState.staff.headPhysio;
              const isHired = currentSt?.name === cand.name;
              const fee = cand.salaryM * 2;
              const canAfford = dynastyState.budgetM >= fee;

              return (
                <div
                  key={cand.id}
                  className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isHired
                      ? 'bg-cyan-950/30 border-cyan-500'
                      : 'bg-[#0e141f] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-xs">{cand.name}</span>
                      <span className="text-[10px] text-amber-300 font-bold px-1.5 py-0.5 rounded bg-amber-950 border border-amber-600">
                        {cand.role} · LVL {cand.level}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-sans mt-1">{cand.perkDescription}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Fee: ${fee}M · Salary: ${cand.salaryM}M / season
                    </div>
                  </div>

                  {isHired ? (
                    <span className="text-xs font-black text-cyan-300 px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> HIRED
                    </span>
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        soundEngine.playCoins();
                        onHireStaff?.(cand);
                      }}
                      className={`py-2 px-3.5 rounded-xl font-black text-xs uppercase transition-all active:scale-95 shrink-0 ${
                        canAfford
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-slate-950 shadow-sm'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      RECRUIT (${fee}M)
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. HONOURS, SILVERWARE & PRE-SEASON WORLD TOUR                            */}
      {/* ========================================================================= */}
      {activeDynastyTab === 'legends' && (
        <div className="space-y-4 font-mono">
          {/* Pre-Season World Tour */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#172235] via-[#111824] to-[#0c121c] border-2 border-cyan-500/80 rounded-3xl space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/40">
              <div className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-cyan-400" />
                <span className="font-black text-white text-xs uppercase tracking-wider">
                  PRE-SEASON GLOBAL EXHIBITION TOUR
                </span>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                dynastyState.preSeasonTourCompleted
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  : 'bg-cyan-950 text-cyan-300 border-cyan-500'
              }`}>
                {dynastyState.preSeasonTourCompleted ? 'TOUR COMPLETED' : 'AWAITING EMBARKATION'}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Travel across the globe before matchday 1 to expand international commercial brand value and sharpen squad match sharpness.
            </p>

            {!dynastyState.preSeasonTourCompleted ? (
              <div className="space-y-2 pt-1">
                {PRE_SEASON_TOURS.map(tour => (
                  <button
                    key={tour.id}
                    onClick={() => {
                      soundEngine.playCoins();
                      onStartTour?.(tour);
                    }}
                    className="w-full p-3 rounded-2xl bg-[#0d1420] hover:bg-[#152032] border border-slate-800 hover:border-cyan-400 text-left flex items-center justify-between gap-3 transition-all active:scale-[0.98] shadow-sm"
                  >
                    <div>
                      <div className="font-black text-white text-xs">{tour.destination}</div>
                      <div className="text-[11px] text-cyan-300 font-sans mt-0.5">
                        +{tour.squadSharpnessBonus} Sharpness · +{tour.staminaConditioning} Conditioning
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-400 shrink-0">
                      +${tour.revenueM}M WAR CHEST
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/60 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pre-season tour concluded successfully. Squad sharpness is peaked for competitive fixtures!</span>
              </div>
            )}
          </div>

          {/* Silverware Cabinet */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#241908] via-[#161f2c] to-[#241908] border-2 border-amber-500/70 rounded-3xl shadow-xl relative overflow-hidden mt-6">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-500/30">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                SILVERWARE CABINET ({dynastyState.trophyCabinet.length} TITLES)
              </span>
            </div>
            {dynastyState.trophyCabinet.length === 0 ? (
              <div className="text-xs text-slate-400 italic py-4 text-center">
                Cabinet awaiting its first silverware. Win the league or European Cup to etch your name into history!
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {dynastyState.trophyCabinet.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      soundEngine.playSuccessChime();
                      setSelectedTrophyPlaque(t);
                    }}
                    className="group px-3.5 py-2 text-xs font-black bg-gradient-to-r from-amber-950/90 via-[#261706] to-amber-950/90 border border-amber-400/80 hover:border-amber-300 text-amber-200 rounded-2xl flex items-center gap-2 shadow-md shadow-amber-950/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all duration-150 active:scale-95"
                  >
                    <div className="w-6 h-6 rounded-lg bg-amber-400/20 border border-amber-400/60 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Trophy className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                    </div>
                    <span className="min-w-0 flex-1 truncate text-left">{t}</span>
                    <span className="text-[9px] text-amber-400/80 font-mono tracking-wider ml-1 uppercase hidden sm:inline shrink-0">
                      [INSPECT PLAQUE]
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hall of Fame Legends */}
          <div className="p-4 sm:p-5 bg-gradient-to-b from-[#141b26] to-[#0f141e] border-2 border-slate-700/80 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black text-white uppercase">
                CLUB HALL OF FAME ({dynastyState.legends.length} LEGENDS)
              </span>
            </div>

            {dynastyState.legends.length === 0 ? (
              <div className="text-xs text-slate-400 italic py-4 text-center">
                Players retiring with 86+ OVR or long service records will be immortalized here.
              </div>
            ) : (
              <div className="space-y-2">
                {dynastyState.legends.map(l => (
                  <div
                    key={l.id}
                    className="p-3 rounded-2xl bg-[#0e141f] border border-amber-500/60 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-xs">{l.name}</span>
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500">
                          {l.legacyStatus}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {l.position} · Peak {l.peakOverall} OVR · Retired Season {l.retiredSeason} · {l.trophiesWon} Trophies
                      </div>
                    </div>
                    <Trophy className="w-4 h-4 text-amber-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. NEWS WIRE, PRESS CONFERENCES & CLUB MEDIA HUB                         */}
      {/* ========================================================================= */}
      {activeDynastyTab === 'news' && (
        <div className="space-y-4 font-mono">
          {/* Media Room Header */}
          <div className="p-4 bg-gradient-to-r from-[#141d2c] to-[#0c131d] border border-slate-700/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase">
                <Newspaper className="w-4 h-4 text-emerald-400" />
                PRESS CONFERENCES & CLUB MEDIA INTELLIGENCE
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Address accredited media correspondents, shape public narrative, and monitor European transfer leaks.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-purple-300 font-bold bg-purple-950/80 px-2.5 py-1 rounded-xl border border-purple-500/60">
                TRUST: {dynastyState.boardConfidence}%
              </span>
            </div>
          </div>

          {/* Press Question Interactive Conference Card */}
          {(() => {
            const currentQ = dynastyPressQuestions[pressQuestionIdx % dynastyPressQuestions.length];
            const answered = answeredPressMap[pressQuestionIdx];

            return (
              <div className="p-4 sm:p-5 bg-gradient-to-b from-[#141d2c] via-[#0d1422] to-[#0a0f18] border-2 border-slate-700/80 rounded-3xl space-y-3.5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-xs font-black text-emerald-300">
                      🎙️
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                        {currentQ.outlet} · {currentQ.journalist}
                      </span>
                      <span className="text-xs font-black text-white">{currentQ.topic}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    BRIEFING {pressQuestionIdx + 1}/{dynastyPressQuestions.length}
                  </span>
                </div>

                <p className="text-xs text-slate-200 font-sans leading-relaxed italic bg-[#0a0f17] p-3 rounded-2xl border border-slate-800">
                  "{currentQ.question}"
                </p>

                {answered ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/80 space-y-2 animate-in fade-in">
                    <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-black uppercase">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>OFFICIAL HEADLINE PUBLISHED:</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-emerald-400/40 text-white font-sans font-bold text-xs">
                      📰 {answered.headline}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">
                      IMPACT: {answered.effect}
                    </div>
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        setPressQuestionIdx(prev => (prev + 1) % dynastyPressQuestions.length);
                      }}
                      className="mt-1 w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all"
                    >
                      NEXT PRESS QUESTION &rarr;
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
                      SELECT YOUR MANAGERIAL RESPONSE:
                    </span>
                    {currentQ.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => {
                          soundEngine.playSuccessChime();
                          setAnsweredPressMap(prev => ({
                            ...prev,
                            [pressQuestionIdx]: {
                              text: opt.label,
                              headline: opt.headline,
                              effect: opt.effect,
                            },
                          }));
                          setPressSuccessNotice(`MEDIA BRIEFING CONCLUDED: ${opt.headline}`);
                          setTimeout(() => setPressSuccessNotice(null), 4000);
                        }}
                        className="w-full p-3 rounded-2xl bg-[#0f1624] hover:bg-[#162134] border border-slate-800 hover:border-emerald-500/70 text-left transition-all group flex flex-col gap-1 active:scale-98"
                      >
                        <div className="text-xs text-white font-sans group-hover:text-emerald-300 transition-colors">
                          {opt.label}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                          <span className="font-bold text-amber-300 uppercase text-[9px]">{opt.tone}</span>
                          <span className="text-emerald-400 font-bold">{opt.effect}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Media Notification Feedback Toast */}
          {pressSuccessNotice && (
            <div className="p-3 bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-500 text-emerald-200 text-xs font-mono font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{pressSuccessNotice}</span>
            </div>
          )}

          {/* Breaking Transfer & Club Intelligence Feed */}
          <div className="p-4 sm:p-5 bg-gradient-to-b from-[#101724] to-[#0c121c] border-2 border-slate-700/80 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs font-black text-white uppercase">
                24/7 FOOTBALL WIRE & TRANSFER DISPATCH
              </span>
            </div>

            <div className="space-y-2">
              {[
                {
                  source: 'Fabrizio Romano',
                  tag: 'TRANSFER RADAR',
                  color: 'border-cyan-500/60 bg-cyan-950/40 text-cyan-200',
                  text: `European scouts have submitted formal inquiries regarding starters in your squad. War chest remains strong at $${dynastyState.budgetM}M.`,
                  time: '12m ago',
                },
                {
                  source: 'The Athletic UK',
                  tag: 'TACTICAL AUDIT',
                  color: 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200',
                  text: `Analyst breakdown confirms your current ${dynastyState.trainingFocus ? dynastyState.trainingFocus.toUpperCase() : 'BALANCED'} drill regime ranks among the most disciplined tactical systems in Europe.`,
                  time: '45m ago',
                },
                {
                  source: 'Club Treasury Board',
                  tag: 'FINANCIAL HEALTH',
                  color: 'border-amber-500/60 bg-amber-950/40 text-amber-200',
                  text: `Facility Level ${dynastyState.facilities.stadium} stadium operations and gate receipts project record-breaking seasonal revenue surplus.`,
                  time: '2h ago',
                },
                {
                  source: 'Chief Scout Piet de Visser',
                  tag: 'SCOUTING DISPATCH',
                  color: 'border-purple-500/60 bg-purple-950/40 text-purple-200',
                  text: `Scouts stationed in South America have shortlisted 3 wonderkids exhibiting 95+ potential. Check the Academy tab to draft them.`,
                  time: '4h ago',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border flex flex-col gap-1.5 ${item.color}`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-black font-sans text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      {item.source}
                    </span>
                    <span className="text-slate-400 font-mono">{item.time}</span>
                  </div>
                  <p className="text-xs font-sans text-slate-200 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Advance Dynasty Season Button & Matchday Notice */}
      <div className="space-y-2">
        {matchday <= maxMatchdays && (
          <div className="p-3 bg-amber-950/40 border border-amber-500/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div className="text-amber-200">
              <span className="font-bold">{maxMatchdays - matchday + 1} fixtures remaining</span> in Season {dynastyState.season}. You can play each fixture or advance season.
            </div>
            {onEnterMatchdayHub && (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onEnterMatchdayHub();
                }}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl uppercase tracking-wider transition-all active:scale-95 shrink-0"
              >
                PLAY FIXTURES &rarr;
              </button>
            )}
          </div>
        )}

        <button
          onClick={onAdvanceSeason}
          className="w-full py-4 px-5 bg-gradient-to-r from-[#1c2636] via-[#243144] to-[#1c2636] hover:border-emerald-500/80 text-white border-2 border-slate-700 rounded-2xl font-mono text-xs font-black uppercase tracking-wider shadow-xl transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]"
        >
          <span>ADVANCE TO DYNASTY SEASON {dynastyState.season + 1} (AGE SQUAD & AUDIT BUDGET)</span>
          <ArrowRight className="w-4 h-4 text-emerald-400" />
        </button>
      </div>

      {/* Interactive Championship Glory Plaque Modal */}
      {selectedTrophyPlaque && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md font-sans select-none animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-[#1f1608] via-[#120d04] to-[#0a0702] border-2 border-amber-500/80 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.45)] text-center space-y-4 animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Top gold shimmer bar */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 via-yellow-200 to-transparent pointer-events-none" />

            {/* Rotating Divine God Rays */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] pointer-events-none opacity-20 animate-divine-rays">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-transparent blur-3xl" />
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedTrophyPlaque(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white transition-colors z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 3D Gold Trophy Pedestal Emblem */}
            <div className="relative z-10 inline-flex items-center justify-center p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-400/30 via-yellow-500/15 to-transparent border-2 border-amber-400/80 shadow-[0_0_35px_rgba(245,158,11,0.5)]">
              <Crown className="w-12 h-12 text-amber-300 drop-shadow-[0_0_15px_rgba(245,158,11,0.9)]" />
            </div>

            {/* Inscription Header */}
            <div className="relative z-10 space-y-1">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-amber-400/90 block">
                HALL OF SILVERWARE · COMMEMORATIVE GLORY PLAQUE
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-md">
                {selectedTrophyPlaque}
              </h2>
            </div>

            {/* Plaque Pedestal Card */}
            <div className="relative z-10 p-4 rounded-2xl bg-[#140e04]/90 border border-amber-500/40 text-left space-y-2.5 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span className="text-slate-400 text-[11px]">CONFERRED TO:</span>
                <span className="text-amber-300 font-black">YOUR STARTING XI & SQUAD</span>
              </div>

              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span className="text-slate-400 text-[11px]">HONOUR STATUS:</span>
                <span className="text-emerald-400 font-black">
                  {selectedTrophyPlaque.includes('38-0') || selectedTrophyPlaque.includes('Invincible')
                    ? '★ IMMORTAL INVINCIBLES'
                    : selectedTrophyPlaque.includes('Champions')
                    ? '★ CONTINENTAL CHAMPIONS'
                    : '★ SILVERWARE WINNERS'}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span className="text-slate-400 text-[11px]">DYNASTY PRESTIGE:</span>
                <span className="text-amber-400 font-black">+500 LEGACY POINTS</span>
              </div>

              <p className="text-[11px] text-amber-200/90 font-sans leading-relaxed pt-1 italic">
                {selectedTrophyPlaque.includes('38-0') || selectedTrophyPlaque.includes('Invincible')
                  ? '"An untouchable campaign without defeat. Etched forever into the pantheon of all-time football dynasties."'
                  : selectedTrophyPlaque.includes('Champions')
                  ? '"Climbing to the pinnacle of elite European competition through supreme tactical courage and clutch knockout mastery."'
                  : '"Triumph attained through relentless tactical consistency, dressing room unity, and unwavering championship spirit."'}
              </p>
            </div>

            {/* Action Close Button */}
            <div className="relative z-10 pt-1">
              <button
                onClick={() => {
                  soundEngine.playSuccessChime();
                  setSelectedTrophyPlaque(null);
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-950/70 transition-all duration-150 active:scale-95"
              >
                CLOSE & ADMIRE SILVERWARE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
