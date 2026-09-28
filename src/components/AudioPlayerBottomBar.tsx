import React from 'react';
import { Play, Pause, Maximize2, SkipForward, SkipBack, Heart } from 'lucide-react';
import { Devotional } from '../types';

interface AudioPlayerBottomBarProps {
  devotional: Devotional;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayToggle: () => void;
  onSeek: (seconds: number) => void;
  onExpand: () => void;
  onLike: (id: string) => void;
  isLiked: boolean;
}

export const AudioPlayerBottomBar: React.FC<AudioPlayerBottomBarProps> = ({
  devotional,
  isPlaying,
  currentTime,
  duration,
  onPlayToggle,
  onSeek,
  onExpand,
  onLike,
  isLiked
}) => {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(newProgress * duration);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f141c]/95 backdrop-blur-xl border-t border-amber-900/30 shadow-[0_-8px_30px_rgba(0,0,0,0.6)]">
      {/* Interactive Progress Line */}
      <div
        className="w-full h-1.5 bg-slate-800/90 cursor-pointer relative group"
        onClick={handleProgressBarClick}
      >
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 relative transition-all"
          style={{ width: `${progressPercent}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-3 py-2.5 sm:px-6 flex items-center justify-between gap-3">
        {/* Track Info (clickable to expand) */}
        <div
          className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
          onClick={onExpand}
        >
          <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900 border border-amber-500/30">
            <img
              src={devotional.coverImage || '/billy-graham-avatar.jpg'}
              alt={devotional.title}
              className="w-full h-full object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5 px-1">
                <span className="w-1 h-3 bg-amber-400 rounded-full animate-wave-bar" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-4 bg-amber-300 rounded-full animate-wave-bar" style={{ animationDelay: '200ms' }} />
                <span className="w-1 h-2 bg-amber-400 rounded-full animate-wave-bar" style={{ animationDelay: '400ms' }} />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-cinzel text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                {devotional.passageRef}
              </span>
              <span className="text-[10px] text-slate-400">•</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <h4 className="font-medium text-xs sm:text-sm text-slate-100 truncate">
              {devotional.title}
            </h4>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-2">
          {/* Like inside mini player */}
          <button
            onClick={() => onLike(devotional.id)}
            className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
            title="Curtir áudio"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={onPlayToggle}
            className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/30 active:scale-95 transition-all"
            aria-label={isPlaying ? 'Pausar' : 'Tocar'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Expand Fullscreen Player */}
          <button
            onClick={onExpand}
            className="p-2 text-slate-400 hover:text-slate-100 transition-colors"
            title="Abrir reprodutor em tela cheia"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
