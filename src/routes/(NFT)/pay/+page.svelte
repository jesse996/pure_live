<script>
	import { goto } from '$app/navigation';
	import { toastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	onMount(() => {
		setTimeout(() => {
			toastStore.trigger({ message: '充值成功', background: 'variant-filled-success' });
			setTimeout(() => {
				goto('/userInfo/balance');
			}, 2000);
		}, 3000);
	});
</script>

<div>
	<img src="/zfb.jpg" alt="" />
</div>
