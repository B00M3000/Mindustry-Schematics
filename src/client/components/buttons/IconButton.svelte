<script lang="ts">
  export let href: string | undefined = undefined;
  export let src: string;
  export let alt: string;
  export let border = false;
</script>

{#if href}
  <a {href} class={$$props.class} on:click>
    <button class="icon" class:no_border={!border}>
      <img {src} {alt} />
      <slot />
    </button>
  </a>
{:else}
  <button class="icon {$$props.class}" class:no_border={!border} on:click>
    <img {src} {alt} />
    <slot />
  </button>
{/if}

<style>
  button.icon {
    cursor: pointer;
    text-decoration: none;
    background-color: var(--surface);
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 0.5em;
    min-width: 1.5rem;
  }
  button.icon:hover {
    background-color: hsla(0, 0%, 60%, 0.8);
  }
  button.icon img {
    width: 1.5rem;
    max-height: 1.5rem;
    object-fit: contain;
  }
  button.no_border {
    border: none;
    border-radius: 0;
  }
  button.icon:hover {
    background-color: rgba(255, 255, 255, 0.4);
  }
  button.icon_text {
    display: flex;
    gap: 0.5em;
    align-items: center;
  }
</style>
