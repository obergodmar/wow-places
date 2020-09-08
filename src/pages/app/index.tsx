import * as React from 'react';
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';

import {
    MainMenuComponent,
    MenuItemComponent,
    MusicComponent,
    PanelComponent,
    PreviewComponent,
    SettingsComponent,
    ViewComponent,
} from '../../components';
import places from '../../assets';
import { author, authorUrl, Orientation, version } from '../../utils';
import { usePlaceView, useSettings, useUiSound } from '../../hooks';
import Sound from '../../modules/sound';

import './style.scss';

export const App: React.FC = () => {
    const {
        settings: { uiSound, musicVolume },
    } = useSettings();

    const [isSettingsShown, setSettingsShown] = useState(false);
    const [isPlaying, setPlaying] = useState(false);

    const {
        panelOpenSound,
        panelCloseSound,
        settingsOpenSound,
        settingsCloseSound,
        checkboxOnSound,
        checkboxOffSound,
    } = useUiSound();

    const [currentPlaying, setCurrentPlaying] = useState<Sound>();
    const {
        isLoading,
        activePlace,
        activeView,
        closePanels,
        hideBottomPanel,
        hideLeftPanel,
        isBottomPanelShown,
        isLeftPanelShown,
        onBottomPanelClick,
        onLeftPanelClick,
    } = usePlaceView({ panelOpenSound, panelCloseSound });

    const app = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (app && app.current) {
            app.current.focus();
        }
    }, [app]);

    useEffect(() => {
        if (!currentPlaying) {
            return;
        }
        currentPlaying.setVolume(musicVolume);
        currentPlaying.playMusic();
    }, [currentPlaying, musicVolume]);

    const appClick = useCallback(() => currentPlaying && currentPlaying.playMusic(), [
        currentPlaying,
    ]);

    const openCloseSettings = useCallback(() => {
        setSettingsShown(!isSettingsShown);
        if (app && app.current) {
            app.current.focus();
        }
        if (!uiSound) {
            return;
        }
        if (isSettingsShown) {
            settingsCloseSound.playSound();
        } else {
            settingsOpenSound.playSound();
        }
    }, [app, isSettingsShown, uiSound, settingsCloseSound, settingsOpenSound]);

    const handleOpenSettings = useCallback(
        (e: KeyboardEvent) => {
            switch (e.keyCode) {
                case 27:
                    if (isLeftPanelShown || isBottomPanelShown) {
                        closePanels();
                        break;
                    }
                    openCloseSettings();
                    break;
                case 32:
                    // TODO: ADD STATUS
                    if (!currentPlaying) {
                        return;
                    }
                    if (isPlaying) {
                        currentPlaying.pause();
                        setPlaying(false);
                    } else {
                        currentPlaying.playMusic();
                    }
                    break;
                default:
                    break;
            }
        },
        [
            isLeftPanelShown,
            isBottomPanelShown,
            openCloseSettings,
            currentPlaying,
            isPlaying,
            closePanels,
        ],
    );

    // TODO: author focus scss round
    return (
        <div
            ref={app}
            onClick={appClick}
            onKeyDown={handleOpenSettings}
            tabIndex={0}
            className="main"
        >
            <ViewComponent src={places[activePlace].view[activeView]} />
            <MainMenuComponent>
                <div className="author">
                    <a href={authorUrl}>{author}</a>
                    <span>{version}</span>
                </div>
                <MenuItemComponent isActive={isSettingsShown} handleClick={openCloseSettings} />
            </MainMenuComponent>
            <PanelComponent
                itemsCount={places.length || 0}
                orientation={Orientation.left}
                isShown={isLeftPanelShown}
                setShown={hideLeftPanel}
            >
                {places.map((place, index) => (
                    <PreviewComponent
                        name={`place.${place.name}`}
                        isLoading={isLoading}
                        key={index}
                        value={index}
                        handleChange={onLeftPanelClick}
                        src={place.preview[0]}
                    />
                ))}
            </PanelComponent>
            <PanelComponent
                itemsCount={places[activePlace].preview.length || 0}
                orientation={Orientation.bottom}
                isShown={isBottomPanelShown}
                setShown={hideBottomPanel}
            >
                {places[activePlace].preview.map((preview, index) => (
                    <PreviewComponent
                        isLoading={isLoading}
                        key={index}
                        value={index}
                        handleChange={onBottomPanelClick}
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
            )}
            <MusicComponent
                music={places[activePlace].music}
                setPlaying={setPlaying}
                setCurrentPlaying={setCurrentPlaying}
            />
        </div>
    );
};

App.displayName = 'App';
