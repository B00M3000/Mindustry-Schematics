<script context="module" lang="ts">
  export const prerender = true;
</script>

<svelte:head>
  <meta property="og:title" content="Info" />
  <meta property="og:description" content="Know more about this website" />
  <meta property="og:image" content="/assets/mindustry_banner.png" />
  <meta property="og:type" content="website" />
  <title>Info</title>
</svelte:head>
<main>
  <ul>
    <li>
      <a href="https://discord.gg/PnHG9xSMVP" target="_blank">
        <button>Discord Server</button>
      </a>
    </li>
    <li>
      <a href="/info/credits">
        <button>Credits</button>
      </a>
    </li>
  </ul>
</main>

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
