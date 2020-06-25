import * as React from 'react'

import ru from '../../locales/ru.json'
import en from '../../locales/en.json'
import { useSettings } from '../../hooks'
import { Settings } from '../../settings-context'
import { CheckBoxComponent, SelectComponent } from '..'

import './settings-component.scss'

type languageValue = keyof typeof ru;

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

    const renderOption = (option: keyof Settings, value: boolean | string[] = []) => {
        const {language} = settings
        const valueName = `ui.${option}` as languageValue
        return (
                <div className='settings-option'>
                    <div className='settings-option-name'>
                        {language[valueName]}
                    </div>
                    {typeof value !== 'boolean' ? (
                            <SelectComponent
                                    handleChange={handleChangeLanguage}
                                    current={language['ui.language']}
                                    options={settings[option] as []}
                            >
                                {language['ui.language']}
                            </SelectComponent>
                    ) : (
                            <CheckBoxComponent
                                    handleClick={handleCheckboxClick}
                                    optionName={option}
                                    value={value}
                            />
                    )}
                </div>
        )
    }

    return (
            <div className='settings'>
                <div className='settings-header'>
                    {settings.language['ui.main-menu']}
                </div>
                <div className='settings-content'>
                    {renderOption('uiSound', settings.uiSound)}
                    {renderOption('uiLanguage', settings.uiLanguage)}
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
