<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
</script>

<div class="bg-gray-100 h-screen">
	<div class="bg-white flex justify-center items-center mt-5 pb-2">
		<!-- <div class=" left-7"> -->
		<ArrowLeft class="absolute left-7" />
		<!-- </div> -->
		<span class="text-xl text-center">马大哈</span>
	</div>
	<hr />
	<div>
		<div class="text-center my-3">12:32</div>
		<div>
			<div class="flex justify-end my-3 items-center">
				<div class="text-gray-400 mr-2 text-sm">已读</div>
				<div class="bg-white rounded-lg p-2">
					<div class="text-right">你好</div>
				</div>
				<!-- <img
					src="https://static.ibox.art/file/oss/test/image/portrait/bfa8ba3852e9408ebab82341ead7c74e.jpg"
					alt=""
					class="rounded-full w-10 h-10 mx-3"
				/> -->
			</div>
			<div class="flex justify-start">
				<!-- <img
					src="https://static.ibox.art/file/oss/test/image/nft-goods/9fb9a8293a3941a7861f856638dade4d.png"
					alt=""
					class="rounded-full w-10 h-10 mx-3"
				/> -->
				<div class="bg-white rounded-lg p-2">
					<div class="text-left">你也好</div>
				</div>
			</div>
		</div>
	</div>
	<div class="bg-white fixed bottom-1 inset-x-0 px-3 py-2 flex justify-between items-center">
		<input class="bg-gray-100 rounded-xl w-2/3 h-9 px-2" placeholder="请输入内容" />
		<button class="bg-blue-300 rounded-xl w-24 h-9 px-2">发送</button>
	</div>
</div>
