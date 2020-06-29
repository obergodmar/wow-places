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
    const [isLoaded, setLoaded] = useState(false)

    useEffect(() => {
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
    }, [src])

    return (
            <div
                    className='view'
                    style={{
                        backgroundImage: `url(${imageSrc})`
                    }}
            >
                <div className={`view-background ${isLoaded ? 'view-background--loaded' : ''}`}/>
                <div className='view-author'>
                    <a href="https://github.com/obergodmar">obergodmar</a>
                    <span>1.0.0</span>
                </div>
            </div>
    )
}

ViewComponent.displayName = 'ViewComponent'
