import * as React from 'react'
import { FocusEvent, KeyboardEvent, useCallback, useRef, useState } from 'react'
import cn from 'classnames'

import './select-component.scss'

interface Props {
    children: React.ReactNode
    options: any[]
    current: any
    handleChange: (value: any) => void
}

export const SelectComponent = ({children, options, current, handleChange}: Props) => {
    const [isSelectShown, setSelectShown] = useState(false)
    const dropDownRef = useRef<HTMLDivElement>(null)

    const handleSelectClick = useCallback(() => setSelectShown(!isSelectShown), [isSelectShown])

    const handleBlur = (e: FocusEvent) => {
        if (!dropDownRef || !dropDownRef.current) {
            return
        }
        if (dropDownRef.current.contains(e.relatedTarget as Node) ||
                e.currentTarget === e.relatedTarget) {
            return
        }
        setSelectShown(!isSelectShown)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.keyCode !== 13 && e.keyCode !== 32) {
            return
        }
        setSelectShown(!isSelectShown)
    }

    const onItemClick = (itemValue: any) => handleChange(itemValue)

    const onItemKeyDown = (e: KeyboardEvent, itemValue: any) => {
        if (e.keyCode !== 13 && e.keyCode !== 32) {
            return
        }
        handleChange(itemValue)
    }

    return (
            <div
                    onClick={handleSelectClick}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    tabIndex={0}
                    className={cn('select', {
                        'select--opened': isSelectShown
                    })}
            >
                {children}
                <div className='select-arrow' />
                {isSelectShown && (
                        <div
                                ref={dropDownRef}
                                className='select-drop-down'
                        >
                            {options.map((item, index) => (
                                    <div
                                            key={index}
                                            tabIndex={0}
                                            onClick={() => onItemClick(item)}
                                            onKeyDown={(e) => onItemKeyDown(e, item)}
                                            className={cn('select-item', {
                                                'select-item--selected': item === current
                                            })}
                                    >
                                        {item}
                                    </div>
                            ))}
                        </div>
                )}
            </div>
    )
}

SelectComponent.displayName = 'SelectComponent'
