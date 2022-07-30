<template lang="pug">
    svelte:head
      title Discord Authentication Failed
    
    h1 Discord Authentication Failed
    p Please try again, if it still doesn't work please contact us via our discord server.
</template>

<style>
  h1 {
    text-align: center;
  }
  pre {
    overflow-x: auto;
    background-color: hsla(0, 0%, 0%, 0.5);
    padding: 1rem;
    border-radius: 1rem;
  }
  pre::-webkit-scrollbar {
    height: 1rem;
  }
  pre::-webkit-scrollbar-track {
    background: hsla(0, 0%, 0%, 0.3);
  }
  pre::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 0.5rem;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>
