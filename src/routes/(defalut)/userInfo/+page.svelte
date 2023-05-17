<script lang="ts">
	import { ChevronRight, Copy } from 'lucide-svelte';
	import { isLogin } from '../../store';
	import { goto } from '$app/navigation';
</script>

<ul class="list">
	<li class="flex justify-between items-center">
		<div>头像</div>
		<div class=" flex items-center">
			<img
				src="https://static.ibox.art/file/oss/test/image/portrait/bfa8ba3852e9408ebab82341ead7c74e.jpg"
				alt="avatar"
				class="w-12 h-12 rounded-full"
			/>
			<ChevronRight />
		</div>
	</li>
	<li class="flex justify-between items-center">
		<div>昵称</div>
		<div class="flex items-center">Jesse <ChevronRight /></div>
	</li>
	<li class="flex justify-between items-center">
		<div>手机号</div>
		<div class="flex items-center">186****1102 <ChevronRight /></div>
	</li>
	<li class="flex  items-center justify-between">
		<div>钱包地址</div>
		<!-- <div class="">cfxtest:aasgmc8usn2yk7xwk67xvu9xzfu<br />a5h48pa5yck0zp2</div> -->
		<div class="flex items-center gap-2">
			<span class="break-all truncate"> cfx:aas...zp2</span>
			<Copy size={14} />
		</div>
	</li>
	<li class="flex justify-between items-center">
		<div>收款账户</div>
		<div class="flex items-center"><ChevronRight /></div>
	</li>
	<li class="flex justify-between items-center">
		<a href="userInfo/balance"> <div class="text-black">余额</div></a>
		<div class="flex items-center"><ChevronRight /></div>
	</li>

	<li class="flex justify-between items-center">
		<div>简介</div>
		<div class="flex items-center"><ChevronRight /></div>
	</li>
</ul>

<div class="mt-5 mx-auto flex justify-center">
	<button
		class="btn variant-filled-error mx-auto w-fit"
		on:click={() => {
			isLogin.set(false);
			goto('/');
		}}>退出登录</button
	>
</div>
