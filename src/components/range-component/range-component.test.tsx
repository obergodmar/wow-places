import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { RangeComponent } from './range-component';
import { SettingsProvider } from '../../settings-context';
import { bootstrapSettings } from '../../utils';
it.each([
    [0, 'ArrowLeft', 0],
    [1, 'ArrowRight', 1],
    [0.5, 'Home', 0],
    [0.5, 'End', 1],
])('clamps volume %s with %s', (value, key, expected) => {
    const handleChange = vi.fn();
    render(
        <SettingsProvider settings={bootstrapSettings('en')}>
            <RangeComponent value={value as number} handleChange={handleChange} />
        </SettingsProvider>,
    );
    fireEvent.keyDown(screen.getByRole('slider'), { key });
    expect(handleChange).toHaveBeenCalledWith(expected);
});
