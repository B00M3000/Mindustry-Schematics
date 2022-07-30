<script lang="ts">
  import { page } from '$app/stores';
  import { user } from '@/client/stores/user';
  import AuthorCard from '@/client/components/AuthorCard.svelte';
  let ul: HTMLUListElement;
  $: current = $page?.url.pathname.split('/')[1];
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<template lang="pug">
  nav
    ul(bind:this!="{ul}" style="--items {ul?.chidren?.length || 1}")
      a(href="/user" class:selected!="{(/(user)|(admin)/).test(current)}")
        li User Login
      a(href="/" class:selected!="{current== '' || current == 'schematics'}")
        li Schematics
      a(href="https://old.mindustryschematics.com")
        li Old Database
      a(href="https://logic.mindustryschematics.com")
        li Logic Emulator
      a(href="/downloads" class:selected!="{current== 'downloads'}")
        li Downloads
      a(href="/guides" class:selected!="{current== 'guides'}")
        li Guides
      a(href="/info" class:selected!="{current== 'info'}")
        li Info
    
    button.icon.menu
      img(src="/assets/menu.svg" alt="menu")

    div.logo_container
      +if("$user.id")
        AuthorCard(creator_id!="{$user.id}")
        +else
          span Mindustry Schematics (Unofficial)
      img(src='/assets/logo.png' width='64px')
</template>

<style>
  nav {
    padding: 0;
    position: sticky;
    background-color: var(--surface);
    color: var(--on-surface);
    box-shadow: 0px 0px 5px black;
    top: 0;
    left: 0;
    margin-bottom: 0.5em;
    z-index: 20;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 'buttons logo';
  }
  nav ul {
    --items: 5;
    display: flex;
    list-style: none;
    padding: 1rem;
    gap: 1em;
  }
  nav ul li {
    padding: 0.5em;
    border-radius: 0.5em;
  }
  nav ul .selected li {
    background-color: var(--primary);
    color: var(--on-primary);
  }
  nav button.menu {
    display: none;
  }
  nav button.menu:hover {
    background-color: transparent;
  }

  .logo_container {
    display: flex;
    justify-content: right;
    align-items: center;
    grid-area: logo;
  }

  @media screen and (max-width: 600px) {
    nav {
      display: grid;
      grid-template-columns: 1fr 3em;
      grid-template-areas:
        'buttons menu'
        'logo logo';
    }
    nav button.menu {
      display: inline-flex;
      grid-area: menu;
      align-self: baseline;
      margin-top: 1.1rem;
      width: 2rem;
      height: 2rem;
    }
    nav button.menu:focus {
      pointer-events: none;
    }
    nav button.menu img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      width: 100%;
    }
    nav ul {
      grid-area: buttons;
      flex-direction: column;
      overflow-y: hidden;
      height: 4rem;
      transition: height 0.5s ease;
    }
    nav ul .selected {
      order: -1;
    }
    nav:focus-within ul {
      height: calc(var(--items) * 3.5em);
    }
    .logo_container {
      justify-self: center;
    }
  }
</style>
