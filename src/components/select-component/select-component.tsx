import * as React from 'react'
import { FocusEvent, KeyboardEvent, MouseEvent, useRef, useState } from 'react'

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

    const handleSelectClick = (e: MouseEvent) => {
        if (dropDownRef && dropDownRef.current && dropDownRef.current.contains(e.target as Node)) {
            return
        }
        setSelectShown(!isSelectShown)
    }

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
        if (dropDownRef && dropDownRef.current && dropDownRef.current.contains(e.target as Node)) {
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
                    className='select'
            >
                {children}
                <div className='select-arrow'/>
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
                                            className={`select-item ${item === current
                                                    ?
                                                    'select-item--selected'
                                                    :
                                                    ''}`
                                            }
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
