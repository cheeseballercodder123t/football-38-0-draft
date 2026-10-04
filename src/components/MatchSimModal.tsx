import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MatchResult,
  Player,
  MatchMentality,
  MatchTempo,
  MatchPressing,
  MatchEvent,
  ManagerDecisionEvent,
  ManagerDecisionOption,
  HalftimeTalkOption,
  PressConferenceQuestion,
  PressConferenceOption,
} from '../types/football';
import {
  Play,
  Pause,
  FastForward,
  CheckCircle2,
  Trophy,
  Shield,
  Flame,
  X,
  BarChart3,
  ListOrdered,
  Award,
  Activity,
  ArrowUpDown,
  Sparkles,
  Zap,
  Star,
  Megaphone,
  SlidersHorizontal,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Users,
  Crown,
  RefreshCw,
  Mic,
  Target,
  Crosshair,
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { AftergameSummaryModal } from './AftergameSummaryModal';
import { HexagonSkillGraph } from './HexagonSkillGraph';
import { generateAftergameReport } from '../utils/radarCalculations';

interface MatchSimModalProps {
  match: MatchResult;
  onClose: () => void;
  onNextMatch?: () => void;
  bench?: (Player | null)[];
  startingXI?: (Player | null)[];
  onSubPlayer?: (outIndex: number, inPlayer: Player) => void;
}

export const MatchSimModal: React.FC<MatchSimModalProps> = ({
  match,
  onClose,
  onNextMatch,
  bench = [],
  startingXI = [],
  onSubPlayer,
}) => {
  const maxMinute = match.extraTime ? 120 : 90;
  const isUserHome = match.homeTeam === 'Your Starting XI';

  // Playback & Speed Control State
  const [currentMinute, setCurrentMinute] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<1 | 2 | 5>(1);
  const [activeTab, setActiveTab] = useState<'radar' | 'log' | 'boxscore' | 'stats' | 'tactics' | 'summary'>('radar');
  const [showAftergameModal, setShowAftergameModal] = useState<boolean>(false);

  // Tactical Aftergame Debrief Memo
  const aftergameReport = useMemo(() => {
    return generateAftergameReport(match, startingXI);
  }, [match, startingXI]);

  // Live Manager Directives
  const [mentality, setMentality] = useState<MatchMentality>('balanced');
  const [tempo, setTempo] = useState<MatchTempo>('balanced');
  const [pressing, setPressing] = useState<MatchPressing>('mid_block');

  // Touchline shouts
  const [activeShout, setActiveShout] = useState<string | null>(null);
  const [shoutNotice, setShoutNotice] = useState<string | null>(null);

  // Substitutions
  const [selectedSubOutIdx, setSelectedSubOutIdx] = useState<number | null>(null);
  const [subbedInPlayerIds, setSubbedInPlayerIds] = useState<string[]>([]);

  // Halftime Dressing Room Talk
  const [showHalftimeTalk, setShowHalftimeTalk] = useState<boolean>(false);
  const [halftimeTalkCompleted, setHalftimeTalkCompleted] = useState<boolean>(false);

  // Post-Match Media Press Conference
  const [showPressConference, setShowPressConference] = useState<boolean>(false);
  const [pressConferenceCompleted, setPressConferenceCompleted] = useState<boolean>(false);
  const [pressConferenceHeadline, setPressConferenceHeadline] = useState<string | null>(null);

  // Captaincy & Formation
  const [captainId, setCaptainId] = useState<string | null>(startingXI[0]?.id || null);
  const [inMatchFormation, setInMatchFormation] = useState<'4-3-3' | '4-2-3-1' | '3-5-2' | '5-3-2'>('4-3-3');

  // Interactive In-Match Decision Moments
  const [activeDecision, setActiveDecision] = useState<ManagerDecisionEvent | null>(null);
  const [answeredDecisionIds, setAnsweredDecisionIds] = useState<string[]>([]);
  const [liveEvents, setLiveEvents] = useState<MatchEvent[]>(match.events);

  // Shot Map & xG Visualizer State
  const [radarSubView, setRadarSubView] = useState<'shot_map' | 'pitch'>('shot_map');
  const [shotFilter, setShotFilter] = useState<'all' | 'goals' | 'user' | 'opp'>('all');
  const [selectedShot, setSelectedShot] = useState<MatchEvent | null>(null);
  const [inspectedPitchPlayerId, setInspectedPitchPlayerId] = useState<string | null>(null);

  const prevGoalsCountRef = useRef<number>(0);

  // Reset simulation state whenever match changes
  useEffect(() => {
    setCurrentMinute(0);
    setIsPlaying(true);
    setLiveEvents(match.events);
    setSelectedShot(null);
    setActiveDecision(null);
    setAnsweredDecisionIds([]);
    setShowHalftimeTalk(false);
    setHalftimeTalkCompleted(false);
    setShowPressConference(false);
    setPressConferenceCompleted(false);
    setPressConferenceHeadline(null);
    setSelectedSubOutIdx(null);
    setSubbedInPlayerIds([]);
    setInspectedPitchPlayerId(null);
    prevGoalsCountRef.current = 0;
    soundEngine.playWhistle();
  }, [match.id, match.events]);

  // Escape key listener to exit modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Main simulation tick loop
  useEffect(() => {
    if (!isPlaying || currentMinute >= maxMinute || activeDecision !== null || showHalftimeTalk) return;

    const intervalDelay = simSpeed === 5 ? 35 : simSpeed === 2 ? 80 : 160;
    const minuteStep = simSpeed === 5 ? 3 : 2;

    const timer = setInterval(() => {
      setCurrentMinute(prev => {
        const next = Math.min(maxMinute, prev + minuteStep);

        // Check if Halftime Team Talk triggers at 45'
        if (next >= 45 && prev < 45 && !halftimeTalkCompleted) {
          setIsPlaying(false);
          setShowHalftimeTalk(true);
          soundEngine.playWhistle();
          return 45;
        }

        // Check if a manager decision is triggered at this minute
        if (match.managerDecisions && match.managerDecisions.length > 0) {
          const pending = match.managerDecisions.find(
            d => next >= d.minute && prev < d.minute && !answeredDecisionIds.includes(d.id)
          );
          if (pending) {
            setIsPlaying(false);
            setActiveDecision(pending);
            soundEngine.playWhistle();
            return pending.minute;
          }
        }

        if (next >= maxMinute) {
          setIsPlaying(false);
          return maxMinute;
        }
        return next;
      });
    }, intervalDelay);

    return () => clearInterval(timer);
  }, [isPlaying, currentMinute, maxMinute, simSpeed, activeDecision, answeredDecisionIds, match.managerDecisions, showHalftimeTalk, halftimeTalkCompleted]);

  // Skip / Instant Sim
  const skipToEnd = () => {
    setCurrentMinute(maxMinute);
    setIsPlaying(false);
    setActiveDecision(null);
    setShowHalftimeTalk(false);
    setHalftimeTalkCompleted(true);
    soundEngine.playWhistle();
  };

  // Visible events and live scores
  const visibleEvents = useMemo(
    () => liveEvents.filter(e => e.minute <= currentMinute),
    [liveEvents, currentMinute]
  );
  const homeGoals = useMemo(
    () => visibleEvents.filter(e => e.type === 'goal' && e.team === 'home').length,
    [visibleEvents]
  );
  const awayGoals = useMemo(
    () => visibleEvents.filter(e => e.type === 'goal' && e.team === 'away').length,
    [visibleEvents]
  );

  const userScore = isUserHome ? homeGoals : awayGoals;
  const oppScore = isUserHome ? awayGoals : homeGoals;

  // Live Shot Map Telemetry
  const allVisibleShots = useMemo(() => {
    return visibleEvents.filter(e =>
      (e.type === 'goal' || e.type === 'shot' || e.type === 'save') &&
      e.shotX !== undefined &&
      e.shotY !== undefined
    );
  }, [visibleEvents]);

  const filteredShots = useMemo(() => {
    return allVisibleShots.filter(s => {
      if (shotFilter === 'goals') return s.type === 'goal' || s.shotOutcome === 'goal';
      if (shotFilter === 'user') return isUserHome ? s.team === 'home' : s.team === 'away';
      if (shotFilter === 'opp') return isUserHome ? s.team === 'away' : s.team === 'home';
      return true;
    });
  }, [allVisibleShots, shotFilter, isUserHome]);

  const userShotsList = useMemo(() => {
    return allVisibleShots.filter(s => isUserHome ? s.team === 'home' : s.team === 'away');
  }, [allVisibleShots, isUserHome]);

  const oppShotsList = useMemo(() => {
    return allVisibleShots.filter(s => isUserHome ? s.team === 'away' : s.team === 'home');
  }, [allVisibleShots, isUserHome]);

  const liveUserXg = useMemo(() => {
    return Math.round(userShotsList.reduce((acc, s) => acc + (s.xG || 0), 0) * 100) / 100;
  }, [userShotsList]);

  const liveOppXg = useMemo(() => {
    return Math.round(oppShotsList.reduce((acc, s) => acc + (s.xG || 0), 0) * 100) / 100;
  }, [oppShotsList]);

  const userBigChances = useMemo(() => {
    return userShotsList.filter(s => (s.xG || 0) >= 0.35).length;
  }, [userShotsList]);

  const oppBigChances = useMemo(() => {
    return oppShotsList.filter(s => (s.xG || 0) >= 0.35).length;
  }, [oppShotsList]);

  // Knockout Tie Aggregate & Single-Elimination Context
  const isKnockoutTie = useMemo(() => {
    return (
      match.competition.includes('Champions') ||
      match.competition.includes('World Cup') ||
      match.competition.includes('Knockouts') ||
      match.competition.includes('Floor') ||
      match.competition.includes('Final') ||
      Boolean(match.isTwoLegged)
    );
  }, [match.competition, match.isTwoLegged]);

  const isUserEliminatedInMatch = useMemo(() => {
    if (!isKnockoutTie) return false;
    // Two-legged leg 1 does not eliminate
    if (match.isTwoLegged && match.leg === 1) return false;

    if (match.isTwoLegged && match.leg === 2 && match.aggregateScore) {
      const userAgg = isUserHome ? match.aggregateScore.homeTeamTotal : match.aggregateScore.awayTeamTotal;
      const oppAgg = isUserHome ? match.aggregateScore.awayTeamTotal : match.aggregateScore.homeTeamTotal;
      if (userAgg < oppAgg) return true;
      if (userAgg > oppAgg) return false;
      return match.winner !== (isUserHome ? 'home' : 'away');
    }

    return match.winner !== (isUserHome ? 'home' : 'away');
  }, [isKnockoutTie, match, isUserHome]);

  // Knockout Two-Legged Aggregate Telemetry
  const liveAggregate = useMemo(() => {
    if (!match.isTwoLegged) return null;
    if (match.leg === 1) {
      return {
        userTotal: userScore,
        oppTotal: oppScore,
        isLeg1: true,
        label: 'LEG 1 OF 2 · HALF-TIME OF TIE',
        status: userScore > oppScore ? 'LEADING' : userScore < oppScore ? 'TRAILING' : 'LEVEL',
      };
    }
    if (match.leg === 2 && match.firstLegResult) {
      const leg1User = isUserHome ? match.firstLegResult.awayScore : match.firstLegResult.homeScore;
      const leg1Opp = isUserHome ? match.firstLegResult.homeScore : match.firstLegResult.awayScore;
      const userTotal = leg1User + userScore;
      const oppTotal = leg1Opp + oppScore;
      return {
        userTotal,
        oppTotal,
        isLeg1: false,
        label: `AGGREGATE: ${userTotal} - ${oppTotal}`,
        status: userTotal > oppTotal ? 'LEADING' : userTotal < oppTotal ? 'TRAILING' : 'LEVEL',
      };
    }
    return null;
  }, [match.isTwoLegged, match.leg, match.firstLegResult, userScore, oppScore, isUserHome]);

  // Sound triggers on new goals
  useEffect(() => {
    const totalGoals = homeGoals + awayGoals;
    if (totalGoals > prevGoalsCountRef.current) {
      soundEngine.playGoalRoar();
      prevGoalsCountRef.current = totalGoals;
    }
  }, [homeGoals, awayGoals]);

  // Sound trigger on full-time
  useEffect(() => {
    if (currentMinute >= maxMinute) {
      soundEngine.playWhistle();
    }
  }, [currentMinute, maxMinute]);

  const [dismissedAdviceTime, setDismissedAdviceTime] = useState<number>(-1);

  // Handle Dynamic Tactical Mentality Switch with on-pitch consequences
  const handleSwitchMentality = (m: MatchMentality) => {
    soundEngine.playWhistle();
    setMentality(m);

    if (m === 'all_out_attack') {
      setShoutNotice('⚡ ALL-OUT ATTACK: Full squad committing forward into the opponent box!');
      // Check if we can inject a late attacking surge
      if (currentMinute < maxMinute - 2) {
        const surgeMinute = Math.min(maxMinute - 1, currentMinute + 3);
        const activeStarters = startingXI.filter((p): p is Player => p !== null);
        const striker = activeStarters.find(p => p.position === 'FWD') || activeStarters[0];
        const isGoal = Math.random() < 0.42;

        const surgeEvent: MatchEvent = {
          minute: surgeMinute,
          type: isGoal ? 'goal' : 'shot',
          team: isUserHome ? 'home' : 'away',
          scorerId: striker?.id,
          scorerName: striker?.name || 'Striker',
          xG: 0.78,
          shotX: 50,
          shotY: 10,
          shotOutcome: isGoal ? 'goal' : 'saved',
          description: isGoal
            ? `⚽ GOAL! ALL-OUT ATTACK PAYOFF! ${striker?.name || 'Forward'} hammers home in the box amid sheer tactical overload!`
            : `⚡ ALL-OUT ATTACK SURGE: ${striker?.name || 'Forward'} unleashes a venomous strike tipped wide by the goalkeeper!`,
        };
        setLiveEvents(prev => [...prev, surgeEvent].sort((a, b) => a.minute - b.minute));
      }
    } else if (m === 'park_the_bus') {
      setShoutNotice('🛡️ PARK THE BUS: Low block deployed, locking down the 18-yard fortress!');
      // In park the bus, convert future opponent goals to heroic defensive stops
      setLiveEvents(prev =>
        prev.map(evt => {
          if (evt.minute > currentMinute && evt.type === 'goal' && evt.team === (isUserHome ? 'away' : 'home')) {
            return {
              ...evt,
              type: 'save',
              shotOutcome: 'blocked',
              description: `🛡️ [PARK THE BUS INTERCEPTION] Defensive barricade heroics! Low block throws bodies on the line to deny opponent clear goal!`,
            };
          }
          return evt;
        })
      );
    } else {
      setShoutNotice(`⚖️ TACTICAL MENTALITY: ${m.replace(/_/g, ' ').toUpperCase()}`);
    }

    setTimeout(() => setShoutNotice(null), 3500);
  };

  // Handle Touchline Shouts with simulated tactical effect
  const handleTriggerShout = (shoutId: string, label: string) => {
    soundEngine.playWhistle();
    setActiveShout(shoutId);
    setShoutNotice(`📢 TOUCHLINE SHOUT: "${label}"! Squad morale boosted.`);

    const shoutEvent: MatchEvent = {
      minute: currentMinute,
      type: 'aura_trigger',
      team: isUserHome ? 'home' : 'away',
      description: `[MANAGER SHOUT] Touchline roar: "${label}"! Players press with renewed vigor.`,
    };
    setLiveEvents(prev => [...prev, shoutEvent].sort((a, b) => a.minute - b.minute));

    setTimeout(() => setShoutNotice(null), 3000);
  };

  // Handle In-Match Decision Option Choice
  const handleSelectDecisionOption = (option: ManagerDecisionOption) => {
    if (!activeDecision) return;

    soundEngine.playSuccessChime();

    // 1. Add tactical decision log event
    const decisionEvent: MatchEvent = {
      minute: activeDecision.minute,
      type: 'aura_trigger',
      team: isUserHome ? 'home' : 'away',
      description: `[TACTICAL MASTERCLASS] Manager directive: "${option.label}"! ${option.tacticalDescription}`,
    };

    const newEvents = [...liveEvents, decisionEvent];

    // 2. Evaluate tactical consequence: Goal Chance
    if (Math.random() < option.userChanceBoost) {
      const activeStarters = startingXI.filter((p): p is Player => p !== null);
      const scorer = activeStarters[Math.floor(Math.random() * Math.min(3, activeStarters.length))] || activeStarters[0];
      const goalEvent: MatchEvent = {
        minute: Math.min(maxMinute - 1, activeDecision.minute + 1),
        type: 'goal',
        team: isUserHome ? 'home' : 'away',
        scorerId: scorer?.id,
        scorerName: scorer?.name || 'Your Starting XI',
        xG: 0.72,
        description: `⚽ GOAL! Tactical payoff! ${scorer?.name || 'Striker'} scores following the manager's tactical directive!`,
      };
      newEvents.push(goalEvent);
    } else if (Math.random() < option.oppCounterRisk) {
      // Counter-attack concession
      const oppGoalEvent: MatchEvent = {
        minute: Math.min(maxMinute - 1, activeDecision.minute + 2),
        type: 'goal',
        team: isUserHome ? 'away' : 'home',
        scorerName: isUserHome ? match.awayTeam : match.homeTeam,
        xG: 0.65,
        description: `⚠️ Counter goal conceded! The opponent exploited the space to score!`,
      };
      newEvents.push(oppGoalEvent);
    }

    newEvents.sort((a, b) => a.minute - b.minute);
    setLiveEvents(newEvents);
    setAnsweredDecisionIds(prev => [...prev, activeDecision.id]);
    setActiveDecision(null);
    setIsPlaying(true);
  };

  // Fresh Legs Tactical Impact Generator for Substitutions
  const generateSubImpactEvent = (benchPlayer: Player): MatchEvent | null => {
    if (currentMinute >= maxMinute - 4) return null;
    if (Math.random() > 0.45) return null;

    const chanceMinute = Math.min(maxMinute - 1, currentMinute + Math.floor(Math.random() * 6) + 2);
    if (benchPlayer.position === 'FWD' || benchPlayer.position === 'MID') {
      const isGoal = Math.random() < 0.44;
      return {
        minute: chanceMinute,
        type: (isGoal ? 'goal' : 'shot') as 'goal' | 'shot',
        team: (isUserHome ? 'home' : 'away') as 'home' | 'away',
        scorerId: benchPlayer.id,
        scorerName: benchPlayer.name,
        xG: isGoal ? 0.72 : 0.38,
        shotX: 50,
        shotY: 10,
        shotOutcome: (isGoal ? 'goal' : 'saved') as 'goal' | 'saved',
        description: isGoal
          ? `⚽ GOAL! FRESH LEGS BRILLIANCE! Substitute ${benchPlayer.name} bursts through tired defenders to score!`
          : `⚡ FRESH LEGS CHANCE: Substitute ${benchPlayer.name} injects energetic pace to create a dangerous chance!`,
      };
    } else {
      return {
        minute: chanceMinute,
        type: 'aura_trigger' as const,
        team: (isUserHome ? 'home' : 'away') as 'home' | 'away',
        description: `🛡️ [DEFENSIVE FRESH LEGS] ${benchPlayer.name} puts in a crunching tackle with full stamina to thwart the opponent attack!`,
      };
    }
  };

  // Handle Sub Select
  const handleSubSelect = (benchPlayer: Player) => {
    if (selectedSubOutIdx === null) return;
    const subbedOut = startingXI[selectedSubOutIdx];
    soundEngine.playAuraSurge();
    onSubPlayer?.(selectedSubOutIdx, benchPlayer);
    setSubbedInPlayerIds(prev => [...prev, benchPlayer.id]);

    const subEvent: MatchEvent = {
      minute: currentMinute,
      type: 'aura_trigger',
      team: isUserHome ? 'home' : 'away',
      description: `🔄 TACTICAL SUB: ${benchPlayer.name} enters the pitch replacing ${subbedOut?.name || 'Starter'}.`,
    };

    const freshImpact = generateSubImpactEvent(benchPlayer);
    const newEvents = freshImpact ? [subEvent, freshImpact] : [subEvent];
    setLiveEvents(prev => [...prev, ...newEvents].sort((a, b) => a.minute - b.minute));
    setSelectedSubOutIdx(null);
  };

  // Handle Direct Sub from 2D Pitch Dossier
  const handleSubDirect = (starterIdx: number, benchPlayer: Player) => {
    const subbedOut = startingXI[starterIdx];
    soundEngine.playAuraSurge();
    onSubPlayer?.(starterIdx, benchPlayer);
    setSubbedInPlayerIds(prev => [...prev, benchPlayer.id]);

    const subEvent: MatchEvent = {
      minute: currentMinute,
      type: 'aura_trigger',
      team: isUserHome ? 'home' : 'away',
      description: `🔄 TACTICAL SUB: ${benchPlayer.name} enters the pitch replacing ${subbedOut?.name || 'Starter'}.`,
    };

    const freshImpact = generateSubImpactEvent(benchPlayer);
    const newEvents = freshImpact ? [subEvent, freshImpact] : [subEvent];
    setLiveEvents(prev => [...prev, ...newEvents].sort((a, b) => a.minute - b.minute));
    setInspectedPitchPlayerId(null);
  };

  // Live dynamic momentum calculation
  const momentumShare = useMemo(() => {
    let base = 50;
    if (mentality === 'all_out_attack') base += 18;
    else if (mentality === 'attacking') base += 10;
    else if (mentality === 'park_the_bus') base -= 8;
    else if (mentality === 'ultra_defensive') base -= 15;

    if (tempo === 'blitz') base += 8;
    else if (tempo === 'possession') base += 4;

    if (pressing === 'high_press') base += 7;
    else if (pressing === 'low_block') base -= 6;

    if (inMatchFormation === '3-5-2') base += 6;
    else if (inMatchFormation === '5-3-2') base -= 6;

    if (userScore > oppScore) base -= 5; // opponent urgency
    else if (userScore < oppScore) base += 8; // user desperation

    return Math.min(85, Math.max(15, base));
  }, [mentality, tempo, pressing, inMatchFormation, userScore, oppScore]);

  // Live Dynamic Player Match Ratings & Stamina
  const playerRatings = useMemo(() => {
    const ratings: Record<string, { rating: number; stamina: number }> = {};
    const elapsedMinutes = currentMinute;
    const baseStaminaDecay = pressing === 'high_press' ? 0.38 : pressing === 'low_block' ? 0.18 : 0.26;

    startingXI.forEach(p => {
      if (!p) return;
      const isSubbedIn = subbedInPlayerIds.includes(p.id);
      let r = 6.5;

      const goals = visibleEvents.filter(e => e.type === 'goal' && (e.scorerId === p.id || e.scorerName === p.name)).length;
      r += goals * 1.4;

      if (p.position === 'GK' || p.position === 'DEF') {
        const goalsAgainst = isUserHome ? awayGoals : homeGoals;
        if (goalsAgainst === 0 && elapsedMinutes >= 45) r += 0.7;
        else r -= goalsAgainst * 0.35;
      }

      const booked = visibleEvents.some(e => e.type === 'yellow_card' && e.description.includes(p.name));
      if (booked) r -= 0.5;

      r += (p.overall - 84) * 0.05;
      if (p.id === captainId) r += 0.2;

      const finalRating = Math.min(9.9, Math.max(4.8, Math.round(r * 10) / 10));
      const stamina = isSubbedIn ? 100 : Math.max(45, Math.round(100 - elapsedMinutes * baseStaminaDecay));

      ratings[p.id] = { rating: finalRating, stamina };
    });

    return ratings;
  }, [startingXI, subbedInPlayerIds, visibleEvents, currentMinute, pressing, isUserHome, awayGoals, homeGoals, captainId]);

  // Assistant Manager Live Dugout Hotline Advice
  const assistantAdvice = useMemo(() => {
    if (currentMinute >= maxMinute || currentMinute < 15) return null;
    if (Math.abs(currentMinute - dismissedAdviceTime) < 12) return null;

    if (currentMinute >= 65 && userScore < oppScore && mentality !== 'all_out_attack') {
      return {
        id: 'trailing-attack',
        text: 'Boss, time is running out! Push numbers forward with All-Out Attack!',
        actionLabel: 'ORDER ALL-OUT ATTACK ⚡',
        action: () => handleSwitchMentality('all_out_attack'),
        badgeColor: 'border-rose-500/80 bg-rose-950/70 text-rose-300',
      };
    }

    if (currentMinute >= 75 && userScore > oppScore && mentality !== 'park_the_bus') {
      return {
        id: 'leading-defend',
        text: 'Boss, they are pouring into our half. Switch to Park The Bus to seal these 3 points!',
        actionLabel: 'LOCKDOWN: PARK THE BUS 🛡️',
        action: () => handleSwitchMentality('park_the_bus'),
        badgeColor: 'border-blue-500/80 bg-blue-950/70 text-blue-300',
      };
    }

    const tiredCount = Object.values(playerRatings).filter(p => p.stamina < 58).length;
    if (tiredCount >= 2 && subbedInPlayerIds.length < 5) {
      return {
        id: 'tired-subs',
        text: `Boss, ${tiredCount} key starters are visibly fatigued! Inject fresh legs from the bench!`,
        actionLabel: 'MAKE SUBS 🔄',
        action: () => setActiveTab('boxscore'),
        badgeColor: 'border-amber-500/80 bg-amber-950/70 text-amber-300',
      };
    }

    if (currentMinute >= 45 && tempo !== 'blitz' && userScore === oppScore) {
      return {
        id: 'stalemate-blitz',
        text: 'Boss, stalemate in midfield. A higher tempo blitz counter could catch their backline flat!',
        actionLabel: 'BLITZ COUNTER 🎯',
        action: () => {
          setTempo('blitz');
          setShoutNotice('🎯 TEMPO SHIFT: Blitz counter-attacking pace activated!');
          setTimeout(() => setShoutNotice(null), 3000);
        },
        badgeColor: 'border-cyan-500/80 bg-cyan-950/70 text-cyan-300',
      };
    }

    return null;
  }, [currentMinute, maxMinute, userScore, oppScore, mentality, tempo, playerRatings, subbedInPlayerIds.length, dismissedAdviceTime]);

  // =========================================================================
  // DYNAMIC 2D PITCH RADAR GEOMETRY & TELEMETRY
  // =========================================================================
  const formationCoords: Record<'4-3-3' | '4-2-3-1' | '3-5-2' | '5-3-2', { role: string; x: number; y: number }[]> = useMemo(() => ({
    '4-3-3': [
      { role: 'GK', x: 7, y: 50 },
      { role: 'RB', x: 21, y: 18 },
      { role: 'CB', x: 17, y: 38 },
      { role: 'CB', x: 17, y: 62 },
      { role: 'LB', x: 21, y: 82 },
      { role: 'CM', x: 31, y: 28 },
      { role: 'CDM', x: 26, y: 50 },
      { role: 'CM', x: 31, y: 72 },
      { role: 'RW', x: 42, y: 22 },
      { role: 'ST', x: 46, y: 50 },
      { role: 'LW', x: 42, y: 78 },
    ],
    '4-2-3-1': [
      { role: 'GK', x: 7, y: 50 },
      { role: 'RB', x: 21, y: 18 },
      { role: 'CB', x: 17, y: 38 },
      { role: 'CB', x: 17, y: 62 },
      { role: 'LB', x: 21, y: 82 },
      { role: 'RDM', x: 27, y: 36 },
      { role: 'LDM', x: 27, y: 64 },
      { role: 'RAM', x: 38, y: 24 },
      { role: 'CAM', x: 39, y: 50 },
      { role: 'LAM', x: 38, y: 76 },
      { role: 'ST', x: 46, y: 50 },
    ],
    '3-5-2': [
      { role: 'GK', x: 7, y: 50 },
      { role: 'RCB', x: 18, y: 28 },
      { role: 'CB', x: 15, y: 50 },
      { role: 'LCB', x: 18, y: 72 },
      { role: 'RWB', x: 28, y: 14 },
      { role: 'CM', x: 32, y: 36 },
      { role: 'CDM', x: 26, y: 50 },
      { role: 'CM', x: 32, y: 64 },
      { role: 'LWB', x: 28, y: 86 },
      { role: 'RS', x: 45, y: 38 },
      { role: 'LS', x: 45, y: 62 },
    ],
    '5-3-2': [
      { role: 'GK', x: 7, y: 50 },
      { role: 'RWB', x: 21, y: 14 },
      { role: 'RCB', x: 17, y: 32 },
      { role: 'CB', x: 15, y: 50 },
      { role: 'LCB', x: 17, y: 68 },
      { role: 'LWB', x: 21, y: 86 },
      { role: 'CM', x: 31, y: 30 },
      { role: 'CM', x: 29, y: 50 },
      { role: 'CM', x: 31, y: 70 },
      { role: 'RS', x: 45, y: 38 },
      { role: 'LS', x: 45, y: 62 },
    ],
  }), []);

  // Starting XI pitch tokens with tactical mentality positioning and live match badges
  const userPitchTokens = useMemo(() => {
    const baseCoords = formationCoords[inMatchFormation] || formationCoords['4-3-3'];
    const shiftX = mentality === 'park_the_bus' ? -3.5 : mentality === 'all_out_attack' ? 4 : 0;

    return baseCoords.map((coord, idx) => {
      const player = startingXI[idx] || null;
      const finalX = idx === 0 ? coord.x : Math.max(11, Math.min(48, coord.x + shiftX));
      const goals = player
        ? visibleEvents.filter(e => e.type === 'goal' && (e.scorerId === player.id || e.scorerName === player.name)).length
        : 0;
      const isYellow = player
        ? visibleEvents.some(e => e.type === 'yellow_card' && e.description.includes(player.name))
        : false;
      const isRed = player
        ? visibleEvents.some(e => e.type === 'red_card' && e.description.includes(player.name))
        : false;
      const isCaptain = player?.id === captainId;
      const rating = player ? playerRatings[player.id]?.rating ?? 6.5 : null;
      const stamina = player ? playerRatings[player.id]?.stamina ?? 100 : null;

      return {
        idx,
        player,
        role: coord.role,
        x: finalX,
        y: coord.y,
        goals,
        isYellow,
        isRed,
        isCaptain,
        rating,
        stamina,
      };
    });
  }, [inMatchFormation, mentality, startingXI, visibleEvents, captainId, playerRatings, formationCoords]);

  // Opponent pitch tokens with tactical reactivity
  const oppPitchTokens = useMemo(() => {
    const oppBase = [
      { role: 'GK', x: 93, y: 50 },
      { role: 'LB', x: 79, y: 18 },
      { role: 'CB', x: 83, y: 38 },
      { role: 'CB', x: 83, y: 62 },
      { role: 'RB', x: 79, y: 82 },
      { role: 'LCM', x: 69, y: 28 },
      { role: 'CDM', x: 74, y: 50 },
      { role: 'RCM', x: 69, y: 72 },
      { role: 'LW', x: 58, y: 22 },
      { role: 'ST', x: 54, y: 50 },
      { role: 'RW', x: 58, y: 78 },
    ];
    const shiftX = mentality === 'all_out_attack' ? 3 : mentality === 'park_the_bus' ? -3 : 0;
    return oppBase.map((item, idx) => ({
      ...item,
      x: idx === 0 ? item.x : Math.max(52, Math.min(89, item.x + shiftX)),
    }));
  }, [mentality]);

  // Latest shot / hazard event on pitch
  const latestShotEvent = useMemo(() => {
    const recentShots = visibleEvents.filter(e =>
      (e.type === 'goal' || e.type === 'shot' || e.type === 'save') &&
      e.shotX !== undefined && e.shotY !== undefined
    );
    if (recentShots.length === 0) return null;
    const last = recentShots[recentShots.length - 1];
    if (currentMinute - last.minute <= 4) {
      return last;
    }
    return null;
  }, [visibleEvents, currentMinute]);

  // Live Football Ball coordinates and dynamics
  const liveBallState = useMemo(() => {
    if (latestShotEvent) {
      const isUserShot = isUserHome ? latestShotEvent.team === 'home' : latestShotEvent.team === 'away';
      const targetX = isUserShot
        ? 88 + ((latestShotEvent.shotY ?? 50) / 100) * 8
        : 12 - ((latestShotEvent.shotY ?? 50) / 100) * 8;
      const targetY = latestShotEvent.shotX ?? 50;
      return {
        x: Math.min(96, Math.max(4, targetX)),
        y: Math.min(88, Math.max(12, targetY)),
        isDanger: true,
        isGoal: latestShotEvent.type === 'goal' || latestShotEvent.shotOutcome === 'goal',
        shooterName: latestShotEvent.scorerName || (isUserShot ? 'Your Attack' : 'Opponent'),
        fromX: isUserShot ? 42 : 58,
        fromY: 50,
      };
    }

    const driftX = Math.sin((currentMinute + 2) * 1.6) * 7;
    const driftY = Math.cos((currentMinute + 1) * 1.3) * 24;
    const bx = Math.min(80, Math.max(20, momentumShare + driftX));
    const by = Math.min(82, Math.max(18, 50 + driftY));

    return {
      x: bx,
      y: by,
      isDanger: false,
      isGoal: false,
      shooterName: null,
      fromX: null,
      fromY: null,
    };
  }, [latestShotEvent, currentMinute, momentumShare, isUserHome]);

  // Inspected Pitch Player Dossier Object
  const inspectedPitchPlayer = useMemo(() => {
    if (!inspectedPitchPlayerId) return null;
    const token = userPitchTokens.find(t => t.player?.id === inspectedPitchPlayerId);
    if (!token || !token.player) return null;
    return {
      token,
      player: token.player,
      rating: token.rating ?? 6.5,
      stamina: token.stamina ?? 100,
    };
  }, [inspectedPitchPlayerId, userPitchTokens]);

  // Halftime Dressing Room Talk Options
  const halftimeOptions: HalftimeTalkOption[] = useMemo(() => {
    const isLeading = userScore > oppScore;
    const isTrailing = userScore < oppScore;

    if (isTrailing) {
      return [
        {
          id: 'talk-passion',
          label: 'Passionate Rallying Cry',
          quote: 'Leave everything on that pitch! We owe this to our supporters — fight for every loose ball!',
          tone: 'passionate',
          staminaImpact: 10,
          momentumShift: 25,
          boostDescription: 'Squad fired up! Attacking aggression and pressing pace surged.',
        },
        {
          id: 'talk-hairdryer',
          label: 'The Hairdryer Treatment (High Risk)',
          quote: 'That first 45 minutes was completely unacceptable! Prove you deserve this shirt right now!',
          tone: 'furious',
          staminaImpact: 15,
          momentumShift: 35,
          boostDescription: 'Extreme adrenaline rush. Big chance boost, with slight foul risk.',
        },
        {
          id: 'talk-tactical',
          label: 'Calm Tactical Restructure',
          quote: 'Keep your heads. Narrow our midfield lines, circulate faster, and exploit their wide pockets.',
          tone: 'tactical',
          staminaImpact: 5,
          momentumShift: 15,
          boostDescription: 'Composure and passing precision stabilized.',
        },
      ];
    } else if (isLeading) {
      return [
        {
          id: 'talk-focus',
          label: 'Demand Total Concentration',
          quote: 'Do not let your intensity slip! Treat the scoreline as 0-0 until the final whistle!',
          tone: 'tactical',
          staminaImpact: 5,
          momentumShift: 15,
          boostDescription: 'Defensive concentration peaked. Defensive errors minimized.',
        },
        {
          id: 'talk-killer',
          label: 'Go for the Killer Blow',
          quote: 'They are visibly shaken. Suffocate them in their own half and find the clinching goal!',
          tone: 'passionate',
          staminaImpact: 10,
          momentumShift: 20,
          boostDescription: 'Counter-attacking blitz tempo heightened.',
        },
        {
          id: 'talk-praise',
          label: 'Measured Praise',
          quote: 'Superb application so far. Keep making them chase shadows and control the tempo.',
          tone: 'encouraging',
          staminaImpact: 0,
          momentumShift: 10,
          boostDescription: 'Morale and passing confidence boosted.',
        },
      ];
    } else {
      return [
        {
          id: 'talk-seize',
          label: 'Seize the Initiative',
          quote: 'This game is there to be won! Take responsibility and show them our champion pedigree!',
          tone: 'passionate',
          staminaImpact: 8,
          momentumShift: 20,
          boostDescription: 'Attackers take on defenders with greater conviction.',
        },
        {
          id: 'talk-patience',
          label: 'Patience & Structure',
          quote: 'Stay solid, don’t force the needle pass, and take the chance when it appears.',
          tone: 'tactical',
          staminaImpact: 5,
          momentumShift: 10,
          boostDescription: 'Central solidity maintained.',
        },
      ];
    }
  }, [userScore, oppScore]);

  const handleSelectHalftimeOption = (opt: HalftimeTalkOption) => {
    soundEngine.playSuccessChime();
    const talkEvent: MatchEvent = {
      minute: 45,
      type: 'aura_trigger',
      team: isUserHome ? 'home' : 'away',
      description: `🗣️ [HALFTIME TEAM TALK] Boss: "${opt.quote}" — ${opt.boostDescription}`,
    };
    setLiveEvents(prev => [...prev, talkEvent].sort((a, b) => a.minute - b.minute));
    setHalftimeTalkCompleted(true);
    setShowHalftimeTalk(false);
    setIsPlaying(true);
  };

  // Post-Match Media Room Options
  const pressData: PressConferenceQuestion = useMemo(() => {
    const isWin = userScore > oppScore;
    const isDraw = userScore === oppScore;

    if (isWin) {
      return {
        id: 'press-win',
        headline: 'POST-MATCH MEDIA ROOM: VICTORIOUS GAFFER ADDRESSES PRESS',
        outlet: 'Sky Sports Champions Lounge',
        journalist: 'Guillem Balagué',
        question: 'A masterclass on the pitch today, Boss! What was the decisive element that broke their resistance?',
        options: [
          {
            id: 'press-1',
            text: '"All credit goes to the squad. They executed every single tactical directive with elite courage."',
            tone: 'inspirational',
            boardConfidenceDelta: 4,
            moraleDelta: 6,
          },
          {
            id: 'press-2',
            text: '"We studied their defensive high line meticulously and struck in transition exactly where we planned."',
            tone: 'diplomatic',
            boardConfidenceDelta: 5,
            moraleDelta: 3,
          },
          {
            id: 'press-3',
            text: '"A lot of so-called pundits wrote us off before kickoff. Perhaps now they will show proper respect."',
            tone: 'combative',
            boardConfidenceDelta: 2,
            moraleDelta: 7,
          },
        ],
      };
    } else if (isDraw) {
      return {
        id: 'press-draw',
        headline: 'POST-MATCH MEDIA ROOM: STALEMATE IN TACTICAL WARFARE',
        outlet: 'BBC Match of the Day',
        journalist: 'Henry Winter',
        question: 'A hard-fought point today. Are you content with the draw or frustrated not to take all three?',
        options: [
          {
            id: 'press-1',
            text: '"Against an opponent of this caliber, a point is respectable, but our ambitions demand more."',
            tone: 'diplomatic',
            boardConfidenceDelta: 3,
            moraleDelta: 3,
          },
          {
            id: 'press-2',
            text: '"We created the superior quality chances. On another evening, we win this comfortably."',
            tone: 'inspirational',
            boardConfidenceDelta: 2,
            moraleDelta: 5,
          },
        ],
      };
    } else {
      return {
        id: 'press-loss',
        headline: 'POST-MATCH MEDIA ROOM: GAFFER RESPONDS TO BITTER REVERSAL',
        outlet: 'The Athletic Football Daily',
        journalist: 'David Ornstein',
        question: 'A painful result today. Where did things unravel, and how does the dressing room bounce back?',
        options: [
          {
            id: 'press-1',
            text: '"I take full responsibility as manager. We will analyze the errors and respond on the training ground."',
            tone: 'diplomatic',
            boardConfidenceDelta: 4,
            moraleDelta: 2,
          },
          {
            id: 'press-2',
            text: '"Certain refereeing calls changed the complexion of this game completely. My players deserved better."',
            tone: 'combative',
            boardConfidenceDelta: -1,
            moraleDelta: 6,
          },
          {
            id: 'press-3',
            text: '"Tough nights forge championship character. We will use this pain as fuel for our next fixture."',
            tone: 'inspirational',
            boardConfidenceDelta: 3,
            moraleDelta: 5,
          },
        ],
      };
    }
  }, [userScore, oppScore]);

  const handleSelectPressOption = (opt: PressConferenceOption) => {
    soundEngine.playSuccessChime();
    setPressConferenceHeadline(opt.text);
    setPressConferenceCompleted(true);
    setShowPressConference(false);

    const pressEvent: MatchEvent = {
      minute: maxMinute,
      type: 'aura_trigger',
      team: isUserHome ? 'home' : 'away',
      description: `🎙️ [PRESS STATEMENT] Gaffer: ${opt.text}`,
    };
    setLiveEvents(prev => [...prev, pressEvent]);
  };

  const handleSwitchFormation = (newForm: '4-3-3' | '4-2-3-1' | '3-5-2' | '5-3-2') => {
    soundEngine.playWhistle();
    setInMatchFormation(newForm);
    const formEvent: MatchEvent = {
      minute: currentMinute,
      type: 'aura_trigger',
      team: isUserHome ? 'home' : 'away',
      description: `🔄 [FORMATION SHIFT] Manager shifts shape to ${newForm} to adapt to match flow!`,
    };
    setLiveEvents(prev => [...prev, formEvent].sort((a, b) => a.minute - b.minute));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto font-sans select-none animate-in fade-in duration-200 cursor-pointer"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-xl my-auto bg-gradient-to-b from-[#141d2c] via-[#0d1422] to-[#070b14] border-2 border-slate-700/80 rounded-3xl flex flex-col max-h-[95vh] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.95)] animate-in zoom-in-95 duration-200 cursor-default"
        onClick={e => e.stopPropagation()}
      >

        {/* Top TV Broadcast Header Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-[#090e17]/95 flex items-center justify-between font-mono text-xs relative z-10">
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/50 via-teal-400/40 to-transparent pointer-events-none" />
          <div className="flex items-center gap-2 min-w-0">
            <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-200 font-black uppercase tracking-wider truncate">
              {match.competition} · MD {match.matchday}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {match.isTwoLegged && (
              <span className="px-2 py-0.5 border border-indigo-500/60 bg-indigo-950/80 text-indigo-300 rounded-md text-[10px] font-bold">
                LEG {match.leg}/2
              </span>
            )}
            <div className="px-2.5 py-0.5 rounded-lg bg-[#141c28] border border-amber-500/50 text-amber-300 font-black drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
              {currentMinute}'
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Broadcast Scoreboard with Stadium Ambience */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#090e17] via-[#0d1729] to-[#090e17] border-b border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between gap-3 text-sm sm:text-base">
            {/* Home Team */}
            <div className="flex-1 flex items-center gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border ${
                  isUserHome
                    ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-400'
                    : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-black text-white truncate font-sans">
                {match.homeTeam}
              </span>
            </div>

            {/* Scoreboard Number Box */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-3 shrink-0 px-4 py-2 bg-[#121926] border border-slate-700 rounded-2xl shadow-xl font-mono">
                <span className="text-2xl sm:text-3xl font-black text-white">{homeGoals}</span>
                <span className="text-slate-500 font-black text-sm">:</span>
                <span className="text-2xl sm:text-3xl font-black text-white">{awayGoals}</span>
              </div>
              {liveAggregate && (
                <div className="mt-1.5 font-mono text-center">
                  {liveAggregate.isLeg1 ? (
                    <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-500/60 text-indigo-300 text-[9px] font-black tracking-wide">
                      LEG 1 / 2 (HALF-TIME OF TIE)
                    </span>
                  ) : (
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-wider border shadow-xs ${
                        liveAggregate.status === 'LEADING'
                          ? 'bg-emerald-950/90 border-emerald-500/80 text-emerald-300'
                          : liveAggregate.status === 'TRAILING'
                          ? 'bg-rose-950/90 border-rose-500/80 text-rose-300'
                          : 'bg-amber-950/90 border-amber-500/80 text-amber-300'
                      }`}
                    >
                      {liveAggregate.label} ({liveAggregate.status})
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex-1 flex items-center justify-end gap-2.5 min-w-0 text-right">
              <span className="font-black text-white truncate font-sans">
                {match.awayTeam}
              </span>
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border ${
                  !isUserHome
                    ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-400'
                    : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                <Shield className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Live Momentum Bar (Tug of War) */}
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-col gap-1 text-[10px] font-mono">
            <div className="flex items-center justify-between text-slate-400 font-bold uppercase gap-1">
              <span className="text-emerald-400 flex items-center gap-1 font-semibold truncate">
                <TrendingUp className="w-3 h-3 shrink-0" />
                <span className="hidden sm:inline">USER</span> {momentumShare}%
              </span>
              <span className="text-slate-400 tracking-wider text-[9px] sm:text-[10px] truncate hidden xs:inline">
                TERRITORIAL DOMINANCE
              </span>
              <span className="text-cyan-400 font-semibold truncate text-right">
                <span className="hidden sm:inline">OPPONENT</span> {100 - momentumShare}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: `${momentumShare}%` }}
              />
              <div
                className="bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                style={{ width: `${100 - momentumShare}%` }}
              />
            </div>
          </div>
        </div>

        {/* Manager Mode Controls Toolbar: Speed & Directives */}
        <div className="px-3 py-2 bg-[#090d14] border-b border-slate-800 flex items-center justify-between text-xs font-mono flex-wrap gap-2">
          {/* Speed & Play/Pause */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPlaying(p => !p)}
              disabled={currentMinute >= maxMinute}
              className={`p-1.5 rounded-xl border font-bold transition-all active:scale-95 flex items-center gap-1 ${
                isPlaying
                  ? 'bg-amber-950/80 border-amber-500/80 text-amber-300'
                  : 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300'
              }`}
              title={isPlaying ? 'Pause simulation' : 'Resume simulation'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>

            {[1, 2, 5].map(spd => (
              <button
                key={spd}
                onClick={() => setSimSpeed(spd as 1 | 2 | 5)}
                className={`px-2 py-1 rounded-xl text-[10px] font-black border transition-all active:scale-95 ${
                  simSpeed === spd
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 border-emerald-400 font-black shadow-xs'
                    : 'bg-[#141c28] text-slate-400 hover:text-white border-slate-800'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Quick Mentality Switcher with mobile-friendly abbreviations */}
          <div className="flex items-center gap-1">
            {(['park_the_bus', 'balanced', 'all_out_attack'] as MatchMentality[]).map(m => (
              <button
                key={m}
                onClick={() => handleSwitchMentality(m)}
                className={`px-2 py-1 rounded-xl text-[10px] font-bold border transition-all active:scale-95 ${
                  mentality === m
                    ? m === 'all_out_attack'
                      ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white border-rose-500 font-black shadow-sm'
                      : m === 'park_the_bus'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-500 font-black shadow-sm'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 border-emerald-500 font-black shadow-sm'
                    : 'bg-[#141c28] text-slate-400 hover:text-white border-slate-800'
                }`}
              >
                <span className="sm:hidden">
                  {m === 'park_the_bus' ? 'BUS' : m === 'all_out_attack' ? 'ATTACK' : 'BAL'}
                </span>
                <span className="hidden sm:inline">
                  {m.replace(/_/g, ' ').toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* In-Match FM Touchline Shouts Bar */}
        <div className="px-3 py-1.5 bg-[#0c121b] border-b border-slate-800 flex items-center justify-between text-xs font-mono flex-wrap gap-1.5">
          <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px] uppercase">
            <Megaphone className="w-3 h-3 text-cyan-400" />
            <span>SHOUT:</span>
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            {[
              { id: 'demand_more', label: 'DEMAND MORE!', icon: '⚡', color: 'from-amber-600 to-yellow-500' },
              { id: 'stay_compact', label: 'STAY COMPACT', icon: '🛡️', color: 'from-blue-600 to-indigo-600' },
              { id: 'fire_up', label: 'SHOW PASSION!', icon: '🔥', color: 'from-rose-600 to-red-600' },
              { id: 'pump_box', label: 'PUMP INTO BOX', icon: '🎯', color: 'from-emerald-600 to-teal-600' },
            ].map(shout => (
              <button
                key={shout.id}
                disabled={currentMinute >= maxMinute}
                onClick={() => handleTriggerShout(shout.id, shout.label)}
                className={`px-2 py-0.5 rounded-xl text-[9px] font-black border transition-all active:scale-95 flex items-center gap-1 ${
                  activeShout === shout.id
                    ? `bg-gradient-to-r ${shout.color} text-white border-white/50 shadow-sm animate-pulse`
                    : 'bg-[#141c28] text-slate-300 hover:text-white border-slate-700/80 hover:border-slate-500'
                } ${currentMinute >= maxMinute ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span>{shout.icon}</span>
                <span>{shout.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Touchline Alert Banner */}
        {shoutNotice && (
          <div className="px-4 py-1.5 bg-gradient-to-r from-cyan-950 via-[#0e2133] to-cyan-950 border-b border-cyan-500/50 text-cyan-200 text-xs font-mono font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
            <Megaphone className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
            <span>{shoutNotice}</span>
          </div>
        )}

        {/* Live Assistant Manager Dugout Hotline Advice Wire */}
        {assistantAdvice && (
          <div className={`px-3 py-2 border-b flex items-center justify-between gap-2 text-xs font-mono animate-in slide-in-from-top-1 ${assistantAdvice.badgeColor}`}>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm shrink-0">👔</span>
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-black tracking-wider block opacity-75">
                  ASST MANAGER DUGOUT WIRE
                </span>
                <p className="text-[11px] font-bold text-white truncate">
                  {assistantAdvice.text}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  soundEngine.playSuccessChime();
                  assistantAdvice.action();
                  setDismissedAdviceTime(currentMinute);
                }}
                className="px-2.5 py-1 rounded-xl bg-white text-slate-950 font-black text-[10px] uppercase shadow-md hover:bg-slate-200 transition-all active:scale-95 whitespace-nowrap"
              >
                {assistantAdvice.actionLabel}
              </button>
              <button
                onClick={() => setDismissedAdviceTime(currentMinute)}
                className="p-1 rounded-lg hover:bg-black/40 text-slate-400 hover:text-white text-xs"
                title="Dismiss advice"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-[#090d14]/90 p-1.5 gap-1 text-xs font-mono">
          <button
            onClick={() => setActiveTab('radar')}
            className={`flex-1 py-1.5 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'radar'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3 h-3 shrink-0" />
            <span className="truncate">RADAR</span>
          </button>
          <button
            onClick={() => setActiveTab('tactics')}
            className={`flex-1 py-1.5 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'tactics'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3 shrink-0" />
            <span className="truncate">TACTICS</span>
          </button>
          <button
            onClick={() => setActiveTab('log')}
            className={`flex-1 py-1.5 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'log'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListOrdered className="w-3 h-3 shrink-0" />
            <span className="truncate">
              <span className="hidden sm:inline">EVENTS</span>
              <span className="sm:hidden">LOG</span> ({visibleEvents.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('boxscore')}
            className={`flex-1 py-1.5 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'boxscore'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3 h-3 shrink-0" />
            <span className="truncate">SUBS</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-1.5 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'stats'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3 h-3 shrink-0" />
            <span className="truncate">STATS</span>
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-1.5 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'summary'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 shrink-0 text-amber-400" />
            <span className="truncate">DEBRIEF</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2.5 min-h-[220px] max-h-[350px] font-mono text-xs">
          {/* 0. Hexagon Skill Graph & Aftergame Summary */}
          {activeTab === 'summary' && (
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#0f1723] border border-slate-800">
                <div>
                  <div className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{aftergameReport.tacticalArchetype}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-sans mt-0.5">
                    Dominance: <span className="font-bold text-white">{aftergameReport.dominanceIndex}%</span> · xG Delta: <span className={aftergameReport.xgDelta >= 0 ? 'text-emerald-300 font-bold' : 'text-rose-400 font-bold'}>{aftergameReport.xgDelta >= 0 ? `+${aftergameReport.xgDelta}` : aftergameReport.xgDelta}</span> · Manager: <span className="text-amber-300 font-bold">{aftergameReport.managerRating}★</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEngine.playCoins();
                    setShowAftergameModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-[11px] uppercase tracking-wider transition-all shadow-md active:scale-95"
                >
                  FULL DEBRIEF ⤢
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-3 rounded-2xl bg-[#0a1017] border border-slate-800">
                <HexagonSkillGraph
                  skills={aftergameReport.squadSkills}
                  comparisonSkills={aftergameReport.opponentSkills}
                  label="Your Starting XI"
                  comparisonLabel={aftergameReport.opponentName}
                  size={240}
                />

                <div className="space-y-1.5 text-xs w-full sm:w-48 font-mono">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">SKILL RATINGS</div>
                  <div className="grid grid-cols-2 sm:grid-cols-1 gap-1 text-[11px]">
                    <div className="flex justify-between p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">FIN:</span>
                      <span className="font-bold text-amber-300">{aftergameReport.squadSkills.finishing}</span>
                    </div>
                    <div className="flex justify-between p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">CRE:</span>
                      <span className="font-bold text-emerald-300">{aftergameReport.squadSkills.creation}</span>
                    </div>
                    <div className="flex justify-between p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">CAR:</span>
                      <span className="font-bold text-cyan-300">{aftergameReport.squadSkills.carrying}</span>
                    </div>
                    <div className="flex justify-between p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">PHY:</span>
                      <span className="font-bold text-rose-300">{aftergameReport.squadSkills.physicality}</span>
                    </div>
                    <div className="flex justify-between p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">DEF:</span>
                      <span className="font-bold text-blue-300">{aftergameReport.squadSkills.defense}</span>
                    </div>
                    <div className="flex justify-between p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">BLD:</span>
                      <span className="font-bold text-purple-300">{aftergameReport.squadSkills.buildUp}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* 1. 2D Interactive Pitch Radar & Shot Map xG Visualizer */}
          {activeTab === 'radar' && (
            <div className="space-y-2.5 font-mono">
              {/* Sub-view Switcher Bar */}
              <div className="flex items-center justify-between gap-2 p-1 bg-[#0c121b] border border-slate-800 rounded-xl">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setRadarSubView('shot_map');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-1.5 ${
                      radarSubView === 'shot_map'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Target className="w-3 h-3" />
                    <span>SHOT MAP & xG ({allVisibleShots.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setRadarSubView('pitch');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-1.5 ${
                      radarSubView === 'pitch'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Activity className="w-3 h-3" />
                    <span>2D RADAR</span>
                  </button>
                </div>

                {radarSubView === 'shot_map' && (
                  <div className="flex items-center gap-1">
                    {(['all', 'goals', 'user', 'opp'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => {
                          soundEngine.playClick();
                          setShotFilter(f);
                        }}
                        className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase transition-all ${
                          shotFilter === f
                            ? 'bg-emerald-950 border border-emerald-400 text-emerald-300'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {f === 'all'
                          ? 'ALL'
                          : f === 'goals'
                          ? `GLS (${allVisibleShots.filter(s => s.type === 'goal' || s.shotOutcome === 'goal').length})`
                          : f === 'user'
                          ? 'YOU'
                          : 'OPP'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View 1: Shot Map & xG Visualizer */}
              {radarSubView === 'shot_map' && (
                <div className="space-y-2">
                  <div className="relative w-full aspect-[16/10] max-h-[220px] rounded-2xl overflow-hidden border-2 border-emerald-600/70 shadow-xl divine-turf">
                    <svg viewBox="0 0 100 86" className="w-full h-full select-none">
                      <defs>
                        <pattern id="turf-stripes" width="100" height="14" patternUnits="userSpaceOnUse">
                          <rect width="100" height="7" fill="#042314" fillOpacity="0.45" />
                          <rect y="7" width="100" height="7" fill="#021a0f" fillOpacity="0.45" />
                        </pattern>
                        <filter id="shot-glow" x="-40%" y="-40%" width="180%" height="180%">
                          <feGaussianBlur stdDeviation="1" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Pitch Grass Backdrop */}
                      <rect width="100" height="86" fill="url(#turf-stripes)" />

                      {/* Goal Netting at Top */}
                      <rect x="36" y="0.5" width="28" height="3.5" fill="#0c1724" stroke="#ffffff" strokeWidth="0.8" fillOpacity="0.8" />
                      <line x1="36" y1="0.5" x2="64" y2="0.5" stroke="#ffffff" strokeWidth="1.2" />

                      {/* Pitch Boundary Line */}
                      <rect x="4" y="4" width="92" height="78" fill="none" stroke="#34d399" strokeWidth="0.7" strokeOpacity="0.4" rx="2" />

                      {/* 6-Yard Box */}
                      <rect x="32" y="4" width="36" height="11" fill="none" stroke="#34d399" strokeWidth="0.6" strokeOpacity="0.4" />

                      {/* 18-Yard Penalty Box */}
                      <rect x="18" y="4" width="64" height="34" fill="none" stroke="#34d399" strokeWidth="0.7" strokeOpacity="0.4" />

                      {/* Penalty Spot */}
                      <circle cx="50" cy="24" r="0.9" fill="#34d399" fillOpacity="0.9" />

                      {/* Penalty Arc "D" */}
                      <path d="M 38 38 A 12 12 0 0 0 62 38" fill="none" stroke="#34d399" strokeWidth="0.6" strokeOpacity="0.4" />

                      {/* Midfield Line & Center Circle Arc */}
                      <line x1="4" y1="82" x2="96" y2="82" stroke="#34d399" strokeWidth="0.7" strokeOpacity="0.4" />
                      <path d="M 35 82 A 15 15 0 0 1 65 82" fill="none" stroke="#34d399" strokeWidth="0.6" strokeOpacity="0.4" />

                      {/* Plotted Interactive Shots */}
                      {filteredShots.map((shot, idx) => {
                        const cx = shot.shotX ?? 50;
                        const cy = 4 + (shot.shotY ?? 25) * 1.15;
                        const r = Math.max(2.4, Math.min(6.5, 2.0 + (shot.xG ?? 0.1) * 7));
                        const isSelected = selectedShot === shot;
                        const isGoal = shot.type === 'goal' || shot.shotOutcome === 'goal';
                        const isSaved = shot.shotOutcome === 'saved' || shot.type === 'save';
                        const isWoodwork = shot.shotOutcome === 'woodwork';
                        const isBlocked = shot.shotOutcome === 'blocked';

                        let fill = '#ef4444';
                        let stroke = '#fca5a5';
                        if (isGoal) {
                          fill = '#10b981';
                          stroke = '#fbbf24';
                        } else if (isSaved) {
                          fill = '#06b6d4';
                          stroke = '#e0f2fe';
                        } else if (isWoodwork) {
                          fill = '#f97316';
                          stroke = '#fef08a';
                        } else if (isBlocked) {
                          fill = '#8b5cf6';
                          stroke = '#ddd6fe';
                        }

                        return (
                          <g
                            key={idx}
                            className="cursor-pointer transition-transform hover:scale-125"
                            onClick={() => {
                              setSelectedShot(shot);
                              soundEngine.playClick();
                            }}
                          >
                            {/* Animated Gold Ring for Goals */}
                            {isGoal && (
                              <circle
                                cx={cx}
                                cy={cy}
                                r={r + 3}
                                fill="none"
                                stroke="#fbbf24"
                                strokeWidth="0.6"
                                strokeOpacity="0.7"
                                className="animate-ping"
                              />
                            )}

                            {/* Selection Reticle */}
                            {isSelected && (
                              <circle
                                cx={cx}
                                cy={cy}
                                r={r + 3.5}
                                fill="none"
                                stroke="#38bdf8"
                                strokeWidth="1.2"
                                strokeDasharray="2,2"
                              />
                            )}

                            <circle
                              cx={cx}
                              cy={cy}
                              r={r}
                              fill={fill}
                              stroke={stroke}
                              strokeWidth={isGoal ? 1.4 : 0.8}
                              filter="url(#shot-glow)"
                            />
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Shot Legend Pills */}
                  <div className="flex items-center justify-between text-[9px] text-slate-400 px-1 flex-wrap gap-1">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 font-bold text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-xs" /> GOAL
                      </span>
                      <span className="flex items-center gap-1 font-bold text-cyan-400">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> SAVED
                      </span>
                      <span className="flex items-center gap-1 font-bold text-orange-400">
                        <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> POST
                      </span>
                      <span className="flex items-center gap-1 font-bold text-purple-400">
                        <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" /> BLOCKED
                      </span>
                      <span className="flex items-center gap-1 font-bold text-rose-400">
                        <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> WIDE
                      </span>
                    </div>
                    <span className="text-slate-500 italic text-[9px]">Tap dot to inspect</span>
                  </div>

                  {/* Interactive Inspected Shot HUD Card */}
                  {(() => {
                    const inspected = selectedShot || allVisibleShots[allVisibleShots.length - 1];
                    if (!inspected) {
                      return (
                        <div className="p-2.5 rounded-xl bg-[#0a0f18] border border-slate-800 text-center text-slate-500 text-[11px] italic">
                          Awaiting first shot opportunity on goal...
                        </div>
                      );
                    }

                    const isUserShot = isUserHome ? inspected.team === 'home' : inspected.team === 'away';
                    const isGoal = inspected.type === 'goal' || inspected.shotOutcome === 'goal';
                    const isSaved = inspected.shotOutcome === 'saved' || inspected.type === 'save';
                    const isWoodwork = inspected.shotOutcome === 'woodwork';
                    const isBlocked = inspected.shotOutcome === 'blocked';
                    const outcomeLabel = isGoal
                      ? 'GOAL! CLINICAL FINISH'
                      : isSaved
                      ? 'SAVED BY GOALKEEPER'
                      : isWoodwork
                      ? 'RATTLED THE WOODWORK'
                      : isBlocked
                      ? 'BLOCKED BY DEFENDER'
                      : 'OFF-TARGET EFFORT';

                    const badgeColor = isGoal
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : isSaved
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                      : isWoodwork
                      ? 'bg-orange-950 border-orange-500 text-orange-300'
                      : isBlocked
                      ? 'bg-purple-950 border-purple-500 text-purple-300'
                      : 'bg-rose-950 border-rose-500 text-rose-300';

                    const distanceYds = Math.round(8 + (inspected.shotY ?? 20) * 0.35);

                    return (
                      <div className="p-2.5 rounded-2xl bg-gradient-to-r from-[#0d1422] to-[#0a0e17] border border-slate-700/80 shadow-md space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                isUserShot
                                  ? 'bg-emerald-950 border border-emerald-500/80 text-emerald-300'
                                  : 'bg-cyan-950 border border-cyan-500/80 text-cyan-300'
                              }`}
                            >
                              {isUserShot ? 'YOU' : 'OPP'}
                            </span>
                            <span className="font-black text-white text-xs truncate">
                              {inspected.scorerName || (isUserShot ? 'Your Striker' : 'Opponent')}
                            </span>
                            <span className="text-amber-400 font-bold text-[10px]">
                              {inspected.minute}'
                            </span>
                          </div>

                          <span className={`px-2 py-0.5 rounded-md border text-[9px] font-black ${badgeColor}`}>
                            {outcomeLabel}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-300 pt-0.5 border-t border-slate-800">
                          <div className="flex items-center gap-2">
                            <span>
                              xG: <strong className="text-amber-400 font-black">{inspected.xG?.toFixed(2) ?? '0.12'}</strong>
                              {(inspected.xG ?? 0) >= 0.35 && (
                                <span className="text-emerald-400 font-bold ml-1">(Big Chance!)</span>
                              )}
                            </span>
                            <span className="text-slate-500">·</span>
                            <span>
                              Dist: <strong className="text-cyan-300 font-bold">~{distanceYds} yds</strong>
                            </span>
                          </div>

                          {selectedShot && (
                            <button
                              onClick={() => setSelectedShot(null)}
                              className="text-[9px] text-slate-400 hover:text-white"
                            >
                              Clear
                            </button>
                          )}
                        </div>

                        <p className="text-[10px] text-slate-300 font-sans italic leading-relaxed break-words">
                          "{inspected.description}"
                        </p>
                      </div>
                    );
                  })()}

                  {/* Cumulative xG Telemetry Comparison Bar */}
                  <div className="p-2.5 rounded-2xl bg-[#0a0e17] border border-slate-800 space-y-1.5 text-[10px]">
                    <div className="flex items-center justify-between font-black">
                      <span className="text-emerald-400">YOU: {liveUserXg.toFixed(2)} xG</span>
                      <span className="text-slate-400 uppercase text-[9px] tracking-wider">EXPECTED GOALS BATTLE</span>
                      <span className="text-cyan-400">OPP: {liveOppXg.toFixed(2)} xG</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                        style={{
                          width: `${
                            liveUserXg + liveOppXg > 0
                              ? (liveUserXg / (liveUserXg + liveOppXg)) * 100
                              : 50
                          }%`,
                        }}
                      />
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                        style={{
                          width: `${
                            liveUserXg + liveOppXg > 0
                              ? (liveOppXg / (liveUserXg + liveOppXg)) * 100
                              : 50
                          }%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-slate-400 text-[9px] pt-0.5">
                      <span>Big Chances: <strong className="text-emerald-300">{userBigChances}</strong> vs <strong className="text-cyan-300">{oppBigChances}</strong></span>
                      <span>Total Shots: <strong className="text-slate-200">{userShotsList.length}</strong> vs <strong className="text-slate-200">{oppShotsList.length}</strong></span>
                    </div>
                  </div>
                </div>
              )}

              {/* View 2: Dynamic 2D Pitch Radar Match Viewer */}
              {radarSubView === 'pitch' && (
                <div className="flex flex-col items-center space-y-2.5 w-full">
                  {/* Top Pitch Match Telemetry Bar */}
                  <div className="w-full flex items-center justify-between text-xs px-1 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-black text-[11px] text-emerald-300 truncate max-w-[120px] sm:max-w-[180px]">
                        {isUserHome ? match.homeTeam : match.awayTeam}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold">
                        {inMatchFormation}
                      </span>
                    </div>

                    <div className="flex items-center">
                      {liveBallState.isDanger ? (
                        <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black text-amber-300 animate-pulse bg-amber-950/90 px-2.5 py-0.5 rounded-full border border-amber-500/70 shadow-[0_0_12px_rgba(245,158,11,0.6)]">
                          <Flame className="w-3 h-3 text-amber-400 fill-current" />
                          {liveBallState.isGoal ? 'GOAL CONVERTED!' : `DANGER ATTACK: ${liveBallState.shooterName}`}
                        </span>
                      ) : (
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-300 flex items-center gap-1.5 bg-[#0a121c] px-2.5 py-0.5 rounded-full border border-slate-800">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span>{currentMinute}' IN PLAY</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-emerald-400 font-black">
                            {mentality === 'all_out_attack' ? 'ALL-OUT ATTACK' : mentality === 'park_the_bus' ? 'PARK THE BUS' : 'BALANCED'}
                          </span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-bold">
                        4-3-3
                      </span>
                      <span className="font-black text-[11px] text-cyan-300 truncate max-w-[120px] sm:max-w-[180px]">
                        {isUserHome ? match.awayTeam : match.homeTeam}
                      </span>
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  </div>

                  {/* 2D Pitch Turf with Markings */}
                  <div className="relative w-full aspect-[16/9] sm:aspect-[16/8.5] max-h-[225px] rounded-2xl overflow-hidden border-2 border-emerald-600/70 shadow-2xl divine-turf select-none">
                    {/* Outer Boundary & Touchlines */}
                    <div className="absolute inset-2 border-2 border-emerald-300/40 rounded-xl pointer-events-none" />
                    {/* Halfway line */}
                    <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-[1px] bg-emerald-300/40 pointer-events-none" />
                    {/* Center Circle & Spot */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-emerald-300/40 pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-300/80 shadow-[0_0_6px_#34d399] pointer-events-none" />

                    {/* Left Penalty Box (18-yard box) */}
                    <div className="absolute top-1/2 left-2 -translate-y-1/2 w-[16%] h-[56%] border-r border-y border-emerald-300/40 rounded-r-xs pointer-events-none" />
                    {/* Left 6-Yard Box */}
                    <div className="absolute top-1/2 left-2 -translate-y-1/2 w-[6.5%] h-[28%] border-r border-y border-emerald-300/35 rounded-r-xs pointer-events-none" />
                    {/* Left Penalty Arc */}
                    <div className="absolute top-1/2 left-[18%] -translate-y-1/2 w-7 h-10 rounded-r-full border-r border-emerald-300/30 pointer-events-none" />

                    {/* Right Penalty Box (18-yard box) */}
                    <div className="absolute top-1/2 right-2 -translate-y-1/2 w-[16%] h-[56%] border-l border-y border-emerald-300/40 rounded-l-xs pointer-events-none" />
                    {/* Right 6-Yard Box */}
                    <div className="absolute top-1/2 right-2 -translate-y-1/2 w-[6.5%] h-[28%] border-l border-y border-emerald-300/35 rounded-l-xs pointer-events-none" />
                    {/* Right Penalty Arc */}
                    <div className="absolute top-1/2 right-[18%] -translate-y-1/2 w-7 h-10 rounded-l-full border-l border-emerald-300/30 pointer-events-none" />

                    {/* Animated Shot Tracer Line on Danger Attacks */}
                    {liveBallState.isDanger && liveBallState.fromX !== null && liveBallState.fromY !== null && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                        <line
                          x1={`${liveBallState.fromX}%`}
                          y1={`${liveBallState.fromY}%`}
                          x2={`${liveBallState.x}%`}
                          y2={`${liveBallState.y}%`}
                          stroke="#f59e0b"
                          strokeWidth="2.5"
                          strokeDasharray="4 4"
                          className="animate-pulse"
                        />
                      </svg>
                    )}

                    {/* User Team Real Player Tokens */}
                    {userPitchTokens.map(token => (
                      <div
                        key={`user-token-${token.idx}`}
                        style={{ left: `${token.x}%`, top: `${token.y}%` }}
                        onClick={() => {
                          if (token.player) {
                            setInspectedPitchPlayerId(token.player.id);
                            soundEngine.playClick();
                          }
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group focus:outline-none z-10 transition-transform active:scale-95"
                        title={token.player ? `${token.player.name} (${token.role}) - Tap to inspect & sub` : token.role}
                      >
                        {/* Token Circle */}
                        <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 border border-emerald-200 text-slate-950 font-black text-[7.5px] sm:text-[9px] flex items-center justify-center shadow-[0_0_8px_rgba(52,211,153,0.7)] group-hover:scale-125 transition-transform duration-150">
                          <span>{token.role}</span>

                          {/* Captain Crown */}
                          {token.isCaptain && (
                            <Crown className="w-2.5 h-2.5 text-amber-300 absolute -top-2.5 -right-1 drop-shadow animate-bounce" />
                          )}

                          {/* Goal Scorer Mini Ball */}
                          {token.goals > 0 && (
                            <span className="absolute -top-1.5 -left-2 bg-amber-500 text-slate-950 text-[7px] font-black rounded-full px-1 border border-white shadow-sm flex items-center">
                              ⚽{token.goals > 1 ? token.goals : ''}
                            </span>
                          )}

                          {/* Yellow / Red Card */}
                          {token.isRed ? (
                            <span className="absolute -bottom-1 -left-1 w-2 h-2.5 bg-rose-600 rounded-[1px] border border-black shadow" />
                          ) : token.isYellow ? (
                            <span className="absolute -bottom-1 -left-1 w-2 h-2.5 bg-yellow-400 rounded-[1px] border border-black shadow" />
                          ) : null}

                          {/* Rating Badge */}
                          {token.rating !== null && (
                            <span className="absolute -bottom-1 -right-1.5 px-0.5 rounded-[2px] bg-slate-950/90 text-[6.5px] font-black text-emerald-300 border border-emerald-500/50">
                              {token.rating}
                            </span>
                          )}
                        </div>

                        {/* Player Last Name Pill */}
                        <span className="absolute top-full mt-0.5 -translate-x-1/2 left-1/2 px-1 py-0.2 rounded bg-slate-950/90 text-[7px] font-bold text-slate-100 max-w-[46px] truncate border border-slate-800 shadow pointer-events-none group-hover:border-emerald-400 group-hover:text-emerald-300">
                          {token.player?.name ? token.player.name.split(' ').pop() : token.role}
                        </span>
                      </div>
                    ))}

                    {/* Away Team Player Tokens */}
                    {oppPitchTokens.map((token, i) => (
                      <div
                        key={`opp-token-${i}`}
                        style={{ left: `${token.x}%`, top: `${token.y}%` }}
                        className="absolute w-4 h-4 sm:w-5 sm:h-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border border-cyan-200 text-slate-950 font-black text-[7px] sm:text-[8px] flex items-center justify-center shadow-[0_0_6px_rgba(56,189,248,0.7)] pointer-events-none"
                      >
                        {token.role}
                      </div>
                    ))}

                    {/* Dynamic Match Football with Physics & Danger Flare */}
                    <div
                      style={{
                        left: `${liveBallState.x}%`,
                        top: `${liveBallState.y}%`,
                        transition: 'all 450ms cubic-bezier(0.25, 1, 0.5, 1)',
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                    >
                      <div
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white border border-slate-950 flex items-center justify-center shadow-[0_0_12px_#ffffff] ${
                          liveBallState.isDanger
                            ? 'ring-2 ring-amber-400 shadow-[0_0_18px_#f59e0b] scale-125'
                            : ''
                        }`}
                      >
                        <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Pitch Legend & Instructions */}
                  <div className="w-full flex items-center justify-between text-[9px] text-slate-400 px-2 pt-0.5 font-mono">
                    <span className="truncate">Tap any starter to open tactical dossier & make in-game subs</span>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="flex items-center gap-0.5 text-amber-300">
                        <Crown className="w-2.5 h-2.5" /> Captain
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-400">
                        ⚽ Scorer
                      </span>
                      <span className="flex items-center gap-0.5 text-yellow-300">
                        <span className="w-1.5 h-2 bg-yellow-400 inline-block rounded-xs" /> Booked
                      </span>
                    </div>
                  </div>

                  {/* Pitch Player Dossier HUD & Quick Sub Drawer */}
                  {inspectedPitchPlayer && (
                    <div className="w-full p-3 rounded-2xl bg-[#0c1420] border-2 border-emerald-500/80 shadow-2xl space-y-2.5 font-mono text-xs animate-in zoom-in-95">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-slate-950 text-xs shadow-md">
                            {inspectedPitchPlayer.player.position}
                          </div>
                          <div>
                            <div className="font-black text-white text-xs flex items-center gap-1.5">
                              <span>{inspectedPitchPlayer.player.name}</span>
                              {inspectedPitchPlayer.token.isCaptain && (
                                <Crown className="w-3.5 h-3.5 text-amber-400 inline" />
                              )}
                              <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 font-bold text-[9px] border border-amber-500/50">
                                {inspectedPitchPlayer.player.overall} OVR
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {inspectedPitchPlayer.player.clubName} ({inspectedPitchPlayer.player.year}) • {inspectedPitchPlayer.player.country}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setInspectedPitchPlayerId(null)}
                          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Performance HUD Grid */}
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                        <div className="p-1.5 rounded-xl bg-[#141d2b] border border-slate-800">
                          <div className="text-slate-400 text-[8px] uppercase">MATCH RATING</div>
                          <div className={`font-black text-xs ${inspectedPitchPlayer.rating >= 7.5 ? 'text-emerald-400' : inspectedPitchPlayer.rating >= 6.5 ? 'text-amber-300' : 'text-rose-400'}`}>
                            {inspectedPitchPlayer.rating}
                          </div>
                        </div>
                        <div className="p-1.5 rounded-xl bg-[#141d2b] border border-slate-800">
                          <div className="text-slate-400 text-[8px] uppercase">STAMINA</div>
                          <div className={`font-black text-xs ${inspectedPitchPlayer.stamina >= 70 ? 'text-emerald-400' : inspectedPitchPlayer.stamina >= 45 ? 'text-amber-300' : 'text-rose-400'}`}>
                            {inspectedPitchPlayer.stamina}%
                          </div>
                        </div>
                        <div className="p-1.5 rounded-xl bg-[#141d2b] border border-slate-800">
                          <div className="text-slate-400 text-[8px] uppercase">GOALS</div>
                          <div className="font-black text-xs text-white">
                            {inspectedPitchPlayer.token.goals}
                          </div>
                        </div>
                        <div className="p-1.5 rounded-xl bg-[#141d2b] border border-slate-800">
                          <div className="text-slate-400 text-[8px] uppercase">DISCIPLINE</div>
                          <div className="font-black text-xs text-white">
                            {inspectedPitchPlayer.token.isRed ? '🟥 RED' : inspectedPitchPlayer.token.isYellow ? '🟨 YELLOW' : 'CLEAN'}
                          </div>
                        </div>
                      </div>

                      {/* Direct Substitution Actions */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-300 font-bold uppercase flex items-center gap-1">
                            <ArrowUpDown className="w-3 h-3 text-emerald-400" />
                            BENCH REPLACEMENTS ({5 - subbedInPlayerIds.length} SUBS REMAINING)
                          </span>
                        </div>

                        {subbedInPlayerIds.length < 5 ? (
                          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {bench
                              .filter((b): b is Player => b !== null && !subbedInPlayerIds.includes(b.id))
                              .map(benchPlayer => (
                                <div
                                  key={benchPlayer.id}
                                  className="flex items-center gap-2 p-2 rounded-xl bg-[#141e2d] border border-slate-700/80 hover:border-emerald-400/80 transition-colors shrink-0"
                                >
                                  <div>
                                    <div className="text-[11px] font-bold text-white whitespace-nowrap">
                                      {benchPlayer.name}
                                    </div>
                                    <div className="text-[9px] text-slate-400 flex items-center gap-1">
                                      <span className="font-black text-emerald-300">{benchPlayer.position}</span>
                                      <span>•</span>
                                      <span>{benchPlayer.overall} OVR</span>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => handleSubDirect(inspectedPitchPlayer.token.idx, benchPlayer)}
                                    className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-wider transition-all active:scale-95 shadow-md flex items-center gap-1"
                                  >
                                    <RefreshCw className="w-2.5 h-2.5" />
                                    SUB IN
                                  </button>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="text-[10px] text-amber-400 bg-amber-950/40 p-2 rounded-xl border border-amber-500/40">
                            Maximum tactical substitutions (5/5) reached for this match.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 2. Detailed Tactical Directive Manager Hub */}
          {activeTab === 'tactics' && (
            <div className="space-y-3 font-mono">
              {/* Mentality */}
              <div className="p-3 bg-[#0d1420] border border-slate-800 rounded-2xl space-y-1.5">
                <span className="text-slate-400 font-bold text-[10px] uppercase flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  TEAM MENTALITY DIRECTIVE
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'park_the_bus', label: 'Park The Bus', desc: 'Solid low block' },
                    { id: 'balanced', label: 'Balanced', desc: 'Control & adapt' },
                    { id: 'all_out_attack', label: 'All-Out Attack', desc: 'Commit forward' },
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setMentality(m.id as MatchMentality)}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        mentality === m.id
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm'
                          : 'bg-[#121926] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-[11px] font-black">{m.label}</div>
                      <div className="text-[9px] text-slate-400">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tempo */}
              <div className="p-3 bg-[#0d1420] border border-slate-800 rounded-2xl space-y-1.5">
                <span className="text-slate-400 font-bold text-[10px] uppercase flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  PASSING TEMPO
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'possession', label: 'Tiki-Taka (Slow)', desc: 'Recycle possession' },
                    { id: 'balanced', label: 'Direct (Normal)', desc: 'Balanced passing' },
                    { id: 'blitz', label: 'Blitz Counter (Fast)', desc: 'High vertical risk' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTempo(t.id as MatchTempo)}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        tempo === t.id
                          ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-sm'
                          : 'bg-[#121926] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-[11px] font-black">{t.label}</div>
                      <div className="text-[9px] text-slate-400">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pressing */}
              <div className="p-3 bg-[#0d1420] border border-slate-800 rounded-2xl space-y-1.5">
                <span className="text-slate-400 font-bold text-[10px] uppercase flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  DEFENSIVE LINE & PRESSING
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'low_block', label: 'Deep Low Block', desc: 'No space in behind' },
                    { id: 'mid_block', label: 'Mid-Block Stance', desc: 'Compact middle third' },
                    { id: 'high_press', label: 'High Gegenpress', desc: 'Suffocate center backs' },
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => setPressing(p.id as MatchPressing)}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        pressing === p.id
                          ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-sm'
                          : 'bg-[#121926] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-[11px] font-black">{p.label}</div>
                      <div className="text-[9px] text-slate-400">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* In-Match Formation Switcher */}
              <div className="p-3 bg-[#0d1420] border border-slate-800 rounded-2xl space-y-1.5">
                <span className="text-slate-400 font-bold text-[10px] uppercase flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  IN-MATCH FORMATION ADAPTATION
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: '4-3-3', label: '4-3-3 Attack', desc: 'Balanced wide wings' },
                    { id: '4-2-3-1', label: '4-2-3-1 Pivot', desc: 'Midfield control & CAM' },
                    { id: '5-3-2', label: '5-3-2 Lockdown', desc: 'Park box & protect lead' },
                    { id: '3-5-2', label: '3-5-2 Total Siege', desc: 'Overload final third' },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => handleSwitchFormation(f.id as any)}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        inMatchFormation === f.id
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm'
                          : 'bg-[#121926] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-[11px] font-black">{f.label}</div>
                      <div className="text-[9px] text-slate-400">{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Team Captain */}
              <div className="p-3 bg-[#0d1420] border border-slate-800 rounded-2xl space-y-1.5">
                <span className="text-slate-400 font-bold text-[10px] uppercase flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  DESIGNATED ON-PITCH CAPTAIN
                </span>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {startingXI.filter((p): p is Player => p !== null).map(p => {
                    const isCap = captainId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setCaptainId(p.id);
                          soundEngine.playSuccessChime();
                        }}
                        className={`px-2.5 py-1.5 rounded-xl border shrink-0 text-left transition-all ${
                          isCap
                            ? 'bg-amber-950/80 border-amber-400 text-amber-300'
                            : 'bg-[#121926] border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="text-[10px] font-black flex items-center gap-1">
                          {isCap && <Crown className="w-3 h-3 text-amber-400" />}
                          <span>{p.name}</span>
                        </div>
                        <div className="text-[8px] text-slate-400">{p.specificPosition} · {p.overall} OVR</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 3. Match Event Ticker Timeline */}
          {activeTab === 'log' && (
            <div className="space-y-2">
              {visibleEvents.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs italic">
                  Match underway. Waiting for first chance...
                </div>
              ) : (
                visibleEvents.map((evt, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-start gap-2.5 transition-all ${
                      evt.type === 'goal'
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                        : evt.type === 'penalty_shootout'
                        ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                        : evt.type === 'yellow_card'
                        ? 'bg-amber-950/50 border-amber-600/70 text-amber-200'
                        : evt.type === 'red_card'
                        ? 'bg-rose-950/80 border-rose-600 text-rose-200'
                        : 'bg-[#0f1520] border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="font-mono font-black text-amber-400 shrink-0">
                      {evt.minute}'
                    </span>
                    <span className="text-xs leading-relaxed">{evt.description}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 4. Substitutions & Lineup Ratings */}
          {activeTab === 'boxscore' && (
            <div className="space-y-3">
              {/* Subs instruction */}
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Tap a starter to substitute from bench:</span>
                <span className="text-emerald-400 font-bold">
                  {subbedInPlayerIds.length}/5 SUBS USED
                </span>
              </div>

              {/* Starters grid */}
              <div className="grid grid-cols-2 gap-2">
                {startingXI.map((p, idx) => {
                  if (!p) return null;
                  const isSelected = selectedSubOutIdx === idx;
                  const isSubbed = subbedInPlayerIds.includes(p.id);
                  const pStat = playerRatings[p.id] || { rating: 6.5, stamina: 100 };

                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedSubOutIdx(isSelected ? null : idx)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-amber-950/80 border-amber-400 text-amber-200 ring-2 ring-amber-400/50'
                          : 'bg-[#121926] border-slate-800 hover:border-slate-600 text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <span className="text-[9px] font-black px-1 rounded bg-slate-900 text-emerald-400 shrink-0">
                            {p.specificPosition}
                          </span>
                          <span className="text-xs font-black truncate min-w-0 flex-1">{p.name}</span>
                          {captainId === p.id && (
                            <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                          )}
                        </div>
                        {/* Dynamic Live Rating Badge */}
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.5 rounded border shrink-0 ${
                            pStat.rating >= 8.5
                              ? 'bg-amber-950 text-amber-300 border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                              : pStat.rating >= 7.5
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                              : pStat.rating >= 6.5
                              ? 'bg-slate-900 text-slate-300 border-slate-700'
                              : 'bg-rose-950 text-rose-300 border-rose-600'
                          }`}
                        >
                          ⭐ {pStat.rating.toFixed(1)}
                        </span>
                      </div>

                      {/* Live Stamina Bar */}
                      <div className="w-full">
                        <div className="flex items-center justify-between text-[9px] text-slate-400 mb-0.5">
                          <span>{p.overall} OVR {isSubbed && '· SUB'}</span>
                          <span className={pStat.stamina < 60 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                            {pStat.stamina}% STM
                          </span>
                        </div>
                        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              pStat.stamina < 60
                                ? 'bg-rose-500'
                                : pStat.stamina < 75
                                ? 'bg-amber-400'
                                : 'bg-emerald-400'
                            }`}
                            style={{ width: `${pStat.stamina}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bench picker when starter is selected */}
              {selectedSubOutIdx !== null && (
                <div className="p-3 bg-amber-950/40 border border-amber-500/70 rounded-2xl space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-amber-300 font-bold text-xs">
                    <span>SELECT BENCH REPLACEMENT:</span>
                    <button
                      onClick={() => setSelectedSubOutIdx(null)}
                      className="text-slate-400 hover:text-white text-[10px]"
                    >
                      CANCEL
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {bench.filter((b): b is Player => b !== null && !subbedInPlayerIds.includes(b.id)).map(b => (
                      <button
                        key={b.id}
                        onClick={() => handleSubSelect(b)}
                        className="w-full p-2 rounded-xl bg-[#141d2c] hover:bg-emerald-950/80 border border-slate-700 hover:border-emerald-500 text-left flex items-center justify-between text-xs transition-all gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400 shrink-0">
                            {b.specificPosition}
                          </span>
                          <span className="font-bold text-white truncate min-w-0 flex-1">{b.name}</span>
                          <span className="text-slate-400 text-[10px] shrink-0">{b.overall} OVR</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-black shrink-0">SUB IN</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. Match Stats Breakdown */}
          {activeTab === 'stats' && (
            <div className="space-y-2.5 font-mono">
              {[
                { label: 'Expected Goals (xG)', h: match.homeStats.xG.toFixed(2), a: match.awayStats.xG.toFixed(2) },
                { label: 'Total Shots', h: match.homeStats.shots, a: match.awayStats.shots },
                { label: 'Shots on Target', h: match.homeStats.shotsOnTarget, a: match.awayStats.shotsOnTarget },
                { label: 'Possession %', h: `${match.homeStats.possession}%`, a: `${match.awayStats.possession}%` },
                { label: 'Tackles Won', h: match.homeStats.tacklesWon, a: match.awayStats.tacklesWon },
                { label: 'Yellow Cards', h: match.homeStats.yellowCards, a: match.awayStats.yellowCards },
              ].map((s, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#0f1522] border border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-black text-emerald-400 w-12 text-left">{s.h}</span>
                  <span className="text-slate-400 text-[10px] uppercase font-bold text-center flex-1">{s.label}</span>
                  <span className="font-black text-cyan-400 w-12 text-right">{s.a}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE MANAGER DECISION OVERLAY MODAL                                 */}
        {/* ========================================================================= */}
        {activeDecision && (
          <div className="absolute inset-x-3 bottom-3 sm:bottom-4 z-40 p-4 rounded-3xl bg-gradient-to-b from-[#182335] via-[#101824] to-[#0c121c] border-2 border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.5)] animate-in slide-in-from-bottom-6 duration-300 font-mono">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-amber-500/40 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <AlertCircle className="w-5 h-5 text-amber-400 animate-bounce shrink-0" />
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider truncate">
                  CRISIS: {activeDecision.scenarioTitle}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 font-bold text-[10px] border border-amber-500 shrink-0">
                ACTION REQUIRED
              </span>
            </div>

            <p className="text-xs text-slate-200 mb-3 font-sans leading-relaxed">
              {activeDecision.scenarioContext}
            </p>

            <div className="space-y-2">
              {activeDecision.options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectDecisionOption(opt)}
                  className="w-full p-3 rounded-2xl bg-[#141d2a] hover:bg-[#1c2738] border border-slate-700 hover:border-amber-400 text-left flex flex-col gap-1 transition-all active:scale-[0.98] shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-xs">{opt.label}</span>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded uppercase border ${
                        opt.risk === 'aggressive'
                          ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                          : opt.risk === 'conservative'
                          ? 'bg-blue-950/80 border-blue-500 text-blue-300'
                          : 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      }`}
                    >
                      {opt.risk} RISK
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans">{opt.tacticalDescription}</div>
                  <div className="text-[10px] text-amber-300/90 font-bold mt-0.5">{opt.moraleOutcome}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* HALFTIME DRESSING ROOM TEAM TALK MODAL                                     */}
        {/* ========================================================================= */}
        {showHalftimeTalk && (
          <div className="absolute inset-x-3 bottom-3 sm:bottom-4 z-40 p-4 rounded-3xl bg-gradient-to-b from-[#192437] via-[#0f1724] to-[#0a0f18] border-2 border-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.5)] animate-in slide-in-from-bottom-6 duration-300 font-mono">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-emerald-500/40 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <MessageSquare className="w-5 h-5 text-emerald-400 animate-pulse shrink-0" />
                <span className="text-xs font-black text-emerald-300 uppercase tracking-wider truncate">
                  HALFTIME TALK (45') · DRESSING ROOM
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 font-black text-[10px] border border-emerald-500 shrink-0">
                {userScore} - {oppScore}
              </span>
            </div>

            <p className="text-xs text-slate-200 mb-3 font-sans leading-relaxed">
              The squad looks to you for tactical clarity and inspiration as they enter the tunnel. How do you address the dressing room?
            </p>

            <div className="space-y-2">
              {halftimeOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectHalftimeOption(opt)}
                  className="w-full p-3 rounded-2xl bg-[#141d2a] hover:bg-[#1a273a] border border-slate-700 hover:border-emerald-400 text-left flex flex-col gap-1 transition-all active:scale-[0.98] shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-xs">{opt.label}</span>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded uppercase border bg-emerald-950/80 border-emerald-500 text-emerald-300">
                      {opt.tone}
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-200/90 font-sans italic">"{opt.quote}"</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{opt.boostDescription}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* POST-MATCH MEDIA PRESS CONFERENCE MODAL                                    */}
        {/* ========================================================================= */}
        {showPressConference && (
          <div className="absolute inset-x-3 bottom-3 sm:bottom-4 z-40 p-4 rounded-3xl bg-gradient-to-b from-[#1b1c28] via-[#10121c] to-[#0a0a12] border-2 border-indigo-400 shadow-[0_0_40px_rgba(99,102,241,0.5)] animate-in slide-in-from-bottom-6 duration-300 font-mono">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-indigo-500/40 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Mic className="w-5 h-5 text-indigo-400 animate-pulse shrink-0" />
                <span className="text-xs font-black text-indigo-300 uppercase tracking-wider truncate">
                  {pressData.headline}
                </span>
              </div>
              <button
                onClick={() => setShowPressConference(false)}
                className="text-slate-400 hover:text-white shrink-0 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-200 mb-3 font-sans leading-relaxed">
              <span className="font-bold text-amber-300">{pressData.journalist} ({pressData.outlet}): </span>
              "{pressData.question}"
            </p>

            <div className="space-y-2">
              {pressData.options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectPressOption(opt)}
                  className="w-full p-3 rounded-2xl bg-[#141624] hover:bg-[#1e2035] border border-slate-700 hover:border-indigo-400 text-left flex flex-col gap-1 transition-all active:scale-[0.98] shadow-sm"
                >
                  <div className="text-xs font-bold text-white font-sans">{opt.text}</div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <span className="capitalize px-1.5 py-0.2 rounded bg-slate-900 text-slate-300">{opt.tone}</span>
                    <span className="text-emerald-400 font-bold">+{opt.boardConfidenceDelta}% Board Trust</span>
                    <span className="text-cyan-400 font-bold">+{opt.moraleDelta}% Morale</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-[#090e17]/95 flex items-center justify-between gap-3 font-mono text-xs relative z-10">
          {currentMinute < maxMinute ? (
            <button
              onClick={skipToEnd}
              className="py-2.5 px-4 bg-[#182230] hover:bg-[#222e40] text-slate-200 border border-slate-700 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
            >
              <FastForward className="w-3.5 h-3.5 text-amber-400" />
              <span>SKIP TO 90'</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span
                className={`font-black flex items-center gap-1.5 ${
                  match.isTwoLegged && match.leg === 1
                    ? 'text-indigo-300'
                    : isUserEliminatedInMatch
                    ? 'text-rose-400'
                    : 'text-emerald-400'
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 ${
                    match.isTwoLegged && match.leg === 1
                      ? 'text-indigo-400'
                      : isUserEliminatedInMatch
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }`}
                />
                {match.isTwoLegged && match.leg === 1
                  ? 'LEG 1 CONCLUDED'
                  : isUserEliminatedInMatch
                  ? 'TIE CONCLUDED'
                  : 'CONCLUDED'}
              </span>
              {!pressConferenceCompleted && (
                <button
                  onClick={() => setShowPressConference(true)}
                  className="py-1.5 px-2.5 bg-indigo-950/90 border border-indigo-500/80 text-indigo-300 rounded-lg font-bold flex items-center gap-1 text-[11px] hover:bg-indigo-900 transition-all active:scale-95 shadow-sm"
                >
                  <Mic className="w-3 h-3 text-indigo-400" />
                  <span>PRESS ROOM</span>
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            {currentMinute >= maxMinute && (
              <button
                onClick={() => {
                  soundEngine.playCoins();
                  setShowAftergameModal(true);
                }}
                className="py-2.5 px-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-950/80 transition-all active:scale-95 flex items-center gap-1.5 ring-1 ring-purple-400/50"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>HEXAGON DEBRIEF</span>
              </button>
            )}

            {match.isTwoLegged && match.leg === 1 && currentMinute >= maxMinute ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/60 text-indigo-300 text-[10px] font-bold">
                  LEG 1 COMPLETE
                </span>
                <button
                  onClick={onClose}
                  className="py-2.5 px-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 text-white font-black rounded-xl shadow-lg shadow-indigo-950/80 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span>RETURN TO BRACKET FOR LEG 2</span>
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            ) : isUserEliminatedInMatch && currentMinute >= maxMinute ? (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-rose-950/90 border border-rose-500/80 text-rose-300 font-black text-xs uppercase flex items-center gap-1.5 shadow-sm">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>KNOCKED OUT</span>
                </span>
                <button
                  onClick={onClose}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold transition-all active:scale-95"
                >
                  RETURN TO BRACKET
                </button>
              </div>
            ) : onNextMatch && currentMinute >= maxMinute ? (
              <button
                onClick={() => {
                  onNextMatch();
                }}
                className="py-2.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black rounded-xl shadow-[0_0_16px_rgba(52,211,153,0.5)] transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>NEXT FIXTURE</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="py-2.5 px-5 bg-[#182230] hover:bg-[#222e40] text-slate-200 border border-slate-700 rounded-xl font-bold transition-all active:scale-95"
              >
                CLOSE
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Standalone Full-Screen Aftergame Hexagon Summary Modal */}
      {showAftergameModal && (
        <AftergameSummaryModal
          match={match}
          startingXI={startingXI}
          onClose={() => setShowAftergameModal(false)}
          onNextMatch={onNextMatch}
        />
      )}
    </div>
  );
};
