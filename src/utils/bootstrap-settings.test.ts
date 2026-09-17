import { expect, it } from 'vitest';
import { bootstrapSettings } from './bootstrap-settings';
import ru from '../locales/ru.json';
import en from '../locales/en.json';
it.each(['ru', 'ru-RU', 'RU_ru'])('recognizes Russian %s', (locale) => {
    expect(bootstrapSettings(locale).language).toEqual(ru);
});
it.each(['en-US', 'fr-FR', ''])('falls back to English for %s', (locale) => {
    expect(bootstrapSettings(locale).language).toEqual(en);
});
it('initializes from browser language', () => {
    expect(bootstrapSettings().musicVolume).toBe(1);
    expect(bootstrapSettings().uiSound).toBe(true);
});
