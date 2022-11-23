/// <reference types="@sveltejs/kit" />

import type { UserAccess } from './lib/auth/access';

declare global {
  // See https://kit.svelte.dev/docs/types#app
  // for information about these interfaces
  // and what to do when importing types  namespace App {
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

  // interface PageData {}
  // interface Error {}
  // interface Platform {}
}
