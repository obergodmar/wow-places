import * as React from 'react';
import { useSettings } from '../../hooks';

import './dialog-box.scss';

interface Props {
    onClick: () => void;
    children: React.ReactNode;
}

export const DialogBox: React.FC<Props> = ({ children, onClick }: Props) => {
    const {
        settings: { language },
    } = useSettings();
    return (
        <div className="dialog-box">
            <span className="dialog-box-message">{children}</span>
            <button onClick={onClick}>{language['ui.dialog.button']}</button>
        </div>
    );
};

DialogBox.displayName = 'DialogBox';
