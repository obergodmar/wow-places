import type { Metadata, Viewport } from 'next';
import './globals.scss';
import '../screens/app/style.scss';

export const metadata: Metadata = {
    title: 'WoW Best Places',
    description: 'This app is supposed to make you feel nostalgic',
    applicationName: 'WoW Best Places',
    manifest: '/site.webmanifest',
    icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
};
export const viewport: Viewport = { themeColor: '#ffffff' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
