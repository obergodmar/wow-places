import * as React from 'react'
import { FocusEvent, MouseEvent, TouchEvent, useCallback, useEffect, useState } from 'react'
import cn from 'classnames'

import { Background } from '../../assets'
import { ANIMATION_DURATION, DEFAULT_HEIGHT, DEFAULT_WIDTH } from '../../utils'

import './view-component.scss'

interface Props {
    src: string
}

interface Position {
    x: number
    y: number
}

const initialPosition = {
    x: 0,
    y: 0
}

export const ViewComponent = ({src}: Props) => {
    const [imageSrc, setImageSrc] = useState(Background)
    const [isLoaded, setLoaded] = useState(false)
    const [isDrag, setDrag] = useState(false)
    const [trackPosition, setTrackPosition] = useState(initialPosition)
    const [position, setPosition] = useState(initialPosition)
    const [lastPosition, setLastPosition] = useState(initialPosition)
    const [isBigScreen, setBigScreen] = useState(false)

    const handleResize = useCallback(() => {
        const {innerWidth, innerHeight} = window

        let width = 0
        let height = 0
        setBigScreen(false)

        if (innerHeight < DEFAULT_HEIGHT && innerWidth < DEFAULT_WIDTH) {
            width = (innerWidth - DEFAULT_WIDTH) / 2
            height = (innerHeight - DEFAULT_HEIGHT) / 2
        } else {
            setBigScreen(true)
        }
        setPosition({x: width, y: height})
        setLastPosition({x: width, y: height})
    }, [])

    useEffect(() => {
        handleResize()
        setLoaded(false)
        const timer = setTimeout(() => {
            const image = new Image()
            image.src = src
            image.onload = () => {
                setImageSrc(src)
                setLoaded(true)
            }
        }, ANIMATION_DURATION)
        return () => {
            clearTimeout(timer)
        }
    }, [src, handleResize])

    useEffect(() => {
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [handleResize])

    const handleTouchMove = (e: TouchEvent) => {
        const {touches} = e
        if (isBigScreen) {
            return
        }
        const {innerWidth, innerHeight} = window
        const width = DEFAULT_WIDTH - innerWidth
        const height = DEFAULT_HEIGHT - innerHeight
        const {clientX: x, clientY: y} = touches[0]

        const diff = limiter({x, y}, width, height)

        setPosition(diff)
    }

    const limiter = (value: Position, width: number, height: number) => {
        const {x: xValue, y: yValue} = value

        let x = lastPosition.x - trackPosition.x + xValue
        let y = lastPosition.y - trackPosition.y + yValue

        if (x > 0) {
            x = 0
        } else if (x < -width) {
            x = -width
        }

        if (y > 0) {
            y = 0
        } else if (y < -height) {
            y = -height
        }

        return ({x, y})
    }

    const handleTouchstart = (e: TouchEvent) => {
        const {touches} = e
        e.nativeEvent.stopImmediatePropagation()
        const {clientX: x, clientY: y} = touches[0]
        setTrackPosition({x, y})
        setDrag(true)
    }

    const handleMouseDown = (e: MouseEvent) => {
        const {clientX, clientY} = e
        e.nativeEvent.stopImmediatePropagation()
        setTrackPosition({x: clientX, y: clientY})
        setDrag(true)
    }

    const handleFree = (e: MouseEvent | FocusEvent | TouchEvent) => {
        e.nativeEvent.stopImmediatePropagation()
        setDrag(false)
        setLastPosition(position)
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDrag) {
            return
        }
        if (isBigScreen) {
            return
        }
        const {innerWidth, innerHeight} = window
        const width = DEFAULT_WIDTH - innerWidth
        const height = DEFAULT_HEIGHT - innerHeight

        const {clientX: x, clientY: y} = e
        const diff = limiter({x, y}, width, height)
        setPosition(diff)
    }

    return (
            <div
                    className='view'
                    style={{
                        backgroundImage: `url(${imageSrc})`,
                        backgroundPosition: `${position.x}px ${position.y}px`,
                        backgroundSize: `${isBigScreen ? 'cover' : 'auto'}`
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleFree}
                    onTouchMove={handleTouchMove}
                    onTouchStart={handleTouchstart}
                    onTouchEnd={handleFree}
                    onMouseLeave={handleFree}
                    onBlur={handleFree}
            >
                <div className={cn('view-background', {
                    'view-background--loaded': isLoaded
                })}
                />
            </div>
    )
}

ViewComponent.displayName = 'ViewComponent'
