import { session } from '$app/stores';
import type { Session } from '@/interfaces/app';
import { UserAccess } from '@/lib/auth/access';
<<<<<<< HEAD
import { Writable, writable } from 'svelte/store';
=======
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
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
function write(value: AuthStore) {
  set(value);
  (session as Writable<Session>).set({
    access: value.access.name,
    name: value.name,
    token: value.token,
  });
}
export const auth = {
  subscribe,
  async login(token: string): Promise<void> {
<<<<<<< HEAD
    const response = await fetch('/api/user/login', {
=======
    const response = await fetch('/api/user/login.json', {
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
      method: 'POST',
      body: JSON.stringify({
        token,
      }),
    });
    if (response.status == 404) throw new Error('Token not registered');
    const data = await response.json();
    write({
      ...data,
      token,
      access: UserAccess.from(data.access),
    });
  },
  async logout(): Promise<void> {
<<<<<<< HEAD
    await fetch('/api/user/logout', {
=======
    await fetch('/api/user/logout.json', {
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
      method: 'POST',
    });
    write({
      access: UserAccess.from(undefined),
    });
  },
  async sync(): Promise<void> {
    let token: string | undefined;
    this.subscribe(($auth) => (token = $auth.token))();
    if (token) await this.login(token);
  },
};
