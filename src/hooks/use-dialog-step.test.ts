import { act, renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { useDialogStep } from './use-dialog-step';
import { ANIMATION_DURATION, DIALOG_STEP_DURATION } from '../utils';
it('advances dialog text, stops at the last step and cancels timers', () => {
    vi.useFakeTimers();
    const { result, unmount } = renderHook(() => useDialogStep({ text: ['one', 'two'] }));
    expect(result.current.step).toBe('one');
    act(() => vi.advanceTimersByTime(DIALOG_STEP_DURATION));
    expect(result.current.isStepShown).toBe(false);
    act(() => vi.advanceTimersByTime(ANIMATION_DURATION / 2));
    expect(result.current.step).toBe('two');
    act(() => vi.advanceTimersByTime(DIALOG_STEP_DURATION * 3));
    expect(result.current.step).toBe('two');
    unmount();
    expect(vi.getTimerCount()).toBe(0);
});
it('handles empty dialogs', () => {
    expect(renderHook(() => useDialogStep({ text: [] })).result.current.step).toBe('');
});
