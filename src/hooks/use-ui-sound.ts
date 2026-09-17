import { useEffect, useMemo } from 'react';

import Sound from '../modules/sound';
import { soundLoad, UI_SOUND_VOLUME } from '../utils';

const PanelOpenAudio = '/media/audio/panel-open.ogg';
const PanelCloseAudio = '/media/audio/panel-close.ogg';

const SettingsOpenAudio = '/media/audio/menu-open.ogg';
const SettingsCloseAudio = '/media/audio/menu-close.ogg';

const CheckBoxOnAudio = '/media/audio/check-box-on.ogg';
const CheckBoxOffAudio = '/media/audio/check-box-off.ogg';

type uiSoundType = {
    panelOpenSound: Sound;
    panelCloseSound: Sound;
    settingsOpenSound: Sound;
    settingsCloseSound: Sound;
    checkboxOnSound: Sound;
    checkboxOffSound: Sound;
};

export const useUiSound = (): uiSoundType => {
    const panelOpenSound = useMemo(() => soundLoad(PanelOpenAudio, UI_SOUND_VOLUME), []);
    const panelCloseSound = useMemo(() => soundLoad(PanelCloseAudio, UI_SOUND_VOLUME), []);
    const settingsOpenSound = useMemo(() => soundLoad(SettingsOpenAudio, UI_SOUND_VOLUME), []);
    const settingsCloseSound = useMemo(() => soundLoad(SettingsCloseAudio, UI_SOUND_VOLUME), []);
    const checkboxOnSound = useMemo(() => soundLoad(CheckBoxOnAudio, UI_SOUND_VOLUME), []);
    const checkboxOffSound = useMemo(() => soundLoad(CheckBoxOffAudio, UI_SOUND_VOLUME), []);

    useEffect(
        () => () => {
            [
                panelOpenSound,
                panelCloseSound,
                settingsOpenSound,
                settingsCloseSound,
                checkboxOnSound,
                checkboxOffSound,
            ].forEach((sound) => sound.pause());
        },
        [
            panelOpenSound,
            panelCloseSound,
            settingsOpenSound,
            settingsCloseSound,
            checkboxOnSound,
            checkboxOffSound,
        ],
    );

    return {
        panelOpenSound,
        panelCloseSound,
        settingsOpenSound,
        settingsCloseSound,
        checkboxOnSound,
        checkboxOffSound,
    };
};
