import { invalidate } from '$app/navigation';
import { page } from '$app/stores';
import type { BasicUserJSON } from '@/interfaces/json';
import { UserAccess } from '@/lib/auth/access';
import { derived } from 'svelte/store';

interface Overrides {
  access: UserAccess;
}

type UserStore =
  | (Omit<App.Session, keyof Overrides> & Overrides)
  | ({ [K in Exclude<keyof App.Session, keyof Overrides>]?: undefined } & Overrides);

const { subscribe } = derived(
  page,
  ({ data: { session } }): UserStore => ({
    ...session,
    access: UserAccess.from(session.access),
  }),
);

export const user = {
  subscribe,
  async logout(): Promise<void> {
    await fetch('/user/logout.json', {
      method: 'POST',
    });
    await invalidate('app:logout');
  },
  async get(id: string): Promise<BasicUserJSON | null> {
    const res = await fetch(`/user/${id}.json`, {
      method: 'GET',
    });
    const data = await res.json();
    return res.status === 200 ? data : null;
  },
};
