import { session } from '$app/stores';
import type { Session } from '@/interfaces/app';
import { UserAccess } from '@/lib/auth/access';
import { Writable, writable } from 'svelte/store';
interface AuthStore {
  name?: string;
  uid?: string;
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
        uid: $session.uid,
        access: UserAccess.from($session.access),
      });
    })();
  },
);
export const auth = {
  subscribe,
  async login(uid: string): Promise<void> {
    const response = await fetch('/api/user/login', {
      method: 'POST',
      body: JSON.stringify({
        uid,
      }),
    });
    if (response.status == 404) throw new Error('Uid does not exist');
    const data = await response.json();
    set({
      ...data,
      uid,
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
    let uid: string | undefined;
    this.subscribe(($auth) => (uid = $auth.uid))();
    if (uid) await this.login(uid);
  },
};
