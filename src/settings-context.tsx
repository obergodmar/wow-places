import { createContext, useMemo, useState, type ReactNode } from 'react';
import type en from './locales/en.json';

export interface Settings {
    language: typeof en;
    musicVolume: number;
    currentLanguage: string;
    uiLanguage: string[];
    uiSound: boolean;
}
export interface SettingsContextType {
    settings: Settings;
    saveSettings: (value: Settings) => void;
}
const SettingsContext = createContext<SettingsContextType | null>(null);
export function SettingsProvider({
    children,
    settings,
}: {
    children: ReactNode;
    settings: Settings;
}) {
    const [currentSettings, saveSettings] = useState(settings);
    const value = useMemo(() => ({ settings: currentSettings, saveSettings }), [currentSettings]);
    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
export default SettingsContext;
