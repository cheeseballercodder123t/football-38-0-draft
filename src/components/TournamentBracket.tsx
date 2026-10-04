import React from 'react';
import { MatchResult } from '../types/football';
import { Trophy, Shield, CheckCircle2, Play, AlertCircle, Sparkles, Award } from 'lucide-react';

export interface TournamentStage {
  name: string;
  opponentName: string;
  isTwoLegged: boolean;
  leg1?: MatchResult;
  leg2?: MatchResult;
  isComplete: boolean;
  userAdvanced: boolean;
}

interface TournamentBracketProps {
  stages: TournamentStage[];
  currentStageIndex: number;
  onPlayNextLeg: () => void;
  competitionName: string;
  isEliminated?: boolean;
  onRestart?: () => void;
  onGoHome?: () => void;
  onOpenAwards?: () => void;
}

export const TournamentBracket: React.FC<TournamentBracketProps> = ({
  stages,
  currentStageIndex,
  onPlayNextLeg,
  competitionName,
  isEliminated = false,
  onRestart,
  onGoHome,
  onOpenAwards,
}) => {
  const isTournamentWon =
    stages.length > 0 &&
    stages[stages.length - 1].isComplete &&
    stages[stages.length - 1].userAdvanced;

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 font-sans select-none animate-in fade-in duration-200">
      {/* Broadcast Knockout Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#141c2c] via-[#0e1624] to-[#141c2c] border-2 border-slate-700/80 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none holo-sheen opacity-15" />

        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-500/10 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.3)]">
              <Trophy className="w-5 h-5 drop-shadow" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-amber-400 font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                TOURNAMENT KNOCKOUT TREE
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight drop-shadow-sm">
                {competitionName}
              </h2>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-xl border font-mono font-black text-xs shadow-xs ${
              isEliminated
                ? 'bg-rose-950/80 border-rose-500/60 text-rose-300'
                : isTournamentWon
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                : 'bg-amber-950/80 border-amber-500/60 text-amber-300'
            }`}
          >
            {isEliminated
              ? 'CAMPAIGN CONCLUDED'
              : isTournamentWon
              ? 'CHAMPIONS'
              : `STAGE ${currentStageIndex + 1} OF ${stages.length}`}
          </span>
        </div>

        {/* Visual Stage Progression Track with Glowing Beacons */}
        <div className="flex items-center justify-between gap-1.5 pt-1 font-mono text-[10px] relative z-10">
          {stages.map((stg, i) => {
            const isStageEliminated = isEliminated && i === currentStageIndex;
            const isDone =
              !isStageEliminated &&
              (i < currentStageIndex || (i === currentStageIndex && stg.isComplete && stg.userAdvanced));
            const isCurrent = i === currentStageIndex && !stg.isComplete && !isEliminated;

            return (
              <div key={stg.name} className="flex-1 flex flex-col items-center">
                <div className="w-full flex items-center">
                  <div
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      isStageEliminated
                        ? 'bg-gradient-to-r from-rose-600 to-red-500 shadow-[0_0_10px_#f43f5e]'
                        : isDone
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_#34d399]'
                        : isCurrent
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-400 shadow-[0_0_10px_#f59e0b] animate-pulse'
                        : 'bg-slate-800'
                    }`}
                  />
                </div>
                <span
                  className={`mt-2 font-bold uppercase truncate max-w-[70px] text-center ${
                    isStageEliminated
                      ? 'text-rose-400 font-black'
                      : isDone
                      ? 'text-emerald-400 font-black'
                      : isCurrent
                      ? 'text-amber-300 font-black'
                      : 'text-slate-500'
                  }`}
                >
                  {stg.name.replace('Quarter-Final', 'QF').replace('Semi-Final', 'SF')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tournament Champion Celebration Banner */}
      {isTournamentWon && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/80 via-[#1b1406] to-amber-950/80 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.35)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-400/40 shrink-0">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-mono font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                CHAMPIONS OF THE TOURNAMENT!
              </div>
              <h3 className="text-lg font-black text-white">{competitionName} WINNERS</h3>
              <p className="text-xs text-amber-200/80 font-sans">
                You navigated every knockout round and lifted the prestigious trophy!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 font-mono">
            {onOpenAwards && (
              <button
                onClick={onOpenAwards}
                className="flex-1 sm:flex-none py-2.5 px-4 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>AWARDS GALA</span>
              </button>
            )}
            {onRestart && (
              <button
                onClick={onRestart}
                className="flex-1 sm:flex-none py-2.5 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95"
              >
                NEW DRAFT
              </button>
            )}
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="flex-1 sm:flex-none py-2.5 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95"
              >
                HOME
              </button>
            )}
          </div>
        </div>
      )}

      {/* Campaign Eliminated Banner */}
      {isEliminated && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/80 via-[#200a12] to-rose-950/80 border-2 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.35)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black shadow-lg shadow-rose-600/40 shrink-0">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-mono font-black text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                CAMPAIGN CONCLUDED: KNOCKED OUT
              </div>
              <h3 className="text-lg font-black text-white">ELIMINATED FROM {competitionName.toUpperCase()}</h3>
              <p className="text-xs text-rose-200/80 font-sans">
                Your knockout campaign has ended. Start a fresh draft or return to the main menu.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 font-mono">
            {onRestart && (
              <button
                onClick={onRestart}
                className="flex-1 sm:flex-none py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>NEW DRAFT</span>
              </button>
            )}
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="flex-1 sm:flex-none py-2.5 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95"
              >
                HOME
              </button>
            )}
          </div>
        </div>
      )}

      {/* Knockout Stage Matchup Cards */}
      <div className="space-y-3 font-mono">
        {stages.map((stage, idx) => {
          const isCurrent = idx === currentStageIndex;
          const isPast = idx < currentStageIndex;
          const isStageEliminated = isCurrent && isEliminated;

          const leg1Score = stage.leg1
            ? `${stage.leg1.homeScore} - ${stage.leg1.awayScore}`
            : null;
          const leg2Score = stage.leg2
            ? `${stage.leg2.homeScore} - ${stage.leg2.awayScore}`
            : null;

          // Calculate aggregate if two legs played
          let aggText = '';
          if (stage.leg1 && stage.leg2) {
            const userTotal = stage.leg1.homeScore + stage.leg2.awayScore;
            const oppTotal = stage.leg1.awayScore + stage.leg2.homeScore;
            aggText = `AGGREGATE: ${userTotal} - ${oppTotal}`;
          }

          return (
            <div
              key={stage.name}
              className={`relative overflow-hidden p-4 sm:p-5 rounded-3xl border-2 transition-all duration-200 ${
                isStageEliminated
                  ? 'border-rose-500 bg-gradient-to-b from-[#220c13] via-[#14080e] to-[#0a0407] shadow-[0_8px_32px_rgba(244,63,94,0.3)] ring-2 ring-rose-500/40'
                  : isCurrent
                  ? 'border-emerald-400 bg-gradient-to-b from-[#14202d] via-[#0d1622] to-[#080d16] shadow-[0_8px_32px_rgba(52,211,153,0.3)] ring-2 ring-emerald-400/40'
                  : isPast
                  ? 'border-slate-800 bg-[#0d121a] opacity-85'
                  : 'border-slate-800/60 bg-[#080c12] opacity-50'
              }`}
            >
              {isCurrent && (
                <div
                  className={`absolute top-0 inset-x-0 h-[1.5px] pointer-events-none ${
                    isStageEliminated
                      ? 'bg-gradient-to-r from-transparent via-rose-500/80 to-transparent'
                      : 'bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent'
                  }`}
                />
              )}

              {/* Stage Top Bar */}
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-black text-white uppercase text-sm tracking-wide">
                    {stage.name}
                  </span>
                  {stage.isTwoLegged && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#16202c] text-slate-300 border border-slate-700 font-bold">
                      2 LEGS
                    </span>
                  )}
                </div>

                <div>
                  {stage.isComplete ? (
                    stage.userAdvanced ? (
                      <span className="px-3 py-1 rounded-xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-300 font-black text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(52,211,153,0.35)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ADVANCED
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-xl bg-rose-950/90 border border-rose-500/80 text-rose-300 font-black text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(244,63,94,0.35)]">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                        ELIMINATED
                      </span>
                    )
                  ) : isCurrent ? (
                    <span className="px-3 py-1 rounded-xl bg-amber-950/90 border border-amber-500/80 text-amber-300 font-black text-xs animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.35)]">
                      ACTIVE TIE
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-bold">
                      {isEliminated ? 'LOCKED - ELIMINATED' : 'UPCOMING TIE'}
                    </span>
                  )}
                </div>
              </div>

              {/* TV Broadcast Scorebug Matchup */}
              <div className="p-3 sm:p-4 bg-[#0a0f18] border border-slate-800 rounded-2xl flex flex-col gap-2.5 shadow-inner">
                <div className="flex items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm">
                  {/* User Team */}
                  <div className="flex-1 flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-950/90 border border-emerald-500/60 flex items-center justify-center shrink-0 shadow-sm">
                      <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                    </div>
                    <span className="font-black text-emerald-400 truncate font-sans">
                      <span className="hidden sm:inline">Your </span>Starting XI
                    </span>
                  </div>

                  {/* Score Display Center */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0 px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-[#141b28] border border-slate-700/80 rounded-xl shadow-md">
                    {stage.leg1 ? (
                      <div className="text-center font-mono">
                        <div className="text-xs sm:text-sm font-black text-white">{leg1Score}</div>
                        {stage.isTwoLegged && (
                          <div className="text-[8px] sm:text-[9px] text-slate-400 uppercase font-black">
                            LEG 1
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 font-black text-xs px-1 sm:px-2">VS</span>
                    )}

                    {stage.leg2 && (
                      <div className="text-center font-mono pl-2 sm:pl-3 border-l border-slate-700">
                        <div className="text-xs sm:text-sm font-black text-white">{leg2Score}</div>
                        <div className="text-[8px] sm:text-[9px] text-slate-400 uppercase font-black">
                          LEG 2
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Opponent Team */}
                  <div className="flex-1 flex items-center justify-end gap-1.5 sm:gap-2.5 min-w-0 text-right">
                    <span className="font-black text-white truncate font-sans">
                      {stage.opponentName}
                    </span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#141b28] border border-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                      <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Aggregate Summary if Available */}
                {aggText && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center text-[11px] font-black text-indigo-300 tracking-wider">
                    {aggText}
                  </div>
                )}
              </div>

              {/* Action Area: Elimination Notice or Simulation Button */}
              {isStageEliminated ? (
                <div className="mt-4 p-4 rounded-2xl bg-rose-950/70 border border-rose-500/60 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    <div>
                      <div className="text-xs font-black text-rose-300 uppercase tracking-wide">
                        CAMPAIGN CONCLUDED: KNOCKED OUT
                      </div>
                      <div className="text-[11px] text-slate-300 font-sans">
                        Defeated in the {stage.name} by {stage.opponentName}. Tournament journey has ended.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 font-mono">
                    {onRestart && (
                      <button
                        onClick={onRestart}
                        className="flex-1 sm:flex-none py-2 px-3.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <span>RESTART</span>
                      </button>
                    )}
                    {onGoHome && (
                      <button
                        onClick={onGoHome}
                        className="flex-1 sm:flex-none py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <span>MAIN MENU</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                isCurrent &&
                !stage.isComplete && (
                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-300 font-sans">
                      {!stage.leg1
                        ? 'First leg ready for broadcast simulation.'
                        : stage.isTwoLegged && !stage.leg2
                        ? 'Decisive second leg ready to determine qualification.'
                        : 'Stage ready for completion.'}
                    </span>

                    <button
                      onClick={onPlayNextLeg}
                      className="w-full sm:w-auto py-2.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950/70 transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>
                        {!stage.leg1
                          ? 'SIMULATE LEG 1'
                          : stage.isTwoLegged && !stage.leg2
                          ? 'SIMULATE DECISIVE LEG 2'
                          : 'FINALIZE TIE'}
                      </span>
                    </button>
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
