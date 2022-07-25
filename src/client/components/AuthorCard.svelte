<script lang="ts">
    import { user } from '@/client/stores/user';

    export let creator_id: string;

    function visit(){
        window.location.assign(`/user/${creator_id}`)
    }
</script>

<template>
    <div class="container" on:click={visit}>
        {#await user.get(creator_id)}
            <span>Loading...</span>
            <img src="/assets/discord_default_avatar.png"/>
        {:then user}
            <span>{user.username}</span>
            <div class="avatar-container">
                <img src="{user.avatar_url}"/>
                {#if user.verified}
                    <img src="/assets/verified.svg" class="icon verified"/>
                {/if}
                {#if user.access}
                    {#if user.access == "mod"}
                        <img src="/assets/mod.svg" class="icon access mod"/>
                    {/if}
                    {#if user.access == "admin"}
                        <img src="/assets/admin.svg" class="icon access"/>
                    {/if}
                {/if}
            </div>
        {/await}
    </div>
</template>
  
<style>
    .container {
        display: inline-flex;
        background-color: var(--surface);
        border-radius: 25px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 7px;
        padding-right: 14px;
    }
    span {
        margin: 7px;
    }
    img {
        width: 32px;
        border-radius: 50%;
    }

    .avatar-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
    }
    
    .mod {
        filter: hue-rotate(200);
    }

    .icon {
        width: 12px;
    }

    .verified {
        position: absolute;
        top: 1px;
        right: -3px;
    }

    .access {
        position: absolute;
        top: 22px;
        right: -3px;
    }
</style>
  