<script lang="ts">
	import type { ActionData, Snapshot } from './$types';
	import { Search, ChevronDown } from 'lucide-svelte';
	import NftItem from '$lib/NftItem.svelte';

	let comment = '';
	let second = '';

	export let form: ActionData;
	$: console.log(form);

	export const snapshot = {
		capture: () => ({ comment, second }),
		restore: (value) => {
			comment = value.comment;
			second = value.second;
		}
	} satisfies Snapshot;
</script>

<div class="px-2">
	<div class="input-group grid-cols-[auto_1fr_auto]">
		<div class="input-group-shim"><Search /></div>
		<input type="search" class="input " placeholder="搜索数字藏品" />
	</div>
	<div class="flex justify-end m-5">
		<!-- <select name="filter" id="filter">
			<option value="0">价格升序</option>
			<option value="1">价格降序</option>
		</select> 筛选 -->

		<span> 筛选</span>
		<ChevronDown />
	</div>

	<!-- 藏品 -->
	<div class="grid grid-cols-2 gap-2">
		<NftItem
			src="https://static.ibox.art/file/oss/test/image/nft-goods/167f08459056401d8206cfc80b4e799e.png?style=st6"
			name="凌霄殿"
			number={413}
			all={500}
			price={999}
		/>
		<NftItem
			src="https://static.ibox.art/file/oss/test/image/nft-goods/69d7a12d750b4070a9fb63925330b1f0.jpg?style=st6"
			name="六合仙鹤"
			number={241}
			all={600}
			price={1242}
		/>
		<NftItem
			src="https://static.ibox.art/file/oss/test/image/nft-goods/34d0ca713b7044c7b301bc9ef9b6416e.png?style=st6"
			name="冰雪神兽-冰雪天鹅"
			number={413}
			all={500}
			price={999}
		/>
		<NftItem
			src="https://static.ibox.art/file/oss/test/image/nft-goods/32c62138bb4b4255a55c70632fc23a99.png?style=st6"
			name="CyberBull"
			number={53}
			all={521}
			price={531}
		/>
		<NftItem
			src="https://static.ibox.art/file/oss/test/image/nft-goods/8f396502014f4ae8b875877d9ceff3d7.png?style=st6"
			name="冰雪神兽-冰雪兔神"
			number={4513}
			all={5000}
			price={499}
		/>
		<NftItem
			src="https://static.ibox.art/file/oss/test/image/nft-goods/deafb429825f43d7975c941cd28cee38.png?style=st6"
			name="CyberRabbit"
			number={1156}
			all={6000}
			price={80}
		/>
	</div>
</div>
