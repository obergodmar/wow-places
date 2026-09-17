import type { Settings } from '../settings-context';
import en from '../locales/en.json';
import ru from '../locales/ru.json';

export function bootstrapSettings(
    locale = typeof navigator === 'undefined'
        ? 'en'
        : navigator.languages?.[0] || navigator.language,
): Settings {
    const language = locale?.toLowerCase().split(/[-_]/)[0] === 'ru' ? ru : en;
    return {
        language,
        musicVolume: 1,
        currentLanguage: language['ui.language'],
        uiLanguage: [en['ui.language'], ru['ui.language']],
        uiSound: true,
    };
}
