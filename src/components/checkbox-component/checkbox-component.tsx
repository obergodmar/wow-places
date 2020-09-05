import * as React from 'react';
import { KeyboardEvent, useCallback } from 'react';
import cn from 'classnames';

import { Settings } from '../../settings-context';

import './checkbox-component.scss';

interface Props {
    handleClick: (option: keyof Settings) => void;
    optionName: keyof Settings;
    value: boolean;
}

export const CheckboxComponent: React.FC<Props> = ({ handleClick, optionName, value }: Props) => {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent, option: keyof Settings) => {
            if (e.keyCode !== 13 && e.keyCode !== 32) {
                return;
            }
            handleClick(option);
        },
        [handleClick],
    );

    return (
        <div
            tabIndex={0}
            onClick={() => handleClick(optionName)}
            onKeyDown={(e) => handleKeyDown(e, optionName)}
            className={cn('checkbox', { 'checkbox--checked': value })}
        />
    );
};

CheckboxComponent.displayName = 'CheckboxComponent';
