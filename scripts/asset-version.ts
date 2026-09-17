import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Content-based URLs let browsers retain assets across visits and deployments.
export function getAssetVersion(publicDirectory: string): string {
    const hash = createHash('sha256');
    for (const directory of ['media', 'fonts']) {
        const root = join(publicDirectory, directory);
        const files = readdirSync(root, { recursive: true, withFileTypes: true })
            .filter((entry) => entry.isFile())
            .map((entry) => join(entry.parentPath, entry.name))
            .sort();
        for (const file of files) {
            hash.update(`${directory}/${file.slice(root.length + 1)}\0`);
            hash.update(readFileSync(file));
        }
    }
    return hash.digest('hex').slice(0, 20);
}
