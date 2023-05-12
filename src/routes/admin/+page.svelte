<script lang="ts">
	import {
		AppShell,
		modalStore,
		type ModalSettings,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import { homeNftList, mId, messages } from '../store';
	import { popup } from '@skeletonlabs/skeleton';
	$: needCheck = $homeNftList.filter((item) => item.checkStatus == 0);

	const popupFeatured: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'popupFeatured11',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom'
	};
	// const popupFeatured1: PopupSettings = {
	// 	// Represents the type of event that opens/closed the popup
	// 	event: 'click',
	// 	// Matches the data-popup value on your popup element
	// 	target: 'popupFeatured12',
	// 	// Defines which side of your trigger the popup will appear
	// 	placement: 'bottom'
	// };

	let curImg = '';
	let curNftId = 0;

	const modal: ModalSettings = {
		type: 'prompt',
		// Data
		title: '拒绝原因',
		body: '填写具体的拒绝的原因',
		// Populates the input value and attributes
		value: '',
		valueAttr: { type: 'text', minlength: 3, maxlength: 10, required: true },
		// Returns the updated response value
		response: (r: string) => {
			$messages = [...$messages, { id: $mId, messages: r, nftId: curNftId }];
			$mId += 1;
		}
	};
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
					<th>相似图片</th>
					<th>描述</th>
					<th>创作者用户名</th>
					<th>申请时间</th>
					<th>操作</th>
				</tr>
			</thead>
			<tbody>
				{#each needCheck as item (item.id)}
					<tr>
						<td class="!align-middle">1</td>
						<td class="text-center !align-middle">{item.name}</td>
						<td class="text-center !align-middle">
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<img
								src={item.img}
								alt=""
								class="w-24 h-24 object-cover"
								use:popup={popupFeatured}
								on:click={() => {
									curImg = item.img;
								}}
							/>
						</td>
						<td class="!align-middle">
							{#if item.img.includes('rotate.jpg')}
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<img
									src="./lf.jpg"
									alt=""
									class="w-24 h-24 object-cover"
									use:popup={popupFeatured}
									on:click={() => {
										curImg = 'http://localhost:5173/./lf.jpg';
									}}
								/>
							{:else}
								<div>无</div>
							{/if}
						</td>
						<td class="!align-middle">{item.desc}</td>
						<td class="!align-middle">jesse</td>
						<td class="!align-middle">{new Date().toLocaleDateString()}</td>

						<td class="!align-middle">
							<div>
								<button
									class="btn variant-filled-primary"
									on:click={() => {
										item.checkStatus = 1;
										$homeNftList = $homeNftList;
									}}>通过</button
								>
								<button
									class="btn variant-filled-error"
									on:click={() => {
										curNftId = item.id;
										modalStore.trigger(modal);

										item.checkStatus = 2;
										$homeNftList = $homeNftList;
									}}>拒绝</button
								>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<div class="card p-4 w-72 shadow-xl" data-popup="popupFeatured11">
		<div><img src={curImg || ''} alt="" /></div>
		<div class="arrow bg-surface-100-800-token" />
	</div>
</AppShell>
