<script lang="ts">
	import { page } from '$app/stores';
	import { toastStore } from '@skeletonlabs/skeleton';
	import { homeNftList, userList } from '../../../store';
	import { goto } from '$app/navigation';

	let nftId = Number($page.url.searchParams.get('nftId'));
	$: nftData = $homeNftList.find((it) => it.id === nftId)!;
	let toUser = '';
</script>

转赠藏品
<div class="px-4 py-2">
	<div class="">
		<div>选择数字藏品：</div>
		<img src={nftData.img} alt="" class="w-20 h-20 p-1 border border-dashed inline-block" />
	</div>
	<div class="mt-4">
		<span>输入对方用户名或钱包地址：</span>
		<input type="text" class="w-full" bind:value={toUser} />
	</div>

	<button
		class="btn variant-filled-primary btn-lg mt-3 mx-auto w-full"
		on:click={() => {
			let to = $userList.find((i) => i.name === toUser);
			if (!to) {
				toastStore.trigger({ message: '用户不存在', background: 'variant-filled-error' });
				return;
			}
			nftData.ownerId = to.id;
			$homeNftList = $homeNftList;
			toastStore.trigger({ message: '转赠成功', background: 'variant-filled-primary' });
			goto('/my');
		}}>确定</button
	>
</div>
