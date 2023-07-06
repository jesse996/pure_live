<script lang="ts">
	import { page } from '$app/stores';
	import { homeNftList, isLogin, orderHistory, sleep, userList } from '../../../store';
	import { goto } from '$app/navigation';
	let nftId = Number($page.url.searchParams.get('id'));

	let nftData = $homeNftList.find((it) => it.id === nftId);

	const { img, name, number, all, price, desc, creatorId, ownerId } = nftData!;

	let creator = $userList.find((it) => it.id === creatorId)!;
	let owner = $userList.find((it) => it.id === ownerId)!;

	$: his = $orderHistory.filter((it) => it.nftId === nftId)!;
</script>

<img src={img} alt="" class="w-full" />
<div class="bg-surface-50 px-5 pt-4 pb-2">
	<!-- <div class="text-xs">该作品拥有官方认证</div> -->
	<div class="flex justify-between items-center mt-2">
		<div class="text-2xl font-bold">{name}# {number}</div>
		<div class="text-red-500 font-bold text-lg">￥{price}</div>
	</div>
	<div class="text-gray-400 mt-3">评估价：￥{price + 50}</div>
</div>

<div class="bg-surface-50 px-5 mt-2 py-2">
	<h2 class="text-lg">简介</h2>
	<div>
		{desc}
	</div>
</div>
<div class="bg-surface-50 px-5 mt-2 py-2">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="flex justify-start items-center space-x-3"
		on:click={() => {
			goto(`/userProfile?uid=${owner.id}`, { noScroll: false });
		}}
	>
		<img src={owner.avatar} alt="" class="w-10 h-10 rounded" />
		<div>
			<div>
				{owner.name} <span class="text-slate-400 bg-blue-100 rounded-lg px-2">拥有者</span>
			</div>
			<div class="text-slate-400">cfx:0xbe9b...a8d2</div>
		</div>
	</div>
	<hr />
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="flex justify-start items-center space-x-3"
		on:click={() => {
			goto(`/userProfile?uid=${creator.id}`, { noScroll: false });
		}}
	>
		<img src={creator.avatar} alt="" class="w-10 h-10 rounded" />
		<div>
			<div>
				{creator.name} <span class="text-slate-400 bg-blue-100 rounded-lg px-2">创作者</span>
			</div>
			<div class="text-slate-400">
				{#if ownerId === creatorId}
					cfx:0xbe9b...a8d2
				{:else}
					cfx:0x0c87...0a81
				{/if}
			</div>
		</div>
	</div>
</div>
<div class="bg-surface-50 px-5 mt-2 py-2 mb-40">
	<h2 class="text-lg mb-2">交易记录</h2>
	<div class="table-container">
		<table class="table table-hover">
			<thead>
				<tr>
					<th>用户</th>
					<th>操作</th>
					<th>交易价格</th>
					<th>上架时间</th>
				</tr>
			</thead>
			<tbody>
				{#each his as item}
					<tr>
						<td>{$userList.find((it) => it.id === item.sellerId)?.name}</td>
						<td>购买</td>
						<td>￥{item.price}</td>
						<td>{item.createTime}</td>
					</tr>
				{/each}
				<!-- <tr>
					<td>海空</td>
					<td>购买</td>
					<td>￥999</td>
					<td>2023-2-13 10:24:32</td>
				</tr>
				<tr>
					<td>小熊猫</td>
					<td>购买</td>
					<td>￥999</td>
					<td>2023-02-11 14:03:22</td>
				</tr> -->
				<tr>
					<td>{creator.name}</td>
					<td>铸造</td>
					<td>￥{nftData?.price}</td>
					<td>{nftData?.createTime}</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
<div>
	<button
		class="btn variant-filled-secondary absolute bottom-0 inset-x-5 mb-2"
		on:click={async () => {
			if (!$isLogin) {
				await sleep(500);
				goto('/login');
				return;
			}
		}}
		>￥{price} 购买
	</button>
</div>
