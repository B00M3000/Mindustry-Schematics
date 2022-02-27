<script lang="ts">
  import type {
    SchematicJSON,
    SchematicParseErrorJSON,
    SchematicParseJSON,
  } from '@/interfaces/json';
  import TagInput from './TagInput.svelte';
  import Scanning from './animated/Scanning.svelte';
  import { goto } from '$app/navigation';
  import { auth } from '../stores/auth';
  import { toast } from '@zerodevx/svelte-toast';
  import { onMount } from 'svelte';
  import { Access } from '@/lib/auth/access';
  import { Tag } from '@/lib/tags';
  export let variant: 'create' | 'edit';
  export let action: string;
  export let initialData: SchematicJSON | undefined = undefined;
  export let method = 'POST';

  // rendering controls
  type Mode = 'text' | 'file';
  let mode: Mode = 'text';
  let parseState: 'parsing' | 'parsed' | undefined;
  let locked = variant == 'create';
  let error: string | undefined;
  let invalid = false;

  let form: HTMLFormElement;
  let submitting = false;

  // form fields
  let name = initialData?.name || '';
  let description = initialData?.description || '';
  let text = initialData?.text || '';
  let creator = initialData?.creator || '';
  let currentTags: Tag[] = initialData ? Tag.parse(initialData.tags) : [];

  let image = initialData ? `/schematics/${initialData._id}.png` : undefined;

  function isValidSchematic(base64Code: string) {
    try {
      const decoded = atob(base64Code);
      const header = 'msch';
      // the startsWith method doesn't work
      for (let i = 0; i < header.length; i++) {
        // eslint-disable-next-line eqeqeq
        if (header[i] != decoded[i]) return false;
      }
      return true;
    } catch {
      return false;
    }
  }
  async function fileToText(file: File | undefined): Promise<string> {
    if (!file) return '';
    const reader = new FileReader();
    const promise = new Promise<string>((resolve) =>
      reader.addEventListener('load', (e) => resolve(btoa(e.target?.result as string))),
    );
    reader.readAsBinaryString(file);
    return promise;
  }
  async function submit(e: Event) {
    e.preventDefault();
    submitting = true;
    const data = new FormData(form);
    if (data.has('file')) {
      data.append('text', await fileToText(data.get('file') as File));
      data.delete('file');
    }
    data.append('tags', JSON.stringify(currentTags.map((tag) => tag.name)));
    const response = await fetch(action, {
      method,
      body: data,
    });
    const url = response.headers.get('location');
    await goto(url || '/');
    if (variant == 'edit' && $auth.access.can({ schematics: Access.updateAll })) {
      const { change } = await response.json();
      const changeUrl = `/admin/schematic_changes/${change}`;
      toast.push(`<a href="${changeUrl}"><button>See edit request</button></a>`);
    }
  }
  function changeMode(newMode: Mode) {
    if (parseState == 'parsing') return;
    text = '';
    mode = newMode;
    locked = true;
  }
  async function parseSchematic(this: HTMLInputElement) {
    const text = this.type == 'text' ? this.value : await fileToText(this.files?.[0]);

    if (!isValidSchematic(text)) {
      invalid = true;
      error = "This isn't a valid schematic";
      locked = true;
      return;
    }
    parseState = 'parsing';
    error = undefined;
    invalid = false;
    const response = await fetch('/schematics/parse.json', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
      },
      body: text.trim(),
    });
    parseState = 'parsed';
    switch (response.status) {
      case 200: {
        const json: SchematicParseJSON = await response.json();
        ({ name, description } = json);
        image = `data:image/png;base64,${json.image}`;
        locked = false;
        break;
      }
      case 400: {
        invalid = true;
        const json: SchematicParseErrorJSON = await response.json();
        error = json.error.message || "This isn't a valid schematic";
        break;
      }
      case 431:
        error = 'The schematic is too big';
        break;
    }
  }
</script>

<template lang="pug">

div.wrapper(class!="{parseState}")
  form({action} class:locked data-variant!="{variant}" on:submit!="{submit}" bind:this!="{form}" enctype="multipart/form-data")
    div.mode
      button(
        type="button"
        class:selected!="{mode == 'text'}"
        on:click!="{() => changeMode('text')}") Text
      button(
        type!="button"
        class:selected!="{mode == 'file'}"
        on:click!="{() => changeMode('file')}"
      ) File
    
    div.inputs
      label(for="name") Name:
      input(
        name="name"
        id="name"
        placeholder="Name of the schematic"
        required
        value!="{name}"
      )
      label(for="creator") Creator:
      input(
        name="creator"
        id="creator"
        placeholder="Creator of the schematic"
        required
        value!="{creator}"
      )
      label(for="description") Description:
      textarea(
        name="description"
        id="description"
        placeholder="Description of the schematic"
        value!="{description}"
        required
      )
      label.fixed(for!="{mode}") {mode == 'text' ? 'Schematic' : 'File'}:
      +if("mode =='text'")
        input.fixed(
          name="text"
          id="text"
          placeholder="Paste the schematic text here"
          required
          class:invalid
          value!="{text}"
          on:change!="{parseSchematic}"
        )
        +else
          input.fixed(
            type="file"
            name="file"
            id="file"
            accept=".msch"
            required
            class:invalid
            on:change!="{parseSchematic}"
          )
      +if("error")
        span.error.fixed {error}
      label(for="tags") Tags:
      TagInput(bind:currentTags)
      +if("variant == 'edit'")
        label(for="changes") Changes:
        textarea(
          name="cDescription"
          id="changes"
          placeholder="Description of what was changed and why?"
          required
        )
    
    figure(id="image_preview")
      figcaption Schematic preview
      img(src!="{image}" alt="schematic preview")
    
    button(disabled!="{submitting}") {submitting ? 'Please wait...' : 'Submit'}
  
  div(id="parse-animation")
    h2 Parsing schematic...
    Scanning.scan

