import { copy } from "./copy";

export async function share(
	title: string,
	text: string,
	url = window.location.href,
): Promise<void> {
	try {
		if ("navigator" in window && "share" in navigator) {
			await navigator.share({
				title,
				text,
				url,
			});
		} else {
			copy(url);
		}
		// eslint-disable-next-line no-empty
	} catch (e) {}
}
