<script lang="ts">
	import { goto } from '$app/navigation';
	import { Eye } from 'lucide-svelte';
	import { balance, isLoading } from '../../store';
	let money = 0;
</script>

<div class="px-5 py-5">
	<!-- <div class="flex justify-between items-center">
		<div class="flex justify-between items-center">
			<div class="font-bold text-2xl">余额：</div>
			<div class="text-3xl text-blue-500">￥{$balance}</div>
		</div>
		<div class="text-lg  ">账单</div>
	</div>
	<div class="mt-4">
		<button class="btn variant-filled-primary">充值</button>
		<button class="btn variant-filled-primary">提现</button>
	</div> -->

	<!-- <div class="flex justify-start items-center space-x-1 mt-10">
		<div class="text-xl">充值金额（元）</div>
		<input type="number" class="rounded" bind:value={money} />
	</div>
	<button
		class="btn variant-filled-primary w-full mt-5"
		on:click={() => {
			isLoading.set(true);
			setTimeout(() => {
				goto('/pay');
				isLoading.set(false);
				balance.update((v) => v + money);
			}, 1000);
		}}
		disabled={$isLoading}>支付</button
	> -->

	<div class="from-orange-400 to-red-600 bg-gradient-to-r rounded-md py-10 px-4 text-white">
		<!-- <div class="bg-surface-800 rounded-md py-10 px-4 text-white"> -->
		<div class=" text-md flex  items-center">总资产 <Eye size={16} /></div>
		<div class="flex justify-between items-center">
			<div class="text-xl">56,300</div>
			<div class=" flex justify-center items-center space-x-5 text-md">
				<div>充值</div>
				<div class="border px-2 py-0.5 rounded-md">提现</div>
			</div>
		</div>
	</div>
	<div class="mt-6 mb-4 font-bold">明细</div>
	<ul>
		<li class="flex justify-between items-center">
			<div class="text-xl">充值</div>
			<div class="flex flex-col items-end">
				<div class="text-red-600 font-bold text-xl">+12</div>
				<div class="text-xs">05-12 15:30</div>
			</div>
		</li>
		<hr />
		<li class="flex justify-between items-center">
			<div class="text-xl">提现</div>
			<div class="flex flex-col items-end">
				<div class="text-red-600 font-bold text-xl">-12</div>
				<div class="text-xs">05-12 16:30</div>
			</div>
		</li>
		<hr />
	</ul>
</div>
