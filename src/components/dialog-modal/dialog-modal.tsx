import * as React from 'react';
import { KeyboardEvent, memo, useCallback } from 'react';
import cn from 'classnames';

import './dialog-modal.scss';
import { useDialogStep } from '../../hooks';

interface Props {
    avatar?: string;
    text: string[];
    title?: string;
    offsetTop: number;
    isShown: boolean;
    onClose: () => void;
}

export const DialogModal = memo<Props>(({ text, title, offsetTop, isShown, onClose }: Props) => {
    const { step, isStepShown } = useDialogStep({ text });
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.keyCode !== 13 && e.keyCode !== 32) {
                return;
            }
            onClose();
        },
        [onClose],
    );

    return (
        <div
            className={cn('dialog-modal', {
                'dialog-modal_shown': isShown,
            })}
            style={{ top: offsetTop - 30 }}
        >
            <div className="dialog-modal_border">
                <div className="dialog-modal_texture">
                    <div className="dialog-modal-image" />
                </div>
            </div>
            <div className="dialog-modal-content">
                <div className="dialog-modal-content__title">{title}</div>
                <div
                    className={cn('dialog-modal-content__text', {
                        'dialog-modal-content__text_shown': isStepShown,
                    })}
                >
                    {step}
                </div>
            </div>
            <div
                tabIndex={0}
                onClick={onClose}
                onKeyDown={handleKeyDown}
                className="dialog-modal-button"
            />
        </div>
    );
});

DialogModal.displayName = 'DialogModal';
