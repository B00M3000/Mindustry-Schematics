import { page } from '$app/stores';
import { writable } from 'svelte/store';
interface PathsStore {
  current?: string;
  previous?: string;
}
export const paths = writable<PathsStore>({}, () => {
  page.subscribe((value) => {
    const query = value.url.search;
    let path = value.url.pathname;
    if (query) path += query;
    paths.update((latest) => ({
      current: path,
      previous: latest.current,
    }));
  });
});
