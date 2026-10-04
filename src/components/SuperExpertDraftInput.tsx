import React, { useState, useRef, useEffect } from 'react';
import { Player, SquadData } from '../types/football';
import { getShortDisplayName } from '../utils/nameUtils';
import { soundEngine } from '../utils/soundEngine';
import {
  Flame,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Shield,
  KeyRound,
  X,
  Send,
  Zap,
} from 'lucide-react';

interface SuperExpertDraftInputProps {
  squad: SquadData;
  draftedIdsSet: Set<string>;
  activeSquad: (Player | null)[];
  onSelectPlayer: (player: Player) => void;
  playerToAssign: Player | null;
  scoutTokens: number;
  onUseScoutToken: () => void;
  onAwardScoutToken?: () => void;
  draftRound: number;
  onReroll: () => void;
  freeRerollAvailable: boolean;
  isSpinning: boolean;
  hasEmptyGkSlot: boolean;
  hasEmptyOutfieldSlot: boolean;
  hasEmptyBench: boolean;
}

// Clean diacritics and accents for robust football name matching
function cleanString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

// Comprehensive football aliases and common nicknames
const COMMON_ALIASES: Record<string, string[]> = {
  kaka: ['kaka', 'ricardo kaka', 'kaka'],
  cr7: ['cristiano ronaldo'],
  r9: ['ronaldo', 'ronaldo nazario'],
  ronaldo: ['cristiano ronaldo', 'ronaldo'],
  messi: ['lionel messi', 'leo messi'],
  kdb: ['kevin de bruyne'],
  vini: ['vinicius junior', 'vinicius jr'],
  ibra: ['zlatan ibrahimovic'],
  lewa: ['robert lewandowski'],
  chicharito: ['javier hernandez'],
  kun: ['sergio aguero'],
  aguero: ['sergio aguero'],
  bale: ['gareth bale'],
  benzema: ['karim benzema'],
  suarez: ['luis suarez'],
  modric: ['luka modric'],
  kroos: ['toni kroos'],
  ramos: ['sergio ramos'],
  neuer: ['manuel neuer'],
  buffon: ['gianluigi buffon'],
  casillas: ['iker casillas'],
  busquets: ['sergio busquets'],
  iniesta: ['andres iniesta'],
  xavi: ['xavi', 'xavi hernandez'],
  pique: ['gerard pique'],
  puyol: ['carles puyol'],
  alves: ['dani alves'],
  marcelo: ['marcelo'],
  casemiro: ['casemiro'],
  zidane: ['zinedine zidane'],
  henry: ['thierry henry'],
  bergkamp: ['dennis bergkamp'],
  vieira: ['patrick vieira'],
  pirlo: ['andrea pirlo'],
  maldini: ['paolo maldini'],
  nesta: ['alessandro nesta'],
  gattuso: ['gennaro gattuso'],
  seedorf: ['clarence seedorf'],
  shevchenko: ['andriy shevchenko'],
  inzaghi: ['filippo inzaghi'],
  rooney: ['wayne rooney'],
  scholes: ['paul scholes'],
  giggs: ['ryan giggs'],
  beckham: ['david beckham'],
  ferdinand: ['rio ferdinand'],
  vidic: ['nemanja vidic'],
  lampard: ['frank lampard'],
  terry: ['john terry'],
  drogba: ['didier drogba'],
  cech: ['petr cech'],
  gerrard: ['steven gerrard'],
  torres: ['fernando torres'],
  carragher: ['jamie carragher'],
  alonso: ['xabi alonso'],
  mascherano: ['javier mascherano'],
  hazard: ['eden hazard'],
  kante: ['n golo kante', 'ngolo kante'],
  mane: ['sadio mane'],
  salah: ['mohamed salah'],
  firmino: ['roberto firmino'],
  alisson: ['alisson becker', 'alisson'],
  son: ['heung min son', 'son heung min'],
  kane: ['harry kane'],
  bellingham: ['jude bellingham'],
  foden: ['phil foden'],
  saka: ['bukayo saka'],
  rodri: ['rodri', 'rodrigo'],
  haaland: ['erling haaland'],
  mbappe: ['kylian mbappe'],
  griezmann: ['antoine griezmann'],
  courtois: ['thibaut courtois'],
  walker: ['kyle walker'],
  stones: ['john stones'],
  rodrygo: ['rodrygo'],
  valverde: ['federico valverde'],
  camavinga: ['eduardo camavinga'],
  tchouameni: ['aurelien tchouameni'],
  leao: ['rafael leao'],
  theo: ['theo hernandez'],
  lautaro: ['lautaro martinez'],
  barella: ['nicolo barella'],
  pedri: ['pedri'],
  gavi: ['gavi'],
  yamal: ['lamine yamal'],
};

