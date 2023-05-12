<script lang="ts">
	import { page } from '$app/stores';
	import NftItem from '$lib/NftItem.svelte';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { Mails, Settings, Sliders } from 'lucide-svelte';
	import { homeNftList, messages, userList } from '../store';

	let name = $page.url.searchParams.get('name');
	let img = $page.url.searchParams.get('img');
	let num = Number($page.url.searchParams.get('num'));
	let desc = $page.url.searchParams.get('desc');
	// let tab = $page.url.searchParams.get('tab') || 1;

	let tab = Number($page.url.searchParams.get('tab')) || 0;
	let tabSet = Number($page.url.searchParams.get('tab')) || 0;
	$: {
		// console.log(tab);
		console.log(tabSet);
	}

	$: me = $userList.find((i) => i.id == 1)!;

	$: myNftList1 = $homeNftList.filter((i) => i.ownerId === 1 && i.checkStatus == 1);
	$: nftList2 = $homeNftList.filter((i) => i.ownerId === 1 && i.checkStatus != 1);

	$: unreadMsgCount = $messages.filter((i) => i.hasRead == false).length;
</script>

<div class="p-5">
	<div class="flex ">
		<img
			src="https://static.ibox.art/file/oss/test/image/portrait/bfa8ba3852e9408ebab82341ead7c74e.jpg"
			alt="avatar"
			class="w-12 h-12 rounded-full"
		/>
		<div class="flex flex-col text-ellipsis pl-2 grow">
			<div>Jesse</div>
			<!-- <div class="truncate">cfxtest:aasgmc8usn2yk7xwk67xvu9xzfua5h48pa5yck0zp2</div> -->
			<div>
				<span> cfx:aas...zp2</span>
				<span class="text-xs "> 复制</span>
			</div>
		</div>

		<a href="/messages" class="mr-5 ">
			<div class="relative inline-block">
				{#if unreadMsgCount > 0}
					<span class="badge-icon variant-filled-warning absolute -top-3 -right-3 z-10"
						>{unreadMsgCount}</span
					>
				{/if}
				<Mails />
			</div>
		</a>
		<a href="userInfo" class="">
			<Settings color="black" />
		</a>
	</div>
	<hr class="my-3" />

	<div class="flex justify-center gap-5 items-center">
		<a class="unstyled" href="/follow"><span class="font-bold ">0</span>朋友</a>
		<a class="unstyled" href="/follow"><span class="font-bold ">{me.following.length}</span>关注</a>
		<a class="unstyled" href="/fan"><span class="font-bold">2</span>粉丝</a>
		<a class="unstyled absolute right-5 variant-filled-primary rounded p-2" href="/createNft"
			>铸造藏品</a
		>
	</div>
	<hr class="my-4" />
	<TabGroup>
		<Tab bind:group={tabSet} name="tab1" value={0}>藏品</Tab>
		<Tab bind:group={tabSet} name="tab2" value={1}>未审核藏品</Tab>
		<Tab bind:group={tabSet} name="tab3" value={2}>已卖出</Tab>
		<Tab bind:group={tabSet} name="tab4" value={3}>已发布</Tab>
	</TabGroup>
	<div class="mt-2 grid grid-cols-2 gap-2">
		{#if tabSet === 0}
			<!-- 有用的藏品 -->
			{#each myNftList1 as nftList (nftList.id)}
				<NftItem
					nftId={nftList.id}
					src={nftList.img}
					name={nftList.name}
					number={nftList.number}
					all={nftList.all}
					price={nftList.price}
				/>
			{/each}
		{:else if tabSet === 1}
			<!-- 未审核藏品 -->
			{#each nftList2 as data (data.id)}
				<!-- {JSON.stringify(data)} -->
				<NftItem
					nftId={data.id}
					src={data.img}
					name={data.name}
					number={data.number}
					all={data.all}
					price={data.price}
				/>
			{/each}
		{/if}
	</div>
</div>
