/* eslint-disable no-unused-vars */

declare module '@zerodevx/svelte-toast' {
  import type { SvelteComponent } from 'svelte';

  export interface SvelteToastOptions {
    duration: number;
    dismissable: boolean;
    initial: number;
    progress: number;
    reversed: boolean;
    intro: unknown;
    theme: { [key: string]: string };
  }

  export class SvelteToast extends SvelteComponent {
    $$prop_def: {
      options?: SvelteToastOptions;
    };
  }

  export namespace toast {
    export function push(text: string, options?: Partial<SvelteToastOptions>): number;
    export function pop(id: number): void;
    export function set(id: number, options: SvelteToastOptions): void;
    export function _opts(options: SvelteToastOptions): SvelteToastOptions;
  }
}
