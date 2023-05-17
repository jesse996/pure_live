<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { homeNftList, messages } from '../../../store';

	let mid = Number($page.params.id)!;

	let message = $messages.find((it) => it.id === mid);
	$: {
		if (message && !message.hasRead) {
			message.hasRead = true;
			$messages = $messages;
			// messages.update((v) => {
			// 	let index = v.findIndex((it) => it.id === mid);
			// 	v[index].hasRead = true;
			// 	return v;
			// });
		}
	}

	let nft = $homeNftList.find((it) => it.id === message?.nftId)!;
</script>

<div class="px-5">
	{#if message?.isPass}
		<p class=" py-3">{message?.messages}</p>
	{:else}
		<h3 class="mt-8">审核失败原因：</h3>
		<p class=" py-3">{message?.messages}</p>
	{/if}

	<hr class="py-2" />
	<h3>数字藏品详情：</h3>
	<div class="text-center"><span class=" text-lg text-center mx-auto"> {nft.name}</span></div>
	<img src={'/' + nft.img} alt="" class="h-60 mx-auto" />
</div>
