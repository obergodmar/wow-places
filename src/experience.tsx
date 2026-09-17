import { useState } from 'react';
import { SettingsProvider } from './settings-context';
import { bootstrapSettings } from './utils/bootstrap-settings';
import type { Place } from './domain/places';
import { App } from './screens/app';
import { NotFound } from './screens/not-found';

export default function Experience({ places }: { places?: Place[] }) {
    const [settings] = useState(bootstrapSettings);
    return (
        <SettingsProvider settings={settings}>
            {places ? <App places={places} /> : <NotFound />}
        </SettingsProvider>
    );
}
