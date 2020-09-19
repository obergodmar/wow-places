import * as React from 'react';

import './dialog-modal.scss';

interface Props {
    avatar?: string;
    text: React.ReactNode;
}

export const DialogModal: React.FC<Props> = ({ text }: Props) => {
    return (
        <div className="dialog-modal">
            <div className="dialog-modal-image" />
            <div className="dialog-modal-text">{text}</div>
        </div>
    );
};

DialogModal.displayName = 'DialogModal';
