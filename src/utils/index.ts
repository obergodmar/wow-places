import Sound from '../modules/sound';
export * from './constants';
export * from './types';
export { bootstrapSettings } from './bootstrap-settings';
export const soundLoad = (file: string, volume: number): Sound => new Sound(file, volume);
export const randomNumber = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min)) + min;
export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, ms: number) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const debounced = (...args: Args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
    debounced.cancel = () => clearTimeout(timer);
    return debounced;
}
