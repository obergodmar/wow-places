import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'

import { Plug } from '../../assets'
import './preview-component.scss'

interface Props {
    isLoading: boolean
    src: string
    value: number
    handleChange: (value: number) => void
}

export const PreviewComponent = ({src, value, handleChange, isLoading}: Props) => {
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

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        handleChange(value)
    }

    return (
            <div
                    onContextMenu={handleClick}
                    onClick={handleClick}
                    style={{
                        backgroundImage: `url(${isLoaded ? image.src : Plug})`
                    }}
                    className={
                        `preview ${!isLoaded
                                ? 'preview--not-loaded' :
                                ''} ${isLoading
                                ? 'preview--loading'
                                : ''}`
                    }
            />
    )
}

PreviewComponent.displayName = 'PreviewComponent'
