import React, { useState } from 'react';
import { SeasonTableEntry, MatchResult, Player } from '../types/football';
import { Trophy, Award, Sparkles, Flame, Shield, ArrowUpRight } from 'lucide-react';

interface SeasonTableProps {
  table: SeasonTableEntry[];
  matches: MatchResult[];
  squad: (Player | null)[];
}

export const SeasonTable: React.FC<SeasonTableProps> = ({
  table,
  matches,
  squad,
}) => {
  const [tab, setTab] = useState<'table' | 'scorers' | 'assists'>('table');

  const playerGoals = new Map<string, { name: string; goals: number; assists: number; team: string }>();

  squad.filter((p): p is Player => p !== null).forEach(p => {
    playerGoals.set(p.id, { name: p.name, goals: 0, assists: 0, team: 'Your Starting XI' });
  });

  matches.forEach(m => {
    const userTeam = m.homeTeam === 'Your Starting XI' ? m.homeStats : m.awayStats;
    userTeam.playerStats.forEach(ps => {
      const entry = playerGoals.get(ps.playerId);
      if (entry) {
        entry.goals += ps.goals;
        entry.assists += ps.assists;
      }
    });

    // Track league opponent scorers from match events
    const oppTeamName = m.homeTeam === 'Your Starting XI' ? m.awayTeam : m.homeTeam;
    m.events.forEach(e => {
      if (e.type === 'goal') {
        const isOppGoal = m.homeTeam === 'Your Starting XI' ? e.team === 'away' : e.team === 'home';
        if (isOppGoal && e.scorerName && e.scorerName !== oppTeamName) {
          const key = `opp-${e.scorerName}`;
          const existing = playerGoals.get(key) || { name: e.scorerName, goals: 0, assists: 0, team: oppTeamName };
          existing.goals += 1;
          playerGoals.set(key, existing);
        }
      }
    });
  });

  const sortedScorers = Array.from(playerGoals.values())
    .filter(p => p.goals > 0)
    .sort((a, b) => b.goals - a.goals);

  const sortedAssisters = Array.from(playerGoals.values())
    .filter(p => p.assists > 0)
    .sort((a, b) => b.assists - a.assists);

  const getTeamForm = (row: SeasonTableEntry) => {
    if (row.form && row.form.length > 0) {
      return row.form.slice(-5);
    }
    const teamMatches = matches
      .filter(m => m.homeTeam === row.team || m.awayTeam === row.team)
      .slice(-5);
    return teamMatches.map(m => {
      const isHome = m.homeTeam === row.team;
      const teamScore = isHome ? m.homeScore : m.awayScore;
      const oppScore = isHome ? m.awayScore : m.homeScore;
      if (teamScore > oppScore) return 'W';
      if (teamScore === oppScore) return 'D';
      return 'L';
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-gradient-to-b from-[#141d2c] via-[#0d1422] to-[#070b14] border-2 border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl font-sans select-none animate-in fade-in duration-200">
      {/* Header Tabs */}
      <div className="flex border-b border-slate-800 bg-[#090d14]/90 p-1.5 gap-1 text-xs font-mono">
        <button
          onClick={() => setTab('table')}
          className={`flex-1 py-2 sm:py-2.5 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
            tab === 'table'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-[0_0_14px_rgba(52,211,153,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            <span className="sm:hidden">TABLE</span>
            <span className="hidden sm:inline">LEAGUE STANDINGS</span>
          </span>
        </button>
        <button
          onClick={() => setTab('scorers')}
          className={`flex-1 py-2 sm:py-2.5 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
            tab === 'scorers'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-[0_0_14px_rgba(52,211,153,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">GOLDEN BOOT</span>
        </button>
        <button
          onClick={() => setTab('assists')}
          className={`flex-1 py-2 sm:py-2.5 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
            tab === 'assists'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-[0_0_14px_rgba(52,211,153,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">PLAYMAKER</span>
        </button>
      </div>

      <div className="p-3.5 overflow-x-auto font-mono">
        {tab === 'table' && (
          <div>
            <table className="w-full min-w-[340px] text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-400 font-black uppercase tracking-wider">
                  <th className="py-2 px-1 text-center">#</th>
                  <th className="py-2 px-2">CLUB</th>
                  <th className="py-2 px-1 text-center">P</th>
                  <th className="py-2 px-1 text-center">W</th>
                  <th className="py-2 px-1 text-center">D</th>
                  <th className="py-2 px-1 text-center">L</th>
                  <th className="py-2 px-1 text-center">GD</th>
                  <th className="py-2 px-2 text-center font-black text-white">PTS</th>
                  <th className="py-2 px-2 text-center hidden sm:table-cell">FORM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {table.map((row, idx) => {
                  const isUser = row.team === 'Your Starting XI';
                  const form = getTeamForm(row);
                  const isUCL = idx < 4;
                  const isUEL = idx === 4;
                  const isRelegation = idx >= table.length - 3;

                  return (
                    <tr
                      key={row.team}
                      className={`transition-colors ${
                        isUser
                          ? 'bg-gradient-to-r from-emerald-950/70 via-[#102318] to-emerald-950/70 text-emerald-200 font-bold border-y-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.25)]'
                          : 'hover:bg-slate-850/60 text-slate-300'
                      }`}
                    >
                      <td className="py-2.5 px-1 text-center">
                        <span
                          className={`inline-block w-5 h-5 leading-5 rounded-md text-[10px] font-black text-center ${
                            idx === 0
                              ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-[0_0_8px_#fbbf24]'
                              : isUCL
                              ? 'bg-emerald-900/90 text-emerald-300 border border-emerald-500/50'
                              : isUEL
                              ? 'bg-indigo-900/90 text-indigo-200 border border-indigo-500/50'
                              : isRelegation
                              ? 'bg-rose-950 text-rose-300 border border-rose-800/70'
                              : 'text-slate-400'
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 font-bold truncate max-w-[120px] sm:max-w-[220px] text-white">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-1 h-3.5 rounded-full ${
                              isUCL
                                ? 'bg-emerald-400 shadow-[0_0_4px_#34d399]'
                                : isUEL
                                ? 'bg-cyan-400 shadow-[0_0_4px_#38bdf8]'
                                : isRelegation
                                ? 'bg-rose-500'
                                : 'bg-transparent'
                            }`}
                          />
                          <span className={`truncate font-sans ${isUser ? 'text-emerald-300 font-black' : 'text-white'}`}>
                            {row.team}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-1 text-center text-slate-400">{row.played}</td>
                      <td className="py-2.5 px-1 text-center text-emerald-400 font-bold">{row.won}</td>
                      <td className="py-2.5 px-1 text-center text-amber-400">{row.drawn}</td>
                      <td className="py-2.5 px-1 text-center text-rose-400">{row.lost}</td>
                      <td className="py-2.5 px-1 text-center">
                        <span
                          className={
                            row.gd > 0
                              ? 'text-emerald-400 font-bold'
                              : row.gd < 0
                              ? 'text-rose-400'
                              : 'text-slate-400'
                          }
                        >
                          {row.gd > 0 ? `+${row.gd}` : row.gd}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center font-black text-white text-sm">
                        {row.points}
                      </td>
                      <td className="py-2.5 px-2 text-center hidden sm:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          {form.length === 0 ? (
                            <span className="text-[10px] text-slate-600">-</span>
                          ) : (
                            form.map((res, fIdx) => (
                              <span
                                key={fIdx}
                                className={`w-3.5 h-3.5 rounded text-[8px] font-black flex items-center justify-center ${
                                  res === 'W'
                                    ? 'bg-emerald-500 text-slate-950 font-black'
                                    : res === 'D'
                                    ? 'bg-amber-400 text-slate-950 font-black'
                                    : 'bg-rose-600 text-white'
                                }`}
                              >
                                {res}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Qualification Legend */}
            <div className="flex flex-wrap items-center gap-3 mt-3.5 pt-3 border-t border-slate-800 text-[10px] text-slate-300 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]" />
                <span>UEFA Champions League (1-4)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_4px_#38bdf8]" />
                <span>Europa League (5)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Relegation Zone (Bottom 3)</span>
              </div>
            </div>
          </div>
        )}

        {tab === 'scorers' && (
          <div className="space-y-2">
            {sortedScorers.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 italic font-sans">
                No goals scored yet in this campaign.
              </div>
            ) : (
              sortedScorers.map((s, idx) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between p-3.5 bg-[#121824] border border-slate-800 rounded-2xl shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center shadow-xs ${
                        idx === 0
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-[0_0_10px_#fbbf24]'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-950'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-black text-white text-sm font-sans">{s.name}</span>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="font-black text-emerald-400 text-lg drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]">
                      {s.goals}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-black">GOALS</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'assists' && (
          <div className="space-y-2">
            {sortedAssisters.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 italic font-sans">
                No assists recorded yet in this campaign.
              </div>
            ) : (
              sortedAssisters.map((s, idx) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between p-3.5 bg-[#121824] border border-slate-800 rounded-2xl shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center shadow-xs ${
                        idx === 0
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-slate-950 shadow-[0_0_10px_#38bdf8]'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-950'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-black text-white text-sm font-sans">{s.name}</span>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="font-black text-cyan-400 text-lg drop-shadow-[0_0_6px_rgba(56,189,248,0.4)]">
                      {s.assists}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-black">ASSISTS</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
