<script context="module" lang="ts">
  interface TutorialInfo {
    name: string;
    title: string;
  }
  export const load: Load = async ({ fetch }) => {
    const response = await fetch('/api/tutorials');
    const data = (await response.json()) as TutorialInfo[];
    return {
      props: {
        tutorials: data,
      },
    };
  };

  export const prerender = true;
</script>

<script lang="ts">
  import type { Load } from '@sveltejs/kit';

  export let tutorials: TutorialInfo[];
</script>

<svelte:head>
  <meta property="og:title" content="Guides" />
  <meta property="og:description" content="Guides that you might find helpful" />
  <meta property="og:image" content="/assets/mindustry_banner.png" />
  <meta property="og:type" content="website" />
  <title>Guides</title>
</svelte:head>
<main>
  {#await tutorials then tutorials}
    <ul>
      {#each tutorials as tutorial}
        <li>
          <a href="/guides/{tutorial.name}">
            <button>{tutorial.title}</button>
          </a>
        </li>
      {/each}
    </ul>
  {/await}
</main>

<style>
  main ul {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    list-style: none;
    padding: 1em;
    gap: 1em;
  }
  main ul button {
    padding: 1em;
    width: 50vw;
  }

  @media screen and (max-width: 600px) {
    main ul button {
      width: 80vw;
    }
  }
</style>
