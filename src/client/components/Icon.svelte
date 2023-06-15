<script lang="ts">
    import type { SVG, SVGAttributes } from "@/client/icons/types";

    export let src: SVG;
    export let size = "1em";
    export let color: string | undefined = undefined;
    
    let innerHtml: string;
    let attributes: SVGAttributes;

    $: {
        attributes = {};
        if (color) {
            if (src?.attributes?.stroke !== "none") {
                attributes.stroke = color;
            }
            if (src?.attributes?.fill !== "none") {
                attributes.fill = color;
            }
        }
    }
</script>

<svg width={size} height={size} stroke-width="0" {...src.attributes} {...attributes} xmlns="http://www.w3.org/2000/svg">
    {@html src.source}
</svg>