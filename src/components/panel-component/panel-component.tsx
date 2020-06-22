import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'

import './panel-component.scss'

interface Props {
    orientation: 'bottom' | 'left'
    isShown: boolean
    setShown: () => void
    children: React.ReactNode
}

export const PanelComponent = ({orientation, isShown, setShown, children}: Props) => {
    const [isRendered, setRendered] = useState(false)

    useEffect(() => {
        setRendered(isShown)
    }, [isShown])

    const handleClick = useCallback((event) => {
        event.preventDefault()
        setShown()
    }, [setShown])

    return (
            <div
                    className={`panel panel--${orientation} ${isShown ? `panel--${orientation}--shown` : ''}`}
            >
                <div className='panel-border'/>
                {isRendered && children}
                <button onClick={handleClick}/>
            </div>
    )
}

PanelComponent.displayName = 'PanelComponent'
