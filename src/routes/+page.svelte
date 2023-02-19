<script lang="ts">
	import type { Snapshot } from './$types';

	let comment = '';
	let second = '';

	export const snapshot = {
		capture: () => ({ comment, second }),
		restore: (value) => {
			comment = value.comment;
			second = value.second;
		}
	} satisfies Snapshot;
</script>

<form method="POST">
	<label for="comment">Comment</label>
	<textarea id="comment" bind:value={comment} />
	<input type="text" bind:value={second} />
	<a href="/about">Post comment</a>
</form>
<hr />
<div>haah</div>
<del><s>Always</s> Gonna Give You Up</del>
<del>sasds</del>
<ins cite="https://youtu.be/dQw4w9WgXcQ" datetime="10-31-2022">insert</ins>
