<script lang="ts">
	import { goto } from '$app/navigation';
	import { balance, isLoading } from '../../store';
	let money = 0;
</script>

<div class="px-5 py-5">
	<div class="flex justify-start">
		<div class="font-bold text-2xl">余额：</div>
		<div class="text-3xl text-blue-500">￥{$balance}</div>
	</div>

	<div class="flex justify-start items-center space-x-1 mt-10">
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
	>
</div>
