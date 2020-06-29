import { useEffect, useMemo } from 'react'
import { randomNumber, soundLoad, UI_MUSIC_VOLUME } from '../../utils'
import Sound from '../../modules/sound'

interface Props {
	music: string[]
	setPlaying: (value: boolean) => void
	setCurrentPlaying: (value: Sound | undefined) => void
}

export const MusicComponent = ({ music, setPlaying, setCurrentPlaying }: Props) => {
	const musicArray = useMemo(() => (
		music.map(sound => soundLoad(sound, UI_MUSIC_VOLUME))
	), [music])

	useEffect(() => {
		musicArray.forEach(sound => {
			sound.audio.onplay = () => {
				setPlaying(true)
				setCurrentPlaying(sound)
			}
			sound.audio.onended = () => {
				musicArray[randomNumber(0, musicArray.length)].playMusic()
			}
		})
		setCurrentPlaying(musicArray[randomNumber(0, musicArray.length)])

		return () => {
			musicArray.forEach(({ audio }) => {
				audio.onplay = null
				audio.onended = null
				audio.pause()
				audio.currentTime = 0
			})
			setCurrentPlaying(undefined)
		}
	}, [musicArray, setPlaying, setCurrentPlaying])

	return null
}

MusicComponent.displayName = 'MusicComponent'