</template>

<style>
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1em;
  }

  form * {
    transition: opacity ease 0.5s, transform ease 0.5s;
  }
  .mode .selected {
    background-color: var(--highlight-surface);
  }
  #image_preview {
    width: 166px;
    height: 166px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    border-radius: 5px;
    overflow: hidden;
  }

  #image_preview img {
    width: 166px;
    height: 166px;
  }
  #image_preview figcaption {
    position: absolute;
    visibility: hidden;
  }

  form.locked > :global(*:not(div.inputs, div.schematic-text, div.mode)) {
    opacity: 0;
    pointer-events: none;
  }
  form.locked > div.inputs > :global(*:not(.fixed)) {
    opacity: 0;
    pointer-events: none;
  }
  form.locked > div.inputs {
    transform: translateY(-50%);
    z-index: 1;
  }
  form.locked[data-variant='edit'] > div.inputs {
    transform: translateY(-36%);
  }
  .inputs {
    --bottomPadding: 3px;
    align-items: center;
    display: grid;
    gap: 1em;
    grid-auto-flow: row;
    grid-template-columns: min-content min-content;
  }

  .inputs label {
    grid-column: 1;
    justify-self: right;
    margin-right: 5px;
    padding-bottom: var(--bottomPadding);
    align-items: center;
  }

  .inputs :global(*:is(input, textarea)) {
    background-color: transparent;
    border: none;
    border-bottom: var(--bottomPadding) solid #888888;
    color: white;
    display: block;
    grid-column: 2 / 3;
    outline: none;
    padding: 0.5em;
    position: relative;
    resize: vertical;

    width: 50vw;
    max-width: 500px;

    color: white;
    background-color: var(--surface);
    border: 2px solid #808080;
    padding: 0.5em;
    border-radius: 0.5rem;
  }

  input#file {
    resize: none;
    cursor: pointer;
  }
  input#file::-webkit-file-upload-button {
    display: none;
  }
  input.invalid {
    border-bottom-color: rgb(255, 101, 101);
  }
  span.error {
    visibility: hidden;
    grid-column: 2 / 3;
    transform: translateY(-0.5em);
  }
  input.invalid ~ span.error {
    visibility: visible;
    color: rgb(255, 101, 101);
  }

  form :global(ul.tags) {
    grid-column: 1 / 3;
    min-width: 0;
    padding: 0 !important;
    /* width: min-content; */
  }
  form :global(ul.tags li) {
    display: inline-block;
    --color: #888888;
    border: none;
    background-color: var(--color);
    border-radius: 5px;
    max-width: min-content;
    white-space: nowrap;
  }

  textarea {
    height: 100px;
  }

  textarea::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  textarea::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 10px;
  }
  textarea::-webkit-scrollbar-thumb {
    background-color: #dfdfdf;
    border-radius: 10px;
  }

  #parse-animation {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    opacity: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1em;
  }
  #parse-animation h2 {
    text-align: center;
    font-size: 1em;
  }
  #parse-animation :global(.scan) {
    max-width: 30vh;
  }
  .parsed form,
  .parsing #parse-animation {
    opacity: 1;
    transition: opacity 0.5s ease;
  }
  .parsing form,
  .parsed #parse-animation {
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  div.mode {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border: #888888 solid 2px;
    border-radius: 1rem;
    z-index: 2;
    background-color: var(--surface);
    overflow: hidden;
  }
  div.mode button {
    border: none;
    padding: 0.5rem;
    text-align: center;
    border-radius: 0.8rem;
  }

  @media screen and (max-width: 600px) {
    .inputs {
      --bottomPadding: 3px;
      display: flex;
      flex-direction: column;
      gap: 0;
      padding: 0 10vw;
      width: 100%;
    }
    .inputs :global(*:is(input, textarea)) {
      width: 100%;
    }
    .inputs :global(ul.tags) {
      margin-top: 1rem;
    }
    .inputs > label {
      margin: 2em 0 0.5em 0;
      grid-column: 1;
      justify-self: left;
      padding-bottom: var(--bottomPadding);
    }

    span.error {
      transform: translateY(0.5em);
    }
  }
</style>
