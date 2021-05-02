<script lang="ts">
	import BackButton from "@/client/components/buttons/BackButton.svelte";
	import Person from "./_person.svelte";

	type Person = {
		name: string;
		[x: string]: string;
	};

	const people: Record<string, Person[]> = {
		Developer: [
			{
				name: "MochaBoom",
				IGN: "MochaBoom",
				"Discord Name": "!!NoobMan13!!",
				"Discord ID": "564177349990416484",
			},
			{
				name: "JeanJPNM",
				"Discord Name": "JeanJPNM",
				"Discord ID": "564177349990416484",
			},
		],
		"Logic Emulator Creator": [
			{
				name: "rspx",
				Github: '<a href="https://github.com/rspx" style="color: lightblue;">rspx</a> ',
				"Discord name": "Danisimo",
				"Discord ID": "363665323528028162",
			},
		],
		"Moderator/Admin": [
			{
				name: "The Lil' Leo",
				"Discord/IGN": "The Lil' Leo",
				"Discord ID": "751519627233722378",
			},
		],
		Contributor: [
			{
				name: "Kei",
				"Discord/IGN": "Kei",
				"Discord ID": "271947902002266112",
			},
		],
	};
	const credits = Object.keys(people);
</script>

<svelte:head>
	<meta property="og:title" content="Credits" />
	<meta property="og:description" content="A list of all contributors will be listed here. " />
	<meta property="og:image" content="/assets/mindustry_banner.png" />
	<meta property="og:type" content="website" />
	<title>Credits</title>
</svelte:head>
<main>
	<article>
		<h1>Credits</h1>
		<section>
			<h3>Developer</h3>
			<ul>
				<li>
					<Person name="MochaBoom">
						<ul>
							<li>IGN: "MochaBoom"</li>
							<li>Discord Name: "!!NoobMan13!!"</li>
							<li>Discord ID: "564177349990416484"</li>
						</ul>
					</Person>
				</li>
				<li>
					<Person name="JeanJPNM">
						<ul>
							<li>Discord Name: "JeanJPNM"</li>
							<li>Discord ID: "558679691930632259"</li>
						</ul>
					</Person>
				</li>
			</ul>
		</section>
		<section>
			<h3>Logic Emulator Creator</h3>
			<ul>
				<li>
					<Person name="rspx">
						<ul>
							<li>Github: <a href="https://github.com/rspx">"rspx"</a></li>
							<li>Discord Name: "Danisimo"</li>
							<li>Discord ID: "363665323528028162"</li>
						</ul>
					</Person>
				</li>
			</ul>
		</section>
		<section>
			<h3>Moderator</h3>
			<ul>
				<li>
					<Person name="The Lil' Leo">
						<ul>
							<li>Discord/IGN: "The Lil' Leo"</li>
							<li>Discord ID: "751519627233722378"</li>
						</ul>
					</Person>
				</li>
			</ul>
		</section>
		<section>
			<h3>Contributor</h3>
			<ul>
				<li>
					<Person name="Kei">
						<ul>
							<li>Discord/IGN: "Kei"</li>
							<li>Discord ID: "271947902002266112"</li>
						</ul>
					</Person>
				</li>
			</ul>
		</section>
	</article>
</main>
<footer>
	<BackButton href="/info" />
</footer>

<style>
	article {
		color: var(--on-background);
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 1em;
	}
	h1 {
		margin: 1em 0;
	}
	article h3 {
		font-weight: 400;
		margin-bottom: 0.5em;
	}
	ul {
		list-style: none;
	}
	section > ul {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
