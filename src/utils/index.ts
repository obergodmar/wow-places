import { LOADING_DURATION } from './constants';
import Sound from '../modules/sound';

export * from './constants';

export { bootstrapSettings } from './bootstrap-settings';

export const delay = (): Promise<unknown> =>
    new Promise((resolve) => setTimeout(resolve, LOADING_DURATION));

export const soundLoad = (soundFile: string, soundVolume: number): Sound =>
    new Sound(soundFile, soundVolume);

export const randomNumber = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min)) + min;

// eslint-disable-next-line
export function debounce(fn: (args: any) => unknown, ms: number): any {
    let timer: NodeJS.Timeout;
    return (...args: [unknown]) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => fn.apply(this, args), ms);
    };
}
