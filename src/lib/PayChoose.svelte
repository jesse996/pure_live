<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ProgressRadial, drawerStore, toastStore } from '@skeletonlabs/skeleton';
	import { homeNftList, isLogin } from '../routes/store';
	let nftId = Number($page.url.searchParams.get('id'));
	let nftData = $homeNftList.find((it) => it.id === nftId)!;
	if (!nftData) {
		toastStore.trigger({ message: '不能购买自己的藏品', background: 'variant-filled-error' });
	}

	let showLoading = false;
</script>

<div class="px-6 py-6 relative">
	<div class="flex justify-end items-center flex-col">
		<div>
			￥ <span class="font-bold text-3xl">{nftData.price}</span>
		</div>
		<div>选择支付方式</div>
		<div class="flex justify-between items-center w-full">
			<div>余额</div>
			<div><img src="./okIcon.png" alt="" /></div>
		</div>
		<button
			type="button"
			class="btn variant-filled-secondary mt-5 w-full"
			disabled={showLoading}
			on:click={() => {
				showLoading = true;
				nftData.ownerId = 1;
				$homeNftList = $homeNftList;
				setTimeout(() => {
					showLoading = false;
					drawerStore.close();
					goto('/buySuccess');
				}, 1000);
			}}>确认支付</button
		>
	</div>
	{#if showLoading}
		<div class="absolute inset-0 m-auto w-fit h-fit">
			<ProgressRadial
				meter="stroke-primary-500"
				track="stroke-primary-900/30"
				width="w-14"
				stroke={90}
			/>
		</div>
	{/if}
</div>
