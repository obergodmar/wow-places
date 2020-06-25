import * as React from 'react'
import { useEffect, useState } from 'react'

import { Background } from '../../assets'
import { ANIMATION_DURATION } from '../../utils'

import './view-component.scss'

interface Props {
    src: string
}

export const ViewComponent = ({src}: Props) => {
    const [imageSrc, setImageSrc] = useState(Background)

    useEffect(() => {
        const timer = setTimeout(() => {
            const image = new Image()
            image.src = src
            image.onload = () => {
                setImageSrc(src)
            }
        }, ANIMATION_DURATION)
        return () => {
            clearTimeout(timer)
        }
    }, [src])

    return (
            <div
                    className='view'
                    style={{
                        backgroundImage: `url(${imageSrc})`
                    }}
            />
    )
}

ViewComponent.displayName = 'ViewComponent'
