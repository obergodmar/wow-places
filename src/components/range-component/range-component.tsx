import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { useSettings } from '../../hooks/use-settings';
import './range-component.scss';

interface Props {
    handleChange: (value: number) => void;
    value: number;
}
const MAX = 55;

export function RangeComponent({ handleChange, value }: Props) {
    const dragging = useRef(false);
    const {
        settings: { language },
    } = useSettings();
    const update = (position: number) => handleChange(Math.max(0, Math.min(MAX, position)) / MAX);
    const point = (event: PointerEvent<HTMLDivElement>) => {
        update(event.clientX - event.currentTarget.getBoundingClientRect().left - 20);
    };
    const onKeyDown = (event: KeyboardEvent) => {
        const position = value * MAX;
        const next = { ArrowLeft: position - 5, ArrowRight: position + 5, Home: 0, End: MAX }[
            event.key
        ];
        if (next !== undefined) {
            event.preventDefault();
            event.stopPropagation();
            update(next);
        }
    };
    return (
        <div
            role="slider"
            aria-label={language['ui.musicVolume']}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(value * 100)}
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerDown={(event) => {
                dragging.current = true;
                event.currentTarget.setPointerCapture(event.pointerId);
                event.currentTarget.focus();
                point(event);
            }}
            onPointerMove={(event) => {
                if (dragging.current) point(event);
            }}
            onPointerUp={() => {
                dragging.current = false;
            }}
            onPointerCancel={() => {
                dragging.current = false;
            }}
            onLostPointerCapture={() => {
                dragging.current = false;
            }}
            onWheel={(event) => {
                event.currentTarget.focus();
                update(value * MAX + (event.deltaY > 0 ? -5 : 5));
            }}
            className="range"
            style={{ touchAction: 'none' }}
        >
            <div style={{ left: `${value * MAX}px` }} className="range-stick" />
        </div>
    );
}
