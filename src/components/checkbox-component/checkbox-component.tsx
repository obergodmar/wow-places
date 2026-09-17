import cn from 'classnames';
import './checkbox-component.scss';
interface Props {
    handleClick: () => void;
    label: string;
    value: boolean;
}
export function CheckboxComponent({ handleClick, label, value }: Props) {
    return (
        <div
            role="checkbox"
            aria-label={label}
            aria-checked={value}
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    handleClick();
                }
            }}
            className={cn('checkbox', { 'checkbox--checked': value })}
        />
    );
}
