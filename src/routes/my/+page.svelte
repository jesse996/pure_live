<script lang="ts">
	import { Settings, Sliders } from 'lucide-svelte';
	// import { IconSettings2, Icon123 } from '@tabler/icons-svelte';
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

		<Settings />
	</div>
	<hr class="my-3" />

	<div class="flex justify-center gap-5">
		<a class="unstyled" href="/follow"><span class="font-bold ">2</span>关注</a>
		<a class="unstyled" href="/fan"><span class="font-bold">2</span>粉丝</a>
	</div>
</div>
