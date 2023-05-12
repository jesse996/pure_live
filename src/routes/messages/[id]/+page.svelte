<script lang="ts">
	import { page } from '$app/stores';
	import { homeNftList, messages } from '../../store';

	let mid = Number($page.params.id)!;
	let message = $messages.find((it) => it.id === mid);
	let nft = $homeNftList.find((it) => it.id === message?.nftId)!;
</script>

<div class="px-5">
	<h3 class="mt-8">审核失败原因：</h3>
	<p class=" py-3">{message?.messages}</p>
	<hr class="py-2" />
	<h3>数字藏品详情：</h3>
	<p><span class="font-bold text-lg"> {nft.name}</span></p>
	<img src={'/' + nft.img} alt="" />
</div>
