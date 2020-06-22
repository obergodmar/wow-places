import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'

import { Background } from '../../assets'

import './view-component.scss'

interface Props {
    src: string
}

export const ViewComponent = ({src}: Props) => {
    const [imageSrc, setImageSrc] = useState(Background)
    const isImage = useMemo(() => imageSrc !== Background, [imageSrc])

    useEffect(() => {
        setTimeout(() => {
            const image = new Image()
            image.src = src
            image.onload = () => {
                setImageSrc(src)
            }
        }, 500)
    }, [src])

    return (
            <div
                    className='view'
                    style={{
                        backgroundImage: `url(${imageSrc})`,
                        backgroundRepeat: `${isImage ? 'no-repeat' : 'repeat'}`,
                        backgroundSize: `${isImage ? 'cover' : '256px'}`
                    }}
            />
    )
}

ViewComponent.displayName = 'ViewComponent'
