<script lang='ts'>
  export let avatar_url: string;
  avatar_url += '?size=64'
</scirpt>

<template>
  <img src={avatar_url}/>
</template>

<style>
  img {
    border-radius: 50%;
    width: 64px;
    height: 64px;
  }
</style>
