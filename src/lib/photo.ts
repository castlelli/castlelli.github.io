// Finds an author photo in public/photos/<name>.<ext>, whatever format it was saved in.
import { existsSync } from 'node:fs';

const EXTS = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'JPG', 'JPEG', 'PNG'];

export function findPhoto(name: string): string | null {
  for (const ext of EXTS) {
    const src = `/photos/${name}.${ext}`;
    if (existsSync(`public${src}`)) return src;
  }
  return null;
}
