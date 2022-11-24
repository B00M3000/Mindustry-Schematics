<script lang="ts">
  import { user } from '@/client/stores/user';
  import { Access, UserAccess } from '@/lib/auth/access';
  import type { PageData } from './$types';

  export let data: PageData;

  let url = `/user/login${data.redirect ? `?redirect=${data.redirect}` : ''}`;

  $: allowChanges = $user.access.can({
    schematics: Access.deleteAll | Access.updateAll,
  });
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<template lang="pug">
  svelte:head
    title User Login
  +if("$user.id")
    main
      div.info
        h2 Welcome Back {$user.username}
        img.avatar(src="{$user.avatar_url}" alt="pfp" width="64px" height="64px")
      +if("allowChanges")
        a.link(href="/admin/schematic_changes")
          button Schematic Changes
      a.link(href="/user/{$user.id}")
        button Public Profile 
      a.link(on:click="{user.logout}")
        button Logout 
    +else
      div.logins        
        a(href!="{url}")
          button.discord
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
  .discord {
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
  main {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1rem;
  }
  div.info {
    display: flex;
    justify-content: center;
    gap: 1em;
    align-items: center;
  }
  a.link {
    align-self: center;
  }
  .logins {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  .avatar {
    border-radius: 50%;
  }
</style>
