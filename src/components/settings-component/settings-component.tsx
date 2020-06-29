import * as React from 'react'

import ru from '../../locales/ru.json'
import en from '../../locales/en.json'
import { useSettings } from '../../hooks'
import { Settings } from '../../settings-context'
import { BorderedHeader, CheckBoxComponent, RangeComponent, SelectComponent } from '..'

import './settings-component.scss'

interface Props {
    closeSettings: () => void
    checkboxOnSoundPlay: (volume?: number) => void
    checkboxOffSoundPlay: (volume?: number) => void
}

export const SettingsComponent = ({closeSettings, checkboxOnSoundPlay, checkboxOffSoundPlay}: Props) => {
    const {settings, saveSettings} = useSettings()

    const handleCheckboxClick = (option: keyof Settings) => {
        saveSettings!({...settings, [option]: !settings[option]})
        if (!settings.uiSound) {
            return
        }
        if (settings[option]) {
            checkboxOffSoundPlay()
        } else {
            checkboxOnSoundPlay()
        }
    }

    const handleChangeLanguage = (nextLanguage: string) => {
        if (settings.currentLanguage === nextLanguage) {
            return
        }
        if (nextLanguage === ru['ui.language']) {
            saveSettings!({...settings, language: ru, currentLanguage: nextLanguage})
        } else {
            saveSettings!({...settings, language: en, currentLanguage: nextLanguage})
        }
        if (!settings.uiSound) {
            return
        }
        checkboxOnSoundPlay()
    }

    const handleChangeRange = (value: number) => {
        checkboxOnSoundPlay()
        saveSettings!({...settings, musicVolume: value})
    }

    const chooseOption = (option: keyof Settings) => {
        const {language} = settings
        switch (typeof settings[option]) {
            case 'boolean':
                return (
                        <CheckBoxComponent
                                handleClick={handleCheckboxClick}
                                optionName={option}
                                value={settings[option] as boolean}
                        />
                )
            case 'object':
                return (
                        <SelectComponent
                                handleChange={handleChangeLanguage}
                                current={language['ui.language']}
                                options={settings[option] as []}
                        >
                            {language['ui.language']}
                        </SelectComponent>
                )
            case 'number':
                return (
                        <RangeComponent
                                defaultValue={settings[option] as number}
                                handleChange={handleChangeRange}
                        />
                )
        }
    }

    const renderOption = (option: keyof Settings) => {
        const {language} = settings
        const valueName = `ui.${option}` as keyof typeof language
        return (
                <div className='settings-option'>
                    <div className='settings-option-name'>
                        {language[valueName]}
                    </div>
                    {chooseOption(option)}
                </div>
        )
    }

    return (
            <div className='settings'>
                <div className='settings-header'>
                    <BorderedHeader>
                        {settings.language['ui.main-menu']}
                    </BorderedHeader>
                </div>
                <div className='settings-content'>
                    {renderOption('uiLanguage')}
                    {renderOption('musicVolume')}
                    {renderOption('uiSound')}
                </div>
                <button
                        className='settings-button'
                        onClick={closeSettings}
                >
                    {settings.language['ui.button.close']}
                </button>
            </div>
    )
}

SettingsComponent.displayName = 'SettingsComponent'
