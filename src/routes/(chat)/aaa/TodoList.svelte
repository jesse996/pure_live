<script>
	import { crossfade } from 'svelte/transition';

	import { send, receive } from './transition.js';
	// const [send, receive] = crossfade({
	// 	duration: (d) => Math.sqrt(d * 200)
	// });
	export let store;
	export let done;
</script>

<slot />
<ul class="todos">
	{#each $store.filter((todo) => todo.done === done) as todo (todo.id)}
		<li class:done in:receive={{ key: todo.id }} out:send={{ key: todo.id }}>
			<label>
				<input
					type="checkbox"
					checked={todo.done}
					on:change={(e) => store.mark(todo, e.currentTarget.checked)}
				/>

				<span>{todo.description}</span>

				<button on:click={() => store.remove(todo)} aria-label="Remove" />
			</label>
		</li>
	{/each}
</ul>

<style>
	label {
		width: 100%;
		height: 100%;
		display: flex;
	}

	span {
		flex: 1;
	}
</style>
