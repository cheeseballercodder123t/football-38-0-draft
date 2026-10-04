import React from 'react';
import { DynastyState } from '../types/football';
import { SeasonTransitionReport } from '../engine/dynastyEngine';
import {
  Trophy,
  Coins,
  TrendingUp,
  Award,
  Crown,
  Calendar,
  Sparkles,
  ArrowRight,
  Shield,
  Building2,
  DollarSign,
  UserCheck,
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface SeasonTransitionModalProps {
  report: SeasonTransitionReport;
  dynastyState: DynastyState;
  onClose: () => void;
}

export const SeasonTransitionModal: React.FC<SeasonTransitionModalProps> = ({
  report,
  dynastyState,
  onClose,
}) => {
  const previousSeason = report.newSeason - 1;

  const totalEarned =
    report.prizeMoneyEarned +
    report.stadiumRevenueEarned +
    report.sponsorRevenueEarned +
    report.boardBonusesEarned;
  const netSurplus = totalEarned - report.staffSalariesPaid;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md font-sans select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-gradient-to-b from-[#141e2e] via-[#0d1522] to-[#070b12] border-2 border-emerald-500/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-[0_0_60px_rgba(52,211,153,0.35)] animate-in zoom-in-95 duration-200">
        {/* Top Divine Shimmer Line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 via-teal-300 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="text-center space-y-1 relative z-10 border-b border-slate-800 pb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 text-xs font-mono font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            DYNASTY BOARDROOM GALA REPORT
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Season {previousSeason} Concluded &mdash; Embarking on Season {report.newSeason}
          </h2>
          <p className="text-xs text-slate-300 font-sans">
            Review your franchise financial audit, squad attribute development, retirements, and war chest allocation.
          </p>
        </div>

        {/* 1. Financial Ledger Breakdown Card */}
        <div className="p-4 rounded-2xl bg-[#090f18] border border-slate-800 space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 uppercase text-[10px] font-black tracking-wider pb-1.5 border-b border-slate-800">
            <span className="flex items-center gap-1 text-emerald-400">
              <DollarSign className="w-3.5 h-3.5" />
              ANNUAL FINANCIAL AUDIT
            </span>
            <span className="text-emerald-300 font-bold">
              NET CASH FLOW: {netSurplus >= 0 ? `+$${netSurplus}M` : `-$${Math.abs(netSurplus)}M`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#121926] border border-slate-800">
              <span className="text-slate-400">Prize Money:</span>
              <span className="text-emerald-400 font-black">+${report.prizeMoneyEarned}M</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#121926] border border-slate-800">
              <span className="text-slate-400">Stadium Gate:</span>
              <span className="text-emerald-400 font-black">+${report.stadiumRevenueEarned}M</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#121926] border border-slate-800">
              <span className="text-slate-400">Sponsorship:</span>
              <span className="text-emerald-400 font-black">+${report.sponsorRevenueEarned}M</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#121926] border border-slate-800">
              <span className="text-slate-400">Board Bonus:</span>
              <span className="text-emerald-400 font-black">+${report.boardBonusesEarned}M</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141224] border border-purple-500/40 text-[11px]">
            <span className="text-purple-300 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              Backroom Staff Payroll:
            </span>
            <span className="text-rose-400 font-black">-${report.staffSalariesPaid}M</span>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-slate-300 font-bold">UPDATED WAR CHEST FOR SEASON {report.newSeason}:</span>
            <span className="text-emerald-300 font-black text-sm bg-emerald-950 px-2.5 py-0.5 rounded-lg border border-emerald-500/70">
              ${report.newBudget}M
            </span>
          </div>
        </div>

        {/* 2. Squad Attribute Progression Bulletin */}
        <div className="space-y-2 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              SQUAD ATTRIBUTE DEVELOPMENT BULLETIN ({report.progressedPlayers.length})
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">
              Facility Level {dynastyState.facilities.trainingGround}
            </span>
          </div>

          {report.progressedPlayers.length === 0 ? (
            <div className="p-3 rounded-2xl bg-[#090f18] border border-slate-800 text-slate-500 text-xs italic text-center">
              No significant rating changes this off-season.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
              {report.progressedPlayers.map(({ player, deltaOvr }) => (
                <div
                  key={player.id}
                  className={`p-2.5 rounded-2xl border flex items-center justify-between text-xs ${
                    deltaOvr > 0
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-black text-white truncate text-[11px]">{player.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {player.specificPosition} · {player.age}yo · Now {player.overall} OVR
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md font-black text-[10px] shrink-0 ${
                      deltaOvr > 0
                        ? 'bg-emerald-500 text-slate-950 shadow-xs'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {deltaOvr > 0 ? `+${deltaOvr} OVR` : `${deltaOvr} OVR`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Retirements & Hall of Fame Legends */}
        {(report.retiredPlayers.length > 0 || report.newLegends.length > 0) && (
          <div className="space-y-2 font-mono">
            <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              RETIREMENTS & CLUB HALL OF FAME
            </span>

            <div className="space-y-1.5">
              {report.retiredPlayers.map(p => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-2xl bg-[#0d1420] border border-amber-500/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-black text-white">{p.name} (Retired)</div>
                    <div className="text-[10px] text-slate-400">
                      {p.specificPosition} · Peak {p.overall} OVR · Hangs up boots at age {p.age}
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-amber-300 px-2 py-0.5 rounded bg-amber-950 border border-amber-500">
                    HONOURED
                  </span>
                </div>
              ))}

              {report.newLegends.map(l => (
                <div
                  key={l.id}
                  className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/80 to-[#1e1406] border-2 border-amber-400 flex items-center justify-between text-xs shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-black text-amber-200">{l.name} &mdash; {l.legacyStatus}</div>
                      <div className="text-[10px] text-amber-300/80 font-sans">
                        Inducted into the Club Hall of Fame with {l.trophiesWon} trophies won.
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Expiring Contracts Alert */}
        {report.expiringContracts && report.expiringContracts.length > 0 && (
          <div className="space-y-2 font-mono">
            <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              CONTRACT EXPIRY RISK ALERT ({report.expiringContracts.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1">
              {report.expiringContracts.map(p => (
                <div
                  key={p.id}
                  className="p-2 rounded-xl bg-rose-950/30 border border-rose-500/50 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-white text-[11px] truncate">{p.name}</div>
                    <div className="text-[10px] text-rose-300">
                      {p.specificPosition} · {p.overall} OVR
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-rose-900 text-rose-200 border border-rose-600">
                    &le; 1 YR LEFT
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Action Button: Embark on Next Season */}
        <div className="pt-2">
          <button
            onClick={() => {
              soundEngine.playSuccessChime();
              onClose();
            }}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider font-mono rounded-2xl shadow-xl shadow-emerald-950/80 transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>EMBARK ON SEASON {report.newSeason} WITH YOUR SQUAD</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
