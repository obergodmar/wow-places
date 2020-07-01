import * as React from 'react'
import { KeyboardEvent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import {
    MainMenuComponent,
    MenuItemComponent,
    MusicComponent,
    PanelComponent,
    PreviewComponent,
    SettingsComponent,
    ViewComponent
} from '../components'
import places from '../assets'
import { delay, soundLoad, UI_SOUND_VOLUME } from '../utils'
import { useSettings } from '../hooks'

import PanelOpenAudio from '../assets/audio/panel-open.ogg'
import PanelCloseAudio from '../assets/audio/panel-close.ogg'

import SettingsOpenAudio from '../assets/audio/menu-open.ogg'
import SettingsCloseAudio from '../assets/audio/menu-close.ogg'

import CheckBoxOnAudio from '../assets/audio/check-box-on.ogg'
import CheckBoxOffAudio from '../assets/audio/check-box-off.ogg'

import Sound from '../modules/sound'

import './style.scss'

export default function App() {
    const {settings: {uiSound, musicVolume, language}} = useSettings()
    const [isSettingsShown, setSettingsShown] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [isPlaying, setPlaying] = useState(false)
    const [isLeftPanelShown, setLeftPanelShown] = useState(false)
    const [isBottomPanelShown, setBottomPanelShown] = useState(false)
    const [activePlace, setActivePlace] = useState(0)
    const [activeView, setActiveView] = useState(0)

    const panelOpenSound = useMemo(() => soundLoad(PanelOpenAudio, UI_SOUND_VOLUME), [])
    const panelCloseSound = useMemo(() => soundLoad(PanelCloseAudio, UI_SOUND_VOLUME), [])
    const settingsOpenSound = useMemo(() => soundLoad(SettingsOpenAudio, UI_SOUND_VOLUME), [])
    const settingsCloseSound = useMemo(() => soundLoad(SettingsCloseAudio, UI_SOUND_VOLUME), [])
    const checkboxOnSound = useMemo(() => soundLoad(CheckBoxOnAudio, UI_SOUND_VOLUME), [])
    const checkboxOffSound = useMemo(() => soundLoad(CheckBoxOffAudio, UI_SOUND_VOLUME), [])

    const [currentPlaying, setCurrentPlaying] = useState<Sound>()

    const app = useRef<HTMLDivElement>(null)

    const handleHideLeftPanel = useCallback(() => {
        setBottomPanelShown(false)
        setLeftPanelShown(!isLeftPanelShown)
    }, [isLeftPanelShown])

    const handleHideBottomPanel = useCallback(() => {
        setLeftPanelShown(false)
        setBottomPanelShown(!isBottomPanelShown)
    }, [isBottomPanelShown])

    const delayedChange = useCallback((fn: (value: number) => void, value: number) => {
        if (isLoading) {
            return
        }
        fn(value)
        setLoading(true)
        delay().then(() => {
            setLoading(false)
        })
    }, [isLoading])

    const handleLeftPreviewClick = (value: number) => delayedChange(setActivePlace, value)

    const handleBottomPreviewClick = (value: number) => delayedChange(setActiveView, value)

    useEffect(() => {
        if (app && app.current) {
            app.current.focus()
        }
    }, [app])

    useLayoutEffect(() => {
        document.title = language[`place.${places[activePlace].name}` as keyof typeof language]
    }, [activePlace, language])

    useEffect(() => {
        if (!currentPlaying) {
            return
        }
        currentPlaying.setVolume(musicVolume)
    }, [currentPlaying, musicVolume])

    const appClick = () => currentPlaying && currentPlaying.playMusic()

    const openCloseSettings = () => {
        setSettingsShown(!isSettingsShown)
        if (app && app.current) {
            app.current.focus()
        }
        if (!uiSound) {
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
                if (!currentPlaying) {
                    return
                }
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
                <MainMenuComponent>
                    <div className='author'>
                        <a href="https://github.com/obergodmar">obergodmar</a>
                        <span>v1.2.0</span>
                    </div>
                    <MenuItemComponent
                            isActive={isSettingsShown}
                            handleClick={openCloseSettings}
                    />
                </MainMenuComponent>
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
                                    name={`place.${place.name}`}
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
                <MusicComponent
                        music={places[activePlace].music}
                        setPlaying={setPlaying}
                        setCurrentPlaying={setCurrentPlaying}
                />
            </div>
    )
}

App.displayName = 'App'
