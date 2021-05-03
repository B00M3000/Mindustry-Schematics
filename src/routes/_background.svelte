<script lang="ts">
  import { onMount } from 'svelte';

  let backgrounds: string[];
  let html: HTMLElement;
  const duration = 6000;
  onMount(() => {
    html = document.documentElement;
    async function load() {
      const response = await fetch('/api/backgrounds');
      backgrounds = (await response.json()) as string[];
      html.classList.add('active');
      setInterval(() => {
        updateBackground();
      }, duration);
    }
    load();
  });
  function nextBackground(current: string) {
    let background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    while (current == `url(${background})`) {
      background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    }
    return background;
  }
  async function updateBackground() {
    let bottom = html.style.getPropertyValue('--bottom-image');
    let top = nextBackground(bottom);
    html.style.setProperty('--top-image', `url(${top})`);
    html.classList.remove('bottom');
    html.classList.add('top');
    await new Promise((resolve) => setTimeout(resolve, duration / 2));
    bottom = nextBackground(top);
    html.style.setProperty('--bottom-image', `url(${bottom}`);
    html.classList.remove('top');
    html.classList.add('bottom');
  }
</script>
