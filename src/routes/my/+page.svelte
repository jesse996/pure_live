<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { Settings, Sliders } from 'lucide-svelte';

	let tabSet: number = 0;
</script>

<div class="p-5">
	<div class="flex ">
		<img
			src="https://static.ibox.art/file/oss/test/image/portrait/bfa8ba3852e9408ebab82341ead7c74e.jpg"
			alt="avatar"
			class="w-12 h-12 rounded-full"
		/>
		<div class="flex flex-col text-ellipsis pl-2 grow">
			<div>Jesse</div>
			<!-- <div class="truncate">cfxtest:aasgmc8usn2yk7xwk67xvu9xzfua5h48pa5yck0zp2</div> -->
			<div>
				<span> cfx:aas...zp2</span>
				<span class="text-xs "> 复制</span>
			</div>
		</div>

		<a href="userInfo" class="">
			<Settings />
		</a>
	</div>
	<hr class="my-3" />

	<div class="flex justify-center gap-5 items-center">
		<a class="unstyled" href="/follow"><span class="font-bold ">0</span>朋友</a>
		<a class="unstyled" href="/follow"><span class="font-bold ">2</span>关注</a>
		<a class="unstyled" href="/fan"><span class="font-bold">2</span>粉丝</a>
		<a class="unstyled absolute right-5 variant-filled-primary rounded p-2" href="/createNft"
			>铸造藏品</a
		>
	</div>
	<hr class="my-4" />
	<TabGroup>
		<Tab bind:group={tabSet} name="tab1" value={0}>藏品</Tab>
		<Tab bind:group={tabSet} name="tab2" value={1}>申请中藏品</Tab>
		<Tab bind:group={tabSet} name="tab3" value={2}>已卖出</Tab>
		<Tab bind:group={tabSet} name="tab4" value={3}>已发布</Tab>
	</TabGroup>
</div>
