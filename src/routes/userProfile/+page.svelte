<script lang="ts">
	import { page } from '$app/stores';
	import { Avatar, toastStore } from '@skeletonlabs/skeleton';
	import { homeNftList, userList } from '../store';
	import NftItem from '$lib/NftItem.svelte';
	let uid = Number($page.url.searchParams.get('uid'));

	$: user = $userList.find((it) => it.id === uid)!;
	$: me = $userList.find((it) => it.id === 1)!;

	$: nftList = $homeNftList.filter((it) => it.ownerId === uid);
	$: hasFollow = me.following.includes(uid);
</script>

<div class="bg-gray-600 pt-14 pb-5 flex justify-between items-center px-2">
	<div class="flex items-center  ">
		<Avatar src={user.avatar} width="w-16" rounded="rounded-full" />
		<div class="flex flex-col ml-2">
			<div class="text">创作者</div>
			<div class="text-xl">{user.name}</div>
		</div>
	</div>
	{#if hasFollow}
		<button
			class="btn variant-filled-error w-24"
			on:click={() => {
				toastStore.trigger({ message: '取消关注成功', background: 'variant-filled-success' });
				me.following = me.following.filter((it) => it !== uid);
			}}>取消关注</button
		>
	{:else}
		<button
			class="btn variant-filled-primary w-24"
			on:click={() => {
				toastStore.trigger({ message: '关注成功', background: 'variant-filled-success' });
				me.following = [...me.following, uid];
			}}>关注</button
		>
	{/if}
</div>
<div class="mt-2  text-center text-lg font-bold">藏品</div>
<div class="mt-2 grid grid-cols-2 gap-2">
	{#each nftList as item (item.id)}
		<NftItem
			nftId={item.id}
			src={item.img}
			name={item.name}
			number={item.number}
			all={item.all}
			price={item.price}
		/>{/each}
</div>
