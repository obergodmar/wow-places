import * as React from 'react'
import { KeyboardEvent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Sound from '../modules/sound'

import { PanelComponent, PreviewComponent, SettingsComponent, ViewComponent } from '../components'
import places from '../assets'
import { delay, UI_MUSIC_VOLUME, UI_SOUND_VOLUME } from '../utils'
import { useSettings } from '../hooks'

import PanelOpenAudio from '../assets/audio/sound/panel-open.ogg'
import PanelCloseAudio from '../assets/audio/sound/panel-close.ogg'

import SettingsOpenAudio from '../assets/audio/sound/menu-open.ogg'
import SettingsCloseAudio from '../assets/audio/sound/menu-close.ogg'

import CheckBoxOnAudio from '../assets/audio/sound/check-box-on.ogg'
import CheckBoxOffAudio from '../assets/audio/sound/check-box-off.ogg'

import StormwindParkMusic1 from '../assets/audio/music/stormwind-park-music-1.mp3'
import StormwindParkMusic2 from '../assets/audio/music/stormwind-park-music-2.mp3'

import './style.scss'

export default function App() {
    const {settings} = useSettings()
    const [isSettingsShown, setSettingsShown] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [isPlaying, setPlaying] = useState(false)
    const [isLeftPanelShown, setLeftPanelShown] = useState(false)
    const [isBottomPanelShown, setBottomPanelShown] = useState(false)
    const [activePlace, setActivePlace] = useState(0)
    const [activeView, setActiveView] = useState(0)

    const soundLoad = (soundFile: string, soundVolume: number) => {
        const sound = new Sound(soundFile)
        sound.setVolume(soundVolume)
        return sound
    }

    const panelOpenSound = useMemo(() => soundLoad(PanelOpenAudio, UI_SOUND_VOLUME), [])
    const panelCloseSound = useMemo(() => soundLoad(PanelCloseAudio, UI_SOUND_VOLUME), [])
    const settingsOpenSound = useMemo(() => soundLoad(SettingsOpenAudio, UI_SOUND_VOLUME), [])
    const settingsCloseSound = useMemo(() => soundLoad(SettingsCloseAudio, UI_SOUND_VOLUME), [])
    const checkboxOnSound = useMemo(() => soundLoad(CheckBoxOnAudio, UI_SOUND_VOLUME), [])
    const checkboxOffSound = useMemo(() => soundLoad(CheckBoxOffAudio, UI_SOUND_VOLUME), [])

    const StormwindMusic1 = useMemo(() => soundLoad(StormwindParkMusic1, UI_MUSIC_VOLUME), [])
    const StormwindMusic2 = useMemo(() => soundLoad(StormwindParkMusic2, UI_MUSIC_VOLUME), [])
    const [currentPlaying, setCurrentPlaying] = useState(StormwindMusic1)

    const app = useRef<HTMLDivElement>(null)

    const handleHideLeftPanel = useCallback(() => {
        setBottomPanelShown(false)
        setLeftPanelShown(!isLeftPanelShown)
    }, [isLeftPanelShown])

    const handleHideBottomPanel = useCallback(() => {
        setLeftPanelShown(false)
        setBottomPanelShown(!isBottomPanelShown)
    }, [isBottomPanelShown])

    const handleLeftPreviewClick = useCallback((value: number) => {
        setActivePlace(value)
    }, [])

    const handleBottomPreviewClick = (value: number) => {
        if (isLoading) {
            return
        }
        setActiveView(value)
        setLoading(true)
        delay().then(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        if (app && app.current) {
            app.current.focus()
        }
    }, [app])

    useLayoutEffect(() => {
        document.title = settings.language['place.stormwind-park']
    }, [settings.language])

    useEffect(() => {
        StormwindMusic1.audio.onplay = () => {
            setCurrentPlaying(StormwindMusic1)
            setPlaying(true)
        }
        StormwindMusic2.audio.onplay = () => {
            setCurrentPlaying(StormwindMusic2)
            setPlaying(true)
        }
        StormwindMusic1.audio.onended = () => {
            StormwindMusic2.playMusic()
        }
        StormwindMusic2.audio.onended = () => {
            StormwindMusic1.playMusic()
        }
        return () => {
            StormwindMusic1.audio.onplay = null
            StormwindMusic2.audio.onplay = null
            StormwindMusic1.audio.onended = null
            StormwindMusic2.audio.onended = null
        }
    }, [StormwindMusic1, StormwindMusic2])

    const appClick = () => currentPlaying.playMusic()

    const openCloseSettings = () => {
        setSettingsShown(!isSettingsShown)
        if (app && app.current) {
            app.current.focus()
        }
        if (!settings.uiSound) {
            return
        }
        if (isSettingsShown) {
            settingsCloseSound.playSound()
        } else {
            settingsOpenSound.playSound()
        }
    }

    const handleOpenSettings = (e: KeyboardEvent) => {
        switch (e.keyCode) {
            case 27:
                if (isLeftPanelShown || isBottomPanelShown) {
                    setLeftPanelShown(false)
                    setBottomPanelShown(false)
                    break
                }
                openCloseSettings()
                break
            case 32:
                if (isPlaying) {
                    currentPlaying.pause()
                    setPlaying(false)
                } else {
                    currentPlaying.playMusic()
                }
        }
    }

    return (
            <div
                    ref={app}
                    onClick={appClick}
                    onKeyDown={handleOpenSettings}
                    tabIndex={0}
                    className='main'
            >
                <ViewComponent src={places[activePlace].view[activeView]}/>
                <PanelComponent
                        openSoundPlay={panelOpenSound.playSound}
                        closeSoundPlay={panelCloseSound.playSound}
                        itemsCount={places.length || 0}
                        orientation='left'
                        isShown={isLeftPanelShown}
                        setShown={handleHideLeftPanel}
                >
                    {places.map((place, index) => (
                            <PreviewComponent
                                    isLoading={isLoading}
                                    key={index}
                                    value={index}
                                    handleChange={handleLeftPreviewClick}
                                    src={place.preview[0]}
                            />
                    ))}
                </PanelComponent>
                <PanelComponent
                        openSoundPlay={panelOpenSound.playSound}
                        closeSoundPlay={panelCloseSound.playSound}
                        itemsCount={places[activePlace].preview.length || 0}
                        orientation='bottom'
                        isShown={isBottomPanelShown}
                        setShown={handleHideBottomPanel}
                >
                    {places[activePlace].preview.map((preview, index) => (
                            <PreviewComponent
                                    isLoading={isLoading}
                                    key={index}
                                    value={index}
                                    handleChange={handleBottomPreviewClick}
                                    src={preview}
                            />
                    ))}
                </PanelComponent>
                {isSettingsShown && (
                        <SettingsComponent
                                closeSettings={openCloseSettings}
                                checkboxOnSoundPlay={checkboxOnSound.playSound}
                                checkboxOffSoundPlay={checkboxOffSound.playSound}
                        />
                )
                }
            </div>
    )
}

App.displayName = 'App'
