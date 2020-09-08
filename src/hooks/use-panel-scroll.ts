import {
    FocusEvent,
    MouseEvent,
    RefObject,
    TouchEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    WheelEvent,
} from 'react';

import {
    ANIMATION_DURATION,
    debounce,
    Orientation,
    PREVIEW_HEIGHT,
    PREVIEW_WIDTH,
    SPACE,
} from '../utils';

interface Props {
    orientation: Orientation;
    itemsCount: number;
    panel: RefObject<HTMLDivElement>;
    isShown: boolean;
}

type panelScrollType = {
    panelProps: {
        onMouseUp: (e: MouseEvent) => void;
        onMouseDown: (e: MouseEvent) => void;
        onMouseMove: (e: MouseEvent) => void;
        onMouseLeave: (e: MouseEvent) => void;
        onTouchStart: (e: TouchEvent) => void;
        onTouchMove: (e: TouchEvent) => void;
        onTouchEnd: (e: TouchEvent) => void;
        onWheel: (e: WheelEvent) => void;
        onBlur: (e: FocusEvent) => void;
        ref: RefObject<HTMLDivElement>;
        tabIndex: number;
    };
};

/* eslint-disable no-param-reassign */
export const usePanelScroll = ({
    orientation,
    itemsCount,
    panel,
    isShown,
}: Props): panelScrollType => {
    const ref = useRef<HTMLDivElement>(null);
    const [isDrag, setDrag] = useState(false);
    const [trackPosition, setTrackPosition] = useState(0);
    const [position, setPosition] = useState(0);
    const [lastPosition, setLastPosition] = useState(0);

    const isBottom = useMemo(() => orientation === Orientation.bottom, [orientation]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (ref && ref.current && isShown) {
                ref.current.focus();
            }
        }, ANIMATION_DURATION);

        return () => {
            clearTimeout(timeout);
        };
    }, [ref, isShown]);

    const resetPanel = useCallback(
        (animate = true) => {
            if (!panel.current) {
                return;
            }
            if (animate) {
                panel.current.style.transition = `transform 0.5s`;
            }
            panel.current.style.transform = `unset`;
            setTrackPosition(0);
            setPosition(0);
            setLastPosition(0);
        },
        [panel],
    );

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        const handleResize = debounce(() => {
            resetPanel();
            timeout = setTimeout(() => {
                if (!panel || !panel.current) {
                    return;
                }
                panel.current.style.transition = 'unset';
            }, ANIMATION_DURATION);
        }, 100);
        window.addEventListener('resize', handleResize);
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [panel, resetPanel]);

    useEffect(() => {
        if (!isShown) {
            resetPanel(false);
        }
    }, [isShown, resetPanel]);

    const overflow = useMemo(() => {
        const { innerWidth, innerHeight } = window;
        const windowSize = isBottom ? innerWidth : innerHeight;
        const containerSize = itemsCount * ((isBottom ? PREVIEW_WIDTH : PREVIEW_HEIGHT) + 15);
        if (!(containerSize > windowSize)) {
            return 0;
        }
        return Math.abs(containerSize - windowSize);
    }, [isBottom, itemsCount]);

    const changePosition = useCallback(() => {
        if (!panel.current) {
            return;
        }
        panel.current.style.transform = `translate${isBottom ? 'X' : 'Y'}(${-position}px)`;
    }, [isBottom, panel, position]);

    const limiter = useCallback(
        (value: number, isWheel = false) => {
            let diff = (!isWheel ? trackPosition : 0) - value + lastPosition;
            if (diff > overflow + SPACE) {
                diff = overflow + SPACE;
            } else if (diff < 0) {
                diff = 0;
            }
            return diff;
        },
        [lastPosition, trackPosition, overflow],
    );

    const handleFree = useCallback(
        (e: MouseEvent | FocusEvent | TouchEvent) => {
            e.nativeEvent.stopImmediatePropagation();
            setDrag(false);
            setLastPosition(position);
        },
        [position],
    );

    const onMouseUp = useCallback((e: MouseEvent) => handleFree(e), [handleFree]);

    const onMouseDown = useCallback(
        (e: MouseEvent) => {
            const { clientX, clientY } = e;
            e.nativeEvent.stopImmediatePropagation();
            setTrackPosition(isBottom ? clientX : clientY);
            setDrag(true);
        },
        [isBottom],
    );

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDrag) {
                return;
            }
            if (!overflow) {
                return;
            }

            const { clientX, clientY } = e;
            const value = isBottom ? clientX : clientY;
            const diff = limiter(value);
            setPosition(diff);
            changePosition();
        },
        [changePosition, isBottom, isDrag, limiter, overflow],
    );

    const onMouseLeave = useCallback((e: MouseEvent) => handleFree(e), [handleFree]);

    const onTouchStart = useCallback(
        (e: TouchEvent) => {
            const { touches } = e;
            e.nativeEvent.stopImmediatePropagation();
            setTrackPosition(isBottom ? touches[0].clientX : touches[0].clientY);
            setDrag(true);
        },
        [isBottom],
    );

    const onTouchMove = useCallback(
        (e: TouchEvent) => {
            const { touches } = e;
            const { clientX, clientY } = touches[0];
            if (!overflow) {
                return;
            }

            const value = isBottom ? clientX : clientY;
            const diff = limiter(value);
            setPosition(diff);
            changePosition();
        },
        [changePosition, isBottom, limiter, overflow],
    );

    const onTouchEnd = useCallback((e: TouchEvent) => handleFree(e), [handleFree]);

    const onWheel = useCallback(
        (e: WheelEvent) => {
            const { deltaY } = e;
            if (!overflow) {
                return;
            }

            const value = deltaY > 0 ? -80 : 80;
            const diff = limiter(value, true);
            setPosition(diff);
            changePosition();
            setLastPosition(position);
        },
        [changePosition, limiter, position, overflow],
    );

    const onBlur = useCallback((e: FocusEvent) => handleFree(e), [handleFree]);

    return {
        panelProps: {
            onMouseUp,
            onMouseDown,
            onMouseMove,
            onMouseLeave,
            onTouchStart,
            onTouchMove,
            onTouchEnd,
            onWheel,
            onBlur,
            ref,
            tabIndex: isShown ? 0 : -1,
        },
    };
};
