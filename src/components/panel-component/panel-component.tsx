import * as React from 'react';
import { forwardRef, MouseEvent, useCallback, useRef } from 'react';
import cn from 'classnames';

import { usePanelScroll, useSettings } from '../../hooks';
import { Orientation } from '../../utils';

import './panel-component.scss';

interface Props {
    orientation: Orientation;
    isShown: boolean;
    itemsCount: number;
    setShown: () => void;
    children: React.ReactNode;
}

export const PanelComponent = forwardRef<HTMLButtonElement, Props>(
    ({ isShown, setShown, children, itemsCount, orientation }: Props, ref) => {
        const {
            settings: { language },
        } = useSettings();

        const panel = useRef<HTMLDivElement>(null);

        // TODO: Keyboard place input
        const { panelProps } = usePanelScroll({ orientation, itemsCount, panel, isShown });

        const handleClick = useCallback(
            (event: MouseEvent) => {
                event.preventDefault();
                setShown();
            },
            [setShown],
        );

        return (
            <div
                {...panelProps}
                className={cn('panel', `panel--${orientation}`, {
                    [`panel--${orientation}--shown`]: isShown,
                })}
            >
                <div ref={panel} className="panel-content">
                    {isShown && children}
                </div>
                <button onClick={handleClick} ref={ref}>
                    {orientation === Orientation.bottom
                        ? language['ui.button.views']
                        : language['ui.button.places']}
                </button>
            </div>
        );
    },
);

PanelComponent.displayName = 'PanelComponent';
