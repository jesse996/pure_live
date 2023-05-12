<script>
	import { toastStore } from '@skeletonlabs/skeleton';

	let isFollow = false;
</script>

我的粉丝
<ul class="list">
	<li>
		<img
			src="https://p5.itc.cn/images01/20220406/d77f50548e8048948a7380c983dcba4a.jpeg"
			class="rounded-full w-12 h-12"
			alt="avatar"
		/>
		<span class="flex-auto">jbf</span>
		{#if !isFollow}
			<button
				class="btn variant-filled-error w-24"
				on:click={() => {
					isFollow = true;
					toastStore.trigger({ message: '回关成功', background: 'variant-filled-success' });
				}}>回关</button
			>
		{:else}
			<button class="btn variant-soft-surface w-24">互相关注</button>
		{/if}
	</li>
	<li>
		<img
			src="https://n.sinaimg.cn/sinakd20230131s/202/w640h362/20230131/0080-f69993d170fb13e03775678ba66b253c.jpg"
			class="rounded-full w-12 h-12"
			alt="avatar"
		/>
		<span class="flex-auto">qwyg</span>
		<button class="btn variant-soft-surface w-24">互相关注</button>
	</li>
</ul>
