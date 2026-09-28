import React from 'react';
import { Radio, Mic, GitBranch, Cloud, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenPublish: () => void;
  onOpenCloudGitHub: () => void;
  onOpenBillyGraham: () => void;
  devotionalsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPublish,
  onOpenCloudGitHub,
  onOpenBillyGraham,
  devotionalsCount
}) => {
  const todayFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  // Capitalize first letter of weekday
  const capitalizedDate = todayFormatted.charAt(0).toUpperCase() + todayFormatted.slice(1);

  return (
    <header className="sticky top-0 z-30 bg-[#0f141c]/95 backdrop-blur-md border-b border-amber-900/20 px-4 py-3 sm:px-6">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold">
              <Radio className="w-5 h-5 text-slate-950" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0f141c] rounded-full animate-pulse" title="Áudio CDN Online" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-cinzel text-lg sm:text-xl font-bold tracking-wide text-amber-100 flex items-center gap-1">
                PALAVRA VIVA
              </h1>
              <span className="text-[10px] uppercase font-semibold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                Diário
              </span>
            </div>
            <p className="text-xs text-amber-200/60 font-medium">
              {capitalizedDate} • {devotionalsCount} Áudios
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Billy Graham Legacy button */}
          <button
            onClick={onOpenBillyGraham}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-amber-500/20 text-xs font-medium text-amber-200 transition-all active:scale-95 shadow-sm"
            title="Especial Pastor Billy Graham"
          >
            <img
              src="/billy-graham-avatar.jpg"
              alt="Pastor Billy Graham"
              className="w-5 h-5 rounded-full object-cover border border-amber-400/50"
            />
            <span className="hidden sm:inline">Billy Graham</span>
          </button>

          {/* Cloud & GitHub Settings button */}
          <button
            onClick={onOpenCloudGitHub}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-amber-300 transition-all active:scale-95"
            title="Integração GitHub & Cloud Storage CDN"
          >
            <div className="flex items-center -space-x-1">
              <GitBranch className="w-4 h-4 text-emerald-400" />
            </div>
          </button>

          {/* New Audio Devotional button */}
          <button
            onClick={onOpenPublish}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-bold shadow-md shadow-amber-500/25 active:scale-95 transition-all"
          >
            <Mic className="w-4 h-4" />
            <span>Enviar Áudio</span>
          </button>
        </div>
      </div>
    </header>
  );
};
