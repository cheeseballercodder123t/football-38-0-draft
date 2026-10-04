import React, { useState, useMemo } from 'react';
import { Player } from '../types/football';
import { HexagonSkillGraph } from './HexagonSkillGraph';
import {
  calculateSquadHexagonSkills,
  calculatePlayerHexagonSkills,
} from '../utils/radarCalculations';
import { soundEngine } from '../utils/soundEngine';
import {
  Activity,
  Sparkles,
  Users,
  Compass,
  X,
  Share2,
  CheckCircle2,
  Shield,
  Target,
  Zap,
} from 'lucide-react';

interface SquadReportModalProps {
  startingXI: (Player | null)[];
  formationName: string;
  managerName?: string;
  onClose: () => void;
}

export function SquadReportModal({
  startingXI,
  formationName,
  managerName = 'Head Coach',
  onClose,
}: SquadReportModalProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | 'squad'>('squad');
  const [copied, setCopied] = useState<boolean>(false);

  const activeStarters = useMemo(() => {
    return startingXI.filter((p): p is Player => p !== null);
  }, [startingXI]);

  const squadSkills = useMemo(() => {
    return calculateSquadHexagonSkills(startingXI);
  }, [startingXI]);

  const inspectedPlayer = useMemo(() => {
    if (selectedPlayerId === 'squad') return null;
    return activeStarters.find(p => p.id === selectedPlayerId) || null;
  }, [selectedPlayerId, activeStarters]);

  const currentSkills = useMemo(() => {
    if (inspectedPlayer) {
      return calculatePlayerHexagonSkills(inspectedPlayer);
    }
    return squadSkills;
  }, [inspectedPlayer, squadSkills]);

  const handleCopyReport = () => {
    soundEngine.playCoins();
    const text = `📊 Squad Tactical Radar (${formationName}) | Index: ${squadSkills.overallIndex} | FIN: ${squadSkills.finishing} | CRE: ${squadSkills.creation} | CAR: ${squadSkills.carrying} | PHY: ${squadSkills.physicality} | DEF: ${squadSkills.defense} | BLD: ${squadSkills.buildUp}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Recommend best tactical playstyle based on squad hexagon strengths
  const recommendedStyle = useMemo(() => {
    if (squadSkills.buildUp >= 82 && squadSkills.creation >= 80) return 'Tiki-Taka / Juego de Posición';
    if (squadSkills.carrying >= 82 && squadSkills.finishing >= 82) return 'Direct Transition Counter-Attack';
    if (squadSkills.physicality >= 82 && squadSkills.defense >= 80) return 'Heavy-Metal Gegenpress';
    if (squadSkills.defense >= 84) return 'Compact Low-Block & Set-Piece Ambush';
    return 'Balanced Modern Total Football';
  }, [squadSkills]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200 font-mono">
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#131b26] to-[#0c1219] border border-slate-700/80 shadow-2xl text-white overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400" />

        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/60 text-[10px] font-black uppercase tracking-wider">
              SQUAD REPORT & TACTICAL RADAR
            </span>
            <span className="text-xs text-slate-400 font-bold hidden sm:inline">
              {formationName}
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

        {/* Hero Section */}
        <div className="px-5 py-3 bg-[#111924] border-b border-slate-800 flex items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <div className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Squad Composite Index: {squadSkills.overallIndex}</span>
            </div>
            <div className="text-xs text-slate-400 font-sans mt-0.5">
              Recommended Philosophy: <span className="text-emerald-300 font-bold">{recommendedStyle}</span>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Player Switcher */}
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
              👥 SQUAD AGGREGATE ({squadSkills.overallIndex})
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

          {/* Hexagon Skill Graph & Breakdown */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-4 rounded-2xl bg-[#0e1622] border border-slate-800">
            <HexagonSkillGraph
              skills={currentSkills}
              comparisonSkills={inspectedPlayer ? squadSkills : undefined}
              label={inspectedPlayer ? inspectedPlayer.name : 'Starting XI'}
              comparisonLabel="Squad Average"
              size={300}
            />

            <div className="w-full md:w-56 space-y-2 text-xs">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                {inspectedPlayer ? `${inspectedPlayer.name} Attributes` : 'Squad Averages'}
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

              {inspectedPlayer && (
                <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[10px] text-emerald-300 font-sans mt-2">
                  Dashed outline represents squad average baseline comparison.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#0e1520] flex items-center justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-md"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
