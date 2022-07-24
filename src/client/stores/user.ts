import { session } from '$app/stores';
import { UserAccess } from '@/lib/auth/access';
import { writable } from 'svelte/store';

interface UserStore {
  id?: string,
  username?: string,
  verified?: boolean,
  uaccess: UserAccess,
  avatar_url?: string,
}

interface Session {
  id?: string,
  username?: string,
  verified?: boolean,
  access?: string,
  avatar_url?: string,
}

const { set, subscribe } = writable<UserStore>(
  {
    uaccess: UserAccess.from(undefined),
  },
  (set) => {
    session.subscribe(($session: Session) => {
      set({
        id: $session.id,
        username: $session.username,
        verified: $session.verified,
        uaccess: UserAccess.from($session.access),
        avatar_url: $session.avatar_url
      });
    })();
  },
);

export const user = {
  subscribe,
  async logout(): Promise<void> {
    await fetch('/user/logout.json', {
      method: 'POST',
    });
    set({
      uaccess: UserAccess.from(undefined),
    });
  },
};
