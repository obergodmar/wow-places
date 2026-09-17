import { assetUrl } from './urls';

export const Plug = assetUrl('/media/ui/plug.png');
export const Background = assetUrl('/media/ui/background.png');

export const criticalUiImages = [
    'backgroundTexture',
    'panelBackground',
    'background',
    'border',
    'borderRight',
    'borderTop',
    'plug',
    'buttonUp',
    'dialogBorder',
].map((name) => assetUrl(`/media/ui/${name}.png`));
