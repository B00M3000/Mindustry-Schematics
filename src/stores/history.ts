import { writable } from 'svelte/store';
interface NavigationData {
  current?: string;
  previous?: string;
}
export const navigation = writable<NavigationData>({
  current: globalThis.window?.location.href,
  previous: undefined,
});
