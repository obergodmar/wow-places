import * as React from 'react';
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';

import {
    DialogModal,
    MainMenuComponent,
    MenuItemComponent,
    MusicComponent,
    PanelComponent,
    PreviewComponent,
    SettingsComponent,
    ViewComponent,
} from '../../components';
import type { Place } from '../../domain/places';
import { author, authorUrl, Orientation } from '../../utils';
import { useDialog, usePlaceView, useSettings, useUiSound } from '../../hooks';
import Sound from '../../modules/sound';

import './style.scss';
import { MenuItems } from '../../components/menu-item-component/menu-item-component';

export const App: React.FC<{ places: Place[] }> = ({ places }) => {
    const {
        settings: { uiSound, musicVolume, language },
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
    } = usePlaceView({ places, panelOpenSound, panelCloseSound });

    const app = useRef<HTMLDivElement>(null);
    const dialogText = [
        language['ui.dialog.welcome.text-1'],
        language['ui.dialog.welcome.text-2'],
        language['ui.dialog.welcome.text-3'],
    ];
    const {
        bottomPanelButtonRef,
        offsetTop,
        handleShowDialog,
        handleHideDialog,
        handleDialogMenuItemClick,
        isDialogShown,
        isDialogMounted,
    } = useDialog({
        isBottomPanelShown,
        stepsCount: dialogText.length,
    });

    useEffect(() => {
        if (app.current) {
            app.current.focus();
        }
        handleShowDialog();
    }, [app, handleShowDialog]);

    useEffect(() => {
        if (!currentPlaying) {
            return;
        }
        currentPlaying.setVolume(musicVolume);
    }, [currentPlaying, musicVolume]);

    useEffect(() => {
        currentPlaying?.playMusic();
    }, [currentPlaying]);

    const appClick = useCallback(() => {
        if (currentPlaying) {
            currentPlaying.playMusic();
        }
    }, [currentPlaying]);

    const openCloseSettings = useCallback(() => {
        if (!isSettingsShown) {
            handleHideDialog();
        }
        setSettingsShown(!isSettingsShown);
        if (app.current) {
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
    }, [app, isSettingsShown, uiSound, settingsCloseSound, settingsOpenSound, handleHideDialog]);

    const handleOpenSettings = useCallback(
        (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    if (isLeftPanelShown || isBottomPanelShown) {
                        closePanels();
                        break;
                    }
                    openCloseSettings();
                    break;
                case ' ':
                    if (e.target !== e.currentTarget) return;
                    e.preventDefault();
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
                    <span>{`v${process.env.NEXT_PUBLIC_APP_VERSION}`}</span>
                </div>
                <MenuItemComponent
                    isActive={isDialogMounted}
                    handleClick={handleDialogMenuItemClick}
                    type={MenuItems.help}
                />
                <MenuItemComponent
                    isActive={isSettingsShown}
                    handleClick={openCloseSettings}
                    type={MenuItems.settings}
                />
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
                        key={place.name}
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
                ref={bottomPanelButtonRef}
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
            {isDialogMounted && (
                <DialogModal
                    title={language['ui.dialog.welcome.title']}
                    text={dialogText}
                    offsetTop={offsetTop}
                    isShown={isDialogShown}
                    onClose={handleHideDialog}
                />
            )}
        </div>
    );
};

App.displayName = 'App';
