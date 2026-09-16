/**
 * SacredAudioEngine
 * Procedural Web Audio API sound design for the Digital Sanctuary.
 * Synthesizes harmonic ambient drones, singing bowls, and tactile paper card foley
 * without requiring external .mp3 file downloads.
 * 
 * Strict Compliance: Zero autoplay. Requires explicit user action to resume audio context.
 */

export class SacredAudioEngine {
  private static instance: SacredAudioEngine | null = null;
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private droneGain: GainNode | null = null;
  private droneOscillators: OscillatorNode[] = [];

  private constructor() {}

  public static getInstance(): SacredAudioEngine {
    if (!SacredAudioEngine.instance) {
      SacredAudioEngine.instance = new SacredAudioEngine();
    }
    return SacredAudioEngine.instance;
  }

  /**
   * Initializes or resumes the AudioContext upon explicit user gesture
   */
  public async initContext(): Promise<void> {
    if (typeof window === "undefined") return;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.droneGain && this.ctx) {
      this.droneGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.04, this.ctx.currentTime, 0.5);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Generates a Tibetan Singing Bowl strike with natural exponential overtone decay
   * @param fundamental Base pitch in Hz (Default: 432 Hz Verdi tuning)
   */
  public playSingingBowl(fundamental: number = 432): void {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Partial 1: Fundamental Sine
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(fundamental, now);

    // Exponential Decay (Ring out over 3.5s)
    gain1.gain.setValueAtTime(0.22, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

    // Partial 2: Metallic Overtone (~2.76x frequency)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(fundamental * 2.76, now);

    gain2.gain.setValueAtTime(0.07, now);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 3.6);
    osc2.stop(now + 2.1);
  }

  /**
   * Generates a tactile paper friction card-slide / flip sound
   */
  public playCardSlide(): void {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.08); // 80 milliseconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // White noise buffer
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Bandpass filter to mimic heavy cardstock friction
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(1.8, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.08);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noiseSource.start(now);
  }

  /**
   * Starts a gentle, low-frequency meditative background drone (108Hz / 432Hz)
   */
  public startAmbientDrone(): void {
    if (!this.ctx || this.droneGain) return;

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.ctx.currentTime);
    this.droneGain.connect(this.ctx.destination);

    const frequencies = [108, 162, 216]; // Root, Fifth, Octave
    this.droneOscillators = frequencies.map((freq) => {
      const osc = this.ctx!.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
      osc.connect(this.droneGain!);
      osc.start();
      return osc;
    });
  }
}
