import React from 'react';
import { X, Play, Share2, Sparkles, BookOpen, Quote, Heart, Award } from 'lucide-react';
import { BILLY_GRAHAM_QUOTES } from '../data/initialDevotionals';
import { Devotional } from '../types';

interface BillyGrahamLegacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  devotionals: Devotional[];
  onPlayDevotional: (devotional: Devotional) => void;
  onShare: (devotional: Devotional) => void;
}

export const BillyGrahamLegacyModal: React.FC<BillyGrahamLegacyModalProps> = ({
  isOpen,
  onClose,
  devotionals,
  onPlayDevotional,
  onShare
}) => {
  if (!isOpen) return null;

  const billyDevotionals = devotionals.filter((d) => d.author.includes('Billy Graham') || d.isBillyGrahamSpecial);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <img
              src="/billy-graham-avatar.jpg"
              alt="Pastor Billy Graham"
              className="w-10 h-10 rounded-full object-cover border-2 border-amber-400/80 shadow-md"
            />
            <div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-amber-200">
                Pastor Billy Graham (1918 – 2018)
              </h3>
              <p className="text-xs text-slate-400">
                O Pregador da Bíblia e o Evangelista do Século XX
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

        {/* Hero Photo Card with open Bible */}
        <div className="mt-4 relative rounded-2xl overflow-hidden border border-amber-500/40 shadow-xl group">
          <img
            src="/billy-graham.jpg"
            alt="Pastor Billy Graham pregando com a Bíblia"
            className="w-full h-56 sm:h-72 object-cover object-top filter grayscale contrast-125 brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="font-cinzel text-[11px] font-bold tracking-widest text-amber-300 uppercase bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded-full">
              Cruzadas Evangelísticas Mundiais
            </span>
            <p className="font-scripture italic text-sm sm:text-base text-slate-100 mt-1.5 leading-snug">
              "A Bíblia diz: Buscai primeiro o Reino de Deus e a Sua justiça, e todas as demais coisas vos serão acrescentadas."
            </p>
          </div>
        </div>

        {/* Biography Summary */}
        <div className="my-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
          <h4 className="font-cinzel font-bold text-amber-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            Um Legado Inabalável de Fé
          </h4>
          <p>
            William Franklin "Billy" Graham Jr. foi um dos maiores evangelistas e pastores da história cristã moderna. Ao longo de mais de seis décadas de ministério, pregou o Evangelho da Cruz a mais de <strong>215 milhões de pessoas</strong> presencialmente em 185 países, além de bilhões através do rádio, televisão e literatura.
          </p>
          <p>
            Sua marca registrada era erguer as Escrituras Sagradas e proclamar com intrepidez e profundo amor: <em>"A Bíblia diz!"</em> (The Bible says!).
          </p>
        </div>

        {/* Memorable Quotes Carousel */}
        <div className="my-4">
          <h4 className="font-cinzel font-bold text-xs uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
            <Quote className="w-3.5 h-3.5" />
            Frases e Pensamentos de Billy Graham
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {BILLY_GRAHAM_QUOTES.map((q, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 hover:border-amber-500/30 transition-all flex flex-col justify-between"
              >
                <p className="font-scripture italic text-xs sm:text-sm text-slate-200 mb-2">
                  "{q.quote}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-amber-400/80 pt-2 border-t border-slate-800/60 font-medium">
                  <span>{q.context}</span>
                  <button
                    onClick={() => {
                      const msg = `🕊️ *Billy Graham:* "${q.quote}" - ${q.context}`;
                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[10px]"
                    title="Compartilhar frase no WhatsApp"
                  >
                    <Share2 className="w-3 h-3" /> WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billy Graham Audio Devotionals Playlist */}
        <div className="mt-4">
          <h4 className="font-cinzel font-bold text-xs uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Mensagens e Devocionais em Áudio do Pastor
          </h4>
          <div className="space-y-2">
            {billyDevotionals.map((dev) => (
              <div
                key={dev.id}
                className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <span className="font-cinzel text-[10px] font-bold text-amber-400">
                    {dev.passageRef}
                  </span>
                  <h5 className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
                    {dev.title}
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    {dev.formattedDate} • {dev.audioSizeFormatted} • Opus CDN
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onPlayDevotional(dev);
                      onClose();
                    }}
                    className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center active:scale-95 transition-all shadow-md shadow-amber-500/20"
                    title="Ouvir Mensagem"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </button>

                  <button
                    onClick={() => onShare(dev)}
                    className="p-2 text-slate-400 hover:text-emerald-400 transition-colors"
                    title="Compartilhar"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-5 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
