declare module "svelte-loading-spinners" {
	import type { SvelteComponent } from "svelte";
	export interface SpinnerProps {
		size?: number;
		color?: string;
		unit?:
			| "cm"
			| "mm"
			| "in"
			| "px"
			| "pt"
			| "pc"
			| "em"
			| "ex"
			| "ch"
			| "rem"
			| "vw"
			| "vh"
			| "vmin"
			| "vmax"
			| "%";
		duration?: string;
	}
	export class BarLoader extends SvelteComponent {
		$$prop_def: SpinnerProps;
	}
	export class Chasing extends SvelteComponent {
		$$prop_def: SpinnerProps;
	}
	export class Circle extends SvelteComponent {
		$$prop_def: SpinnerProps;
	}
	export class Circle2 extends SvelteComponent {
		$$prop_def: Pick<SpinnerProps, "size" | "unit"> & {
			colorOuter?: string;
			colorCenter?: string;
			colorInner?: string;
			durationMultiplier?: number;
			durationOuter?: string;
			durationInner?: string;
			durationCenter?: string;
		};
	}

	export class Circle3 extends SvelteComponent {
		$$prop_def: Pick<SpinnerProps, "size" | "unit"> & {
			ballTopLeft?: string;
			ballTopRight?: string;
			ballBottomLeft?: string;
			ballBottomRight?: string;
			duration?: string;
		};
	}
	export class DoubleBounce extends SvelteComponent {
		$$prop_def: SpinnerProps;
	}
	export class Firework extends SvelteComponent {
		$$prop_def: SpinnerProps;
	}
	export class GoogleSpin extends SvelteComponent {
		$$prop_def: Pick<SpinnerProps, "size" | "duration">;
	}
	export class Jellyfish extends SvelteComponent {
		$$prop_def: SpinnerProps;
	}
	export class Jumper extends SvelteComponent {
		$$prop_def: SpinnerProps;
	}
	export class Pulse extends SvelteComponent {
		$$prop_def: SpinnerProps;
	}
	export class Rainbow extends SvelteComponent {
		$$prop_def: SpinnerProps;
	}
	export class RingLoader extends SvelteComponent {
		$$prop_def: SpinnerProps;
	}
	export class ScaleOut extends SvelteComponent {
		$$prop_def: SpinnerProps;
	}
	export class Shadow extends SvelteComponent {
		$$prop_def: SpinnerProps;
	}
	export class SpinLine extends SvelteComponent {
		$$prop_def: SpinnerProps & {
			stroke?: string;
		};
	}
	export class Stretch extends SvelteComponent {
		$$prop_def: SpinnerProps;
	}
	export class SyncLoader extends SvelteComponent {
		$$prop_def: SpinnerProps;
	}
	export class Wave extends SvelteComponent {
		$$prop_def: SpinnerProps;
	}
	export class Square extends SvelteComponent {
		$$prop_def: SpinnerProps;
	}
	export class Moon extends SvelteComponent {
		$$prop_def: SpinnerProps;
	}
}
