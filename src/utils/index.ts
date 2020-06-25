import { LOADING_DURATION } from './constants'

export {
	PREVIEW_WIDTH,
	PREVIEW_HEIGHT,
	UI_MUSIC_VOLUME,
	UI_SOUND_VOLUME,
	LOADING_DURATION,
	ANIMATION_DURATION
} from './constants'
export const delay = () => new Promise(resolve => setTimeout(resolve, LOADING_DURATION))
