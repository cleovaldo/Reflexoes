import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageCircle, Send, Download, Sparkles, BookOpen } from 'lucide-react';
import { Devotional } from '../types';
import confetti from 'canvas-confetti';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  devotional: Devotional | null;
  onShareRegistered?: (devotionalId: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  devotional,
  onShareRegistered
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen || !devotional) return null;

  const appUrl = window.location.origin;
  const shareUrl = `${appUrl}?devotional=${devotional.id}`;

  const formattedShareMessage = `🕊️ *PALAVRA VIVA - Devocional em Áudio*
📖 *Passagem:* ${devotional.passageRef}
"${devotional.verseText}"

✨ *Reflexão:* ${devotional.title}
🎙️ *Por:* ${devotional.author}

Ouça a reflexão completa em áudio aqui:
🔗 ${shareUrl}

Que a graça e a paz de Deus abençoem o seu dia! 🙏`;

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(formattedShareMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    if (onShareRegistered) onShareRegistered(devotional.id);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
  };

  const handleShareTelegram = () => {
    const encoded = encodeURIComponent(formattedShareMessage);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`🕊️ *${devotional.title}* - Devocional Palavra Viva`)}`, '_blank');
    if (onShareRegistered) onShareRegistered(devotional.id);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Palavra Viva: ${devotional.title}`,
          text: `"${devotional.verseText}" - ${devotional.passageRef}\nOuça a reflexão diária em áudio:`,
          url: shareUrl
        });
        if (onShareRegistered) onShareRegistered(devotional.id);
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    if (onShareRegistered) onShareRegistered(devotional.id);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(formattedShareMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
    if (onShareRegistered) onShareRegistered(devotional.id);
  };

  const handleDownloadAudio = () => {
    const a = document.createElement('a');
    a.href = devotional.audioUrl;
    a.download = `${devotional.id}-${devotional.passageRef.replace(/[^a-zA-Z0-9]/g, '_')}.opus`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-amber-900/30 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-cinzel text-base font-bold text-slate-100">
                Compartilhar Devocional
              </h3>
              <p className="text-xs text-slate-400">
                Leve a Palavra de Deus a quem você ama
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Devotional Preview Mini Card */}
        <div className="my-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center gap-3">
          <img
            src={devotional.coverImage || '/billy-graham-avatar.jpg'}
            alt={devotional.title}
            className="w-12 h-12 rounded-lg object-cover border border-amber-500/30"
          />
          <div className="min-w-0 flex-1">
            <span className="font-cinzel text-[11px] font-bold text-amber-400">
              {devotional.passageRef}
            </span>
            <h4 className="text-xs font-semibold text-slate-100 truncate">
              {devotional.title}
            </h4>
            <p className="text-[11px] text-slate-400">
              {devotional.author} • {devotional.audioSizeFormatted}
            </p>
          </div>
        </div>

        {/* 1-Tap Primary WhatsApp Button */}
        <button
          onClick={handleShareWhatsApp}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 active:scale-98 transition-all mb-3"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>Compartilhar no WhatsApp</span>
        </button>

        {/* Native Mobile Share Sheet Button */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-100 font-semibold text-xs sm:text-sm border border-slate-700 active:scale-98 transition-all mb-3"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>Mais Opções (Instagram, Mensagens, Status)</span>
          </button>
        )}

        {/* Secondary Channels Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={handleShareTelegram}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Send className="w-4 h-4 text-sky-400" />
            <span>Telegram</span>
          </button>

          <button
            onClick={handleDownloadAudio}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
            title="Baixar áudio para ouvir offline"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Baixar Áudio</span>
          </button>
        </div>

        {/* Copy Tools */}
        <div className="space-y-2 pt-3 border-t border-slate-800">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-slate-950 text-xs text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            <span className="truncate pr-2 font-mono text-[11px] text-slate-400">
              {shareUrl}
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-semibold flex-shrink-0">
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
            </span>
          </button>

          <button
            onClick={handleCopyText}
            className="w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-slate-950 text-xs text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            <span className="text-[11px] text-slate-400">
              Copiar texto devocional formatado
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold flex-shrink-0">
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <BookOpen className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'Texto Copiado!' : 'Copiar Mensagem'}</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
