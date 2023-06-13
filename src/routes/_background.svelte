<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { onMount } from 'svelte';

  export let backgrounds: string[];
  let backgroundCache = new Map<string, string>();
  let html: HTMLElement;
  let current: string | undefined;
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

  function nextBackground() {
    let background: string;
    do {
      background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    } while (current == background);

    return background;
  }
  async function updateBackground() {
    busy = true;

    let next = nextBackground();

    let base64Data = backgroundCache.get(next);
    if (!base64Data) {
      base64Data = await fetchImage(next);
      backgroundCache.set(next, base64Data);
    }

    html.style.setProperty('--temp-image', `url("${base64Data}")`);
    html.style.setProperty('--temp-opacity', '1');

    await delay(1000);

    html.style.setProperty('--solid-image', `url("${base64Data}")`);

    await delay(200);

    html.style.setProperty('--temp-opacity', '0');

    await delay(600);

    current = next;
    busy = false;
  }

  async function fetchImage(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();

    return await new Promise<string>((resolve, reject) => {
      reader.addEventListener('error', reject);
      reader.addEventListener('load', (e) => resolve(reader.result as string));
      reader.readAsDataURL(blob);
    });
  }
</script>
