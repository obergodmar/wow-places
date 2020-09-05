import * as React from 'react';
import { KeyboardEvent, useCallback } from 'react';
import cn from 'classnames';

import './menu-item-component.scss';

interface Props {
    isActive: boolean;
    handleClick: () => void;
}

export const MenuItemComponent: React.FC<Props> = ({ isActive, handleClick }: Props) => {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.keyCode !== 13 && e.keyCode !== 32) {
                return;
            }
            handleClick();
        },
        [handleClick],
    );

    return (
        <div
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={cn('menu-item', { 'menu-item--active': isActive })}
        />
    );
};

MenuItemComponent.displayName = 'MainMenuComponent';
