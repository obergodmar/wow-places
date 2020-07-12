import { LOADING_DURATION } from './constants'
import Sound from '../modules/sound'

export {
	PREVIEW_WIDTH,
	PREVIEW_HEIGHT,
	UI_MUSIC_VOLUME,
	UI_SOUND_VOLUME,
	LOADING_DURATION,
	ANIMATION_DURATION,
	DEFAULT_HEIGHT,
	DEFAULT_WIDTH,
	SPACE
} from './constants'

export const delay = () => new Promise(resolve => setTimeout(resolve, LOADING_DURATION))

export const soundLoad = (soundFile: string, soundVolume: number) => (
	new Sound(soundFile, soundVolume)
)

export const randomNumber = (min: number, max: number) => (
	Math.floor(Math.random() * (max - min)) + min
)

export function debounce(fn: (args: any) => any, ms: number) {
	let timer: NodeJS.Timeout
	return (...args: any) => {
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(() => fn.apply(this, args), ms)
	}
}
