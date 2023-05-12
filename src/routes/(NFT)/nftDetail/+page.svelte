<script lang="ts">
	import { page } from '$app/stores';
	import { drawerStore, type DrawerSettings, toastStore } from '@skeletonlabs/skeleton';
	import { homeNftList, isLogin, sleep } from '../../store';
	import { goto } from '$app/navigation';
	let nftId = Number($page.url.searchParams.get('id'));

	let nftData = $homeNftList.find((it) => it.id === nftId);

	const { img, name, number, all, price } = nftData!;

	let drowSetting: DrawerSettings = {
		id: 'pay',
		position: 'bottom',
		height: 'h-[200px]'
	};
</script>

<img
	src={img ??
		'https://static.ibox.art/file/oss/test/image/nft-goods/167f08459056401d8206cfc80b4e799e.png?style=st6'}
	alt=""
	class="w-full"
/>
<div class="bg-surface-50 px-5 pt-4 pb-2">
	<div class="text-xs">该作品拥有官方认证</div>
	<div class="flex justify-between items-center mt-2">
		<div class="text-2xl font-bold ">{name ?? '凌霄殿'}# {number ?? 443}</div>
		<div class="text-red-500 font-bold text-lg">￥${price ?? 999}</div>
	</div>
	<div class="text-gray-400 mt-3">评估价：￥900</div>
</div>

<div class="bg-surface-50 px-5 mt-2 py-2">
	<h2 class="text-lg">简介</h2>
	<div>
		Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum aspernatur officia corporis
		incidunt ad, temporibus, eum dicta atque sed molestiae quis corrupti quod mollitia possimus
		debitis ab, ullam ea ratione.
	</div>
</div>
<div class="bg-surface-50 px-5 mt-2 py-2 ">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="flex justify-start items-center space-x-3"
		on:click={() => {
			goto('/userProfile?uid=2');
		}}
	>
		<img
			src="https://static.ibox.art/file/oss/test/image/nft-goods/9fb9a8293a3941a7861f856638dade4d.png"
			alt=""
			class="w-10 h-10 rounded"
		/>
		<div>
			<div>马大哈 <span class="text-slate-400 bg-blue-100 rounded-lg px-2 ">拥有者</span></div>
			<div class="text-slate-400">cfx:0xbe9b...a8d2</div>
		</div>
	</div>
	<hr />
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="flex justify-start items-center space-x-3"
		on:click={() => {
			goto('/userProfile?uid=3');
		}}
	>
		<img
			src="https://static.ibox.art/file/oss/test/image/portrait/3842ff4f575e44a0bd42db5a798ddd99.png?style=st"
			alt=""
			class="w-10 h-10 rounded"
		/>
		<div>
			<div>小雨 <span class="text-slate-400 bg-blue-100 rounded-lg px-2 ">创作者</span></div>
			<div class="text-slate-400">cfx:0x0c87...0a81</div>
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
				<tr>
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
				</tr>
				<tr>
					<td>ahh18</td>
					<td>铸造</td>
					<td>￥999</td>
					<td>2023-02-11 11:02:02</td>
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
				toastStore.trigger({ message: '请先登录', background: 'variant-filled-error' });
				await sleep(500);
				goto('/login');
				return;
			}
			drawerStore.open(drowSetting);
		}}
		>￥{price} 购买
	</button>
</div>
