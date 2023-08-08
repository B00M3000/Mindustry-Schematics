<script lang="ts">
  import { goto } from '$app/navigation';
  import { user } from '@/client/stores/user';
  import type { PageData } from './search/$types';
  import UserAvatar from '@/client/components/UserAvatar.svelte';

	export let data: PageData;

	let form: HTMLFormElement;

	let aq: string;

	async function search(e?: Event){
		e?.preventDefault()

		const formData = new FormData(form);
		const searchParams = new URLSearchParams();
		const query = formData.get('query');
		
		searchParams.set('q', query?.toString() || '')
		if(aq) searchParams.set('a', aq)
		await goto(`/users?${searchParams}`)
	}

	$: isAdmin = $user.access?.toString() == "admin"

	async function modifyAccess(e: Event, id: string){
		const newAccess: "none" | "mod" | "admin" = e.target.value.toLowerCase()
		fetch('/users', {
			method: "POST",
			body: JSON.stringify({
				user_id: id,
				access: newAccess
			})
		})
		window.location.reload()
	}

	async function modifyVerification(e: Event, id: string){
		const newVerificationString: "unverified" | "verified" = e.target.value.toLowerCase()
		const newVerification: boolean = newVerificationString == "verified"
		fetch('/users', {
			method: "POST",
			body: JSON.stringify({
				user_id: id,
				verified: newVerification
			})
		})
		window.location.reload()
	}
</script>

<svelte:head>
	<title>User Directory</title>
</svelte:head>

<!-- svelte-ignore a11y-missing-attribute -->
<template>
	<main>
		<form bind:this={form} on:submit={search}>
			<input id="user_search" placeholder="Search for users..." name="query" value={data.query}>
			<select bind:value={aq}>
				<option value="">All</option>
				<option value="mod">Mod</option>
				<option value="admin">Admin</option>
			</select>
			<button type="submit">Search</button>
		</form>

		Only shows the top 10 results...

		<div id="users">
		{#each data.users as u}
		{#await user.get(u._id)}
		{:then _user}
			<div class="user">
				<a class="user-container" href="/user/{u._id}">
						{#if _user}
						<UserAvatar {..._user} />
						<span>{_user.username}</span>
						{:else}
						<img src="/assets/discord_default_avatar.png" alt="user avatar" />
						<span>Not Found</span>
						{/if}
				</a>
				{#if isAdmin && user}
				<div class="admin-container">
					<select on:change={(e) => modifyAccess(e, u._id)} disabled={u._id == $user.id || _user?.access?.toString() == "admin"}>
						<option selected={_user?.access?.toString() == "none"}>None</option>
						<option selected={_user?.access?.toString() == "mod"}>Mod</option>
						<option selected={_user?.access?.toString() == "admin"} disabled>Admin</option>
					</select>
					<select on:change={(e) => modifyVerification(e, u._id)}>
						<option selected={_user?.verified == false}>Unverified</option>
						<option selected={_user?.verified == true}>Verified</option>
					</select>
				</div>
				{/if}
			</div>
		{/await}
		{/each}
		</div>
	</main>
</template>

<style>
	main {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	form {
		margin: 1em;
	}

	#users {
		display: flex;
		align-items: center;
		flex-direction: column;
		width: 60%;
		padding: 0.5em;
		background: rgb(80, 83, 84);
		border-radius: 1em;
		margin: 1em;
		gap: 1em;
	}

	.user-container {
		display: flex;
		justify-content: center;
		gap: 1em;
	}

	.admin-container {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1em;
	}

	span {
		padding: 7px 0;
	}

	.user {
		display: flex;
		align-items: center;
		justify-content: space-between;

		width: 100%;
		padding: 0.4em 0.7em;
		border-radius: 1em;
		
		background-color: var(--surface);
	}
</style>
  