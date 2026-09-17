'use client';

import { preload } from 'react-dom';
import { criticalUiImages } from '../assets';
import { assetUrl } from '../assets/urls';

// Client components are also rendered on the server, so these hints reach the
// browser in the initial HTML without waiting for Experience to mount.
export function UiAssetPreloads() {
    for (const href of criticalUiImages) preload(href, { as: 'image' });
    preload(assetUrl('/fonts/font-0.woff2'), {
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
    });
    return null;
}

export function ScenePreload({ src }: { src: string }) {
    preload(src, { as: 'image', fetchPriority: 'high' });
    return null;
}
