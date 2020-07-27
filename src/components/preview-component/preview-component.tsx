import * as React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'

import { useSettings } from '../../hooks'
import { Plug } from '../../assets'
import './preview-component.scss'
import { BorderedHeader } from '..'

interface Props {
    name?: string
    isLoading: boolean
    src: string
    value: number
    handleChange: (value: number) => void
}

export const PreviewComponent = ({name = '', src, value, handleChange, isLoading}: Props) => {
    const {settings: {language}} = useSettings()
    const [isLoaded, setLoaded] = useState(false)
    const image = useMemo(() => {
        setLoaded(false)
        const img = new Image()
        img.src = src
        return img
    }, [src])

    useEffect(() => {
        image.onload = () => {
            setLoaded(true)
        }
        return () => {
            image.onload = null
        }
    }, [image])

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        handleChange(value)
    }, [handleChange, value])

    return (
            <div
                    onContextMenu={handleClick}
                    onClick={handleClick}
                    style={{
                        margin: `${name ? '10px 5px' : '5px'}`,
                        backgroundImage: `url(${isLoaded ? image.src : Plug})`
                    }}
                    className={cn('preview', {
                        'preview--not-loaded': !isLoaded,
                        'preview--loading': isLoading
                    })}
            >
                {name && (
                        <div className='preview-name'>
                            <BorderedHeader>
                                {language[name as keyof typeof language]}
                            </BorderedHeader>
                        </div>
                )}
            </div>
    )
}

PreviewComponent.displayName = 'PreviewComponent'
