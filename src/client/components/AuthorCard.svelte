<script lang="ts">
    import { user } from '@/client/stores/user';

    export let creator_id: string;

    let author_page = `/user/${creator_id}`
</script>

<template>
    <div>
        <a href={author_page}> 
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
                            <img src="/assets/mod.svg" class="icon access"/>
                        {/if}
                        {#if user.access == "admin"}
                            <img src="/assets/admin.svg" class="icon access"/>
                        {/if}
                    {/if}
                </div>
            {/await}
        </a>
    </div>
</template>
  
<style>
    div {
        background-color: grey;
        border-radius: 25px;
    }
    span {
        align-self: center;
    }
    img {
        width: 32px;
    }

    .icon {
        width: 12px;
    }

    .verified {
        position: relative;
        top: -20px;
        left: -12.5px;
    }

    .access {
        position: relative;
        left: -30px;
    }
</style>
  