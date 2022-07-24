<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { onMount } from 'svelte';

  export let backgrounds: string[];
  let html: HTMLElement;
  let busy = false;

  afterNavigate(() => {
    if (!busy) updateBackground();
  });

  onMount(() => {
    html = document.documentElement;
    updateBackground();
  });

  const delay = (milliseconds: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

  function nextBackground(current: string) {
    let background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    while (current == `url("${background}"")`) {
      background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    }
    return background;
  }
  async function updateBackground() {
    busy = true;

    let previous = html.style.getPropertyValue('--solid-image');
    let next = nextBackground(previous);

    html.style.setProperty('--temp-image', `url("${next}")`);
    html.style.setProperty('--temp-opacity', '1');

    await delay(1000);

    html.style.setProperty('--solid-image', `url("${next}")`);

    await delay(200);

    html.style.setProperty('--temp-opacity', '0');

    await delay(600);

    busy = false;
  }
</script>
