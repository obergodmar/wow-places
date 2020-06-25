import * as React from 'react'
import UIfx from 'uifx'

import { useSettings } from '../../hooks'

import ru from '../../locales/ru.json'
import en from '../../locales/en.json'

import './settings-component.scss'
import { Settings } from '../../settings-context'
import { UI_SOUND_VOLUME } from '../../utils'
import { CheckBoxComponent, SelectComponent } from '..'

type languageValue = keyof typeof ru;

interface Props {
    closeSettings: () => void
    checkboxOnSound: UIfx
    checkboxOffSound: UIfx
}

export const SettingsComponent = ({closeSettings, checkboxOnSound, checkboxOffSound}: Props) => {
    const {settings, saveSettings} = useSettings()

    const handleCheckboxClick = (option: keyof Settings) => {
        saveSettings!({...settings, [option]: !settings[option]})
        if (!settings.uiSound) {
            return
        }
        if (settings[option]) {
            checkboxOffSound.play(UI_SOUND_VOLUME)
        } else {
            checkboxOnSound.play(UI_SOUND_VOLUME)
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
        checkboxOnSound.play(UI_SOUND_VOLUME)
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
