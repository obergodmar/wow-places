export function assetUrl(path: string): string {
    const version = process.env.NEXT_PUBLIC_ASSET_VERSION;
    if (!version) return path;
    return path.replace(/^\/(media|fonts)\//, `/$1/v-${version}/`);
}
