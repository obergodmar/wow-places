import { useEffect } from 'react';
import { randomNumber } from '../../utils';
import Sound from '../../modules/sound';

interface Props {
    music: string[];
    setPlaying: (value: boolean) => void;
    setCurrentPlaying: (value: Sound | undefined) => void;
}

export function MusicComponent({ music, setPlaying, setCurrentPlaying }: Props) {
    useEffect(() => {
        let current: Sound | undefined;
        const next = () => {
            current?.dispose();
            if (!music.length) return;
            current = new Sound(music[randomNumber(0, music.length)]);
            current.audio.onplay = () => setPlaying(true);
            current.audio.onpause = () => setPlaying(false);
            current.audio.onended = next;
            setPlaying(false);
            setCurrentPlaying(current);
        };
        next();
        return () => {
            current?.dispose();
        };
    }, [music, setPlaying, setCurrentPlaying]);
    return null;
}
