<script context="module" lang="ts">
	import type { Session } from "@/interfaces/app";

	import type { Load } from "@sveltejs/kit";

	export const load: Load = async ({ context, fetch, page, session }) => {
		const { isAdmin } = session as Session;
		if (!isAdmin)
			return {
				props: {
					redirect: "/user",
				},
			};
		const response = await fetch("/api/admin/tokens");
		const users = await response.json();

		return {
			props: {
				users,
			},
		};
	};
</script>

<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import type { Writable } from "svelte/store";
	import type { UserTokenJSON } from "@/interfaces/json";
	import User from "./_user.svelte";
	import { auth } from "@/client/stores/auth";
	import BackButton from "@/client/components/buttons/BackButton.svelte";
	export let redirect: string | null = null;
	export let users: UserTokenJSON[] = [];
	onMount(() => {
		if (redirect) goto(redirect);
	});
</script>

<svelte:head>
	<title>User Tokens</title>
</svelte:head>

{#if $auth.isAdmin}
	<h2>User Tokens</h2>
	<ul class="users">
		{#each users as user}
			<li>
				<User {user} />
			</li>
		{/each}
	</ul>
{/if}
<footer>
	<BackButton href="/user" smart />
</footer>

<style>
	h2 {
		margin: 1rem;
		text-align: center;
	}
	ul.users {
		display: flex;
		flex-direction: column;
		align-items: center;
		list-style: none;
		padding: 1rem;
		gap: 1.5rem;
	}
	ul.users li {
		background-color: var(--surface);
		padding: 0.7rem;
		border-radius: 1rem;
	}
</style>
