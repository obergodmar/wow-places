export function validateVolume(volume = 1): number {
    if (!Number.isFinite(volume) || volume < 0 || volume > 1) {
        throw new RangeError('Volume must be a finite number between 0 and 1');
    }
    return volume;
}

export default class Sound {
    public readonly audio: HTMLAudioElement;
    private volume: number;

    constructor(file: string, volume = 1) {
        this.volume = validateVolume(volume);
        this.audio = new Audio(file);
        this.audio.preload = 'none';
        this.audio.volume = this.volume;
    }
    public setVolume = (volume: number): Sound => {
        this.volume = validateVolume(volume);
        this.audio.volume = this.volume;
        return this;
    };
    public playSound = (volume = this.volume): void => {
        this.audio.volume = validateVolume(volume);
        // play() waits for loading; readyState=0 is normal with lazy media.
        void this.audio.play().catch(() => {
            /* Autoplay may require a user gesture. */
        });
    };
    public playMusic = (volume = this.volume): void => this.playSound(volume);
    public pause = (): void => this.audio.pause();
    public dispose = (): void => {
        this.audio.onplay = null;
        this.audio.onended = null;
        this.audio.onpause = null;
        this.audio.pause();
        this.audio.removeAttribute('src');
        this.audio.load();
    };
}
