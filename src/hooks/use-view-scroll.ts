import {
    FocusEvent,
    MouseEvent,
    TouchEvent,
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
} from 'react';

import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '../utils';

interface Position {
    x: number;
    y: number;
}

const initialPosition: Position = {
    x: 0,
    y: 0,
};

type ViewScrollType = {
    style: {
        backgroundPosition: string;
        backgroundSize: string;
    };
    props: {
        onMouseMove: (event: MouseEvent) => void;
        onMouseDown: (event: MouseEvent) => void;
        onMouseUp: (event: MouseEvent) => void;
        onMouseLeave: (event: MouseEvent) => void;
        onTouchStart: (event: TouchEvent) => void;
        onTouchMove: (event: TouchEvent) => void;
        onTouchEnd: (event: TouchEvent) => void;
        onBlur: (event: FocusEvent) => void;
    };
};

export const useViewScroll = (): ViewScrollType => {
    const [isDrag, setDrag] = useState(false);
    const [trackPosition, setTrackPosition] = useState(initialPosition);
    const [position, setPosition] = useState(initialPosition);
    const [lastPosition, setLastPosition] = useState(initialPosition);
    const [isBigScreen, setBigScreen] = useState(false);

    const handleResize = useCallback(() => {
        const { innerWidth, innerHeight } = window;

        let width = 0;
        let height = 0;
        setBigScreen(false);

        if (innerHeight < DEFAULT_HEIGHT && innerWidth < DEFAULT_WIDTH) {
            width = (innerWidth - DEFAULT_WIDTH) / 2;
            height = (innerHeight - DEFAULT_HEIGHT) / 2;
        } else {
            setBigScreen(true);
        }
        setPosition({ x: width, y: height });
        setLastPosition({ x: width, y: height });
    }, []);

    useEffect(() => {
        handleResize();
    }, [handleResize]);

    useLayoutEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    const limiter = useCallback(
        (value: Position, width: number, height: number) => {
            const { x: xValue, y: yValue } = value;

            let x = lastPosition.x - trackPosition.x + xValue;
            let y = lastPosition.y - trackPosition.y + yValue;

            if (x > 0) {
                x = 0;
            } else if (x < -width) {
                x = -width;
            }

            if (y > 0) {
                y = 0;
            } else if (y < -height) {
                y = -height;
            }

            return { x, y };
        },
        [lastPosition.x, lastPosition.y, trackPosition.x, trackPosition.y],
    );

    const onTouchMove = useCallback(
        (e: TouchEvent) => {
            const { touches } = e;
            if (isBigScreen) {
                return;
            }
            const { innerWidth, innerHeight } = window;
            const width = DEFAULT_WIDTH - innerWidth;
            const height = DEFAULT_HEIGHT - innerHeight;
            const { clientX: x, clientY: y } = touches[0];

            const diff = limiter({ x, y }, width, height);

            setPosition(diff);
        },
        [isBigScreen, limiter],
    );

    const onTouchStart = useCallback((e: TouchEvent) => {
        const { touches } = e;
        e.nativeEvent.stopImmediatePropagation();
        const { clientX: x, clientY: y } = touches[0];
        setTrackPosition({ x, y });
        setDrag(true);
    }, []);

    const onMouseDown = useCallback((e: MouseEvent) => {
        const { clientX, clientY } = e;
        e.nativeEvent.stopImmediatePropagation();
        setTrackPosition({ x: clientX, y: clientY });
        setDrag(true);
    }, []);

    const handleFree = useCallback(
        (e: MouseEvent | FocusEvent | TouchEvent) => {
            e.nativeEvent.stopImmediatePropagation();
            setDrag(false);
            setLastPosition(position);
        },
        [position],
    );

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDrag) {
                return;
            }
            if (isBigScreen) {
                return;
            }
            const { innerWidth, innerHeight } = window;
            const width = DEFAULT_WIDTH - innerWidth;
            const height = DEFAULT_HEIGHT - innerHeight;

            const { clientX: x, clientY: y } = e;
            const diff = limiter({ x, y }, width, height);
            setPosition(diff);
        },
        [isBigScreen, isDrag, limiter],
    );

    return {
        style: {
            backgroundPosition: `${position.x}px ${position.y}px`,
            backgroundSize: `${isBigScreen ? 'cover' : 'auto'}`,
        },
        props: {
            onMouseMove,
            onMouseDown,
            onTouchStart,
            onTouchMove,
            onMouseUp: handleFree,
            onTouchEnd: handleFree,
            onMouseLeave: handleFree,
            onBlur: handleFree,
        },
    };
};
