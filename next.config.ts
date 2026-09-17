import type { NextConfig } from 'next';
import { version } from './package.json';
import { resolve } from 'node:path';
import { getAssetVersion } from './scripts/asset-version';

const assetVersion = getAssetVersion(resolve('public'));

const config: NextConfig = {
    env: { NEXT_PUBLIC_APP_VERSION: version, NEXT_PUBLIC_ASSET_VERSION: assetVersion },
    poweredByHeader: false,
    sassOptions: {
        loadPaths: [resolve('src')],
        additionalData: `@use "assets/assets" with ($assetVersion: "${assetVersion}");`,
    },
    async rewrites() {
        return ['media', 'fonts'].map((directory) => ({
            source: `/${directory}/v-${assetVersion}/:path*`,
            destination: `/${directory}/:path*`,
        }));
    },
    async headers() {
        return ['media', 'fonts'].map((directory) => ({
            source: `/${directory}/v-${assetVersion}/:path*`,
            headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        }));
    },
};
export default config;
