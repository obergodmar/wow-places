import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type MouseEvent,
    type TouchEvent,
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
    isShown: boolean;
}

export const usePanelScroll = ({ orientation, itemsCount, isShown }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const drag = useRef<{ start: number; position: number } | null>(null);
    const [position, setPosition] = useState(0);
    const [overflow, setOverflow] = useState(0);
    const [previousShown, setPreviousShown] = useState(isShown);
    const isBottom = orientation === Orientation.bottom;
    if (previousShown !== isShown) {
        setPreviousShown(isShown);
        setPosition(0);
    }
    useEffect(() => {
        if (!isShown) {
            drag.current = null;
            return;
        }
        const timer = setTimeout(() => ref.current?.focus(), ANIMATION_DURATION);
        return () => clearTimeout(timer);
    }, [isShown]);
    useEffect(() => {
        const resize = debounce(() => {
            const viewport = isBottom ? window.innerWidth : window.innerHeight;
            const size = itemsCount * ((isBottom ? PREVIEW_WIDTH : PREVIEW_HEIGHT) + 15);
            setOverflow(Math.max(0, size - viewport));
            setPosition(0);
        }, 100);
        resize();
        window.addEventListener('resize', resize);
        return () => {
            resize.cancel();
            window.removeEventListener('resize', resize);
        };
    }, [isBottom, itemsCount]);
    const clamp = (value: number) => Math.min(overflow + SPACE, Math.max(0, value));
    const move = (coordinate: number) => {
        if (drag.current && overflow)
            setPosition(clamp(drag.current.position + drag.current.start - coordinate));
    };
    const release = () => {
        drag.current = null;
    };
    const panelStyle: CSSProperties = {
        transform: `translate${isBottom ? 'X' : 'Y'}(${-position}px)`,
    };
    return {
        panelStyle,
        panelProps: {
            ref,
            tabIndex: isShown ? 0 : -1,
            onMouseDown: (event: MouseEvent) => {
                drag.current = { start: isBottom ? event.clientX : event.clientY, position };
            },
            onMouseMove: (event: MouseEvent) => move(isBottom ? event.clientX : event.clientY),
            onMouseUp: release,
            onMouseLeave: release,
            onBlur: release,
            onTouchStart: (event: TouchEvent) => {
                const touch = event.touches[0];
                if (touch)
                    drag.current = { start: isBottom ? touch.clientX : touch.clientY, position };
            },
            onTouchMove: (event: TouchEvent) => {
                const touch = event.touches[0];
                if (touch) move(isBottom ? touch.clientX : touch.clientY);
            },
            onTouchEnd: release,
            onWheel: (event: React.WheelEvent) => {
                if (overflow) setPosition((value) => clamp(value + (event.deltaY > 0 ? 80 : -80)));
            },
        },
    };
};
