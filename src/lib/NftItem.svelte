<script lang="ts">
	export let src: string;
	export let name: string;
	export let number: number;
	export let all: number;
	export let price: number;
</script>

<div class="bg-surface-50 rounded-lg">
	<a href="/nftDetail" class="unstyled">
		<img {src} alt="nft" class="w-full aspect-square " />
		<div class="px-3 pb-2">
			<div class="pt-2">{name}</div>
			<div class="mt-4 mb-1 text-xs"><span class="text-red-400">#{number}/</span>{all}</div>
			<div>￥{price}</div>
		</div>
	</a>
</div>
