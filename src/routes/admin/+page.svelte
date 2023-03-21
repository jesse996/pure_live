<script>
	import { AppShell } from '@skeletonlabs/skeleton';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
</script>

<AppShell slotSidebarLeft="bg-gray-900 w-60 text-white">
	<svelte:fragment slot="sidebarLeft">
		<ul class="flex flex-col space-y-2  py-4 text-lg">
			<li class="pl-4 flex justify-between items-center py-3">
				<span> 用户管理</span>
				<ChevronUp class="mr-4" />
			</li>
			<li class="pl-4 flex justify-between items-center py-3">
				<span> 数字藏品管理</span>
				<ChevronDown class="mr-4" />
			</li>
			<div class="bg-gray-800">
				<ul class=" flex flex-col  text-lg">
					<li class="pl-8 flex justify-between items-center py-3">
						<span> 列表管理</span>
						<ChevronUp class="mr-4" />
					</li>
					<li class="pl-8 flex justify-between items-center bg-blue-600 py-3">
						<span> 铸造审核</span>
						<!-- <ChevronDown class="mr-4" /> -->
					</li>
				</ul>
			</div>
		</ul>
	</svelte:fragment>

	<div class="table-container ">
		<!-- Native Table Element -->
		<table class="table table-hover ">
			<thead>
				<tr>
					<th>ID</th>
					<th>藏品名称</th>
					<th>图片</th>
					<th>创作者用户名</th>
					<th>申请时间</th>
					<th>相似图片</th>
					<th>操作</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="!align-middle">1</td>
					<td class="text-center !align-middle">凌霄殿</td>
					<td class="text-center !align-middle"
						><img
							src="https://static.ibox.art/file/oss/test/image/nft-goods/167f08459056401d8206cfc80b4e799e.png?style=st6"
							alt=""
							class="w-14 h-14"
						/>
					</td>
					<td class="!align-middle">天意</td>
					<td class="!align-middle">2022-02-01 12:02:32</td>
					<td class="!align-middle">
						<img
							src="https://static.ibox.art/file/oss/test/image/nft-goods/167f08459056401d8206cfc80b4e799e.png?style=st6"
							alt=""
							class="w-14 h-14"
						/>
					</td>
					<td class="!align-middle">
						<div>
							<button class="btn variant-filled-primary">通过</button>
							<button class="btn variant-filled-error">拒绝</button>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</AppShell>
