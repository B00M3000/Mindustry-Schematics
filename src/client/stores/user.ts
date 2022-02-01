import { session } from '$app/stores';
import { ClientSession } from '@/interfaces/app';
import { UserAccess } from '@/lib/auth/access';
import { writable } from 'svelte/store';
import { Writable } from 'svelte/store';

class User {
  private readonly store: Writable<ClientSession>;
  readonly subscribe: Writable<ClientSession>['subscribe'];
  constructor() {
    this.store = writable( this.sync(false) );
    this.subscribe = this.store.subscribe;
  }

  async logout(): Promise<boolean> {
    const response = await fetch('/user/logout.json', {
      method: 'POST',
    });
    
    this.store.update({
      access: UserAccess.from(null)
    })

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

    //sync()

    if(response.status == 200) return true
    else return false
  }

  async sync(update: boolean = true): Promise<ClientSession> {
    const response = await fetch('/user.json')
    if(response.status == 404){
      const value = { access: UserAccess.from(null) }
      if(update) this.store.update(value)
      return value
    } else if(response.status == 200){
      const user: ClientSession = response.json()
      const value = {
        ...user,
        access: UserAccess.from(user.access)
      }
      if(update) this.store.update(value)
      return value
    }
  }
}

export let user = new User();