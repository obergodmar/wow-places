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

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!stick || !stick.current || !stick.current.parentNode) {
            return
        }
        const {width} = (stick.current.parentNode as HTMLDivElement).getBoundingClientRect()
        switch (e.keyCode) {
            case 37:
                if (position - 5 < 0) {
                    return
                }
                setPosition(position - 5)
                handleChange(position / MAX)
                break
            case 39:
                if (position + 5 > width - 35) {
                    return
                }
                setPosition(position + 5)
                handleChange(position / MAX)
                break
        }
    }

    const handleMouseDown = useCallback(() => {
        setPressed(true)
    }, [])

    const handleMouseUp = useCallback(() => {
        setPressed(false)
    }, [])

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isPressed) {
            return
        }
        if (!stick || !stick.current || !stick.current.parentNode) {
            return
        }
        const {width, left} = (stick.current.parentNode as HTMLDivElement).getBoundingClientRect()
        const {clientX} = e
        const diff = clientX - left - 20
        if (diff > width - 35 || diff < 0) {
            return
        }
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
        if (value > width - 35 || value < 0) {
            return
        }
        setPosition(value)
        handleChange(value / MAX)
    }

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [handleMouseMove, handleMouseUp])

    return (
            <div
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    onMouseDown={handleMouseDown}
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
