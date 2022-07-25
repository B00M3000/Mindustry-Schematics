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
                <img src="{user.avatar_url}"/>
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
</style>
  