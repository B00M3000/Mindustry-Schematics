import { session } from '$app/stores';
import type { Session } from '@/interfaces/app';
import { UserAccess } from '@/lib/auth/access';
import { Writable, writable } from 'svelte/store';
interface AuthState {
  name?: string;
  uid?: string;
  access: UserAccess;
}
class Auth {
  private readonly store: Writable<AuthState>;
  readonly subscribe: Writable<AuthState>['subscribe'];
  constructor() {
    this.store = writable(
      {
        access: UserAccess.from(undefined),
      },
      (set) => {
        const s = session as Writable<Session>;
        s.subscribe(($session) =>
          set({
            ...$session,
            access: UserAccess.from($session.access),
          }),
        )();
      },
    );
    this.subscribe = this.store.subscribe;
  }

  private set(value: AuthState) {
    this.store.set(value);
    session.set(value);
  }

  async login(uid: string): Promise<void> {
    const response = await fetch('/api/user/login', {
      method: 'POST',
      body: JSON.stringify({
        uid,
      }),
    });
    if (response.status == 404) throw new Error('Uid does not exist');
    const data = await response.json();
    this.set({
      ...data,
      uid,
      access: UserAccess.from(data.access),
    });
  }
  async logout(): Promise<void> {
    await fetch('/api/user/logout', {
      method: 'POST',
    });
    this.set({
      access: UserAccess.from(undefined),
    });
  }
  async sync(): Promise<void> {
    let uid: string | undefined;
    this.subscribe(($auth) => (uid = $auth.uid))();
    if (uid) await this.login(uid);
  }
}
export const auth = new Auth();
