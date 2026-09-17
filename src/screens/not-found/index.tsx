import * as React from 'react';
import { useCallback } from 'react';

import { useSettings } from '../../hooks';
import { DialogBox } from '../../components/dialog-box';
import { DEFAULT_PLACE } from '../../utils';

import './style.scss';

const PandarenVideo = '/media/pandaren.mp4';

export const NotFound: React.FC = () => {
    const {
        settings: { language },
    } = useSettings();

    const handleClick = useCallback(() => {
        const { origin } = window.location;
        window.location.replace(`${origin}/${DEFAULT_PLACE}`);
    }, []);

    return (
        <>
            <div className="container">
                <video autoPlay muted loop playsInline className="container-video">
                    <source src={PandarenVideo} type="video/mp4" />
                </video>
                <video autoPlay muted loop playsInline className="container-video-fallback">
                    <source src={PandarenVideo} type="video/mp4" />
                </video>
            </div>
            <DialogBox onClick={handleClick}>{language['error.404']}</DialogBox>
        </>
    );
};

NotFound.displayName = 'NotFound';
