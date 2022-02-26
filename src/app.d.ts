/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces
declare namespace App {
  interface Locals {
    name?: string;
    token?: string;
    access?: string;
  }

  interface Session {
    name?: string;
    token?: string;
    access?: string;
  }

  // interface Platform {}

  // interface Stuff {}
}
