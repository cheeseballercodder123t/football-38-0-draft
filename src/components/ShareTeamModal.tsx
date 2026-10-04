import React, { useState } from 'react';
import { Player, Formation, Manager } from '../types/football';
import { Trophy, Shield, Share2, Copy, Check, X, Sparkles, Download } from 'lucide-react';

interface ShareTeamModalProps {
  startingXI: (Player | null)[];
  bench?: (Player | null)[];
  formation: Formation;
  manager: Manager | null;
  chemistry: number;
  teamRating: number;
  trophies?: string[];
  campaignTitle?: string;
  onClose: () => void;
}

export const ShareTeamModal: React.FC<ShareTeamModalProps> = ({
  startingXI,
  bench = [],
  formation,
  manager,
  chemistry,
  teamRating,
  trophies = [],
  campaignTitle = 'Tactical Draft: 38-0',
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const activeStarters = startingXI.filter((p): p is Player => p !== null);
  const activeBench = bench.filter((p): p is Player => p !== null);

  const handleCopyRoster = () => {
    const text = `🏆 [${campaignTitle.toUpperCase()}]
Manager: ${manager?.name || 'Tactician'} (${formation.name} · ${formation.tacticalSynergy})
Team Rating: ${teamRating} OVR · Chemistry: ${chemistry}%

⭐ STARTING XI:
${formation.slots
  .map((slot, i) => {
    const p = startingXI[i];
    return p ? `• ${slot.label}: ${p.name} (${p.overall} OVR · ${p.clubName} ${p.year})` : `• ${slot.label}: [Vacant]`;
  })
  .join('\n')}

🪑 BENCH:
${activeBench.map(p => `• SUB: ${p.name} (${p.overall} OVR · ${p.specificPosition})`).join('\n') || 'None'}
${trophies.length > 0 ? `\n🥇 TROPHIES WON: ${trophies.join(', ')}` : ''}
Play Tactical Draft: 38-0!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="820" viewBox="0 0 600 820" style="background:#090e17;font-family:system-ui,-apple-system,sans-serif;">
  <rect width="600" height="820" fill="#090e17"/>
  <rect x="20" y="20" width="560" height="780" rx="24" fill="#121824" stroke="#334155" stroke-width="2"/>
  
  <!-- Header -->
  <text x="50" y="70" fill="#34d399" font-size="12" font-weight="900" letter-spacing="2">TACTICAL DRAFT: 38-0</text>
  <text x="50" y="105" fill="#ffffff" font-size="26" font-weight="900">${campaignTitle}</text>
  <text x="50" y="132" fill="#94a3b8" font-size="13">Manager: ${manager?.name || 'Tactician'} · ${formation.name} (${formation.tacticalSynergy})</text>
  
  <!-- Badges -->
  <rect x="50" y="152" width="115" height="42" rx="10" fill="#1c160b" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="68" y="178" fill="#f59e0b" font-size="14" font-weight="900">${teamRating} OVR</text>
  
  <rect x="175" y="152" width="135" height="42" rx="10" fill="#0d2618" stroke="#10b981" stroke-width="1.5"/>
  <text x="192" y="178" fill="#34d399" font-size="14" font-weight="900">CHEM: ${chemistry}%</text>

  <!-- Starting XI List -->
  <text x="50" y="235" fill="#f8fafc" font-size="16" font-weight="800">STARTING XI</text>
  <line x1="50" y1="246" x2="550" y2="246" stroke="#334155" stroke-width="1"/>
  
  ${formation.slots
    .map((slot, idx) => {
      const p = startingXI[idx];
      const y = 280 + idx * 37;
      if (!p) {
        return `<text x="50" y="${y}" fill="#64748b" font-size="13">• ${slot.label}: [Vacant]</text>`;
      }
      return `
      <g>
        <rect x="50" y="${y - 18}" width="34" height="24" rx="6" fill="#1e293b"/>
        <text x="57" y="${y - 2}" fill="#34d399" font-size="10" font-weight="900">${slot.label}</text>
        <text x="96" y="${y}" fill="#ffffff" font-size="13" font-weight="700">${p.name}</text>
        <text x="375" y="${y}" fill="#94a3b8" font-size="11">${p.clubName} (${p.year})</text>
        <text x="525" y="${y}" fill="#fbbf24" font-size="13" font-weight="900">${p.overall}</text>
      </g>`;
    })
    .join('')}

  <!-- Footer Branding -->
  <line x1="50" y1="730" x2="550" y2="730" stroke="#334155" stroke-width="1"/>
  <text x="50" y="765" fill="#64748b" font-size="11">Generated with Tactical Draft: 38-0 Simulator</text>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TacticalDraft-XI-${formation.name}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/90 backdrop-blur-md overflow-y-auto font-sans select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg my-auto bg-gradient-to-b from-[#16202e] via-[#0f1724] to-[#080d16] border-2 border-slate-700/80 rounded-3xl p-5 sm:p-6 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Holographic Header Sheen */}
        <div className="absolute inset-0 pointer-events-none holo-sheen opacity-20 z-0" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.3)]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-400 font-black uppercase tracking-wider">
                TACTICAL SQUAD CARD
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Share Starting XI
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Squad Card Preview */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-br from-[#121824] to-[#0a0f18] border border-slate-800 space-y-3 font-mono relative z-10 shadow-inner">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base sm:text-lg font-black text-white font-sans">{campaignTitle}</div>
              <div className="text-xs text-slate-300">
                Manager: <strong className="text-white">{manager?.name || 'Tactician'}</strong> · {formation.name}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-amber-950/90 border border-amber-500/60 text-amber-300 font-black shadow-xs">
                {teamRating} OVR
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 font-black shadow-xs">
                {chemistry}% CHEM
              </span>
            </div>
          </div>

          {/* Starters Grid */}
          <div className="space-y-1.5 pt-2.5 border-t border-slate-800 text-xs">
            {formation.slots.map((slot, idx) => {
              const p = startingXI[idx];
              return (
                <div
                  key={slot.id}
                  className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-[#16202d] border border-slate-800"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-8 text-[9px] font-black text-emerald-400 font-mono">
                      {slot.label}
                    </span>
                    <span className="text-white font-bold truncate font-sans">
                      {p ? p.name : <span className="text-slate-500 italic">Vacant</span>}
                    </span>
                  </div>
                  {p && (
                    <div className="flex items-center gap-2 text-[11px] shrink-0 font-mono">
                      <span className="text-slate-400">{p.clubName}</span>
                      <span className="font-black text-amber-400">{p.overall}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 font-mono text-xs relative z-10">
          <button
            onClick={handleCopyRoster}
            className="flex-1 py-3 px-4 bg-[#182230] hover:bg-[#222e40] text-white border border-slate-700 rounded-xl font-bold uppercase tracking-wider transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-black">COPIED ROSTER!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-300" />
                <span>COPY ROSTER</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadSvg}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950/70 transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>SAVE BADGE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
