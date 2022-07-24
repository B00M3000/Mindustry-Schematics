/// <reference types="@sveltejs/kit" />

import type { UserAccess } from './lib/auth/access';

declare global {
  // See https://kit.svelte.dev/docs/types#the-app-namespace
  // for information about these interfaces
  namespace App {
    interface Locals {
      user?: {
        id: string;
        username: string;
        access: UserAccess;
        verified: boolean;
        avatar_url: string;
      };
    }

    interface Session {
      id?: string;
      username?: string;
      access?: string;
      verified?: boolean;
      avatar_url?: string;
    }

    // interface Platform {}

    // interface Stuff {}
  }
}
