import * as React from 'react'
import {
    FocusEvent,
    MouseEvent,
    TouchEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    WheelEvent
} from 'react'

import { ANIMATION_DURATION, debounce, PREVIEW_HEIGHT, PREVIEW_WIDTH, SPACE } from '../../utils'
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
    const [trackPosition, setTrackPosition] = useState(0)
    const [position, setPosition] = useState(0)
    const [lastPosition, setLastPosition] = useState(0)

    const panel = useRef<HTMLInputElement>(null)
    const isBottom = useMemo(() => orientation === 'bottom', [orientation])

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

    const resetPanel = useCallback((animate = true) => {
        if (!panel.current) {
            return
        }
        if (animate) {
            panel.current.style.transition = `transform 0.5s`
        }
        panel.current.style.transform = `unset`
        setTrackPosition(0)
        setPosition(0)
        setLastPosition(0)
    }, [panel])

    useEffect(() => {
        let timeout: NodeJS.Timeout
        const handleResize = debounce(() => {
            resetPanel()
            timeout = setTimeout(() => {
                if (!panel || !panel.current) {
                    return
                }
                panel.current.style.transition = 'unset'
            }, ANIMATION_DURATION)
        }, 100)
        window.addEventListener('resize', handleResize)
        return () => {
            if (timeout) {
                clearTimeout(timeout)
            }
            window.removeEventListener('resize', handleResize)
        }
    }, [panel, resetPanel])

    useEffect(() => {
        if (!isShown) {
            resetPanel(false)
        }
    }, [isShown, resetPanel])

    const handleDragScroll = (e: MouseEvent) => {
        if (!isDrag) {
            return
        }
        const overflow = windowOverflow()
        if (!overflow) {
            return
        }

        const {clientX, clientY} = e
        const value = isBottom ? clientX : clientY
        const diff = limiter(value, overflow)
        setPosition(diff)
        changePosition()
    }

    const windowOverflow = () => {
        const {innerWidth, innerHeight} = window
        const windowSize = isBottom ? innerWidth : innerHeight
        const containerSize = itemsCount * ((isBottom ? PREVIEW_WIDTH : PREVIEW_HEIGHT) + 15)
        if (!(containerSize > windowSize)) {
            return 0
        }
        return Math.abs(containerSize - windowSize)
    }

    const limiter = (value: number, overflow: number, isWheel: boolean = false) => {
        let diff = (!isWheel ? trackPosition : 0) - value + lastPosition
        if (Math.abs(diff) > overflow + SPACE) {
            diff = overflow + SPACE
        } else if (diff < 0) {
            diff = 0
        }
        return diff
    }

    const changePosition = () => {
        if (!panel.current) {
            return
        }
        panel.current.style.transform = `translate${isBottom ? 'X' : 'Y'}(${-position}px)`
    }

    const handleMouseDown = (e: MouseEvent) => {
        const {clientX, clientY} = e
        e.nativeEvent.stopImmediatePropagation()
        setTrackPosition(isBottom ? clientX : clientY)
        setDrag(true)
    }

    const handleTouchstart = (e: TouchEvent) => {
        const {touches} = e
        e.nativeEvent.stopImmediatePropagation()
        setTrackPosition(isBottom ? touches[0].clientX : touches[0].clientY)
        setDrag(true)
    }

    const handleTouchMove = (e: TouchEvent) => {
        const {touches} = e
        const {clientX, clientY} = touches[0]
        const overflow = windowOverflow()
        if (!overflow) {
            return
        }

        const value = isBottom ? clientX : clientY
        const diff = limiter(value, overflow)
        setPosition(diff)
        changePosition()
    }

    const handleFree = (e: MouseEvent | FocusEvent | TouchEvent) => {
        e.nativeEvent.stopImmediatePropagation()
        setDrag(false)
        setLastPosition(position)
    }

    const handleScroll = (e: WheelEvent) => {
        const {deltaY} = e
        const overflow = windowOverflow()
        if (!overflow) {
            return
        }

        const value = deltaY > 0 ? -80 : 80
        const diff = limiter(value, overflow, true)
        setPosition(diff)
        changePosition()
        setLastPosition(position)
    }

    return (
            <div
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchstart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleFree}
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
