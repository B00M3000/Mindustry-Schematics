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
    html.style.setProperty('--top-image', top);
    html.classList.remove('second');
    html.classList.add('first');
    await new Promise((resolve) => setTimeout(resolve, duration / 2));
    const background = nextBackground(top);
    html.style.setProperty('--current-image', `url(${background}`);
    html.classList.remove('first');
    html.classList.add('second');
  }
</script>
