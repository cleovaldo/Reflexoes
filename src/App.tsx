import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { BillyGrahamHero } from './components/BillyGrahamHero';
import { DevotionalCard } from './components/DevotionalCard';
import { AudioPlayerBottomBar } from './components/AudioPlayerBottomBar';
import { FullScreenPlayerModal } from './components/FullScreenPlayerModal';
import { ShareModal } from './components/ShareModal';
import { AdminPublishModal } from './components/AdminPublishModal';
import { CloudAndGitHubModal } from './components/CloudAndGitHubModal';
import { BillyGrahamLegacyModal } from './components/BillyGrahamLegacyModal';
import { INITIAL_DEVOTIONALS } from './data/initialDevotionals';
import { Devotional } from './types';
import { audioEngine } from './utils/audioEngine';
import { Search, Sparkles, Filter, Mic, BookOpen, Heart, Radio, Shield, Cloud, GitBranch, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Devotionals State
  const [devotionals, setDevotionals] = useState<Devotional[]>(() => {
    try {
      const saved = localStorage.getItem('palavra_viva_devotionals');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DEVOTIONALS;
  });

  // Likes tracking
  const [likedIds, setLikedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('palavra_viva_user_likes');
      if (saved) return new Set(JSON.parse(saved));
    } catch {}
    return new Set<string>(['dev-today']);
  });

  // Audio Playback State
  const [currentDevotional, setCurrentDevotional] = useState<Devotional | null>(devotionals[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(devotionals[0]?.durationSeconds || 194);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showFullScreen, setShowFullScreen] = useState(false);

  // Modals State
  const [shareTarget, setShareTarget] = useState<Devotional | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showCloudGitHubModal, setShowCloudGitHubModal] = useState(false);
  const [showBillyGrahamModal, setShowBillyGrahamModal] = useState(false);

  // Filter & Search State
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist devotionals and likes
  useEffect(() => {
    try {
      localStorage.setItem('palavra_viva_devotionals', JSON.stringify(devotionals));
    } catch {}
  }, [devotionals]);

  useEffect(() => {
    try {
      localStorage.setItem('palavra_viva_user_likes', JSON.stringify(Array.from(likedIds)));
    } catch {}
  }, [likedIds]);

  // Setup Audio Engine Listeners
  useEffect(() => {
    audioEngine.setCallbacks(
      (state) => {
        setCurrentTime(state.currentTime);
        if (state.duration && !isNaN(state.duration) && isFinite(state.duration)) {
          setDuration(state.duration);
        }
        setIsPlaying(state.isPlaying);
      },
      () => {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    );
  }, []);

  // Handle Play/Pause
  const handlePlayToggle = (devotional: Devotional) => {
    if (currentDevotional?.id === devotional.id) {
      if (isPlaying) {
        audioEngine.pause();
        setIsPlaying(false);
      } else {
        audioEngine.resume();
        setIsPlaying(true);
      }
    } else {
      setCurrentDevotional(devotional);
      setDuration(devotional.durationSeconds || 180);
      setCurrentTime(0);
      setIsPlaying(true);
      audioEngine.playDevotional(
        devotional.audioUrl,
        devotional.durationSeconds,
        `${devotional.passageRef}. ${devotional.verseText}. ${devotional.reflectionText}`
      );
    }
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    audioEngine.seek(seconds);
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    audioEngine.setPlaybackRate(rate);
  };

  // Like Devotional with Sound & Confetti
  const handleLike = (id: string) => {
    const isCurrentlyLiked = likedIds.has(id);
    const newLikes = new Set(likedIds);

    if (isCurrentlyLiked) {
      newLikes.delete(id);
    } else {
      newLikes.add(id);
      audioEngine.playLikeChime();
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.85 },
        colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981']
      });
    }

    setLikedIds(newLikes);

    setDevotionals((prev) =>
      prev.map((dev) => {
        if (dev.id === id) {
          return {
            ...dev,
            likesCount: isCurrentlyLiked ? Math.max(0, dev.likesCount - 1) : dev.likesCount + 1
          };
        }
        return dev;
      })
    );
  };

  // Open Share Modal
  const handleShareClick = (devotional: Devotional) => {
    setShareTarget(devotional);
  };

  const handleShareRegistered = (devotionalId: string) => {
    setDevotionals((prev) =>
      prev.map((dev) => (dev.id === devotionalId ? { ...dev, sharesCount: dev.sharesCount + 1 } : dev))
    );
  };

  // Add newly published devotional from Admin Studio
  const handleAddNewDevotional = (newDevotional: Devotional) => {
    setDevotionals((prev) => [newDevotional, ...prev]);
    setCurrentDevotional(newDevotional);
    handlePlayToggle(newDevotional);
  };

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    tagsSet.add('all');
    tagsSet.add('Billy Graham');
    devotionals.forEach((d) => d.tags.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [devotionals]);

  // Filtered devotionals
  const filteredDevotionals = useMemo(() => {
    return devotionals.filter((d) => {
      // Tag filter
      if (selectedTag === 'Billy Graham') {
        if (!d.author.includes('Billy Graham') && !d.isBillyGrahamSpecial) return false;
      } else if (selectedTag !== 'all' && !d.tags.includes(selectedTag)) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = d.title.toLowerCase().includes(query);
        const matchesPassage = d.passageRef.toLowerCase().includes(query);
        const matchesVerse = d.verseText.toLowerCase().includes(query);
        const matchesAuthor = d.author.toLowerCase().includes(query);
        const matchesTags = d.tags.some((t) => t.toLowerCase().includes(query));
        return matchesTitle || matchesPassage || matchesVerse || matchesAuthor || matchesTags;
      }

      return true;
    });
  }, [devotionals, selectedTag, searchQuery]);

  // Billy Graham Hero Devotional (Today's special or top featured)
  const heroDevotional = useMemo(() => {
    return devotionals.find((d) => d.isBillyGrahamSpecial) || devotionals[0];
  }, [devotionals]);

  return (
    <div className="min-h-screen bg-[#0f141c] text-slate-100 flex flex-col font-sans pb-28 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header with navigation & studio trigger */}
      <Header
        onOpenPublish={() => setShowPublishModal(true)}
        onOpenCloudGitHub={() => setShowCloudGitHubModal(true)}
        onOpenBillyGraham={() => setShowBillyGrahamModal(true)}
        devotionalsCount={devotionals.length}
      />

      {/* Main Container */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 pt-4 sm:pt-6 space-y-6 flex-1">
        {/* Daily Motivation / Scripture Header */}
        <section className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-900/30 flex items-center justify-between gap-3 shadow-lg shadow-black/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-semibold text-amber-200 truncate">
                Reflexões Bíblicas Diárias & Evangelização
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Áudios otimizados via CDN • Curtidas & Compartilhamento 1-clique
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowBillyGrahamModal(true)}
            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/20 transition-all"
          >
            <span>Billy Graham</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>

        {/* Featured Billy Graham Preaching Hero Card */}
        {heroDevotional && (
          <section>
            <BillyGrahamHero
              devotional={heroDevotional}
              isPlaying={isPlaying}
              isCurrentAudio={currentDevotional?.id === heroDevotional.id}
              onPlayToggle={handlePlayToggle}
              onLike={handleLike}
              onShare={handleShareClick}
              onOpenLegacy={() => setShowBillyGrahamModal(true)}
              isLiked={likedIds.has(heroDevotional.id)}
            />
          </section>
        )}

        {/* Search & Topic Filters */}
        <section className="space-y-3 pt-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por versículo, tema (Fé, Paz, Esperança), oração..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Tag Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-all active:scale-95 ${
                  selectedTag === tag
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tag === 'all' ? 'Todos os Áudios' : `#${tag}`}
              </button>
            ))}
          </div>
        </section>

        {/* Devotionals List Feed */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-cinzel text-sm sm:text-base font-bold text-slate-200 flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>Devocionais em Áudio ({filteredDevotionals.length})</span>
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-mono">
                Streaming CDN Opus 64kbps
              </span>
            </div>
          </div>

          {filteredDevotionals.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">
                Nenhum áudio devocional encontrado para esta busca.
              </p>
              <button
                onClick={() => {
                  setSelectedTag('all');
                  setSearchQuery('');
                }}
                className="text-xs text-amber-400 hover:underline font-semibold"
              >
                Ver todos os devocionais
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDevotionals.map((dev) => (
                <DevotionalCard
                  key={dev.id}
                  devotional={dev}
                  isPlaying={isPlaying}
                  isCurrentAudio={currentDevotional?.id === dev.id}
                  onPlayToggle={handlePlayToggle}
                  onLike={handleLike}
                  onShare={handleShareClick}
                  isLiked={likedIds.has(dev.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Quick Author Record Banner for Mobile */}
        <section className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-amber-950/30 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 font-cinzel">
                Grave o Devocional de Amanhã
              </h4>
              <p className="text-xs text-slate-400">
                Envie áudios diariamente com otimização automática e deploy no GitHub
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPublishModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Abrir Estúdio de Áudio
          </button>
        </section>
      </main>

      {/* Sticky Bottom Audio Player Bar */}
      {currentDevotional && (
        <AudioPlayerBottomBar
          devotional={currentDevotional}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onPlayToggle={() => handlePlayToggle(currentDevotional)}
          onSeek={handleSeek}
          onExpand={() => setShowFullScreen(true)}
          onLike={handleLike}
          isLiked={likedIds.has(currentDevotional.id)}
        />
      )}

      {/* Full Screen Immersive Player Modal */}
      {currentDevotional && (
        <FullScreenPlayerModal
          isOpen={showFullScreen}
          onClose={() => setShowFullScreen(false)}
          devotional={currentDevotional}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onPlayToggle={() => handlePlayToggle(currentDevotional)}
          onSeek={handleSeek}
          onLike={handleLike}
          onShare={handleShareClick}
          isLiked={likedIds.has(currentDevotional.id)}
          onPlaybackRateChange={handlePlaybackRateChange}
          playbackRate={playbackRate}
        />
      )}

      {/* 1-Tap Share Sheet Modal */}
      <ShareModal
        isOpen={Boolean(shareTarget)}
        onClose={() => setShareTarget(null)}
        devotional={shareTarget}
        onShareRegistered={handleShareRegistered}
      />

      {/* Daily Audio Recording / Publish Studio Modal */}
      <AdminPublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onPublish={handleAddNewDevotional}
      />

      {/* Cloud Storage API & GitHub CI/CD Modal */}
      <CloudAndGitHubModal
        isOpen={showCloudGitHubModal}
        onClose={() => setShowCloudGitHubModal(false)}
        devotionals={devotionals}
      />

      {/* Pastor Billy Graham Legacy Tribute Modal */}
      <BillyGrahamLegacyModal
        isOpen={showBillyGrahamModal}
        onClose={() => setShowBillyGrahamModal(false)}
        devotionals={devotionals}
        onPlayDevotional={handlePlayToggle}
        onShare={handleShareClick}
      />
    </div>
  );
}
