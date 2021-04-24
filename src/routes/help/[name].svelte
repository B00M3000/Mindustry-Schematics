<script context="module" lang="ts">
  export async function preload(this: { fetch: typeof fetch }, page: any) {
    const { params } = page;
    const name = params.name as string;
    const response = await this.fetch(`/api/tutorials/${name}`);
    const content = await response.text();
    return {
      content,
    };
  }
</script>

<script lang="ts">
  import BackButton from '@/src/components/buttons/BackButton.svelte';

  export let content: string = '';
</script>

<main>
  <article>
    {@html content}
  </article>
</main>
<footer>
  <BackButton href="/help" />
</footer>

<style>
  article {
    color: var(--on-background);
    text-align: center;
    padding: 0 2em;
  }
  :global(article h1) {
    margin: 1em 0;
  }
  :global(article h3) {
    margin: 1em;
  }
  :global(article li) {
    padding: 1em;
  }
  :global(article img) {
    max-width: 100%;
    margin: 1em 0;
  }
</style>
