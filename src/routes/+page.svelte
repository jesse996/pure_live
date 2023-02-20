<script lang="ts">
	import type { ActionData, Snapshot } from './$types';

	let comment = '';
	let second = '';

	export let form: ActionData;
	$: console.log(form);

	export const snapshot = {
		capture: () => ({ comment, second }),
		restore: (value) => {
			comment = value.comment;
			second = value.second;
		}
	} satisfies Snapshot;
</script>

<button
	on:click={async () => {
		fetch(window.location.href, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: JSON.stringify({
				comment,
				second
			})
		});
	}}>btn</button
>
