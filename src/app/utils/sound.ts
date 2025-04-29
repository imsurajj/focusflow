class SoundService {
  private audioContext: AudioContext | null = null;
  private sounds: {
    [key: string]: AudioBuffer
  } = {};
  private enabled: boolean = true;

  constructor() {
    // Initialize audio context on user interaction
    this.initAudioContext();
  }

  private initAudioContext() {
    if (typeof window !== 'undefined') {
      try {
        window.AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioContext();
      } catch (e) {
        console.error('Web Audio API is not supported in this browser');
      }
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  // Create simple beep sounds programmatically
  private generateTone(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer | null {
    if (!this.audioContext) return null;
    
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      // Sine wave with fade in/out envelope
      let envelope = 1;
      const fadeTime = 0.01; // 10ms fade in/out
      
      if (t < fadeTime) {
        envelope = t / fadeTime; // Fade in
      } else if (t > duration - fadeTime) {
        envelope = (duration - t) / fadeTime; // Fade out
      }
      
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope;
    }
    
    return buffer;
  }

  // Initialize sound effects
  public async initialize() {
    if (!this.audioContext) {
      this.initAudioContext();
      if (!this.audioContext) return;
    }
    
    // Resume audio context if suspended (autoplay policy)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    // Generate notification sounds
    this.sounds['timerComplete'] = this.generateTone(783.99, 0.15, 'sine') || new AudioBuffer({ length: 1, sampleRate: 44100 });
    // C5 note
    this.sounds['shortBreak'] = this.generateTone(523.25, 0.1, 'sine') || new AudioBuffer({ length: 1, sampleRate: 44100 });
    // G5 note
    this.sounds['longBreak'] = this.generateTone(783.99, 0.2, 'sine') || new AudioBuffer({ length: 1, sampleRate: 44100 });
    // E5 note
    this.sounds['buttonClick'] = this.generateTone(659.25, 0.05, 'sine') || new AudioBuffer({ length: 1, sampleRate: 44100 });
  }

  // Play a specific sound
  public play(soundName: 'timerComplete' | 'shortBreak' | 'longBreak' | 'buttonClick') {
    if (!this.enabled || !this.audioContext || !this.sounds[soundName]) return;
    
    // Resume audio context if suspended (autoplay policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = this.sounds[soundName];
    source.connect(this.audioContext.destination);
    source.start();
  }
}

// Singleton instance
export const soundService = new SoundService();

export default soundService; 