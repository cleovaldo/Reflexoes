import React, { useState } from 'react';
import { X, Play, Pause, RotateCcw, RotateCw, Heart, Share2, Sparkles, BookOpen, Volume2, Cloud, Download } from 'lucide-react';
import { Devotional } from '../types';

interface FullScreenPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  devotional: Devotional;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayToggle: () => void;
  onSeek: (seconds: number) => void;
  onLike: (id: string) => void;
  onShare: (devotional: Devotional) => void;
  isLiked: boolean;
  onPlaybackRateChange: (rate: number) => void;
  playbackRate: number;
}

export const FullScreenPlayerModal: React.FC<FullScreenPlayerModalProps> = ({
  isOpen,
  onClose,
  devotional,
  isPlaying,
  currentTime,
  duration,
  onPlayToggle,
  onSeek,
  onLike,
  onShare,
  isLiked,
  onPlaybackRateChange,
  playbackRate
}) => {
  const [activeTab, setActiveTab] = useState<'player' | 'text' | 'prayer'>('player');

  if (!isOpen) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];

  const cycleSpeed = () => {
    const currentIndex = speeds.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    onPlaybackRateChange(speeds[nextIndex]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0d14]/95 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header */}
      <div className="p-4 sm:p-6 flex items-center justify-between border-b border-slate-800/60 max-w-xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs uppercase font-cinzel font-bold tracking-widest text-amber-300">
            Devocional em Áudio
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-750 flex items-center justify-center text-slate-300 hover:text-white transition-colors active:scale-95"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-xl mx-auto w-full px-5 py-4 flex flex-col items-center justify-center">
        {/* Navigation Sub-Tabs: Tocador / Texto / Oração */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('player')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'player'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tocador
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'text'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Reflexão
          </button>
          <button
            onClick={() => setActiveTab('prayer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'prayer'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Oração
          </button>
        </div>

        {activeTab === 'player' && (
          <div className="w-full flex flex-col items-center">
            {/* Devotional Artwork */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border-2 border-amber-500/30 mb-6">
              <img
                src={devotional.coverImage || '/billy-graham.jpg'}
                alt={devotional.title}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <span className="font-cinzel text-xs font-bold text-amber-300 bg-black/60 px-2.5 py-1 rounded-full border border-amber-400/30">
                  {devotional.passageRef}
                </span>
              </div>
            </div>

            {/* Title & Author */}
            <div className="text-center w-full mb-6">
              <h2 className="font-cinzel text-lg sm:text-xl font-bold text-slate-100 mb-1.5 leading-tight">
                {devotional.title}
              </h2>
              <p className="text-xs sm:text-sm text-amber-200/80 font-medium">
                {devotional.author} • {devotional.formattedDate}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Cloud className="w-3.5 h-3.5" />
                  Streaming Otimizado (Opus CDN)
                </span>
              </div>
            </div>

            {/* Scripture snippet */}
            <div className="w-full font-scripture text-center text-sm italic text-amber-100/90 bg-slate-900/60 border border-amber-900/30 p-3 rounded-xl mb-6">
              "{devotional.verseText}"
            </div>

            {/* Scrubber / Progress Bar */}
            <div className="w-full mb-4">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mt-1.5">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 w-full mb-6">
              {/* Speed button */}
              <button
                onClick={cycleSpeed}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-bold text-amber-300 hover:bg-slate-700 transition-colors"
                title="Velocidade de reprodução"
              >
                {playbackRate}x
              </button>

              {/* Rewind 15s */}
              <button
                onClick={() => onSeek(Math.max(0, currentTime - 15))}
                className="p-3 text-slate-300 hover:text-white active:scale-90 transition-transform"
                title="Voltar 15 segundos"
              >
                <RotateCcw className="w-6 h-6" />
              </button>

              {/* Main Play/Pause */}
              <button
                onClick={onPlayToggle}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/40 active:scale-95 transition-all"
                aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 fill-current" />
                ) : (
                  <Play className="w-8 h-8 fill-current ml-1" />
                )}
              </button>

              {/* Forward 15s */}
              <button
                onClick={() => onSeek(Math.min(duration, currentTime + 15))}
                className="p-3 text-slate-300 hover:text-white active:scale-90 transition-transform"
                title="Avançar 15 segundos"
              >
                <RotateCw className="w-6 h-6" />
              </button>

              {/* Like */}
              <button
                onClick={() => onLike(devotional.id)}
                className={`p-3 rounded-full transition-transform active:scale-90 ${
                  isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'
                }`}
                title="Curtir devocional"
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="w-full bg-slate-900/80 border border-slate-800 p-5 rounded-2xl max-h-[60vh] overflow-y-auto space-y-4 text-left">
            <div>
              <span className="font-cinzel text-xs font-bold text-amber-400 uppercase tracking-wider">
                Passagem Sagrada
              </span>
              <h3 className="font-cinzel text-lg font-bold text-slate-100 mt-1">
                {devotional.passageRef}
              </h3>
              <blockquote className="font-scripture text-base italic text-amber-200/90 border-l-2 border-amber-500 pl-3 py-1 mt-2">
                "{devotional.verseText}"
              </blockquote>
            </div>

            <div>
              <span className="font-cinzel text-xs font-bold text-amber-400 uppercase tracking-wider">
                Reflexão Diária
              </span>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed mt-2">
                {devotional.reflectionText}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'prayer' && (
          <div className="w-full bg-slate-900/80 border border-slate-800 p-6 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-amber-300">
              Oração para o Seu Dia
            </h3>
            <p className="font-scripture italic text-base sm:text-lg text-slate-100 leading-relaxed">
              "{devotional.prayerText}"
            </p>
            <p className="text-xs text-slate-400">
              Diga com fé: <strong className="text-amber-300">Amém!</strong>
            </p>
          </div>
        )}
      </div>

      {/* Bottom Share Bar */}
      <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/80 max-w-xl mx-auto w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onLike(devotional.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold ${
              isLiked ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{devotional.likesCount} Curtidas</span>
          </button>
        </div>

        <button
          onClick={() => onShare(devotional)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 active:scale-98 transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span>Compartilhar Devocional</span>
        </button>
      </div>
    </div>
  );
};
