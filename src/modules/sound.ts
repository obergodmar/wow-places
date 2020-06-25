interface Config {
	volume?: number
}

const name = 'UIAudio'

export default class Sound {
	public audio: HTMLAudioElement
	private volume: number

	constructor(file: string, config?: Config) {
		const validateURI = (fileURI: string) => {
			if (fileURI) {
				return fileURI
			} else {
				throw Error('Requires valid URI path for "file"')
			}
		}

		const volume = this.validateVolume(config && config.volume)

		const appendAudioElement = (fileValue: string) => {
			const hashFn = (str: string) => {
				let hash = 0
				if (str.length === 0) {
					return hash
				}
				for (let i = 0; i < str.length; i++) {
					const char = str.charCodeAt(i)
					hash = (hash << 5) - hash + char
					hash = hash & hash
				}
				return Math.abs(hash)
			}
			const id = `${name}-${hashFn(fileValue)}`
			const audioElement = document.createElement('audio')

			audioElement.id = id
			audioElement.src = file
			audioElement.preload = 'auto'

			document.body.appendChild(audioElement)
			return file
		}

		const audioNode = appendAudioElement(validateURI(file))
		this.audio = new Audio(audioNode)
		this.audio.load()
		this.volume = volume
	}

	public setVolume = (volume: number) => {
		this.validateVolume(volume)
		this.volume = volume

		return this
	}

	public playSound = (volume: number = this.volume) => {
		this.audio.volume = this.validateVolume(volume)
		if (!this.audio.readyState) {
			return
		}
		this.audio.play().catch((error: Error) => console.error(`Error playback: ${error}`))
	}

	public playMusic = (volume: number = this.volume) => {
		this.audio.volume = this.validateVolume(volume)
		if (!this.audio.readyState) {
			return
		}
		this.audio.play().catch((error: Error) => console.error(`Error playback: ${error}`))
	}

	public pause = () => this.audio.pause()

	private validateVolume = (volumeValue: number = 1.0) => {
		if (volumeValue && (volumeValue < 0 || volumeValue > 1)) {
			throw Error('"Volume" must be an number between 0.0 and 1.0')
		}
		return volumeValue
	}
}
