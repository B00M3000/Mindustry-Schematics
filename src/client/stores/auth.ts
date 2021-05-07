import { session } from '$app/stores';
import type { Session } from '@/interfaces/app';
import { writable } from 'svelte/store';
const { set, subscribe } = writable<Session>(
  {
    isAdmin: false,
    isMod: false,
  },
  (set) => {
    session.subscribe(($session) => set($session))();
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
    });
  },
  async logout(): Promise<void> {
    await fetch('/api/user/logout', {
      method: 'POST',
    });
    set({
      isAdmin: false,
      isMod: false,
    });
  },
  async sync(): Promise<void> {
    let token: string | undefined;
    this.subscribe(($auth) => (token = $auth.token))();
    if (token) await this.login(token);
  },
};
