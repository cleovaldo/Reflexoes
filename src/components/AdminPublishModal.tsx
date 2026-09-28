import React, { useState, useRef } from 'react';
import { X, Mic, Upload, Square, Play, Pause, Cloud, GitBranch, Check, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { Devotional } from '../types';
import { cloudStorageOptimizer } from '../utils/cloudStorage';
import { githubSyncManager } from '../utils/githubSync';
import confetti from 'canvas-confetti';

interface AdminPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (newDevotional: Devotional) => void;
}

export const AdminPublishModal: React.FC<AdminPublishModalProps> = ({
  isOpen,
  onClose,
  onPublish
}) => {
  const [audioSource, setAudioSource] = useState<'record' | 'upload'>('record');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewPlaying, setPreviewPlaying] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [passageRef, setPassageRef] = useState('');
  const [verseText, setVerseText] = useState('');
  const [reflectionText, setReflectionText] = useState('');
  const [prayerText, setPrayerText] = useState('');
  const [author, setAuthor] = useState('Pastor Cleovaldo');
  const [authorRole, setAuthorRole] = useState('Voz Pastoral & Reflexão Bíblica');
  const [tagsInput, setTagsInput] = useState('Fé, Esperança, Paz');

  // Cloud & GitHub Pipeline Status
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingStep, setPublishingStep] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  if (!isOpen) return null;

  // Start Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : undefined
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Não foi possível acessar o microfone. Verifique as permissões do seu navegador.');
    }
  };

  // Stop Voice Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setRecordedAudioUrl(url);
    }
  };

  const toggleAudioPreview = () => {
    if (!recordedAudioUrl) return;
    if (!audioPreviewRef.current) {
      audioPreviewRef.current = new Audio(recordedAudioUrl);
      audioPreviewRef.current.onended = () => setPreviewPlaying(false);
    }

    if (previewPlaying) {
      audioPreviewRef.current.pause();
      setPreviewPlaying(false);
    } else {
      audioPreviewRef.current.play();
      setPreviewPlaying(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !passageRef || !verseText) {
      alert('Por favor, preencha o Título, a Passagem Bíblica e o Versículo.');
      return;
    }

    const audioToUpload = recordedAudioBlob || uploadedFile;
    if (!audioToUpload && !recordedAudioUrl) {
      alert('Por favor, grave ou selecione um arquivo de áudio.');
      return;
    }

    setIsPublishing(true);
    setPublishingStep('Iniciando processamento de áudio...');

    try {
      // 1. Optimize audio and upload to Cloud Storage API
      const fakeOrRealBlob = audioToUpload || new Blob(['mock audio'], { type: 'audio/webm' });
      const cleanFileName = `audio-${Date.now()}-${passageRef.replace(/[^a-zA-Z0-9]/g, '_')}`;

      const optimizationResult = await cloudStorageOptimizer.optimizeAndUpload(
        fakeOrRealBlob,
        cleanFileName,
        (progress, step) => {
          setUploadProgress(progress);
          setPublishingStep(step);
        }
      );

      // 2. Commit and deploy to GitHub Version Control
      setPublishingStep('Criando Git Commit e disparando workflow de Deploy Contínuo no GitHub Actions...');
      const dateStr = new Date().toISOString().split('T')[0];
      const commit = await githubSyncManager.commitAndDeployDevotional({
        devotionalTitle: title,
        audioFileName: `audio/${dateStr}-${cleanFileName}.opus`,
        date: dateStr,
        passageRef: passageRef,
        cloudUrl: optimizationResult.cloudUrl
      });

      // 3. Assemble new devotional object
      const newDevotional: Devotional = {
        id: `dev-${Date.now()}`,
        title,
        date: dateStr,
        formattedDate: 'Hoje, ' + new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' }).format(new Date()),
        passageRef,
        verseText,
        author,
        authorRole,
        authorAvatar: author.includes('Billy Graham') ? '/billy-graham-avatar.jpg' : undefined,
        durationSeconds: recordingSeconds > 0 ? recordingSeconds : 180,
        audioUrl: recordedAudioUrl || optimizationResult.cloudUrl,
        audioSizeFormatted: cloudStorageOptimizer.formatBytes(optimizationResult.optimizedSizeBytes),
        audioFormat: 'opus',
        optimizedViaCloud: true,
        cloudCdnUrl: optimizationResult.cloudUrl,
        compressionRatio: `-${optimizationResult.savingsPercentage}% via Cloud CDN`,
        githubCommitHash: commit.shortHash,
        reflectionText: reflectionText || 'Uma mensagem diária de reflexão e edificação espiritual.',
        prayerText: prayerText || 'Senhor, guia meus passos e abençoa o meu dia. Amém.',
        tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
        likesCount: 1,
        sharesCount: 0,
        listensCount: 1,
        isBillyGrahamSpecial: author.includes('Billy Graham'),
        coverImage: author.includes('Billy Graham') ? '/billy-graham.jpg' : 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80'
      };

      onPublish(newDevotional);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      onClose();
    } catch (err) {
      alert('Erro ao enviar áudio. Tente novamente.');
    } finally {
      setIsPublishing(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-amber-900/40 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-slate-100">
                Estúdio de Gravação e Envio
              </h3>
              <p className="text-xs text-slate-400">
                Envio diário • Otimização Cloud CDN • Git Deploy
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Audio Input Selector: Record vs Upload */}
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <button
                type="button"
                onClick={() => setAudioSource('record')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                  audioSource === 'record'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>Gravar com Microfone</span>
              </button>
              <button
                type="button"
                onClick={() => setAudioSource('upload')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                  audioSource === 'upload'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Fazer Upload (MP3/WAV)</span>
              </button>
            </div>

            {audioSource === 'record' ? (
              <div className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-800 rounded-lg bg-slate-900/40">
                {isRecording ? (
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto animate-pulse">
                      <span className="w-6 h-6 rounded-full bg-rose-500 animate-ping" />
                    </div>
                    <div className="font-mono text-xl font-bold text-rose-400">
                      {formatSeconds(recordingSeconds)}
                    </div>
                    <p className="text-xs text-slate-400">
                      Gravando áudio da reflexão bíblica...
                    </p>
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 mx-auto"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      <span>Concluir Gravação</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <button
                      type="button"
                      onClick={startRecording}
                      className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 active:scale-95 transition-all mx-auto"
                    >
                      <Mic className="w-6 h-6" />
                    </button>
                    <p className="text-xs font-medium text-slate-300">
                      {recordedAudioUrl ? 'Gravar Novamente' : 'Clique para Iniciar a Gravação'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Grave a leitura da passagem e a reflexão pastoral
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-800 rounded-lg bg-slate-900/40 text-center">
                <input
                  type="file"
                  accept="audio/*"
                  id="audio-file-input"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="audio-file-input"
                  className="cursor-pointer flex flex-col items-center gap-1.5"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-amber-300 hover:underline">
                    {uploadedFile ? uploadedFile.name : 'Selecionar arquivo de áudio'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Compatível com MP3, WAV, M4A, OGG, WebM
                  </span>
                </label>
              </div>
            )}

            {/* Audio Preview if available */}
            {recordedAudioUrl && !isRecording && (
              <div className="mt-3 p-2.5 bg-slate-900 rounded-lg flex items-center justify-between border border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleAudioPreview}
                    className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center"
                  >
                    {previewPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">
                      {uploadedFile ? uploadedFile.name : 'Áudio gravado com sucesso'}
                    </p>
                    <p className="text-[10px] text-emerald-400 font-mono">
                      Pronto para transcodificação Opus
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Devotional Metadata Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Título do Devocional
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: A Fidelidade de Deus nos Desertos da Vida"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Referência Bíblica
                </label>
                <input
                  type="text"
                  value={passageRef}
                  onChange={(e) => setPassageRef(e.target.value)}
                  placeholder="Ex: Salmos 23:1-3 ou João 14:27"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Pregador / Autor
                </label>
                <select
                  value={author}
                  onChange={(e) => {
                    setAuthor(e.target.value);
                    if (e.target.value.includes('Billy Graham')) {
                      setAuthorRole('Evangelista & Pregador da Palavra');
                    } else {
                      setAuthorRole('Voz Pastoral & Reflexão Bíblica');
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Pastor Cleovaldo">Pastor Cleovaldo (Você)</option>
                  <option value="Pastor Billy Graham">Pastor Billy Graham (Especial)</option>
                  <option value="Equipe Pastoral Palavra Viva">Equipe Pastoral Palavra Viva</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Texto do Versículo
              </label>
              <textarea
                value={verseText}
                onChange={(e) => setVerseText(e.target.value)}
                placeholder="Insira o texto das Sagradas Escrituras..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Reflexão Diária (Texto de Apoio)
              </label>
              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Compartilhe a meditação prática para abençoar os ouvintes hoje..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Oração do Dia
              </label>
              <input
                type="text"
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
                placeholder="Ex: Pai Celestial, concede-nos sabedoria e serenidade. Amém."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Tags / Categorias (separadas por vírgula)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Fé, Consolo, Gratidão, Promessas"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Cloud Storage & GitHub CI/CD Info Notice */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Cloud className="w-3.5 h-3.5" />
              <span>Otimização Cloud Storage API ativa:</span>
            </div>
            <p>
              O áudio será automaticamente compactado com codec Opus/WebM a 64kbps (economia de até 70% de dados) para streaming instantâneo sem travamentos em conexões 3G/4G/5G.
            </p>
            <div className="flex items-center gap-1.5 text-sky-400 font-semibold pt-1">
              <GitBranch className="w-3.5 h-3.5" />
              <span>Controle de Versão GitHub:</span>
            </div>
            <p>
              Um commit automático e disparador de deploy contínuo (CI/CD) será criado no repositório.
            </p>
          </div>

          {/* Publishing Progress State */}
          {isPublishing && (
            <div className="p-3.5 bg-amber-950/20 border border-amber-500/40 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {publishingStep}
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPublishing}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 active:scale-98 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isPublishing ? 'Processando e Publicando...' : 'Publicar Devocional Diário'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
