import { session } from '$app/stores';
import type { Session } from '@/interfaces/app';
import { UserAccess } from '@/lib/auth/access';
import { Writable, writable } from 'svelte/store';
interface AuthStore {
  name?: string;
  token?: string;
  access: UserAccess;
}
const { set, subscribe } = writable<AuthStore>(
  {
    access: UserAccess.from(undefined),
  },
  (set) => {
    const s = session as Writable<Session>;
    s.subscribe(($session) => {
      set({
        name: $session.name,
        token: $session.token,
        access: UserAccess.from($session.access),
      });
    })();
  },
);
export const auth = {
  subscribe,
  async login(token: string): Promise<void> {
    const response = await fetch('/api/user/login', {
      method: 'POST',
      body: JSON.stringify({
        token,
      }),
    });
    if (response.status == 404) throw new Error('Token not registered');
    const data = await response.json();
    set({
      ...data,
      token,
      access: UserAccess.from(data.access),
    });
  },
  async logout(): Promise<void> {
    await fetch('/api/user/logout', {
      method: 'POST',
    });
    set({
      access: UserAccess.from(undefined),
    });
  },
  async sync(): Promise<void> {
    let token: string | undefined;
    this.subscribe(($auth) => (token = $auth.token))();
    if (token) await this.login(token);
  },
};
