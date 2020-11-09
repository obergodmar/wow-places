import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { ANIMATION_DURATION, debounce, DIALOG_STEP_DURATION } from '../utils';

interface dialogPositionType {
    bottomPanelButtonRef: RefObject<HTMLButtonElement>;
    offsetTop: number;
    handleShowDialog: () => void;
    handleHideDialog: () => void;
    isDialogShown: boolean;
    isDialogMounted: boolean;
    handleDialogMenuItemClick: () => void;
}

interface Props {
    isBottomPanelShown: boolean;
    stepsCount: number;
}

export const useDialog = ({ isBottomPanelShown, stepsCount }: Props): dialogPositionType => {
    const bottomPanelButtonRef = useRef<HTMLButtonElement>(null);
    const [isMounted, setMounted] = useState(false);
    const [isShown, setShown] = useState(false);
    const [offsetTop, setOffsetTop] = useState(0);
    const shownTimerRef = useRef<NodeJS.Timeout | null>(null);

    const updateOffset = useCallback(() => {
        if (!bottomPanelButtonRef.current) {
            return;
        }

        const { top } = bottomPanelButtonRef.current.getBoundingClientRect();
        setOffsetTop(top);
    }, [bottomPanelButtonRef]);

    useEffect(() => {
        updateOffset();

        const throttledUpdateOffset = debounce(updateOffset, 100);
        window.addEventListener('resize', throttledUpdateOffset);
        return () => {
            window.removeEventListener('resize', throttledUpdateOffset);
        };
    }, [updateOffset]);

    useEffect(() => {
        const timer = setTimeout(updateOffset, ANIMATION_DURATION);
        return () => {
            clearTimeout(timer);
        };
    }, [updateOffset, isBottomPanelShown]);

    useEffect(() => {
        let mountTimer: NodeJS.Timeout;
        let shownTimer: NodeJS.Timeout;
        let mainTimer: NodeJS.Timeout;

        if (isMounted) {
            mainTimer = setTimeout(() => {
                setShown(true);
                shownTimer = setTimeout(() => {
                    setShown(false);
                    mountTimer = setTimeout(() => setMounted(false), ANIMATION_DURATION);
                }, stepsCount * DIALOG_STEP_DURATION);
            }, ANIMATION_DURATION);
        }
        return () => {
            clearTimeout(mainTimer);
            clearTimeout(shownTimer);
            clearTimeout(mountTimer);
        };
    }, [isMounted, stepsCount]);

    const handleShowDialog = useCallback(() => setMounted(true), []);
    const handleHideDialog = useCallback(() => {
        setShown(false);
        shownTimerRef.current = setTimeout(() => setMounted(false), ANIMATION_DURATION);
    }, []);

    const handleDialogMenuItemClick = useCallback(() => {
        if (isShown) {
            handleHideDialog();
        } else {
            handleShowDialog();
        }
    }, [handleHideDialog, handleShowDialog, isShown]);

    useEffect(() => {
        return () => {
            if (shownTimerRef.current) {
                clearTimeout(shownTimerRef.current);
            }
        };
    }, [shownTimerRef]);

    return {
        bottomPanelButtonRef,
        offsetTop,
        handleShowDialog,
        handleHideDialog,
        isDialogShown: isShown,
        isDialogMounted: isMounted,
        handleDialogMenuItemClick,
    };
};
