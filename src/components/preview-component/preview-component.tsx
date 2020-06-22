import * as React from 'react'
import { useMemo, useState } from 'react'

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
        const img = new Image(320, 180)
        img.src = src
        img.onload = () => {
            setLoaded(true)
        }
        return img
    }, [src])

    const handleClick = () => {
        handleChange(value)
    }

    return (
            <div
                    onClick={handleClick}
                    style={{
                        backgroundImage: `url(${isLoaded ? image.src : Plug})`,
                        backgroundSize: `${isLoaded ? '320px 180px' : '90px 90px'}`,
                        opacity: `${isLoading ? '0.4' : '1'}`
                    }}
                    className='preview'
            />
    )
}

PreviewComponent.displayName = 'PreviewComponent'