export const SuperExpertDraftInput: React.FC<SuperExpertDraftInputProps> = ({
  squad,
  draftedIdsSet,
  activeSquad,
  onSelectPlayer,
  playerToAssign,
  scoutTokens,
  onUseScoutToken,
  onAwardScoutToken,
  draftRound,
  onReroll,
  freeRerollAvailable,
  isSpinning,
  hasEmptyGkSlot,
  hasEmptyOutfieldSlot,
  hasEmptyBench,
}) => {
  const [query, setQuery] = useState('');
  const [streak, setStreak] = useState(0);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'warning' | null;
    message: string;
    player?: Player;
  }>({ type: null, message: '' });
  const [activeIntelClue, setActiveIntelClue] = useState<string | null>(null);
  const [recalledNames, setRecalledNames] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input on mount or squad change
  useEffect(() => {
    inputRef.current?.focus();
    setFeedback({ type: null, message: '' });
    setActiveIntelClue(null);
  }, [squad.clubName, squad.year, draftRound]);

  // Match input string against squad players
  const handleRecallSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const raw = query.trim();
    if (!raw) return;

    const cleaned = cleanString(raw);

    // Find best match in squad players
    let matchedPlayer: Player | undefined;

    // 1. Direct clean match against player name
    matchedPlayer = squad.players.find(p => cleanString(p.name) === cleaned);

    // 2. Direct match against short display name
    if (!matchedPlayer) {
      matchedPlayer = squad.players.find(
        p => cleanString(getShortDisplayName(p.name)) === cleaned
      );
    }

    // 3. Match against last word / surname
    if (!matchedPlayer) {
      matchedPlayer = squad.players.find(p => {
        const parts = cleanString(p.name).split(' ');
        return parts[parts.length - 1] === cleaned;
      });
    }

    // 4. Match against known aliases
    if (!matchedPlayer && COMMON_ALIASES[cleaned]) {
      const aliasTargets = COMMON_ALIASES[cleaned];
      matchedPlayer = squad.players.find(p => {
        const pClean = cleanString(p.name);
        return aliasTargets.some(target => pClean.includes(target) || target.includes(pClean));
      });
    }

    // 5. Substring inclusion if query is 3+ characters
    if (!matchedPlayer && cleaned.length >= 3) {
      matchedPlayer = squad.players.find(p => {
        const pClean = cleanString(p.name);
        return pClean.includes(cleaned) || cleaned.includes(pClean);
      });
    }

    // Evaluation
    if (matchedPlayer) {
      // Check if already drafted into this active team
      const isAlreadyDrafted = activeSquad.some(
        p => p !== null && (p.id === matchedPlayer!.id || cleanString(p.name) === cleanString(matchedPlayer!.name))
      );

      if (isAlreadyDrafted) {
        soundEngine.playBuzzer();
        setFeedback({
          type: 'warning',
          message: `${matchedPlayer.name} is already deployed in your Starting XI or Dugout Bench!`,
          player: matchedPlayer,
        });
        return;
      }

      // Check slot compatibility
      const hasSlot = matchedPlayer.position === 'GK' ? hasEmptyGkSlot : hasEmptyOutfieldSlot;
      if (!hasSlot && !hasEmptyBench) {
        soundEngine.playBuzzer();
        setFeedback({
          type: 'warning',
          message: `No vacant ${matchedPlayer.position} or Bench slots remaining for ${matchedPlayer.name}.`,
          player: matchedPlayer,
        });
        return;
      }

      // Valid Match!
      soundEngine.playSuccessChime();
      setRecalledNames(prev => [...prev, matchedPlayer!.name]);
      setCorrectGuesses(c => c + 1);
      setTotalGuesses(t => t + 1);
      setStreak(prev => {
        const next = prev + 1;
        if (next >= 2 && onAwardScoutToken) {
          onAwardScoutToken();
        }
        return next;
      });

      setFeedback({
        type: 'success',
        message: `SCOUT TARGET CONFIRMED: ${matchedPlayer.name} (${matchedPlayer.specificPosition})! Select slot on the pitch or bench to assign.`,
        player: matchedPlayer,
      });

      // Clear input
      setQuery('');
      onSelectPlayer(matchedPlayer);
    } else {
      // No match in this squad
      soundEngine.playBuzzer();
      setStreak(0);
      setTotalGuesses(t => t + 1);
      setFeedback({
        type: 'error',
        message: `UNCONFIRMED: '${raw}' was not in the official ${squad.clubName} (${squad.year}) squad. Check spelling or recall another player!`,
      });
    }
  };

  // Request scout intel clue (costs 1 scout token)
  const handleRequestIntel = () => {
    if (scoutTokens <= 0) {
      soundEngine.playBuzzer();
      return;
    }

    // Find un-drafted players in this squad
    const uncalled = squad.players.filter(p => !draftedIdsSet.has(p.id) && !recalledNames.includes(p.name));
    if (uncalled.length === 0) return;

    onUseScoutToken();
    soundEngine.playClick();

    // Pick random uncalled player to give a clue about
    const target = uncalled[Math.floor(Math.random() * uncalled.length)];
    const parts = target.name.split(' ');
    const initials = parts.map(p => p[0].toUpperCase()).join('.');

    setActiveIntelClue(
      `ARCHIVE INTEL: ${target.specificPosition} (${target.position}) from ${target.country} • Initials: ${initials}.`
    );
  };

  const accuracy = totalGuesses > 0 ? Math.round((correctGuesses / totalGuesses) * 100) : 100;
  const iqTier =
    correctGuesses >= 6 && accuracy >= 80
      ? { title: 'ENCYCLOPEDIA', grade: 'S+', border: 'border-amber-400 text-amber-300' }
      : correctGuesses >= 3 && accuracy >= 65
      ? { title: 'MASTER SCOUT', grade: 'A', border: 'border-emerald-400 text-emerald-300' }
      : correctGuesses >= 1
      ? { title: 'PUNDIT', grade: 'B', border: 'border-cyan-400 text-cyan-300' }
      : { title: 'ROOKIE', grade: 'C', border: 'border-slate-600 text-slate-400' };

  return (
    <div className="space-y-3 font-mono">
      {/* Top Banner Bar */}
      <div className="p-4 bg-gradient-to-r from-[#210c14] via-[#16080e] to-[#210c14] border-2 border-rose-600/80 rounded-3xl shadow-[0_8px_30px_rgba(244,63,94,0.35)] relative overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-rose-950/80 pb-2.5 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 shadow-[0_0_10px_#f43f5e]" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-400 fill-current animate-pulse" />
              SUPER EXPERT COMMAND TERMINAL
            </span>
          </div>

          <div className="flex items-center gap-2">
            {streak > 0 && (
              <span className="text-[10px] text-amber-300 font-black px-2 py-0.5 rounded-lg bg-amber-950/90 border border-amber-500/70 shadow-[0_0_10px_rgba(245,158,11,0.4)] flex items-center gap-1 animate-pulse">
                <Flame className="w-3 h-3 text-amber-400 fill-current" />
                STREAK: {streak} {streak >= 2 ? '(+1 TOKEN!)' : ''}
              </span>
            )}
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg bg-slate-900 border ${iqTier.border} shadow-xs`}>
              IQ: {iqTier.grade} ({accuracy}%)
            </span>
            <span className="text-[10px] text-rose-300 font-black px-2.5 py-0.5 rounded-lg bg-rose-950/90 border border-rose-500/60 shadow-xs">
              ROUND {draftRound}/16
            </span>
          </div>
        </div>

        {/* Squad Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              TARGET OFFICIAL ARCHIVE
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight drop-shadow-md">
              {squad.clubName}
            </div>
            <div className="text-xs text-rose-300 font-bold mt-0.5">
              Season: {squad.year} · {squad.league} · {(squad.tier || 'elite').toUpperCase()} TIER
            </div>
          </div>

          {/* Reroll Button if manager is stuck */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onReroll}
              disabled={isSpinning || (!freeRerollAvailable && scoutTokens <= 0)}
              className={`px-3 py-2 rounded-xl text-xs font-black border flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                freeRerollAvailable
                  ? 'bg-amber-950/80 hover:bg-amber-900 border-amber-500/80 text-amber-200'
                  : scoutTokens > 0
                  ? 'bg-purple-950/80 hover:bg-purple-900 border-purple-500/80 text-purple-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-600 opacity-40 cursor-not-allowed'
              }`}
              title={freeRerollAvailable ? 'Use Free Tactical Reroll' : 'Use 1 Scout Token to Reroll'}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{freeRerollAvailable ? 'FREE REROLL' : `REROLL (${scoutTokens} TOKENS)`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Manual Recall Textbox Input Area */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#141a24] to-[#0c121b] border border-slate-700/80 shadow-xl space-y-3.5">
        <div>
          <div className="flex items-center justify-between mb-1.5 text-xs">
            <label htmlFor="player-recall-input" className="font-black text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              RECALL FOOTBALLER BY NAME:
            </label>
            <span className="text-[10px] text-slate-400">
              Cards and stats classified in Super Expert
            </span>
          </div>

          <form onSubmit={handleRecallSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                id="player-recall-input"
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={`Type a player from ${squad.clubName} ${squad.year} (e.g. surname or full name)...`}
                disabled={isSpinning}
                className="w-full pl-10 pr-9 py-3 bg-[#080d14] border-2 border-rose-500/60 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/20 text-white font-sans text-sm rounded-2xl outline-none placeholder:text-slate-600 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!query.trim() || isSpinning}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-rose-900/40 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shrink-0"
            >
              <span>SUBMIT</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Verification Result Feedback Alert */}
        {feedback.message && (
          <div
            className={`p-3 rounded-2xl border text-xs font-bold flex items-start gap-2.5 animate-in fade-in duration-200 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-[0_0_16px_rgba(52,211,153,0.3)]'
                : feedback.type === 'warning'
                ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-[0_0_16px_rgba(245,158,11,0.25)]'
                : 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-[0_0_16px_rgba(244,63,94,0.3)]'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : feedback.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div>{feedback.message}</div>
              {feedback.player && feedback.type === 'success' && (
                <div className="mt-1 text-[11px] text-emerald-400 flex items-center gap-2">
                  <span>Category: {feedback.player.position}</span>
                  <span>•</span>
                  <span>Position: {feedback.player.specificPosition}</span>
                  <span>•</span>
                  <span>{feedback.player.country}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scout Intel Clue Bar */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRequestIntel}
              disabled={scoutTokens <= 0}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                scoutTokens > 0
                  ? 'bg-amber-950/70 border-amber-500/70 text-amber-300 hover:bg-amber-900 active:scale-95 cursor-pointer'
                  : 'bg-slate-900 border-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>REQUEST INTEL CLUE ({scoutTokens} TOKENS LEFT)</span>
            </button>
          </div>

          {activeIntelClue && (
            <div className="text-xs text-amber-300 bg-amber-950/60 border border-amber-600/50 px-3 py-1.5 rounded-xl flex items-center gap-2 animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{activeIntelClue}</span>
            </div>
          )}
        </div>
      </div>

      {/* Classified Squad Roster Board */}
      <div className="p-4 rounded-3xl bg-[#090d14] border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800 text-xs">
          <div className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">
            CLASSIFIED MATCH SHEET ROSTER ({squad.players.length} PLAYERS)
          </div>
          <span className="text-[10px] text-slate-500">
            Type any player above to recall
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {squad.players.map((p, idx) => {
            const isDraftedIntoActive = activeSquad.some(a => a?.id === p.id);
            const isRecalled = recalledNames.includes(p.name);
            const isCurrentlySelected = playerToAssign?.id === p.id;

            return (
              <div
                key={p.id}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isCurrentlySelected
                    ? 'border-emerald-400 bg-emerald-950/80 shadow-[0_0_12px_rgba(52,211,153,0.4)] ring-2 ring-emerald-400'
                    : isDraftedIntoActive
                    ? 'border-slate-800 bg-[#0e141d] opacity-50'
                    : isRecalled
                    ? 'border-cyan-500/80 bg-cyan-950/40 text-cyan-200'
                    : 'border-slate-800/80 bg-[#101622]/60'
                }`}
              >
                <div className="text-[9px] font-black uppercase text-slate-400">
                  {p.specificPosition}
                </div>
                <div className="text-xs font-bold truncate mt-1">
                  {isCurrentlySelected ? (
                    <span className="text-emerald-300 font-black">{getShortDisplayName(p.name)}</span>
                  ) : isDraftedIntoActive ? (
                    <span className="text-slate-500 line-through">{getShortDisplayName(p.name)}</span>
                  ) : isRecalled ? (
                    <span className="text-cyan-300">{getShortDisplayName(p.name)}</span>
                  ) : (
                    <span className="text-slate-600 font-mono">? ? ?</span>
                  )}
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">
                  {isDraftedIntoActive ? 'DEPLOYED' : isCurrentlySelected ? 'ACTIVE' : `SLOT ${idx + 1}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
