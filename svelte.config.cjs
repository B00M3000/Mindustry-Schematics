const preprocess = require("svelte-preprocess");
const path = require("path");
const node = require("@sveltejs/adapter-node");
/** @type {import('@sveltejs/kit').Config} */
module.exports = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: {
			name: "node-adapter",
			adapt: node,
		},
		vite: {
			resolve: {
				alias: {
					"@": path.resolve("src"),
					"@static": path.resolve("static"),
				},
			},
		},
		// hydrate the <div id="svelte"> element in src/app.html
		target: "#svelte",
	},
};
