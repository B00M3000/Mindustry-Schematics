import { session } from '$app/stores';
import type { ClientSession } from '@/interfaces/app';
import { UserAccess } from '@/lib/auth/access';
import { get, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

class User {
  private readonly store: Writable<ClientSession>;
  readonly subscribe: Writable<ClientSession>['subscribe'];
  constructor() {
    this.store = writable(
      {
        access: UserAccess.from(undefined),
      },
      (set) => {
        const $session = get<ClientSession>(session);
        set(serializeUser($session.user ?? {}));
      });
    this.subscribe = this.store.subscribe;
  }

  private set(value: ClientSession) {
    this.store.set(value);
    session.set(value);
  }

  async logout(): Promise<boolean> {
    const response = await fetch('/user/logout.json', {
      method: 'POST',
    });

    this.set(serializeUser({}))

    if(response.status == 200) return true
    else return false
  }

  async avatar(mime?: string, data?: string): Promise<boolean> {
    const response = await fetch('/user/avatar.json', {
      method: 'POST',
      body: JSON.stringify({
        content_type: mime,
        data: data
      })
    });

    const responseJSON = response.json();

    this.set(serializeUser(responseJSON.user))

    if(response.status == 200) return true
    else return false
  }
}

function serializeUser(user){
  return {
    ...user,
    access: UserAccess.from(user.access)
  }
}

export let user = new User();