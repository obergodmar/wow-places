import type { ReactNode } from 'react';
import ru from '../../locales/ru.json';
import en from '../../locales/en.json';
import { useSettings } from '../../hooks';
import { BorderedHeader, CheckboxComponent, RangeComponent, SelectComponent } from '..';
import './settings-component.scss';

interface Props {
    closeSettings: () => void;
    checkboxOnSoundPlay: () => void;
    checkboxOffSoundPlay: () => void;
}
export function SettingsComponent({
    closeSettings,
    checkboxOnSoundPlay,
    checkboxOffSoundPlay,
}: Props) {
    const { settings, saveSettings } = useSettings();
    const { language } = settings;
    const changeLanguage = (name: string) => {
        if (name === settings.currentLanguage) return;
        saveSettings({
            ...settings,
            language: name === ru['ui.language'] ? ru : en,
            currentLanguage: name,
        });
        if (settings.uiSound) checkboxOnSoundPlay();
    };
    const toggleSound = () => {
        saveSettings({ ...settings, uiSound: !settings.uiSound });
        if (settings.uiSound) checkboxOffSoundPlay();
    };
    const changeVolume = (musicVolume: number) => {
        if (settings.uiSound) checkboxOnSoundPlay();
        saveSettings({ ...settings, musicVolume });
    };
    const row = (label: string, control: ReactNode) => (
        <div className="settings-option">
            <div className="settings-option-name">{label}</div>
            {control}
        </div>
    );
    return (
        <div className="settings">
            <div className="settings-header">
                <BorderedHeader>{language['ui.main-menu']}</BorderedHeader>
            </div>
            <div className="settings-content">
                {row(
                    language['ui.uiLanguage'],
                    <SelectComponent
                        handleChange={changeLanguage}
                        current={settings.currentLanguage}
                        options={settings.uiLanguage}
                    >
                        {settings.currentLanguage}
                    </SelectComponent>,
                )}
                {row(
                    language['ui.musicVolume'],
                    <RangeComponent value={settings.musicVolume} handleChange={changeVolume} />,
                )}
                {row(
                    language['ui.uiSound'],
                    <CheckboxComponent
                        label={language['ui.uiSound']}
                        value={settings.uiSound}
                        handleClick={toggleSound}
                    />,
                )}
            </div>
            <button className="settings-button" onClick={closeSettings}>
                {language['ui.button.close']}
            </button>
        </div>
    );
}
