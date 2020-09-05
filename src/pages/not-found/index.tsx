import * as React from 'react';
import { useCallback } from 'react';

import { useSettings } from '../../hooks';
import { DialogBox } from '../../components/dialog-box';
import PandarenVideo from '../../assets/pandaren.mp4';
import { DEFAULT_PLACE } from '../../utils';

import './style.scss';

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
                <video autoPlay muted loop className="container-video">
                    <source src={PandarenVideo} type="video/mp4" />
                </video>
                <video autoPlay muted loop className="container-video-fallback">
                    <source src={PandarenVideo} type="video/mp4" />
                </video>
            </div>
            <DialogBox onClick={handleClick}>{language['error.404']}</DialogBox>
        </>
    );
};

NotFound.displayName = 'NotFound';
