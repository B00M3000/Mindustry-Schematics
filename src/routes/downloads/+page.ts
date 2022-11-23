import { browser, dev } from '$app/environment';

export const hydrate = dev;
export const router = browser;
export const prerender = true;
