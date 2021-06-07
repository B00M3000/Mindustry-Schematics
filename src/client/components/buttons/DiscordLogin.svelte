<script lang="ts">
  
</script>

<template lang="pug">
  div.btn(onclick="window.location.href='/user/discord'")
    img(src="/assets/discord_logo_white.png" width="40px" height="40px")
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
  div {
    text-align: center;
    vertical-align: middle;
    display: inline-block;
    width: 300px;
    height: 50px;
    background: #738ADB;
    padding: 10px;
    text-align: center;
    border-radius: 5px;
    line-height: 25px;
  }
</style>