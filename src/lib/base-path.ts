/**
 * On GitHub Pages the site lives under /cinq-website/, so every asset URL
 * written by hand needs the prefix. Next handles its own routes, fonts and
 * chunks; this covers the images and video referenced from `public/`.
 * Locally the prefix is empty and nothing changes.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path: string) {
  return `${BASE_PATH}${path}`;
}
