import * as React from 'react'
import { KeyboardEvent, useCallback, useEffect, useRef, useState, WheelEvent } from 'react'

import './range-component.scss'

interface Props {
    handleChange: (value: number) => void
    defaultValue: number
}

const MAX = 55

export const RangeComponent = ({handleChange, defaultValue}: Props) => {
    const [isPressed, setPressed] = useState(false)
    const [position, setPosition] = useState(defaultValue * MAX)

    const stick = useRef<HTMLDivElement>(null)

    const handleFocus = useCallback(() => setPressed(true), [])
    const handleFree = useCallback(() => setPressed(false), [])

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!stick || !stick.current || !stick.current.parentNode) {
            return
        }
        const {width} = (stick.current.parentNode as HTMLDivElement).getBoundingClientRect()
        switch (e.keyCode) {
            case 37:
                const minusValue = position - 5
                const minusDiff = limiter(minusValue, width)

                setPosition(minusDiff)
                handleChange(minusDiff / MAX)
                break
            case 39:
                const plusValue = position + 5
                const plusDiff = limiter(plusValue, width)

                setPosition(plusDiff)
                handleChange(plusDiff / MAX)
                break
        }
    }

    const handlePoint = useCallback((e: React.MouseEvent | MouseEvent) => {
        if (!stick || !stick.current || !stick.current.parentNode) {
            return
        }
        const {width, left} = (stick.current.parentNode as HTMLDivElement).getBoundingClientRect()
        const {clientX} = e
        const value = clientX - left - 20
        const diff = limiter(value, width)

        setPosition(diff)
        handleChange(diff / MAX)
    }, [stick, handleChange])

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isPressed) {
            return
        }
        handlePoint(e)
    }, [isPressed, handlePoint])

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!isPressed) {
            return
        }
        const {touches} = e
        const {clientX} = touches[0]

        if (!stick || !stick.current || !stick.current.parentNode) {
            return
        }
        const {width, left} = (stick.current.parentNode as HTMLDivElement).getBoundingClientRect()

        const value = clientX - left - 20
        const diff = limiter(value, width)

        setPosition(diff)
        handleChange(diff / MAX)
    }, [isPressed, stick, handleChange])

    const handleScroll = (e: WheelEvent) => {
        if (!stick || !stick.current || !stick.current.parentNode) {
            return
        }
        const range = stick.current.parentNode as HTMLDivElement
        const {width} = range.getBoundingClientRect()
        range.focus()
        const {deltaY} = e
        const value = position + (deltaY > 0 ? -5 : 5)
        const diff = limiter(value, width)

        setPosition(diff)
        handleChange(diff / MAX)
    }

    const limiter = (value: number, width: number) => {
        let diff = value
        if (diff > width - 35) {
            diff = MAX
        } else if (diff < 0) {
            diff = 0
        }
        return diff
    }

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleFree)
        window.addEventListener('touchmove', handleTouchMove)
        window.addEventListener('touchend', handleFree)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleFree)
            window.removeEventListener('touchmove', handleTouchMove)
            window.removeEventListener('touchend', handleFree)
        }
    }, [handleMouseMove, handleTouchMove, handleFree])

    return (
            <div
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    onMouseDown={handleFocus}
                    onClick={handlePoint}
                    onTouchStart={handleFocus}
                    onWheel={handleScroll}
                    className='range'
            >
                <div
                        ref={stick}
                        style={{
                            left: `${position}px`
                        }}
                        className='range-stick'
                />
            </div>
    )
}

RangeComponent.displayName = 'RangeComponent'
