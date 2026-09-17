import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type Sound from '../modules/sound';
import { useSettings } from './use-settings';
import { resolvePlace, type Place } from '../domain/places';
import { LOADING_DURATION } from '../utils';

interface Props {
    places: Place[];
    panelOpenSound: Sound;
    panelCloseSound: Sound;
}

export const usePlaceView = ({ places, panelOpenSound, panelCloseSound }: Props) => {
    const {
        settings: { language, uiSound },
    } = useSettings();
    const pathname = usePathname();
    const [, placeName, viewNumber] = pathname.split('/');
    const { activePlace, activeView } = resolvePlace(places, placeName, viewNumber);
    const [isLoading, setLoading] = useState(false);
    const loadingRef = useRef(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isLeftPanelShown, setLeftPanelShown] = useState(false);
    const [isBottomPanelShown, setBottomPanelShown] = useState(false);

    useEffect(
        () => () => {
            if (timer.current) clearTimeout(timer.current);
        },
        [],
    );
    useEffect(() => {
        document.title =
            language[`place.${places[activePlace].name}` as keyof typeof language] ??
            places[activePlace].name;
    }, [activePlace, places, language]);

    const togglePanel = (side: 'left' | 'bottom') => {
        const wasShown = side === 'left' ? isLeftPanelShown : isBottomPanelShown;
        if (uiSound) {
            if (isLeftPanelShown || isBottomPanelShown) panelCloseSound.playSound();
            if (!wasShown) panelOpenSound.playSound();
        }
        setLeftPanelShown(side === 'left' && !wasShown);
        setBottomPanelShown(side === 'bottom' && !wasShown);
    };
    const navigate = useCallback(
        (place: number, view: number) => {
            if (loadingRef.current || !places[place]?.view[view]) return;
            const nextPath = `/${places[place].name}/${view}`;
            if (nextPath === pathname) return;
            loadingRef.current = true;
            setLoading(true);
            // Next integrates native history with usePathname; no server roundtrip for a view change.
            window.history.pushState(null, '', nextPath);
            timer.current = setTimeout(() => {
                loadingRef.current = false;
                setLoading(false);
            }, LOADING_DURATION);
        },
        [pathname, places],
    );
    const closePanels = () => {
        if (uiSound && (isLeftPanelShown || isBottomPanelShown)) panelCloseSound.playSound();
        setLeftPanelShown(false);
        setBottomPanelShown(false);
    };
    return {
        isLoading,
        activePlace,
        activeView,
        isLeftPanelShown,
        isBottomPanelShown,
        hideLeftPanel: () => togglePanel('left'),
        hideBottomPanel: () => togglePanel('bottom'),
        onLeftPanelClick: (value: number) => navigate(value, 0),
        onBottomPanelClick: (value: number) => navigate(activePlace, value),
        closePanels,
    };
};
