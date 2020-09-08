import * as React from 'react';
import { MouseEvent, useRef } from 'react';
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

export const PanelComponent: React.FC<Props> = ({
    isShown,
    setShown,
    children,
    itemsCount,
    orientation,
}: Props) => {
    const {
        settings: { language },
    } = useSettings();

    const panel = useRef<HTMLDivElement>(null);

    // TODO: Keyboard place input
    const { panelProps } = usePanelScroll({ orientation, itemsCount, panel, isShown });

    const handleClick = (event: MouseEvent) => {
        event.preventDefault();
        setShown();
    };

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
            <button onClick={handleClick}>
                {orientation === Orientation.bottom
                    ? language['ui.button.views']
                    : language['ui.button.places']}
            </button>
        </div>
    );
};

PanelComponent.displayName = 'PanelComponent';
