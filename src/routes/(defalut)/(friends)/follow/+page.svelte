<script lang="ts">
	import { tabSet } from '$lib/store';
	import { toastStore } from '@skeletonlabs/skeleton';
	import { userList, type UserInfo } from '../../store';
	import { goto } from '$app/navigation';
	let me = $userList.find((i) => i.id == 1)!;
	$: following = me.following.map((i) => {
		return $userList.find((j) => j.id == i)!;
	});
</script>

我的关注
<ul class="list">
	{#each following as user (user.id)}
		<li>
			<img src={user.avatar} class="rounded-full w-12 h-12" alt="avatar" />
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<span
				class="flex-auto"
				on:click={() => {
					goto('/userProfile?uid=' + user.id);
				}}>{user.name}</span
			>
			<button
				class="btn variant-soft-surface w-24"
				on:click={() => {
					me.following = me.following.filter((i) => i != user.id);
					toastStore.trigger({ message: '取消关注成功', background: 'variant-filled-error' });
				}}>已关注</button
			>
		</li>
	{/each}
</ul>
