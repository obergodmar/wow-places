import { beforeEach, describe, expect, it, vi } from 'vitest';
import Sound, { validateVolume } from './sound';

describe('sound playback', () => {
    beforeEach(() => {
        vi.stubGlobal(
            'Audio',
            class {
                volume = 1;
                preload = '';
                readyState = 0;
                onplay = null;
                onpause = null;
                onended = null;
                play = vi.fn().mockResolvedValue(undefined);
                pause = vi.fn();
                load = vi.fn();
                removeAttribute = vi.fn();
            },
        );
    });
    it.each([-1, 1.1, NaN, Infinity])('rejects invalid volume %s', (volume) => {
        expect(() => validateVolume(volume)).toThrow(RangeError);
    });
    it('supports silence and updates active audio immediately', () => {
        const sound = new Sound('/music.ogg');
        expect(validateVolume()).toBe(1);
        expect(sound.setVolume(0)).toBe(sound);
        expect(sound.audio.volume).toBe(0);
        sound.playMusic();
        expect(sound.audio.play).toHaveBeenCalledOnce();
    });
    it('starts lazy audio even before readyState becomes nonzero', () => {
        const sound = new Sound('/music.ogg', 0.3);
        sound.playSound();
        expect(sound.audio.volume).toBe(0.3);
        expect(sound.audio.play).toHaveBeenCalledOnce();
        expect(sound.audio.preload).toBe('none');
    });
    it('handles autoplay rejection and cleans up playback', async () => {
        const sound = new Sound('/music.ogg');
        vi.mocked(sound.audio.play).mockRejectedValue(new Error('NotAllowedError'));
        sound.playMusic();
        await Promise.resolve();
        sound.pause();
        sound.dispose();
        expect(sound.audio.pause).toHaveBeenCalledTimes(2);
        expect(sound.audio.removeAttribute).toHaveBeenCalledWith('src');
        expect(sound.audio.onended).toBeNull();
    });
});
