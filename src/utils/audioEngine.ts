// Audio Engine supporting HTML5 Audio, Web Speech Synthesis (PT-BR) narration, and Web Audio harmonic ambient backup

class AudioEngine {
  private audio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private ambientOscillator: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private speechUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeechPlaying = false;
  private updateCallback: ((state: { currentTime: number; duration: number; isPlaying: boolean }) => void) | null = null;
  private endCallback: (() => void) | null = null;
  private mockTimer: number | null = null;
  private currentVirtualTime = 0;
  private virtualDuration = 180;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.preload = 'metadata';

      this.audio.addEventListener('timeupdate', () => {
        if (this.audio && this.updateCallback) {
          this.updateCallback({
            currentTime: this.audio.currentTime,
            duration: this.audio.duration || this.virtualDuration,
            isPlaying: !this.audio.paused
          });
        }
      });

      this.audio.addEventListener('ended', () => {
        this.stop();
        if (this.endCallback) this.endCallback();
      });

      this.audio.addEventListener('error', () => {
        // Fallback to synthetic ambient audio stream if network audio fails
        this.startSyntheticAmbient();
      });
    }
  }

  public setCallbacks(
    onUpdate: (state: { currentTime: number; duration: number; isPlaying: boolean }) => void,
    onEnded: () => void
  ) {
    this.updateCallback = onUpdate;
    this.endCallback = onEnded;
  }

  public playDevotional(audioUrl: string, durationSec: number, narrationText?: string) {
    this.stop();
    this.virtualDuration = durationSec || 180;
    this.currentVirtualTime = 0;

    if (!this.audio) return;

    // Check if browser can play speech synthesis or standard audio
    if (audioUrl && (audioUrl.startsWith('http') || audioUrl.startsWith('blob:') || audioUrl.startsWith('data:'))) {
      this.audio.src = audioUrl;
      const playPromise = this.audio.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If media blocked by CORS or audio decode error, run synthetic voice & ambient audio
          this.startSyntheticNarration(narrationText);
        });
      }
    } else {
      this.startSyntheticNarration(narrationText);
    }
  }

  private startSyntheticNarration(text?: string) {
    this.startSyntheticAmbient();

    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 450));
      utterance.lang = 'pt-BR';
      utterance.rate = 0.95;
      utterance.pitch = 0.95;

      utterance.onend = () => {
        this.stop();
        if (this.endCallback) this.endCallback();
      };

      utterance.onerror = () => {
        // Continue ambient sound
      };

      this.speechUtterance = utterance;
      this.isSpeechPlaying = true;
      window.speechSynthesis.speak(utterance);
    }
  }

  private startSyntheticAmbient() {
    this.initAudioContext();
    this.startMockTimer();
  }

  private initAudioContext() {
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      // Soft warm drone tone at 108Hz (deep soothing sound)
      this.ambientGain = this.audioCtx.createGain();
      this.ambientGain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      this.ambientGain.connect(this.audioCtx.destination);

      this.ambientOscillator = this.audioCtx.createOscillator();
      this.ambientOscillator.type = 'sine';
      this.ambientOscillator.frequency.setValueAtTime(108, this.audioCtx.currentTime);
      this.ambientOscillator.connect(this.ambientGain);
      this.ambientOscillator.start();
    } catch {
      // AudioContext not allowed without gesture
    }
  }

  private startMockTimer() {
    if (this.mockTimer) clearInterval(this.mockTimer);
    this.mockTimer = window.setInterval(() => {
      this.currentVirtualTime += 1;
      if (this.currentVirtualTime >= this.virtualDuration) {
        this.stop();
        if (this.endCallback) this.endCallback();
        return;
      }
      if (this.updateCallback) {
        this.updateCallback({
          currentTime: this.currentVirtualTime,
          duration: this.virtualDuration,
          isPlaying: true
        });
      }
    }, 1000);
  }

  public pause() {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
    if (this.isSpeechPlaying && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    if (this.mockTimer) {
      clearInterval(this.mockTimer);
      this.mockTimer = null;
    }
    if (this.ambientGain && this.audioCtx) {
      this.ambientGain.gain.setValueAtTime(0.0001, this.audioCtx.currentTime);
    }
  }

  public resume() {
    if (this.audio && this.audio.src) {
      this.audio.play().catch(() => {});
    }
    if (this.isSpeechPlaying && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
    if (this.ambientGain && this.audioCtx) {
      this.ambientGain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
    }
    if (!this.audio || this.audio.paused) {
      this.startMockTimer();
    }
  }

  public seek(seconds: number) {
    if (this.audio && isFinite(this.audio.duration) && this.audio.duration > 0) {
      this.audio.currentTime = seconds;
    }
    this.currentVirtualTime = seconds;
    if (this.updateCallback) {
      this.updateCallback({
        currentTime: seconds,
        duration: this.audio?.duration || this.virtualDuration,
        isPlaying: this.audio ? !this.audio.paused : Boolean(this.mockTimer)
      });
    }
  }

  public setPlaybackRate(rate: number) {
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
  }

  public stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeechPlaying = false;

    if (this.mockTimer) {
      clearInterval(this.mockTimer);
      this.mockTimer = null;
    }

    if (this.ambientOscillator) {
      try {
        this.ambientOscillator.stop();
        this.ambientOscillator.disconnect();
      } catch {}
      this.ambientOscillator = null;
    }
  }

  // Play lovely chime for like interaction
  public playLikeChime() {
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.12); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.25); // G5

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {}
  }
}

export const audioEngine = new AudioEngine();
