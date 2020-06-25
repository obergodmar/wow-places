import * as React from 'react'
import { FocusEvent, MouseEvent, useEffect, useMemo, useRef, useState, WheelEvent } from 'react'

import { PREVIEW_HEIGHT, PREVIEW_WIDTH } from '../../utils'
import { useSettings } from '../../hooks'

import './panel-component.scss'

interface Props {
    orientation: 'bottom' | 'left'
    isShown: boolean
    itemsCount: number
    setShown: () => void
    openSoundPlay: (volume?: number) => void
    closeSoundPlay: (volume?: number) => void
    children: React.ReactNode
}

export const PanelComponent = ({
    isShown,
    setShown,
    children,
    openSoundPlay,
    closeSoundPlay,
    itemsCount,
    orientation
}: Props) => {
    const {settings: {language, uiSound}} = useSettings()
    const [isDrag, setDrag] = useState(false)
    const [trackMouse, setTrackMouse] = useState(0)
    const [lastPosition, setLastPosition] = useState(0)

    const panel = useRef<HTMLInputElement>(null)
    let position = 0
    const isBottom = useMemo(() => orientation === 'bottom', [orientation])

    useEffect(() => {
        if (!isShown && panel.current) {
            panel.current.style.transform = 'unset'
            setLastPosition(0)
        }
    }, [isShown])

    const handleClick = (event: MouseEvent) => {
        event.preventDefault()
        setShown()
        if (!uiSound) {
            return
        }
        if (isShown) {
            openSoundPlay()
        } else {
            closeSoundPlay()
        }
    }

    const handleDragScroll = (e: MouseEvent) => {
        if (!isDrag) {
            return
        }

        const {clientX, clientY} = e
        const value = isBottom ? clientX : clientY
        position = trackMouse - value + lastPosition
        changePosition()
    }

    const changePosition = () => {
        if (!panel.current) {
            return
        }
        const {innerHeight, innerWidth} = window
        const overflowWindow = isBottom ? innerWidth : innerHeight
        const overflowContainer = itemsCount * ((isBottom ? PREVIEW_WIDTH : PREVIEW_HEIGHT) + 10)
        const overflow = overflowContainer > overflowWindow ? overflowContainer : overflowWindow
        if (Math.abs(position) > overflow) {
            position = -position
        }
        panel.current.style.transform = `translate${isBottom ? 'X' : 'Y'}(${-position}px)`
    }

    const handlePress = (e: MouseEvent) => {
        e.preventDefault()
        setTrackMouse(isBottom ? e.clientX : e.clientY)
        setDrag(true)
    }

    const handleFree = (e: MouseEvent | FocusEvent) => {
        e.preventDefault()
        setDrag(false)
        setLastPosition(position)
    }

    const handleScroll = (e: WheelEvent) => {
        const {deltaY} = e
        const value = deltaY > 0 ? 50 : -50
        position = value + lastPosition
        changePosition()
        setLastPosition(position)
    }

    return (
            <div
                    onMouseDown={handlePress}
                    onMouseUp={handleFree}
                    onMouseMove={handleDragScroll}
                    onMouseLeave={handleFree}
                    onWheel={handleScroll}
                    onBlur={handleFree}
                    className={`panel panel--${orientation} ${isShown ? `panel--${orientation}--shown` : ''}`}
            >
                <div
                        ref={panel}
                        className='panel-content'
                >
                    {isShown && children}
                </div>
                <button onClick={handleClick}>
                    {orientation === 'bottom' ? language['ui.button.views'] : language['ui.button.places']}
                </button>
            </div>
    )
}

PanelComponent.displayName = 'PanelComponent'
