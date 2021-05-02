<script lang="ts">
	import { PromiseProvider } from "mongoose";

	import { onMount } from "svelte";

	export let src: string | undefined;
	export let alt: string;
	/**The underlying `img` element, do not provide a custom value for it
	 */
	let image: HTMLImageElement;
	let data: string | undefined;
	async function fetchData(src: string | undefined) {
		if (!src) return;
		const response = await fetch(src);
		const content = (await response.text()) as string;
		data = `data:image/png;base64,${content}`;
	}
	onMount(() => {
		fetchData(src);
	});
</script>

<img bind:this={image} class={$$props.class} id={$$props.id} src={data} {alt} />
