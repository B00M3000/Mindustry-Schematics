<script lang="ts">
  export let name: string;
</script>

<button class="person">{name}</button>
<div class="container popup">
  <div class="person popup">
    <slot />
  </div>
</div>

<style>
  button + div.container.popup {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    height: 100vh;
    width: 100vw;
    justify-content: center;
    align-items: center;
    opacity: 0;
    pointer-events: none;
    background-color: rgba(0, 0, 0, 0.5);
  }
  button:focus-within + div.container.popup,
  div.container.popup:active {
    opacity: 1;
    pointer-events: all;
    transition: opacity 0.5s ease;
  }
  div.person.popup {
    padding: 1em;
    border-radius: 1em;
    background-color: var(--surface);
  }
</style>
