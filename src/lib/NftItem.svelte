<script lang="ts">
	import { homeNftList } from '../routes/store';

	export let src: string;
	export let name: string;
	export let number: number;
	export let all: number;
	export let price: number | null;
	export let nftId: number;

	$: nftData = $homeNftList.find((it) => it.id === nftId)!;
	// const { img, name, number, all, price } = nftData;

	const popupFeatured3 = {
		event: 'click',
		target: 'popupFeatured9',
		placement: 'bottom'
	};
</script>

<div class="bg-surface-50 rounded-lg">
	<a
		href={`/nftDetail?id=${nftId}&src=${src}&name=${name}&price=${price}&num=${number}`}
		class="unstyled"
	>
		<img {src} alt="nft" class="w-full aspect-square object-cover" />
	</a>
	<div class="px-3 pb-2">
		<div class="pt-2">{name}</div>
		<div class="mt-4 mb-1 text-xs"><span class="text-red-400">#{number}/</span>{all}</div>
		<div class="flex justify-between items-center">
			{#if price}
				<div>￥{price}</div>
			{/if}

			{#if nftData.checkStatus == 0}
				<span class="text-green-600">审核中</span>
			{:else if nftData.checkStatus == 2}
				<span class="text-red-600">未通过</span>
			{/if}
			<div class=" p-4 w-16 shadow-xl z-1000" data-popup="popupFeatured9">
				<div>
					<ul>
						<li><a href={`/zz?nftId=${nftData.id}`}>转赠</a></li>
						<hr />
						<li><a href="/"> 上架</a></li>
						<hr />
						<li><a href={`/`}>改价</a></li>
					</ul>
				</div>
				<div class="arrow bg-surface-100-800-token" />
			</div>
			{#if nftData.ownerId === 1}
				<button
					on:click={() => {
						console.log('...');
					}}
				>
					...
				</button>
			{/if}
		</div>
	</div>
</div>
