import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Sound from '../modules/sound';
import { useSettings } from './use-settings';
import places from '../assets';
import { delay } from '../utils';

type placeViewType = {
    isLoading: boolean;
    activePlace: number;
    activeView: number;
    isLeftPanelShown: boolean;
    isBottomPanelShown: boolean;
    hideLeftPanel: () => void;
    hideBottomPanel: () => void;
    onLeftPanelClick: (value: number) => void;
    onBottomPanelClick: (value: number) => void;
    closePanels: () => void;
};

interface Props {
    panelOpenSound: Sound;
    panelCloseSound: Sound;
}

export const usePlaceView = ({ panelOpenSound, panelCloseSound }: Props): placeViewType => {
    const {
        settings: { language, uiSound },
    } = useSettings();

    const { placeName, viewNumber } = useParams();
    const { currentPlace, currentView } = useMemo(() => {
        let placeIndex = places.findIndex((place) => place.name === placeName);
        placeIndex = placeIndex === -1 ? 0 : placeIndex;
        let viewIndex = Number(viewNumber) || 0;
        viewIndex =
            places[placeIndex].view.length > viewIndex
                ? viewIndex
                : places[placeIndex].view.length - 1;
        return {
            currentPlace: placeIndex,
            currentView: viewIndex,
        };
    }, [placeName, viewNumber]);

    const history = useHistory();

    const [isLoading, setLoading] = useState(false);
    const [isLeftPanelShown, setLeftPanelShown] = useState(false);
    const [isBottomPanelShown, setBottomPanelShown] = useState(false);
    const [activePlace, setActivePlace] = useState(currentPlace);
    const [activeView, setActiveView] = useState(currentView);

    const handleUiSoundPanels = useCallback(
        (isOpponentOpened: boolean, currentPanel: boolean) => {
            if (!uiSound) {
                return;
            }

            if (isOpponentOpened) {
                panelCloseSound.playSound();
            }

            if (currentPanel) {
                panelCloseSound.playSound();
            } else {
                panelOpenSound.playSound();
            }
        },
        [panelCloseSound, panelOpenSound, uiSound],
    );

    const hideLeftPanel = useCallback(() => {
        handleUiSoundPanels(isBottomPanelShown, isLeftPanelShown);
        setBottomPanelShown(false);
        setLeftPanelShown(!isLeftPanelShown);
    }, [handleUiSoundPanels, isBottomPanelShown, isLeftPanelShown]);

    const hideBottomPanel = useCallback(() => {
        handleUiSoundPanels(isLeftPanelShown, isBottomPanelShown);
        setLeftPanelShown(false);
        setBottomPanelShown(!isBottomPanelShown);
    }, [handleUiSoundPanels, isBottomPanelShown, isLeftPanelShown]);

    const delayedChange = useCallback(
        (fn: (value: number) => void, value: number) => {
            if (isLoading) {
                return;
            }
            fn(value);
            setLoading(true);
            delay().then(() => {
                setLoading(false);
            });
        },
        [isLoading],
    );

    const onLeftPanelClick = useCallback(
        (value: number) => {
            delayedChange(setActivePlace, value);
            setActiveView(0);
        },
        [delayedChange],
    );

    const onBottomPanelClick = useCallback(
        (value: number) => {
            delayedChange(setActiveView, value);
        },
        [delayedChange],
    );

    useLayoutEffect(() => {
        history.push(`/${places[activePlace].name}/${activeView}`);
        document.title = language[`place.${places[activePlace].name}` as keyof typeof language];
    }, [activePlace, activeView, language, history]);

    const closePanels = useCallback(() => {
        handleUiSoundPanels(false, isLeftPanelShown || isBottomPanelShown);
        setLeftPanelShown(false);
        setBottomPanelShown(false);
    }, [handleUiSoundPanels, isBottomPanelShown, isLeftPanelShown]);

    return {
        isLoading,
        activePlace,
        activeView,
        isLeftPanelShown,
        isBottomPanelShown,
        hideLeftPanel,
        hideBottomPanel,
        onLeftPanelClick,
        onBottomPanelClick,
        closePanels,
    };
};
