import * as React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import UIfx from 'uifx'

import { PanelComponent, PreviewComponent, SettingsComponent, ViewComponent } from '../components'
import places from '../assets'
import { delay, UI_SOUND_VOLUME } from '../utils'
import { useSettings } from '../hooks'

import PanelOpenAudio from '../assets/audio/sound/panel-open.ogg'
import PanelCloseAudio from '../assets/audio/sound/panel-close.ogg'

import SettingsOpenAudio from '../assets/audio/sound/menu-open.ogg'
import SettingsCloseAudio from '../assets/audio/sound/menu-close.ogg'

import CheckBoxOnAudio from '../assets/audio/sound/check-box-on.ogg'
import CheckBoxOffAudio from '../assets/audio/sound/check-box-off.ogg'

import './style.scss'

export default function App() {
    const {settings} = useSettings()
    const [isSettingsShown, setSettingsShown] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [isLeftPanelShown, setLeftPanelShown] = useState(false)
    const [isBottomPanelShown, setBottomPanelShown] = useState(false)
    const [activePlace, setActivePlace] = useState(0)
    const [activeView, setActiveView] = useState(0)

    const panelOpenSound = useMemo(() => new UIfx(PanelOpenAudio), [])
    const panelCloseSound = useMemo(() => new UIfx(PanelCloseAudio), [])
    const settingsOpenSound = useMemo(() => new UIfx(SettingsOpenAudio), [])
    const settingsCloseSound = useMemo(() => new UIfx(SettingsCloseAudio), [])
    const checkboxOnSound = useMemo(() => new UIfx(CheckBoxOnAudio), [])
    const checkboxOffSound = useMemo(() => new UIfx(CheckBoxOffAudio), [])

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
        appFocus()
    }, [])

    const appFocus = () => {
        if (app && app.current) {
            app.current.focus()
        }
    }

    const openCloseSettings = () => {
        setSettingsShown(!isSettingsShown)
        appFocus()
        if (!settings.uiSound) {
            return
        }
        if (isSettingsShown) {
            settingsCloseSound.play(UI_SOUND_VOLUME)
        } else {
            settingsOpenSound.play(UI_SOUND_VOLUME)
        }
    }

    const handleOpenSettings = (e: React.KeyboardEvent) => {
        switch (e.keyCode) {
            case 27:
                if (isLeftPanelShown || isBottomPanelShown) {
                    setLeftPanelShown(false)
                    setBottomPanelShown(false)
                    break
                }
                openCloseSettings()
                break
        }
    }

    return (
            <div
                    ref={app}
                    onKeyDown={handleOpenSettings}
                    tabIndex={0}
                    className='main'
            >
                <ViewComponent src={places[activePlace].view[activeView]}/>
                <PanelComponent
                        openSound={panelOpenSound}
                        closeSound={panelCloseSound}
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
                        openSound={panelOpenSound}
                        closeSound={panelCloseSound}
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
                                checkboxOnSound={checkboxOnSound}
                                checkboxOffSound={checkboxOffSound}
                        />
                )
                }
            </div>
    )
}

App.displayName = 'App'
