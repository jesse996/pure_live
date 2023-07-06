<script lang="ts">
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

<slot />
