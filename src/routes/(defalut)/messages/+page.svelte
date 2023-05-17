<script lang="ts">
	import { messages } from '../../store';
</script>

<h2 class="px-4 mt-4">消息列表:</h2>
<ul class="list mt-4 px-4">
	{#each $messages as message}
		<li class="bg-surface-200 rounded-sm">
			<div class="py-2 px-4">
				<a href={'/messages/' + message.id}>
					{#if message.isPass}
						<span> 数字藏品审核通过通知 </span>
					{:else}
						<span class="text-red-700"> 数字藏品审核不通过通知 </span>
					{/if}
				</a>
			</div>
		</li>
	{/each}
</ul>
