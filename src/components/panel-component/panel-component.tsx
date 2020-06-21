import * as React from 'react'
import { useCallback } from 'react'

import './panel-component.scss'

interface Props {
    orientation: 'bottom' | 'left'
    isShown: boolean
    setShown: () => void
}

export const PanelComponent = ({orientation, isShown, setShown}: Props) => {

    const handleClick = useCallback((event) => {
        event.preventDefault()
        setShown()
    }, [setShown])

    return (
            <div
                    className={`panel panel--${orientation} ${isShown ? `panel--${orientation}--shown` : ''}`}
            >
                <button onClick={handleClick}/>
            </div>
    )
}

PanelComponent.displayName = 'PanelComponent'
