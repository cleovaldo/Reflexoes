import React from 'react';
import { Play, Pause, Heart, Share2, Sparkles, Volume2, Bookmark, Check } from 'lucide-react';
import { Devotional } from '../types';

interface BillyGrahamHeroProps {
  devotional: Devotional;
  isPlaying: boolean;
  isCurrentAudio: boolean;
  onPlayToggle: (devotional: Devotional) => void;
  onLike: (devotionalId: string) => void;
  onShare: (devotional: Devotional) => void;
  onOpenLegacy: () => void;
  isLiked: boolean;
}

export const BillyGrahamHero: React.FC<BillyGrahamHeroProps> = ({
  devotional,
  isPlaying,
  isCurrentAudio,
  onPlayToggle,
  onLike,
  onShare,
  onOpenLegacy,
  isLiked
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-900 to-[#121926] border border-amber-500/30 shadow-2xl shadow-black/60 group">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Image Container */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-slate-950">
        <img
          src="/billy-graham.jpg"
          alt="Pastor Billy Graham pregando com a Bíblia"
          className="w-full h-full object-cover object-top filter grayscale contrast-125 brightness-95 transition-transform duration-700 group-hover:scale-105"
        />
        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121926] via-[#121926]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/40 text-[11px] font-semibold text-amber-300 pointer-events-auto">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Inspiração Evangelística • Pastor Billy Graham</span>
          </div>

          <button
            onClick={onOpenLegacy}
            className="px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700 text-[11px] font-medium text-slate-300 hover:text-white transition-all pointer-events-auto active:scale-95"
          >
            Ver Biografia
          </button>
        </div>

        {/* Floating Quick Play on Image for Mobile */}
        <div className="absolute bottom-3 right-3 sm:hidden">
          <button
            onClick={() => onPlayToggle(devotional)}
            className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/40 active:scale-95 transition-all"
            aria-label="Tocar áudio"
          >
            {isPlaying && isCurrentAudio ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 pt-2 relative z-10">
        {/* Scripture reference & date */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="font-cinzel text-xs font-bold tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
            {devotional.passageRef}
          </span>
          <span className="text-xs text-slate-400">
            {devotional.formattedDate}
          </span>
          <span className="text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono">
            {devotional.audioSizeFormatted} • Opus CDN
          </span>
        </div>

        {/* Title */}
        <h2 className="font-cinzel text-lg sm:text-xl font-bold text-slate-100 leading-snug mb-2 hover:text-amber-300 transition-colors cursor-pointer" onClick={() => onPlayToggle(devotional)}>
          {devotional.title}
        </h2>

        {/* Scripture Highlight */}
        <blockquote className="font-scripture text-sm sm:text-base italic text-amber-100/90 bg-amber-950/20 border-l-2 border-amber-500 pl-3 py-1.5 my-2.5 rounded-r">
          "{devotional.verseText}"
        </blockquote>

        {/* Excerpt */}
        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {devotional.reflectionText}
        </p>

        {/* Interactive Bottom Bar: Listen CTA, Like, Share */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
          <button
            onClick={() => onPlayToggle(devotional)}
            className="flex-1 hidden sm:flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 active:scale-98 transition-all"
          >
            {isPlaying && isCurrentAudio ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pausar Áudio da Mensagem</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Ouvir Reflexão em Áudio (3m 14s)</span>
              </>
            )}
          </button>

          {/* Mobile direct listen pill */}
          <button
            onClick={() => onPlayToggle(devotional)}
            className="sm:hidden flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlaying && isCurrentAudio ? 'Pausar' : 'Ouvir Áudio'}</span>
          </button>

          {/* Social actions */}
          <div className="flex items-center gap-2">
            {/* Like button with count */}
            <button
              onClick={() => onLike(devotional.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-90 ${
                isLiked
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-slate-800/90 text-slate-300 hover:text-rose-400 hover:bg-slate-800 border border-slate-700/60'
              }`}
              title="Curtir devocional"
            >
              <Heart
                className={`w-4 h-4 transition-transform ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''}`}
              />
              <span>{devotional.likesCount}</span>
            </button>

            {/* Share button */}
            <button
              onClick={() => onShare(devotional)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-amber-300 text-xs font-semibold transition-all active:scale-95"
              title="Compartilhar no WhatsApp ou redes"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Compartilhar</span>
              <span className="text-[11px] text-slate-400">({devotional.sharesCount})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
