<!-- @component
  Displays the user avatar with icons indicating 
  if they are verified or have priviliged access.

  Exposes a `--image-size` css var for custom image sizes
-->
<script lang="ts">
  export let verified = false;
  export let access: string | undefined = undefined;
  export let avatar_url = '/assets/discord_default_avatar.png';

  let image: HTMLImageElement;
</script>

<div class="avatar-container">
  <img bind:this={image} on:error={() => image.src = "/assets/discord_default_avatar.png"} src={avatar_url} alt="user avatar">
  {#if verified}
    <img src="/assets/verified.svg" class="icon verified" alt="verified user icon" />
  {/if}
  {#if access == 'mod'}
    <img src="/assets/mod.svg" class="icon access mod" alt="mod user icon" />
  {:else if access == 'admin'}
    <img src="/assets/admin.svg" class="icon access" alt="admin user icon" />
  {/if}
</div>

<style>
  .avatar-container {
    --size: var(--image-size, 32px);
    --icon-size: calc(var(--size) / 3);
    --offset: calc(var(--size) / -15);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size);
  }

  img {
    width: 100%;
    border-radius: 50%;
  }

  .mod {
    filter: hue-rotate(200);
  }

  .icon {
    width: var(--icon-size);
  }

  .verified {
    position: absolute;
    top: var(--offset);
    right: var(--offset);
  }

  .access {
    position: absolute;
    bottom: var(--offset);
    right: var(--offset);
  }
</style>
