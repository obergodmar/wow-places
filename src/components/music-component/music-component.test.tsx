import { render } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { MusicComponent } from './music-component';
import type Sound from '../../modules/sound';
it('loads one track, advances when it ends and releases the previous audio', () => {
    vi.stubGlobal(
        'Audio',
        class {
            volume = 1;
            preload = '';
            onplay: (() => void) | null = null;
            onpause: (() => void) | null = null;
            onended: (() => void) | null = null;
            play = vi.fn().mockResolvedValue(undefined);
            pause = vi.fn();
            load = vi.fn();
            removeAttribute = vi.fn();
        },
    );
    const setCurrentPlaying = vi.fn<(value: Sound | undefined) => void>();
    const setPlaying = vi.fn();
    const { unmount } = render(
        <MusicComponent
            music={['/one.ogg', '/two.ogg']}
            setCurrentPlaying={setCurrentPlaying}
            setPlaying={setPlaying}
        />,
    );
    expect(setCurrentPlaying).toHaveBeenCalledTimes(1);
    const first = setCurrentPlaying.mock.calls[0][0]!;
    first.audio.onplay?.(new Event('play'));
    expect(setPlaying).toHaveBeenLastCalledWith(true);
    first.audio.onpause?.(new Event('pause'));
    expect(setPlaying).toHaveBeenLastCalledWith(false);
    first.audio.onended?.(new Event('ended'));
    expect(setCurrentPlaying).toHaveBeenCalledTimes(2);
    expect(first.audio.removeAttribute).toHaveBeenCalledWith('src');
    const second = setCurrentPlaying.mock.calls[1][0]!;
    unmount();
    expect(second.audio.pause).toHaveBeenCalled();
    expect(second.audio.onended).toBeNull();
});
it('handles an empty playlist without selecting undefined media', () => {
    const setCurrentPlaying = vi.fn();
    render(
        <MusicComponent music={[]} setCurrentPlaying={setCurrentPlaying} setPlaying={vi.fn()} />,
    );
    expect(setCurrentPlaying).not.toHaveBeenCalled();
});
