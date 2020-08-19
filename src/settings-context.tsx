import * as React from "react";
import { createContext, useState } from "react";

import ru from "./locales/ru.json";
import en from "./locales/en.json";

export interface Settings {
  language: typeof ru | typeof en;
  musicVolume: number;
  currentLanguage: string;
  uiLanguage: string[];
  uiSound: boolean;
}

export interface SettingsContextType {
  settings: Settings;
  saveSettings?: (value: Settings) => void;
}

interface Props {
  children: React.ReactNode;
  settings: Settings;
}

const defaultSettings: SettingsContextType = {
  settings: {
    language: ru,
    musicVolume: 1.0,
    currentLanguage: ru["ui.language"],
    uiLanguage: [ru["ui.language"], en["ui.language"]],
    uiSound: true,
  },
};
const SettingsContext = createContext(defaultSettings);

export const SettingsProvider: React.FC<Props> = ({
  children,
  settings,
}: Props) => {
  const [currentSettings, setCurrentSettings] = useState(
    settings || defaultSettings
  );

  const saveSettings = (value: Settings) => {
    setCurrentSettings(value);
  };

  return (
    <SettingsContext.Provider
      value={{ settings: currentSettings, saveSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
