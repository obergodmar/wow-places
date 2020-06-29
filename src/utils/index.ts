import { LOADING_DURATION } from './constants'
import Sound from '../modules/sound'

export {
	PREVIEW_WIDTH,
	PREVIEW_HEIGHT,
	UI_MUSIC_VOLUME,
	UI_SOUND_VOLUME,
	LOADING_DURATION,
	ANIMATION_DURATION
} from './constants'

export const delay = () => new Promise(resolve => setTimeout(resolve, LOADING_DURATION))

export const soundLoad = (soundFile: string, soundVolume: number) => (
	new Sound(soundFile, soundVolume)
)

export const randomNumber = (min: number, max: number) => (
	Math.floor(Math.random() * (max - min)) + min
)

export const debounce = (fn: () => any, ms: number) => {
	let timer: NodeJS.Timeout | null
	return () => {
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(() => {
			timer = null
			fn()
		}, ms)
	}
}
