import * as React from 'react'

import './main-menu-component.scss'

interface Props {
    children: React.ReactNode
}

export const MainMenuComponent = ({children}: Props) => {
    return (
            <div className='main-menu'>
                {children}
            </div>
    )
}

MainMenuComponent.displayName = 'MainMenuComponent'
