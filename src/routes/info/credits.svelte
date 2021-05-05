<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
  import BackButton from '@/client/components/buttons/BackButton.svelte';
  import Person from './_person.svelte';
</script>

<template lang="pug">
  svelte:head
    meta(property="og:title" content="Credits")
    meta(
      property="og:description"
      content="A list of all contributors will be listed here. "
    )
    meta(property="og:image" content="/assets/mindustry_banner.png")
    meta(property="og:type" content="website")
    title Credits 

  main
    article
      h1 Credits
      section
        h3 Developer
        ul
          li
            Person(name="MochaBoom")
              ul
                li IGN: "MochaBoom"
                li Discord Name: "!!NoobMan13!!"
                li Discord ID: "564177349990416484"
          li
            Person(name="JeanJPNM")
              ul
                li Discord Name: "JeanJPNM"
                li Discord ID: "558679691930632259"
      section 
        h3 Logic Emulator Creator
        ul
          li
            Person(name="rspx")
              ul
                li Github:
                  a(href="https://github.com/rspx") "rspx"
                li Discord Name: "Danisimo"
                li Discord ID: "363665323528028162"
      section
        h3 Moderator
        ul
          li
            Person(name="The Lil' Leo")
              ul
                li Discord/IGN: "The Lil' Leo"
                li Discord ID: "751519627233722378"
      section
        h3 Contributor
        ul
          li
            Person(name="Kei")
              ul
                li Discord/IGN: "Kei"
                li Discord ID: "271947902002266112"
  footer
    BackButton(href="/info")
</template>

<style>
  article {
    color: var(--on-background);
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
  h1 {
    margin: 1em 0;
  }
  article h3 {
    font-weight: 400;
    margin-bottom: 0.5em;
  }
  ul {
    list-style: none;
  }
  section > ul {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
