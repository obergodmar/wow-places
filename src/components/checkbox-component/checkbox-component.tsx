import * as React from 'react'
import { KeyboardEvent, useCallback } from 'react'

import './checkbox-component.scss'

interface Props {
    handleClick: (option: any) => void
    optionName: any
    value: boolean
}

export const CheckBoxComponent = ({handleClick, optionName, value}: Props) => {

    const handleKeyDown = useCallback((e: KeyboardEvent, option: any) => {
        if (e.keyCode !== 13 && e.keyCode !== 32) {
            return
        }
        handleClick(option)
    }, [handleClick])

    return (
            <div
                    tabIndex={0}
                    onClick={() => handleClick(optionName)}
                    onKeyDown={(e) => handleKeyDown(e, optionName)}
                    className={`checkbox ${value ? 'checkbox--checked' : ''}`}
            />
    )
}

CheckBoxComponent.displayName = 'CheckBoxComponent'
