import * as React from 'react'
import { KeyboardEvent } from 'react'

import './menu-item-component.scss'

interface Props {
    isActive: boolean
    handleClick: () => void
}

export const MenuItemComponent = ({isActive, handleClick}: Props) => {

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.keyCode !== 13 && e.keyCode !== 32) {
            return
        }
        handleClick()
    }

    return (
            <div
                    tabIndex={0}
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}
                    className={`menu-item ${isActive ? 'menu-item--active' : ''}`}
            />
    )
}

MenuItemComponent.displayName = 'MainMenuComponent'
