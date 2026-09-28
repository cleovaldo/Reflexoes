import React, { useState } from 'react';
import { Play, Pause, Heart, Share2, ChevronDown, ChevronUp, Sparkles, BookOpen, Clock, Cloud, GitCommit } from 'lucide-react';
import { Devotional } from '../types';

interface DevotionalCardProps {
  devotional: Devotional;
  isPlaying: boolean;
  isCurrentAudio: boolean;
  onPlayToggle: (devotional: Devotional) => void;
  onLike: (devotionalId: string) => void;
  onShare: (devotional: Devotional) => void;
  isLiked: boolean;
}

export const DevotionalCard: React.FC<DevotionalCardProps> = ({
  devotional,
  isPlaying,
  isCurrentAudio,
  onPlayToggle,
  onLike,
  onShare,
  isLiked
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatMinutes = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <article className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all p-4 sm:p-5 shadow-lg shadow-black/40">
      {/* Top Header: Passage & Date */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-cinzel text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
            {devotional.passageRef}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {devotional.formattedDate}
          </span>
        </div>

        {/* Cloud & Git badge */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-0.5 text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-500/20" title="Armazenamento em Nuvem Edge CDN">
            <Cloud className="w-3 h-3" />
            <span>CDN</span>
          </span>
          {devotional.githubCommitHash && (
            <span className="hidden sm:flex items-center gap-0.5 text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700" title={`Git Commit: ${devotional.githubCommitHash}`}>
              <GitCommit className="w-3 h-3" />
              <span>{devotional.githubCommitHash}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Title & Play Toggle */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 cursor-pointer" onClick={() => onPlayToggle(devotional)}>
          <h3 className="font-cinzel text-base sm:text-lg font-bold text-slate-100 hover:text-amber-300 transition-colors leading-snug">
            {devotional.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span className="font-medium text-amber-200/80">{devotional.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {formatMinutes(devotional.durationSeconds)}
            </span>
          </p>
        </div>

        {/* Circular Play Button */}
        <button
          onClick={() => onPlayToggle(devotional)}
          className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-md ${
            isPlaying && isCurrentAudio
              ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 scale-105'
              : 'bg-slate-800 text-amber-400 hover:bg-amber-500 hover:text-slate-950 border border-slate-700 hover:border-amber-400'
          }`}
          aria-label={isPlaying && isCurrentAudio ? 'Pausar áudio' : 'Reproduzir áudio'}
        >
          {isPlaying && isCurrentAudio ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>
      </div>

      {/* Scripture Verse Quote */}
      <blockquote className="font-scripture text-xs sm:text-sm italic text-amber-100/90 bg-amber-950/15 border-l-2 border-amber-500/80 pl-3 py-1.5 mb-3 rounded-r">
        "{devotional.verseText}"
      </blockquote>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {devotional.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-medium text-slate-400 bg-slate-800/80 hover:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700/50"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Collapsible Full Reflection & Prayer */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-3 animate-in fade-in duration-200">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Reflexão Bíblica Completa
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {devotional.reflectionText}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-amber-900/30">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Oração do Dia
            </h4>
            <p className="font-scripture italic text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              "{devotional.prayerText}"
            </p>
          </div>
        </div>
      )}

      {/* Footer Actions: Expand, Like, Share */}
      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-800/60 text-xs">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-slate-400 hover:text-amber-300 font-medium transition-colors"
        >
          <span>{isExpanded ? 'Recolher reflexão' : 'Ler reflexão'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center gap-2">
          {/* Like Button */}
          <button
            onClick={() => onLike(devotional.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-all active:scale-90 ${
              isLiked
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-slate-800/70 text-slate-300 hover:text-rose-400 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
            />
            <span>{devotional.likesCount}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => onShare(devotional)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 font-medium transition-all active:scale-95"
            title="Compartilhar"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Compartilhar</span>
          </button>
        </div>
      </div>
    </article>
  );
};
