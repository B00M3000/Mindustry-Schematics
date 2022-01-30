import { session } from '$app/stores';
import type { ClientSession } from '@/interfaces/app';
import { UserAccess } from '@/lib/auth/access';
import { get, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
interface AuthState {
  name?: string;
  id?: string;
  access: UserAccess;
  avatar?: string;
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
        const $session = get<ClientSession>(session);
        set({
          ...$session,
          access: UserAccess.from($session.access),
        });
      },
    );
    this.subscribe = this.store.subscribe;
  }

  private set(value: AuthState) {
    this.store.set(value);
    session.set(value);
  }

  async logout(): Promise<void> {
    await fetch('/user/logout.json', {
      method: 'POST',
    });
    this.set({
      access: UserAccess.from(undefined),
    });
  }
}
export const auth = new Auth();
