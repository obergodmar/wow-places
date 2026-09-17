import * as React from 'react';
import { FocusEvent, KeyboardEvent, useCallback, useRef, useState } from 'react';
import cn from 'classnames';

import './select-component.scss';

interface Props {
    children: React.ReactNode;
    options: string[];
    current: string;
    handleChange: (value: string) => void;
}

export const SelectComponent: React.FC<Props> = ({
    children,
    options,
    current,
    handleChange,
}: Props) => {
    const [isSelectShown, setSelectShown] = useState(false);
    const dropDownRef = useRef<HTMLDivElement>(null);

    const handleSelectClick = useCallback(() => setSelectShown(!isSelectShown), [isSelectShown]);

    const handleBlur = (e: FocusEvent) => {
        if (!dropDownRef.current) {
            return;
        }
        if (
            dropDownRef.current.contains(e.relatedTarget as Node) ||
            e.currentTarget === e.relatedTarget
        ) {
            return;
        }
        setSelectShown(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Enter' && e.key !== ' ') {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        setSelectShown(!isSelectShown);
    };

    const onItemClick = (itemValue: string) => handleChange(itemValue);

    const onItemKeyDown = (e: KeyboardEvent, itemValue: string) => {
        if (e.key !== 'Enter' && e.key !== ' ') {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        handleChange(itemValue);
        setSelectShown(false);
    };

    return (
        <div
            role="combobox"
            aria-expanded={isSelectShown}
            aria-label={String(children)}
            onClick={handleSelectClick}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            tabIndex={0}
            className={cn('select', {
                'select--opened': isSelectShown,
            })}
        >
            {children}
            <div className="select-arrow" />
            {isSelectShown && (
                <div role="listbox" ref={dropDownRef} className="select-drop-down">
                    {options.map((item) => (
                        <div
                            role="option"
                            aria-selected={item === current}
                            key={item}
                            tabIndex={0}
                            onClick={() => onItemClick(item)}
                            onKeyDown={(e) => onItemKeyDown(e, item)}
                            className={cn('select-item', {
                                'select-item--selected': item === current,
                            })}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

SelectComponent.displayName = 'SelectComponent';
