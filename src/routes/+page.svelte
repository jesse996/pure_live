<script lang="ts">
	import type { ActionData, Snapshot } from './$types';
	import { Search, ChevronDown } from 'lucide-svelte';
	import NftItem from '$lib/NftItem.svelte';
	import { homeNftList, isLoading, sleep } from './store';
	import { ListBox, ListBoxItem, popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';

	let comment = '';
	let second = '';
	let searchKey = '';

	export const snapshot = {
		capture: () => ({ comment, second }),
		restore: (value) => {
			comment = value.comment;
			second = value.second;
		}
	} satisfies Snapshot;

	let filterNftList = $homeNftList.filter((it) => it.checkStatus == 1 && it.ownerId !== 1);

	function handleSearch(event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) {
		if (event.key === 'Enter') {
			$isLoading = true;
			setTimeout(() => {
				filterNftList = $homeNftList.filter((it) =>
					it.name.toLocaleLowerCase().includes(searchKey.toLocaleLowerCase())
				);
				$isLoading = false;
			}, 200);
		}
	}

	async function handleSelect(type: string) {
		isLoading.set(true);
		await sleep(200);
		isLoading.set(false);
		switch (type) {
			case 'priceUp':
				filterNftList = filterNftList.sort((i, j) => i.price - j.price);
				break;
			case 'priceDown':
				filterNftList = filterNftList.sort((i, j) => j.price - i.price);
				break;
			default:
				filterNftList = filterNftList.sort((i, j) => (j.createTime > i.createTime ? 1 : -1));
		}
	}

	//筛选
	const popupFeatured: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'popupFeatured',
		// Defines which side of your trigger the popup will appear
		placement: 'top'
	};

	let selectValue = '';
</script>

<div class="px-2">
	<div class="input-group grid-cols-[auto_1fr_auto] mt-2">
		<div class="input-group-shim"><Search /></div>
		<input
			type="search"
			class="input "
			placeholder="搜索数字藏品"
			on:keydown={handleSearch}
			bind:value={searchKey}
		/>
	</div>
	<div class="flex justify-end m-2">
		<button use:popup={popupFeatured}> 筛选</button>
		<ChevronDown />
		<div class="card p-4 w-72 shadow-xl z-100" data-popup="popupFeatured">
			<ListBox>
				<ListBoxItem
					bind:group={selectValue}
					name="medium"
					value="default"
					on:click={() => {
						handleSelect('default');
					}}>默认排序</ListBoxItem
				>
				<ListBoxItem
					bind:group={selectValue}
					name="medium"
					value="priceUp"
					on:click={() => {
						handleSelect('priceUp');
					}}>价格升序</ListBoxItem
				>
				<ListBoxItem
					bind:group={selectValue}
					name="medium"
					value="priceDown"
					on:click={() => {
						handleSelect('priceDown');
					}}>价格降序</ListBoxItem
				>
			</ListBox>
			<div class="arrow bg-surface-100-800-token" />
		</div>
	</div>

	<!-- 藏品 -->
	<div class="grid grid-cols-2 gap-2">
		{#each filterNftList as nft (nft.name)}
			<NftItem
				src={nft.img || ''}
				name={nft.name}
				number={nft.number}
				all={nft.all}
				price={nft.price}
				nftId={nft.id}
			/>
		{/each}
	</div>
</div>
