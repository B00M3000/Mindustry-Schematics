<script context="module" lang="ts">
  interface PreloadPage {
    host: string;
    path: string;
    query: Record<string, string>;
    params: Record<string, string>;
  }
  export async function preload(
    this: { fetch: typeof fetch },
    page: PreloadPage
  ) {
    const { id } = page.params;
    const response = await this.fetch(`/api/schematics/${id}`);
    const schematic = await response.json();
    return { schematic };
  }
</script>

<script lang="ts">
  import type { SchematicJSON } from '@/interfaces/json';
  import BackButton from '@/src/components/buttons/BackButton.svelte';
  import { safeDescription } from '@/util/safe_description';
  import { goto } from '@sapper/app';
  export let schematic: SchematicJSON;
  let form: HTMLFormElement;
  let submitting = false;
  async function submit(e: Event) {
    e.preventDefault();
    submitting = true;
    const data = new FormData(form);
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
    });
    goto(response.url);
  }
</script>

<h1>Delete a Schematic</h1>
<form
  action="/api/schematics/{schematic._id}/delete"
  method="POST"
  bind:this={form}
  on:submit={submit}
>
  <h2 class="title">[Schematic] {schematic.name}</h2>
  <img src="/raw/schematics/{schematic._id}/image" alt="schematic preview" />
  <h3 class="creator">by {schematic.creator}</h3>
  <h4 class="description">{@html safeDescription(schematic.description)}</h4>
  <div class="inputs">
    <label for="reason">Reason:</label>
    <textarea
      name="reason"
      id="reason"
      placeholder="Why should this schematic be removed?"
      required
    />
  </div>
  <button type="submit">Submit Deletion Request</button>
</form>
<footer>
  <BackButton href="/schematics/{schematic._id}" smart />
</footer>

<style>
  h1 {
    text-align: center;
    margin-top: 1.5rem;
  }
  form {
    color: white;
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: min-content min-content min-content min-content min-content min-content min-content;
    gap: 1em 2em;
    padding: 2em;
    grid-template-areas:
      'preview title'
      'preview creator'
      'preview description'
      'preview input'
      'preview submit';
    align-items: center;
    justify-items: baseline;
    word-wrap: break-word;
    word-break: break-all;
    word-break: break-word;
    hyphens: auto;
  }
  .title {
    grid-area: title;
  }
  .creator {
    grid-area: creator;
  }
  .description {
    grid-area: description;
    text-align: start;
  }
  form img {
    grid-area: preview;
    width: 100%;
    border-radius: 1em;
    align-self: baseline;
  }
  .inputs {
    display: flex;
    flex-direction: column;
    gap: 0.2em;
    align-items: baseline;
  }
  textarea {
    width: 50vw;
    max-width: 500px;
  }
  button[type='submit'] {
    grid-area: submit;
  }
  @media screen and (max-width: 600px) {
    form {
      text-align: center;
      grid-template-columns: 1fr;
      grid-template-rows: min-content min-content auto min-content min-content min-content min-content min-content;
      grid-template-areas:
        'title'
        'author'
        'preview'
        'description'
        'input'
        'submit';
      justify-items: center;
    }
    form img {
      width: 70vw;
    }
    form .title {
      font-size: 1.2em;
    }
    form .creator {
      font-size: 0.9em;
    }
  }
</style>
