<script lang="ts">
</script>

<template lang="pug">
  a(href="/user/discord")
    button
      img(src="/assets/discord_logo_white.png" width="40px" height="40px" alt="discord logo")
      p Login with Discord
</template>

<style>
  img {
    vertical-align: middle;
    float: left;
  }
  p {
    font-size: 17px;
    font-weight: bold;
    color: white;
  }
  button {
    display: inline-flex;
    justify-content: space-evenly;
    align-items: center;
    width: 300px;
    height: 50px;
    background: #738adb;
    padding: 10px;
    text-align: center;
    border-radius: 5px;
    line-height: 25px;
    border: none;
  }
</style>
