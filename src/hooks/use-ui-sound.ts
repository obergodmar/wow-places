import { useMemo } from 'react';

import Sound from '../modules/sound';
import { soundLoad, UI_SOUND_VOLUME } from '../utils';

import PanelOpenAudio from '../assets/audio/panel-open.ogg';
import PanelCloseAudio from '../assets/audio/panel-close.ogg';

import SettingsOpenAudio from '../assets/audio/menu-open.ogg';
import SettingsCloseAudio from '../assets/audio/menu-close.ogg';

import CheckBoxOnAudio from '../assets/audio/check-box-on.ogg';
import CheckBoxOffAudio from '../assets/audio/check-box-off.ogg';

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

    return {
        panelOpenSound,
        panelCloseSound,
        settingsOpenSound,
        settingsCloseSound,
        checkboxOnSound,
        checkboxOffSound,
    };
};
