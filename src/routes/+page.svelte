<script>
	let visible = false;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>hello world</section>
<button class="btn variant-filled-primary" on:click={() => (visible = !visible)}>toggle</button>

{#if visible}
	<aside class="alert variant-ghost">
		<!-- Icon -->
		<div>(icon)</div>
		<!-- Message -->
		<div class="alert-message">
			<h3>(title)</h3>
			<p>message</p>
		</div>
		<!-- Actions -->
		<div class="alert-actions">(buttons)</div>
	</aside>
{/if}
