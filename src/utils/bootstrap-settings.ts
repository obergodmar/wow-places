import { Settings } from '../settings-context';
import en from '../locales/en.json';
import ru from '../locales/ru.json';

export function bootstrapSettings(): Settings {
    const initialSettings: Settings = {
        language: en,
        musicVolume: 1.0,
        currentLanguage: en['ui.language'],
        uiLanguage: [en['ui.language'], ru['ui.language']],
        uiSound: true,
    };
    const languageString =
        (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        navigator.userLanguage;

    const language = languageString.match(/\w*/i);
    if (!language || !language.length) {
        return initialSettings;
    }

    switch (language[0]) {
        case 'ru':
            return {
                ...initialSettings,
                language: ru,
                currentLanguage: ru['ui.language'],
            };
        case 'en':
            return {
                ...initialSettings,
                language: en,
                currentLanguage: en['ui.language'],
            };
        default:
            return initialSettings;
    }
}
