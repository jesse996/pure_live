<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	// import { tabSet } from '$lib/store';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	let tabSet = -1;
	afterNavigate(async (navigating) => {
		console.log('beforeNavigate');
		if (navigating.to?.url.pathname === '/friend') {
			tabSet = 0;
		} else if (navigating.to?.url.pathname === '/follow') {
			tabSet = 1;
		} else if (navigating.to?.url.pathname === '/fan') {
			tabSet = 2;
		}
		console.log(tabSet);
	});
</script>

<TabGroup justify="justify-center">
	<Tab bind:group={tabSet} name="tab1" value={0}>
		<button
			on:click={() => {
				goto('/friend');
			}}
		>
			朋友
		</button>
	</Tab>
	<Tab bind:group={tabSet} name="tab2" value={1}>
		<button
			on:click={() => {
				goto('/follow');
			}}
		>
			关注
		</button>
	</Tab>
	<Tab bind:group={tabSet} name="tab3" value={2}>
		<button
			on:click={() => {
				goto('/fan');
			}}
		>
			粉丝
		</button>
	</Tab>
</TabGroup>

<slot />
