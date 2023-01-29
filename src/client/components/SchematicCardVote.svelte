<script lang="ts">
    import Icon from "@/client/components/Icon.svelte";
    import CaretDown from "@/client/icons/CaretDown";
    import CaretUp from "@/client/icons/CaretUp";

    import { user } from "@/client/stores/user";

    import { toast } from "@zerodevx/svelte-toast";

    import type { Votes } from "@/server/mongo";

    export let votes: Votes;
    export let vertical: boolean = false;

    let local_vote = $user.id && votes ? Object.keys(votes).includes($user.id) ? votes[$user.id] : 0 : 0
    const cvotes = votes ? Object.values(votes).reduce((a: number, b: number) => a + b, 0) - local_vote : 0
    const logged_in = Boolean($user.id)

    function handleUpvote(){
        if(local_vote == 1) vote(0)
        else vote(1)
    }
    function handleDownvote(){
        if(local_vote == -1) vote(0)
        else vote(-1)
    }
    function vote(v: number){
        if(!logged_in) return toast.push("You must be logged in to vote.")
        local_vote = v
        //TBA: Send Result to Server
    }

    let counter: HTMLDivElement;

    let upvoteColor: string;
    let downvoteColor: string;

    $: upvoteColor = local_vote == 1 ? "green" : "grey"
    $: downvoteColor = local_vote == -1 ? "red" : "grey"
    $: dvotes = cvotes + local_vote
</script>

<template>
    <div class="outer-container">
        <div class={`inner-container${vertical ? " vertical" : ""}`}>
            <div class="vote-button upvote" on:click={handleUpvote}>
                <Icon src={CaretUp} color={upvoteColor} size="1.5em" />
            </div>
            <div class="counter">
                <span>{dvotes}</span>
            </div>
            <div class="vote-button downvote" on:click={handleDownvote}>
                <Icon src={CaretDown} color={downvoteColor} size="1.5em" />
            </div>
        </div>
    </div>
</template>

<style>
    .counter {
        position: relative;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }
    .upvote { color: green }
    .downvote { color: red }
    .inner-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 1.7em;
    }
    .vote-button {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>