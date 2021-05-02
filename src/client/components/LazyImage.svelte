<script lang="ts">
	import { onMount } from "svelte";

	export let src: string;
	export let alt: string;
	export let top = 0;
	export let bottom = 0;
	export let left = 0;
	export let right = 0;

	let intersecting = false;
	let image: HTMLImageElement;
	let loaded = false;
	let visible = false;

	onMount(() => {
		image.addEventListener("load", () => (loaded = true));
		if (typeof IntersectionObserver !== "undefined") {
			const observer = new IntersectionObserver((entries) => {
				intersecting = entries[0].isIntersecting;
				if (intersecting) {
					observer.unobserve(image);
					visible = true;
				}
			});
			observer.observe(image);
			return () => observer.unobserve(image);
		}

		// The following is a fallback for older browsers
		function handler() {
			const bcr = image.getBoundingClientRect();

			intersecting =
				bcr.bottom + bottom > 0 &&
				bcr.right + right > 0 &&
				bcr.top - top < window.innerHeight &&
				bcr.left - left < window.innerWidth;

			if (intersecting) {
				window.removeEventListener("scroll", handler);
				visible = true;
			}
		}

		window.addEventListener("scroll", handler);
		return () => window.removeEventListener("scroll", handler);
	});
</script>

<img {alt} bind:this={image} src={visible ? src : undefined} class:loaded />

<style>
	img {
		opacity: 0;
		transition: opacity ease 0.5s;
	}
	img.loaded {
		opacity: 1;
	}
</style>
