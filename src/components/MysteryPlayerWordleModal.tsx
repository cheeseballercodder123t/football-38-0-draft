import React, { useState, useMemo } from 'react';
import { MysteryPlayerClue, MysteryGuessResult, PlayerPosition } from '../types/football';
import { SQUADS } from '../data/squads';
import { soundEngine } from '../utils/soundEngine';
import {
  HelpCircle,
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  Coins,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  X,
  Search,
  Flame,
} from 'lucide-react';

interface MysteryPlayerWordleModalProps {
  onAwardTokens: (tokens: number) => void;
  onClose: () => void;
}

export const MYSTERY_POOL: MysteryPlayerClue[] = [
  // Global Icons & Ballons d'Or
  { name: 'Lionel Messi', club: 'Inter Miami', league: 'MLS', nation: 'Argentina', nationFlag: '🇦🇷', position: 'FWD', overall: 88, age: 37 },
  { name: 'Cristiano Ronaldo', club: 'Al Nassr', league: 'Saudi Pro League', nation: 'Portugal', nationFlag: '🇵🇹', position: 'FWD', overall: 86, age: 39 },
  { name: 'Neymar Jr', club: 'Al Hilal', league: 'Saudi Pro League', nation: 'Brazil', nationFlag: '🇧🇷', position: 'FWD', overall: 87, age: 32 },
  { name: 'Robert Lewandowski', club: 'Barcelona', league: 'La Liga', nation: 'Poland', nationFlag: '🇵🇱', position: 'FWD', overall: 88, age: 36 },
  { name: 'Karim Benzema', club: 'Al Ittihad', league: 'Saudi Pro League', nation: 'France', nationFlag: '🇫🇷', position: 'FWD', overall: 86, age: 36 },
  { name: 'Luka Modrić', club: 'Real Madrid', league: 'La Liga', nation: 'Croatia', nationFlag: '🇭🇷', position: 'MID', overall: 86, age: 39 },

  // Premier League Superstars
  { name: 'Erling Haaland', club: 'Man City', league: 'Premier League', nation: 'Norway', nationFlag: '🇳🇴', position: 'FWD', overall: 91, age: 24 },
  { name: 'Kevin De Bruyne', club: 'Man City', league: 'Premier League', nation: 'Belgium', nationFlag: '🇧🇪', position: 'MID', overall: 91, age: 33 },
  { name: 'Rodri', club: 'Man City', league: 'Premier League', nation: 'Spain', nationFlag: '🇪🇸', position: 'MID', overall: 91, age: 28 },
  { name: 'Phil Foden', club: 'Man City', league: 'Premier League', nation: 'England', nationFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', position: 'MID', overall: 88, age: 24 },
  { name: 'Bernardo Silva', club: 'Man City', league: 'Premier League', nation: 'Portugal', nationFlag: '🇵🇹', position: 'MID', overall: 88, age: 30 },
  { name: 'Rúben Dias', club: 'Man City', league: 'Premier League', nation: 'Portugal', nationFlag: '🇵🇹', position: 'DEF', overall: 88, age: 27 },
  { name: 'Ederson', club: 'Man City', league: 'Premier League', nation: 'Brazil', nationFlag: '🇧🇷', position: 'GK', overall: 88, age: 31 },
  { name: 'Joško Gvardiol', club: 'Man City', league: 'Premier League', nation: 'Croatia', nationFlag: '🇭🇷', position: 'DEF', overall: 83, age: 22 },
  { name: 'Kyle Walker', club: 'Man City', league: 'Premier League', nation: 'England', nationFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', position: 'DEF', overall: 84, age: 34 },

  { name: 'Mohamed Salah', club: 'Liverpool', league: 'Premier League', nation: 'Egypt', nationFlag: '🇪🇬', position: 'FWD', overall: 89, age: 32 },
  { name: 'Virgil van Dijk', club: 'Liverpool', league: 'Premier League', nation: 'Netherlands', nationFlag: '🇳🇱', position: 'DEF', overall: 89, age: 33 },
  { name: 'Alisson Becker', club: 'Liverpool', league: 'Premier League', nation: 'Brazil', nationFlag: '🇧🇷', position: 'GK', overall: 89, age: 32 },
  { name: 'Trent Alexander-Arnold', club: 'Liverpool', league: 'Premier League', nation: 'England', nationFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', position: 'DEF', overall: 86, age: 26 },
  { name: 'Alexis Mac Allister', club: 'Liverpool', league: 'Premier League', nation: 'Argentina', nationFlag: '🇦🇷', position: 'MID', overall: 86, age: 25 },
  { name: 'Luis Díaz', club: 'Liverpool', league: 'Premier League', nation: 'Colombia', nationFlag: '🇨🇴', position: 'FWD', overall: 84, age: 27 },

  { name: 'Bukayo Saka', club: 'Arsenal', league: 'Premier League', nation: 'England', nationFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', position: 'FWD', overall: 87, age: 23 },
  { name: 'Martin Ødegaard', club: 'Arsenal', league: 'Premier League', nation: 'Norway', nationFlag: '🇳🇴', position: 'MID', overall: 89, age: 25 },
  { name: 'Declan Rice', club: 'Arsenal', league: 'Premier League', nation: 'England', nationFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', position: 'MID', overall: 87, age: 25 },
  { name: 'William Saliba', club: 'Arsenal', league: 'Premier League', nation: 'France', nationFlag: '🇫🇷', position: 'DEF', overall: 87, age: 23 },
  { name: 'Gabriel Magalhães', club: 'Arsenal', league: 'Premier League', nation: 'Brazil', nationFlag: '🇧🇷', position: 'DEF', overall: 86, age: 26 },
  { name: 'David Raya', club: 'Arsenal', league: 'Premier League', nation: 'Spain', nationFlag: '🇪🇸', position: 'GK', overall: 84, age: 29 },

  { name: 'Cole Palmer', club: 'Chelsea', league: 'Premier League', nation: 'England', nationFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', position: 'MID', overall: 85, age: 22 },
  { name: 'Bruno Fernandes', club: 'Man United', league: 'Premier League', nation: 'Portugal', nationFlag: '🇵🇹', position: 'MID', overall: 87, age: 30 },
  { name: 'Son Heung-min', club: 'Tottenham', league: 'Premier League', nation: 'South Korea', nationFlag: '🇰🇷', position: 'FWD', overall: 87, age: 32 },
  { name: 'Cristian Romero', club: 'Tottenham', league: 'Premier League', nation: 'Argentina', nationFlag: '🇦🇷', position: 'DEF', overall: 84, age: 26 },
  { name: 'Alexander Isak', club: 'Newcastle', league: 'Premier League', nation: 'Sweden', nationFlag: '🇸🇪', position: 'FWD', overall: 85, age: 25 },
  { name: 'Bruno Guimarães', club: 'Newcastle', league: 'Premier League', nation: 'Brazil', nationFlag: '🇧🇷', position: 'MID', overall: 85, age: 26 },
  { name: 'Ollie Watkins', club: 'Aston Villa', league: 'Premier League', nation: 'England', nationFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', position: 'FWD', overall: 85, age: 28 },

  // La Liga Titans
  { name: 'Kylian Mbappé', club: 'Real Madrid', league: 'La Liga', nation: 'France', nationFlag: '🇫🇷', position: 'FWD', overall: 91, age: 25 },
  { name: 'Jude Bellingham', club: 'Real Madrid', league: 'La Liga', nation: 'England', nationFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', position: 'MID', overall: 90, age: 21 },
  { name: 'Vinícius Júnior', club: 'Real Madrid', league: 'La Liga', nation: 'Brazil', nationFlag: '🇧🇷', position: 'FWD', overall: 90, age: 24 },
  { name: 'Thibaut Courtois', club: 'Real Madrid', league: 'La Liga', nation: 'Belgium', nationFlag: '🇧🇪', position: 'GK', overall: 89, age: 32 },
  { name: 'Federico Valverde', club: 'Real Madrid', league: 'La Liga', nation: 'Uruguay', nationFlag: '🇺🇾', position: 'MID', overall: 88, age: 26 },
  { name: 'Antonio Rüdiger', club: 'Real Madrid', league: 'La Liga', nation: 'Germany', nationFlag: '🇩🇪', position: 'DEF', overall: 88, age: 31 },
  { name: 'Rodrygo', club: 'Real Madrid', league: 'La Liga', nation: 'Brazil', nationFlag: '🇧🇷', position: 'FWD', overall: 86, age: 23 },
  { name: 'Dani Carvajal', club: 'Real Madrid', league: 'La Liga', nation: 'Spain', nationFlag: '🇪🇸', position: 'DEF', overall: 86, age: 32 },
  { name: 'Aurélien Tchouaméni', club: 'Real Madrid', league: 'La Liga', nation: 'France', nationFlag: '🇫🇷', position: 'MID', overall: 85, age: 24 },
  { name: 'Eduardo Camavinga', club: 'Real Madrid', league: 'La Liga', nation: 'France', nationFlag: '🇫🇷', position: 'MID', overall: 83, age: 21 },

  { name: 'Lamine Yamal', club: 'Barcelona', league: 'La Liga', nation: 'Spain', nationFlag: '🇪🇸', position: 'FWD', overall: 81, age: 17 },
  { name: 'Raphinha', club: 'Barcelona', league: 'La Liga', nation: 'Brazil', nationFlag: '🇧🇷', position: 'FWD', overall: 84, age: 27 },
  { name: 'Pedri', club: 'Barcelona', league: 'La Liga', nation: 'Spain', nationFlag: '🇪🇸', position: 'MID', overall: 86, age: 21 },
  { name: 'Frenkie de Jong', club: 'Barcelona', league: 'La Liga', nation: 'Netherlands', nationFlag: '🇳🇱', position: 'MID', overall: 87, age: 27 },
  { name: 'Gavi', club: 'Barcelona', league: 'La Liga', nation: 'Spain', nationFlag: '🇪🇸', position: 'MID', overall: 83, age: 20 },
  { name: 'Jules Koundé', club: 'Barcelona', league: 'La Liga', nation: 'France', nationFlag: '🇫🇷', position: 'DEF', overall: 85, age: 25 },
  { name: 'Ronald Araújo', club: 'Barcelona', league: 'La Liga', nation: 'Uruguay', nationFlag: '🇺🇾', position: 'DEF', overall: 85, age: 25 },
  { name: 'Marc-André ter Stegen', club: 'Barcelona', league: 'La Liga', nation: 'Germany', nationFlag: '🇩🇪', position: 'GK', overall: 89, age: 32 },
  { name: 'Dani Olmo', club: 'Barcelona', league: 'La Liga', nation: 'Spain', nationFlag: '🇪🇸', position: 'MID', overall: 84, age: 26 },

  { name: 'Antoine Griezmann', club: 'Atlético Madrid', league: 'La Liga', nation: 'France', nationFlag: '🇫🇷', position: 'FWD', overall: 88, age: 33 },
  { name: 'Jan Oblak', club: 'Atlético Madrid', league: 'La Liga', nation: 'Slovenia', nationFlag: '🇸🇮', position: 'GK', overall: 88, age: 31 },
  { name: 'Julián Álvarez', club: 'Atlético Madrid', league: 'La Liga', nation: 'Argentina', nationFlag: '🇦🇷', position: 'FWD', overall: 84, age: 24 },

  // Serie A Stars
  { name: 'Lautaro Martínez', club: 'Inter Milan', league: 'Serie A', nation: 'Argentina', nationFlag: '🇦🇷', position: 'FWD', overall: 89, age: 27 },
  { name: 'Nicolò Barella', club: 'Inter Milan', league: 'Serie A', nation: 'Italy', nationFlag: '🇮🇹', position: 'MID', overall: 87, age: 27 },
  { name: 'Alessandro Bastoni', club: 'Inter Milan', league: 'Serie A', nation: 'Italy', nationFlag: '🇮🇹', position: 'DEF', overall: 87, age: 25 },
  { name: 'Hakan Çalhanoğlu', club: 'Inter Milan', league: 'Serie A', nation: 'Turkey', nationFlag: '🇹🇷', position: 'MID', overall: 86, age: 30 },
  { name: 'Federico Dimarco', club: 'Inter Milan', league: 'Serie A', nation: 'Italy', nationFlag: '🇮🇹', position: 'DEF', overall: 84, age: 26 },
  { name: 'Marcus Thuram', club: 'Inter Milan', league: 'Serie A', nation: 'France', nationFlag: '🇫🇷', position: 'FWD', overall: 84, age: 27 },
  { name: 'Yann Sommer', club: 'Inter Milan', league: 'Serie A', nation: 'Switzerland', nationFlag: '🇨🇭', position: 'GK', overall: 87, age: 35 },

  { name: 'Rafael Leão', club: 'AC Milan', league: 'Serie A', nation: 'Portugal', nationFlag: '🇵🇹', position: 'FWD', overall: 86, age: 25 },
  { name: 'Theo Hernández', club: 'AC Milan', league: 'Serie A', nation: 'France', nationFlag: '🇫🇷', position: 'DEF', overall: 87, age: 27 },
  { name: 'Mike Maignan', club: 'AC Milan', league: 'Serie A', nation: 'France', nationFlag: '🇫🇷', position: 'GK', overall: 87, age: 29 },

  { name: 'Dušan Vlahović', club: 'Juventus', league: 'Serie A', nation: 'Serbia', nationFlag: '🇷🇸', position: 'FWD', overall: 84, age: 24 },
  { name: 'Bremer', club: 'Juventus', league: 'Serie A', nation: 'Brazil', nationFlag: '🇧🇷', position: 'DEF', overall: 86, age: 27 },
  { name: 'Teun Koopmeiners', club: 'Juventus', league: 'Serie A', nation: 'Netherlands', nationFlag: '🇳🇱', position: 'MID', overall: 83, age: 26 },

  { name: 'Victor Osimhen', club: 'Galatasaray', league: 'Süper Lig', nation: 'Nigeria', nationFlag: '🇳🇬', position: 'FWD', overall: 87, age: 25 },
  { name: 'Khvicha Kvaratskhelia', club: 'Napoli', league: 'Serie A', nation: 'Georgia', nationFlag: '🇬🇪', position: 'FWD', overall: 85, age: 23 },
  { name: 'Paulo Dybala', club: 'Roma', league: 'Serie A', nation: 'Argentina', nationFlag: '🇦🇷', position: 'FWD', overall: 87, age: 30 },
  { name: 'Ademola Lookman', club: 'Atalanta', league: 'Serie A', nation: 'Nigeria', nationFlag: '🇳🇬', position: 'FWD', overall: 82, age: 26 },

  // Bundesliga Powerhouses
  { name: 'Harry Kane', club: 'Bayern Munich', league: 'Bundesliga', nation: 'England', nationFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', position: 'FWD', overall: 90, age: 31 },
  { name: 'Jamal Musiala', club: 'Bayern Munich', league: 'Bundesliga', nation: 'Germany', nationFlag: '🇩🇪', position: 'MID', overall: 87, age: 21 },
  { name: 'Joshua Kimmich', club: 'Bayern Munich', league: 'Bundesliga', nation: 'Germany', nationFlag: '🇩🇪', position: 'MID', overall: 86, age: 29 },
  { name: 'Leroy Sané', club: 'Bayern Munich', league: 'Bundesliga', nation: 'Germany', nationFlag: '🇩🇪', position: 'FWD', overall: 85, age: 28 },
  { name: 'Alphonso Davies', club: 'Bayern Munich', league: 'Bundesliga', nation: 'Canada', nationFlag: '🇨🇦', position: 'DEF', overall: 82, age: 23 },
  { name: 'Manuel Neuer', club: 'Bayern Munich', league: 'Bundesliga', nation: 'Germany', nationFlag: '🇩🇪', position: 'GK', overall: 86, age: 38 },

  { name: 'Florian Wirtz', club: 'Bayer Leverkusen', league: 'Bundesliga', nation: 'Germany', nationFlag: '🇩🇪', position: 'MID', overall: 88, age: 21 },
  { name: 'Granit Xhaka', club: 'Bayer Leverkusen', league: 'Bundesliga', nation: 'Switzerland', nationFlag: '🇨🇭', position: 'MID', overall: 86, age: 32 },
  { name: 'Jonathan Tah', club: 'Bayer Leverkusen', league: 'Bundesliga', nation: 'Germany', nationFlag: '🇩🇪', position: 'DEF', overall: 86, age: 28 },
  { name: 'Jeremie Frimpong', club: 'Bayer Leverkusen', league: 'Bundesliga', nation: 'Netherlands', nationFlag: '🇳🇱', position: 'DEF', overall: 84, age: 23 },
  { name: 'Alejandro Grimaldo', club: 'Bayer Leverkusen', league: 'Bundesliga', nation: 'Spain', nationFlag: '🇪🇸', position: 'DEF', overall: 86, age: 29 },

  { name: 'Gregor Kobel', club: 'Borussia Dortmund', league: 'Bundesliga', nation: 'Switzerland', nationFlag: '🇨🇭', position: 'GK', overall: 88, age: 26 },
  { name: 'Serhou Guirassy', club: 'Borussia Dortmund', league: 'Bundesliga', nation: 'Guinea', nationFlag: '🇬🇳', position: 'FWD', overall: 84, age: 28 },
  { name: 'Nico Schlotterbeck', club: 'Borussia Dortmund', league: 'Bundesliga', nation: 'Germany', nationFlag: '🇩🇪', position: 'DEF', overall: 85, age: 24 },
  { name: 'Xavi Simons', club: 'RB Leipzig', league: 'Bundesliga', nation: 'Netherlands', nationFlag: '🇳🇱', position: 'MID', overall: 83, age: 21 },

  // Ligue 1 & European Phenoms
  { name: 'Gianluigi Donnarumma', club: 'PSG', league: 'Ligue 1', nation: 'Italy', nationFlag: '🇮🇹', position: 'GK', overall: 89, age: 25 },
  { name: 'Achraf Hakimi', club: 'PSG', league: 'Ligue 1', nation: 'Morocco', nationFlag: '🇲🇦', position: 'DEF', overall: 84, age: 25 },
  { name: 'Marquinhos', club: 'PSG', league: 'Ligue 1', nation: 'Brazil', nationFlag: '🇧🇷', position: 'DEF', overall: 87, age: 30 },
  { name: 'Ousmane Dembélé', club: 'PSG', league: 'Ligue 1', nation: 'France', nationFlag: '🇫🇷', position: 'FWD', overall: 86, age: 27 },
  { name: 'Vitinha', club: 'PSG', league: 'Ligue 1', nation: 'Portugal', nationFlag: '🇵🇹', position: 'MID', overall: 85, age: 24 },
  { name: 'Bradley Barcola', club: 'PSG', league: 'Ligue 1', nation: 'France', nationFlag: '🇫🇷', position: 'FWD', overall: 82, age: 22 },
  { name: 'Viktor Gyökeres', club: 'Sporting CP', league: 'Liga Portugal', nation: 'Sweden', nationFlag: '🇸🇪', position: 'FWD', overall: 84, age: 26 },
];

export function MysteryPlayerWordleModal({
  onAwardTokens,
  onClose,
}: MysteryPlayerWordleModalProps) {
  const [targetPlayer, setTargetPlayer] = useState<MysteryPlayerClue>(() => {
    return MYSTERY_POOL[Math.floor(Math.random() * MYSTERY_POOL.length)];
  });

  const [guesses, setGuesses] = useState<MysteryGuessResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [streak, setStreak] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('onetwo_wordle_streak') || '0', 10);
    } catch {
      return 0;
    }
  });

  const availableCandidates = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return MYSTERY_POOL.filter(
      p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !guesses.some(g => g.guessedName.toLowerCase() === p.name.toLowerCase())
    );
  }, [searchTerm, guesses]);

  const handleMakeGuess = (candidate: MysteryPlayerClue) => {
    if (isGameOver) return;
    soundEngine.playCardDraft();

    const isMatch = candidate.name === targetPlayer.name;

    const guessResult: MysteryGuessResult = {
      guessedName: candidate.name,
      nationMatch: candidate.nation === targetPlayer.nation ? 'exact' : 'wrong',
      nationText: `${candidate.nationFlag} ${candidate.nation}`,
      leagueMatch: candidate.league === targetPlayer.league ? 'exact' : 'wrong',
      leagueText: candidate.league,
      clubMatch: candidate.club === targetPlayer.club ? 'exact' : 'wrong',
      clubText: candidate.club,
      posMatch:
        candidate.position === targetPlayer.position
          ? 'exact'
          : (candidate.position === 'FWD' && targetPlayer.position === 'MID') ||
            (candidate.position === 'MID' && targetPlayer.position === 'FWD')
          ? 'close'
          : 'wrong',
      posText: candidate.position,
      ovrMatch:
        candidate.overall === targetPlayer.overall
          ? 'exact'
          : candidate.overall < targetPlayer.overall
          ? 'higher'
          : 'lower',
      ovrText: candidate.overall,
      ageMatch:
        candidate.age === targetPlayer.age
          ? 'exact'
          : candidate.age < targetPlayer.age
          ? 'higher'
          : 'lower',
      ageText: candidate.age,
    };

    const newGuesses = [guessResult, ...guesses];
    setGuesses(newGuesses);
    setSearchTerm('');

    if (isMatch) {
      setIsWon(true);
      setIsGameOver(true);
      soundEngine.playBullseye();
      const newStreak = streak + 1;
      setStreak(newStreak);
      try {
        localStorage.setItem('onetwo_wordle_streak', String(newStreak));
      } catch {}
      onAwardTokens(3);
    } else if (newGuesses.length >= 6) {
      setIsGameOver(true);
      soundEngine.playRedCard();
      setStreak(0);
      try {
        localStorage.setItem('onetwo_wordle_streak', '0');
      } catch {}
    }
  };

  const handleResetGame = () => {
    soundEngine.playClick();
    setTargetPlayer(MYSTERY_POOL[Math.floor(Math.random() * MYSTERY_POOL.length)]);
    setGuesses([]);
    setIsGameOver(false);
    setIsWon(false);
    setSearchTerm('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-emerald-500/40 p-5 sm:p-6 shadow-2xl text-white">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  "Who Are Ya?" <span className="text-emerald-400">Wordle</span>
                </h3>
                {streak > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 text-[10px]">
                    🔥 Streak: {streak}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400">
                One Two Inspired Daily Mystery Footballer · 6 Guesses
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar (Disabled when game over) */}
        {!isGameOver ? (
          <div className="relative mb-4">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Type footballer name (e.g. Haaland, Bellingham, Salah)..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Candidate Dropdown */}
            {availableCandidates.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-20 divide-y divide-slate-800">
                {availableCandidates.map(c => (
                  <button
                    key={c.name}
                    onClick={() => handleMakeGuess(c)}
                    className="w-full px-4 py-2.5 text-left text-xs text-slate-200 hover:bg-slate-800 hover:text-emerald-300 flex items-center justify-between transition-colors"
                  >
                    <span className="font-bold">{c.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {c.club} · {c.position} · {c.overall} OVR
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Game Over Alert */
          <div className="mb-4 p-4 rounded-xl text-center border animate-in zoom-in-95 duration-200 bg-slate-900">
            {isWon ? (
              <div>
                <Trophy className="w-10 h-10 text-emerald-400 mx-auto mb-1 animate-bounce" />
                <h4 className="font-black text-lg text-emerald-400">BRILLIANT! YOU GUESSED IT!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  The mystery player was <b className="text-white">{targetPlayer.name}</b> ({targetPlayer.club})!
                </p>
                <div className="inline-flex items-center gap-1 text-xs text-amber-300 font-bold mt-2">
                  <Coins className="w-3.5 h-3.5" /> +3 Scout Tokens Awarded
                </div>
              </div>
            ) : (
              <div>
                <XCircle className="w-10 h-10 text-rose-400 mx-auto mb-1" />
                <h4 className="font-black text-lg text-rose-400">OUT OF GUESSES!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  The mystery player was <b className="text-white">{targetPlayer.name}</b> ({targetPlayer.club})!
                </p>
              </div>
            )}

            <button
              onClick={handleResetGame}
              className="mt-3 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 mx-auto transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Play Another Mystery
            </button>
          </div>
        )}

        {/* Guesses Board */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {guesses.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Guess a player to reveal nationality, league, club, position, OVR, and age clues!
            </div>
          ) : (
            guesses.map((g, idx) => (
              <div
                key={idx}
                className="grid grid-cols-6 gap-1.5 text-center text-[11px] font-bold"
              >
                {/* 1. Name */}
                <div className="p-2 rounded-lg bg-slate-800 text-white flex items-center justify-center truncate">
                  <span className="truncate">{g.guessedName}</span>
                </div>

                {/* 2. Nation */}
                <div
                  className={`p-2 rounded-lg flex items-center justify-center gap-1 truncate ${
                    g.nationMatch === 'exact'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
                  }`}
                >
                  <span className="truncate">{g.nationText}</span>
                </div>

                {/* 3. League */}
                <div
                  className={`p-2 rounded-lg flex items-center justify-center truncate ${
                    g.leagueMatch === 'exact'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
                  }`}
                >
                  <span className="truncate">{g.leagueText}</span>
                </div>

                {/* 4. Club */}
                <div
                  className={`p-2 rounded-lg flex items-center justify-center truncate ${
                    g.clubMatch === 'exact'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
                  }`}
                >
                  <span className="truncate">{g.clubText}</span>
                </div>

                {/* 5. Position */}
                <div
                  className={`p-2 rounded-lg flex items-center justify-center ${
                    g.posMatch === 'exact'
                      ? 'bg-emerald-600 text-white'
                      : g.posMatch === 'close'
                      ? 'bg-amber-600 text-white'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
                  }`}
                >
                  {g.posText}
                </div>

                {/* 6. OVR & Age */}
                <div
                  className={`p-2 rounded-lg flex items-center justify-center gap-1 font-mono ${
                    g.ovrMatch === 'exact'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-amber-300'
                  }`}
                >
                  <span>{g.ovrText}</span>
                  {g.ovrMatch === 'higher' && <ArrowUp className="w-3 h-3 text-emerald-400" />}
                  {g.ovrMatch === 'lower' && <ArrowDown className="w-3 h-3 text-rose-400" />}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Legend / Status Footer */}
        <div className="pt-3 border-t border-slate-800/80 mt-4 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Match
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Close
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Wrong
            </span>
          </div>
          <span>Guesses: {guesses.length} / 6</span>
        </div>
      </div>
    </div>
  );
}
