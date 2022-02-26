import { session } from '$app/stores';
import { UserAccess } from '@/lib/auth/access';
import { writable } from 'svelte/store';
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
    session.subscribe(($session) => {
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
  session.set({
    access: value.access.name,
    name: value.name,
    token: value.token,
  });
}
export const auth = {
  subscribe,
  async login(token: string): Promise<void> {
    const response = await fetch('/user/login.json', {
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
    await fetch('/user/logout.json', {
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
