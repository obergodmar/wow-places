import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';

import { useSettings } from '../../hooks';
import { Plug } from '../../assets';
import './preview-component.scss';
import { BorderedHeader } from '..';

interface Props {
    name?: string;
    isLoading: boolean;
    src: string;
    value: number;
    handleChange: (value: number) => void;
}

export const PreviewComponent: React.FC<Props> = ({
    name = '',
    src,
    value,
    handleChange,
    isLoading,
}: Props) => {
    const {
        settings: { language },
    } = useSettings();
    const [loadedSrc, setLoadedSrc] = useState<string>();
    const isLoaded = loadedSrc === src;
    useEffect(() => {
        const image = new Image();
        image.onload = () => setLoadedSrc(src);
        image.src = src;
        return () => {
            image.onload = null;
        };
    }, [src]);

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            handleChange(value);
        },
        [handleChange, value],
    );

    return (
        <div
            role="button"
            tabIndex={0}
            aria-label={
                name
                    ? (language[name as keyof typeof language] ?? name.replace('place.', ''))
                    : `View ${value + 1}`
            }
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    handleChange(value);
                }
            }}
            onContextMenu={handleClick}
            onClick={handleClick}
            style={{
                margin: `${name ? '10px 5px' : '5px'}`,
                backgroundImage: `url(${isLoaded ? src : Plug})`,
            }}
            className={cn('preview', {
                'preview--not-loaded': !isLoaded,
                'preview--loading': isLoading,
            })}
        >
            {name && (
                <div className="preview-name">
                    <BorderedHeader>
                        {language[name as keyof typeof language] ?? name.replace('place.', '')}
                    </BorderedHeader>
                </div>
            )}
        </div>
    );
};

PreviewComponent.displayName = 'PreviewComponent';
