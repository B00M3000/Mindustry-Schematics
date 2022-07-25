<script lang="ts">
  import { onMount } from 'svelte';

  let class_name = '';
  export { class_name as class };

  let container: HTMLDivElement;

  let height = '0px';

  onMount(() => {
    const observer = new ResizeObserver((entries) => {
      const [entry] = entries;

      height = `${entry.borderBoxSize[0].blockSize}px`;
    });

    observer.observe(container);
  });
</script>

<div class="spaced {class_name}" style:height />
<div class="floating {class_name}" bind:this={container}>
  <slot />
</div>

<style>
  .floating {
    position: fixed;
    bottom: 0;
    display: flex;
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(2px);
    color: var(--on-surface);
    width: 100%;
    padding: 0.5rem;
    gap: 1em;
    z-index: 10;
    justify-content: center;
    align-items: center;
  }

  .spaced {
    padding: 0;
    margin: 0;
  }
</style>
