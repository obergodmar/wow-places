/* eslint-disable no-console */
export default class Sound {
    public audio: HTMLAudioElement;

    private volume: number;

    constructor(file: string, volumeValue?: number) {
        const volume = this.validateVolume(volumeValue);
        this.audio = new Audio(file);
        this.audio.load();
        this.volume = volume;
    }

    public setVolume = (volume: number): Sound => {
        this.validateVolume(volume);
        this.volume = volume;

        return this;
    };

    public playSound = (volume: number = this.volume): void => {
        this.audio.volume = this.validateVolume(volume);
        if (!this.audio.readyState) {
            return;
        }
        this.audio.play().catch((error: Error) => console.error(`Error playback: ${error}`));
    };

    public playMusic = (volume: number = this.volume): void => {
        this.audio.volume = this.validateVolume(volume);
        if (!this.audio.readyState) {
            return;
        }
        this.audio.play().catch((error: Error) => console.error(`Error playback: ${error}`));
    };

    public pause = (): void => this.audio.pause();

    private validateVolume = (volumeValue = 1.0) => {
        if (volumeValue && (volumeValue < 0 || volumeValue > 1)) {
            throw Error('"Volume" must be an number between 0.0 and 1.0');
        }
        return volumeValue;
    };
}
