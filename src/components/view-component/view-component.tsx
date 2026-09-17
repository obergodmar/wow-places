import * as React from 'react';
import { useEffect, useState } from 'react';
import cn from 'classnames';

import { Background } from '../../assets';
import { ANIMATION_DURATION } from '../../utils';
import { useViewScroll } from '../../hooks';

import './view-component.scss';

interface Props {
    src: string;
}

export const ViewComponent: React.FC<Props> = ({ src }: Props) => {
    const [imageSrc, setImageSrc] = useState(Background);
    const isLoaded = imageSrc === src;

    const { style, props } = useViewScroll();

    useEffect(() => {
        const image = new Image();
        const timer = setTimeout(() => {
            image.onload = () => {
                setImageSrc(src);
            };
            image.src = src;
        }, ANIMATION_DURATION);
        return () => {
            clearTimeout(timer);
            image.onload = null;
        };
    }, [src]);

    return (
        <div
            {...props}
            className="view"
            style={{
                backgroundImage: `url(${imageSrc})`,
                ...style,
            }}
        >
            <div
                className={cn('view-background', {
                    'view-background--loaded': isLoaded,
                })}
            />
        </div>
    );
};

ViewComponent.displayName = 'ViewComponent';
