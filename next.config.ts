import type { NextConfig } from 'next';
import { version } from './package.json';

const config: NextConfig = {
    env: { NEXT_PUBLIC_APP_VERSION: version },
    poweredByHeader: false,
};
export default config;
