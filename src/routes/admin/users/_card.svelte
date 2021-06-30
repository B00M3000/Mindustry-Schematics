<script lang="ts">
  import type { UserSearchJSON } from '@/interfaces/json';
  import { UserAccess, accessLevels } from '@/lib/auth/access';
  import type { LevelName } from '@/lib/auth/access';
  import { toast } from '@zerodevx/svelte-toast';
  import { auth } from '@/client/stores/auth';

  export let user: UserSearchJSON['users'][0];
  let userAccess = UserAccess.from(user.access);
  let verified = user.verified;
  let access = user.access;
  $: changed = verified == !user.verified || access != user.access;
  function reset() {
    ({ verified, access } = user);
  }
  async function save() {
    if (user.id == $auth.uid) {
      toast.push("You can't modify your own privileges");
      reset();
      return;
    }
    const response = await fetch(`/api/admin/users/${user.id}`, {
      method: 'POST',
      body: JSON.stringify({
        verified,
        access,
      }),
    });
    switch (response.status) {
      case 200:
        user.access = access;
        user.verified = verified;
        break;
      case 401: {
        const message = (await response.json()).message as string;
        if (message.includes('own')) {
          toast.push("You can't modify your own privileges");
        } else {
          toast.push("You can't promove a user to a level higher than yours");
        }
        reset();
        break;
      }
    }
    2;
  }
  function showLevel(level: LevelName) {
    return userAccess.compare(accessLevels[level]) >= 0;
  }
</script>

<template lang="pug">
  li(class:changed)
    div.name
      span.field Tag:
      span {user.tag}
    div.verified
      span.field Verified:
      input(type="checkbox"  bind:checked!="{verified}")
    div.access
      span.field Access:
      select(bind:value!="{access}")
        +each("Object.keys(accessLevels) as level")
          +if("showLevel(level)")
            option(value!="{level}" selected!="{user.access == level}") {level}
    button.save(on:click!="{save}") Save
</template>

<style>
  li {
    padding: 0.5em;
    border-radius: 1em;
    background-color: var(--surface);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1em;
    position: relative;
    flex-wrap: wrap;
    width: 100%;
    transition: margin 0.5s ease;
  }
  li > div {
    padding: 0.2em;
    display: flex;
    gap: 0.5em;
    align-items: center;
    position: relative;
    border: 2px solid var(--highlight-surface);
    border-radius: 0.5em;
  }

  input,
  select {
    background-color: var(--surface);
    color: var(--on-surface);
    border: none;
    cursor: pointer;
  }
  button.save {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: 0.5s;
    pointer-events: none;
    opacity: 0;
  }
  li.changed {
    margin-bottom: 3em;
  }
  li.changed button.save {
    top: 130%;
    transform: translate(-50%);
    pointer-events: all;
    opacity: 1;
  }
</style>
