import { useContext } from 'react';
import SettingsContext from '../settings-context';
export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings requires SettingsProvider');
    return context;
}
