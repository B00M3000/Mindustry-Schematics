<template lang="pug">
  svelte:head
    meta(property="og:title" content="Info")
    meta(property="og:description" content="Know more about this website")
    meta(property="og:image" content="/assets/mindustry_banner.png")
    meta(property="og:type" content="website")
    title Info

  main
    ul
      li
        a(href="https://discord.gg/PnHG9xSMVP" rel="noreferrer" target="_blank")
          button Discord Server
      li
        a(href="/info/credits")
          button Credits
</template>

<style>
  main ul {
    display: flex;
    flex-direction: column;
    align-items: center;
    list-style: none;
    gap: 1em;
    padding: 1em;
  }
  main li {
    cursor: pointer;
    border-radius: 0.5em;
    width: 50vw;
    text-align: center;
  }
  main li button {
    height: 100%;
    width: 100%;
    padding: 1em;
  }
  @media screen and (max-width: 600px) {
    main li {
      width: 80vw;
    }
  }
</style>
