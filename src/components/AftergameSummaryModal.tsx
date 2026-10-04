import React, { useState, useMemo, useEffect } from 'react';
import { MatchResult, Player, AftergameReport } from '../types/football';
import { HexagonSkillGraph } from './HexagonSkillGraph';
import {
  generateAftergameReport,
  calculatePlayerHexagonSkills,
} from '../utils/radarCalculations';
import { soundEngine } from '../utils/soundEngine';
import {
  Trophy,
  Sparkles,
  Shield,
  Target,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Share2,
  User,
  Users,
  Compass,
  Award,
  Flame,
  X,
  ChevronRight,
  Star,
} from 'lucide-react';

interface AftergameSummaryModalProps {
  match: MatchResult;
  startingXI: (Player | null)[];
  managerName?: string;
  onClose: () => void;
  onNextMatch?: () => void;
}

export function AftergameSummaryModal({
  match,
  startingXI,
  managerName = 'Head Coach',
  onClose,
  onNextMatch,
}: AftergameSummaryModalProps) {
  const [tab, setTab] = useState<'radar' | 'tactics' | 'scout' | 'mvp'>('radar');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | 'squad'>('squad');
  const [showComparison, setShowComparison] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Generate full aftergame analytical report
  const report: AftergameReport = useMemo(() => {
    return generateAftergameReport(match, startingXI, managerName);
  }, [match, startingXI, managerName]);

  const isWin = report.resultOutcome === 'win';
  const isDraw = report.resultOutcome === 'draw';

  const activeStarters = useMemo(() => {
    return startingXI.filter((p): p is Player => p !== null);
  }, [startingXI]);

  // Selected player for individual hexagon inspection
  const inspectedPlayer = useMemo(() => {
    if (selectedPlayerId === 'squad') return null;
    return activeStarters.find(p => p.id === selectedPlayerId) || null;
  }, [selectedPlayerId, activeStarters]);

  const currentSkills = useMemo(() => {
    if (inspectedPlayer) {
      return calculatePlayerHexagonSkills(inspectedPlayer);
    }
    return report.squadSkills;
  }, [inspectedPlayer, report.squadSkills]);

  const handleCopyReport = () => {
    soundEngine.playCoins();
    const text = `📊 TACTICAL DEBRIEF [${match.competition} MD ${report.matchday}]: ${report.scoreline} vs ${report.opponentName} | Archetype: ${report.tacticalArchetype} | Dominance: ${report.dominanceIndex}% | Manager Rating: ${report.managerRating}/10 | MVP: ${report.mvpName} (${report.mvpRating}★)`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200 font-mono cursor-pointer"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#131b26] to-[#0c1219] border border-slate-700/80 shadow-2xl text-white overflow-hidden my-auto max-h-[92vh] flex flex-col cursor-default"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Glow Bar */}
        <div
          className={`h-1.5 w-full bg-gradient-to-r ${
            isWin
              ? 'from-emerald-400 via-teal-300 to-cyan-400'
              : isDraw
              ? 'from-amber-400 via-yellow-300 to-amber-500'
              : 'from-rose-500 via-red-400 to-orange-500'
          }`}
        />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                isWin
                  ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/60'
                  : isDraw
                  ? 'bg-amber-950/90 text-amber-300 border border-amber-500/60'
                  : 'bg-rose-950/90 text-rose-300 border border-rose-500/60'
              }`}
            >
              {isWin ? 'VICTORY' : isDraw ? 'DRAW' : 'DEFEAT'} · MD {report.matchday}
            </span>
            <span className="text-xs text-slate-400 font-bold hidden sm:inline">
              {match.competition}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReport}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{copied ? 'COPIED!' : 'SHARE'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Score & Banner Hero */}
        <div className="px-5 py-3 bg-gradient-to-r from-[#162130] to-[#111924] border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <div className="text-2xl font-black text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
              <span>{report.scoreline}</span>
              <span className="text-sm text-slate-400 font-medium">vs {report.opponentName}</span>
            </div>
            <div className="text-xs text-emerald-400 font-bold mt-0.5 flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{report.tacticalArchetype}</span>
            </div>
          </div>

          {/* Quick Metrics Pills */}
          <div className="flex items-center gap-2 text-[11px]">
            <div className="px-3 py-1.5 rounded-xl bg-[#0c131d] border border-slate-700 text-center">
              <div className="text-[9px] text-slate-400 font-bold uppercase">DOMINANCE</div>
              <div className="text-emerald-300 font-black">{report.dominanceIndex}%</div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#0c131d] border border-slate-700 text-center">
              <div className="text-[9px] text-slate-400 font-bold uppercase">xG DELTA</div>
              <div className={report.xgDelta >= 0 ? 'text-emerald-300 font-black' : 'text-rose-400 font-black'}>
                {report.xgDelta >= 0 ? `+${report.xgDelta}` : report.xgDelta}
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#0c131d] border border-slate-700 text-center">
              <div className="text-[9px] text-slate-400 font-bold uppercase">MANAGER ★</div>
              <div className="text-amber-300 font-black">{report.managerRating}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-5 pt-2 border-b border-slate-800 gap-2 bg-[#0e1520] text-xs font-bold">
          <button
            onClick={() => setTab('radar')}
            className={`py-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              tab === 'radar'
                ? 'border-emerald-400 text-emerald-300 font-black'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>HEXAGON SKILL GRAPH</span>
          </button>
          <button
            onClick={() => setTab('tactics')}
            className={`py-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              tab === 'tactics'
                ? 'border-emerald-400 text-emerald-300 font-black'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>TACTICAL SHAPE</span>
          </button>
          <button
            onClick={() => setTab('scout')}
            className={`py-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              tab === 'scout'
                ? 'border-emerald-400 text-emerald-300 font-black'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>SCOUT DEBRIEF</span>
          </button>
          <button
            onClick={() => setTab('mvp')}
            className={`py-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              tab === 'mvp'
                ? 'border-emerald-400 text-emerald-300 font-black'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>MATCH MVP</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: HEXAGON SKILL GRAPH */}
          {tab === 'radar' && (
            <div className="space-y-4">
              {/* Player / Squad Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedPlayerId('squad');
                  }}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all border ${
                    selectedPlayerId === 'squad'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  👥 SQUAD RADAR ({report.squadSkills.overallIndex})
                </button>
                {activeStarters.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedPlayerId(p.id);
                    }}
                    className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all border ${
                      selectedPlayerId === p.id
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p.name.split(' ').pop()} ({p.overall})
                  </button>
                ))}
              </div>

              {/* Hexagon Radar Display */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-4 rounded-2xl bg-[#0e1622] border border-slate-800">
                <HexagonSkillGraph
                  skills={currentSkills}
                  comparisonSkills={
                    selectedPlayerId === 'squad' && showComparison ? report.opponentSkills : undefined
                  }
                  label={inspectedPlayer ? `${inspectedPlayer.name}` : 'Your Starting XI'}
                  comparisonLabel={report.opponentName}
                  size={300}
                />

                {/* Radar Breakdown Metrics Card */}
                <div className="w-full md:w-56 space-y-2 text-xs">
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    {inspectedPlayer ? `${inspectedPlayer.name} Profile` : 'Squad Skill Breakdown'}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400">FINISHING:</span>
                      <span className="font-bold text-amber-400">{currentSkills.finishing}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400">CREATION:</span>
                      <span className="font-bold text-emerald-400">{currentSkills.creation}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400">CARRYING:</span>
                      <span className="font-bold text-cyan-400">{currentSkills.carrying}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400">PHYSICALITY:</span>
                      <span className="font-bold text-rose-400">{currentSkills.physicality}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400">DEFENSE:</span>
                      <span className="font-bold text-blue-400">{currentSkills.defense}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400">BUILD-UP:</span>
                      <span className="font-bold text-purple-400">{currentSkills.buildUp}</span>
                    </div>
                  </div>

                  {selectedPlayerId === 'squad' && (
                    <button
                      onClick={() => setShowComparison(prev => !prev)}
                      className="w-full mt-2 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold border border-slate-700 transition-all text-center"
                    >
                      {showComparison ? 'Hide Opponent Overlay' : 'Overlay Opponent Radar'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TACTICAL SHAPE & PARTNERSHIPS */}
          {tab === 'tactics' && (
            <div className="space-y-3">
              <div className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Key Unit Partnerships
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {report.partnerships.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#0f1723] border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white text-xs flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{p.name}</span>
                        <span className="text-[10px] text-slate-400">({p.players.join(' & ')})</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-[10px] font-black">
                        {p.rating} / 100
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {p.verdict}
                    </p>
                  </div>
                ))}
              </div>

              {/* Conversion and Shot Accuracy Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                <div className="p-3 rounded-2xl bg-[#0f1723] border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">SHOT CONVERSION</div>
                  <div className="text-base font-black text-emerald-400 mt-0.5">{report.conversionRate}%</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#0f1723] border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">CLEAN SHEET</div>
                  <div className="text-base font-black text-cyan-400 mt-0.5">
                    {match.homeTeam === 'Your Starting XI' ? match.awayScore === 0 ? 'YES' : 'NO' : match.homeScore === 0 ? 'YES' : 'NO'}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-[#0f1723] border border-slate-800 text-center col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">OUTCOME VERDICT</div>
                  <div className="text-base font-black text-amber-300 mt-0.5 uppercase">
                    {isWin ? 'MAX 3 PTS' : isDraw ? '1 POINT' : '0 PTS'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCOUT DEBRIEF */}
          {tab === 'scout' && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Tactical Strengths
                </div>
                <div className="space-y-2">
                  {report.scoutDebrief.strengths.map((str, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 font-sans"
                    >
                      {str}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-black uppercase text-rose-400 tracking-wider flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Areas For Tactical Optimization
                </div>
                <div className="space-y-2">
                  {report.scoutDebrief.vulnerabilities.map((vuln, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 font-sans"
                    >
                      {vuln}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MATCH MVP */}
          {tab === 'mvp' && (
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-950/50 via-[#1e1910] to-yellow-950/50 border border-amber-500/60 shadow-xl text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  MAN OF THE MATCH · {report.mvpRating} RATING
                </div>

                <div className="text-xl font-black text-white">{report.mvpName}</div>
                <div className="text-xs text-amber-200/90 font-medium font-sans">
                  {report.mvpStats}
                </div>

                {/* MVP Individual Radar */}
                {inspectedPlayer && inspectedPlayer.id === report.mvpPlayerId ? (
                  <div className="pt-2 flex justify-center">
                    <HexagonSkillGraph
                      skills={calculatePlayerHexagonSkills(inspectedPlayer)}
                      label={`${inspectedPlayer.name} MVP Radar`}
                      size={260}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedPlayerId(report.mvpPlayerId);
                      setTab('radar');
                    }}
                    className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all active:scale-95 shadow-md"
                  >
                    View {report.mvpName}'s Hexagon Radar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#0e1520] flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all active:scale-95"
          >
            Return to Season Hub
          </button>

          {onNextMatch && (
            <button
              onClick={() => {
                soundEngine.playWhistle();
                onNextMatch();
                onClose();
              }}
              className="py-2.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 text-xs font-black rounded-xl transition-all active:scale-95 shadow-md flex items-center gap-1.5"
            >
              <span>NEXT MATCHDAY</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
