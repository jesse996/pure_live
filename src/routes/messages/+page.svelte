<script lang="ts">
	import { messages } from '../store';
</script>

<h2 class="px-2">消息列表:</h2>
<ul class="list mt-4">
	{#each $messages as message}
		<li class="bg-surface-200">
			<div class="py-2 px-4">
				<a href={'/messages/' + message.id}>
					{#if message.isPass}
						数字藏品审核通过通知
					{:else}
						数字藏品审核不通过通知
					{/if}
				</a>
			</div>
		</li>
	{/each}
</ul>
