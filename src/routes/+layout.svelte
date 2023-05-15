<script lang="ts">
	import { page } from '$app/stores';
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import {
		Drawer,
		drawerStore,
		Modal,
		ProgressRadial,
		Toast,
		toastStore
	} from '@skeletonlabs/skeleton';
	import { navigating } from '$app/stores';
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import Navigation from '$lib/Navigation.svelte';
	import { isLogin, isLoading } from './store';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import PayChoose from '$lib/PayChoose.svelte';
	import { ArrowLeft } from 'lucide-svelte';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	function drawerOpen(): void {
		drawerStore.open({});
	}
</script>

<Drawer bgDrawer="bg-white">
	{#if $drawerStore.id === 'pay'}
		<!-- 支付 -->
		<PayChoose />
	{:else}
		<h2 class="p-4">Navigation</h2>
		<hr />
		<Navigation />
	{/if}
</Drawer>

<!-- <AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64 "> -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<AppShell slotPageContent=" bg-surface-500/5" regionPage="hide-scrollbar">
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<!-- <button class="lg:hidden btn btn-sm mr-4" on:click={drawerOpen}>
						<span>
							<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
								<rect width="100" height="20" />
								<rect y="30" width="100" height="20" />
								<rect y="60" width="100" height="20" />
							</svg>
						</span>
					</button> -->
					{#if $page.route.id !== '/'}
						<div
							class=" absolute"
							on:click={() => {
								history.back();
							}}
						>
							<ArrowLeft />
						</div>
					{/if}
					<a href="/" class="ml-10">
						<strong class="text-xl uppercase">数字藏品</strong>
					</a>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a class="btn btn-sm" href="/">市场</a>
				{#if $isLogin}
					<a class="btn btn-sm" href="/my">我的</a>
				{:else}
					<a class="btn btn-sm" href="/login">登录</a>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<!-- <svelte:fragment slot="sidebarLeft">
		<Navigation />
	</svelte:fragment> -->
	{#if $navigating}
		<div class="w-24 h-24 absolute inset-0 m-auto">
			<ProgressRadial />
		</div>
	{/if}
	<Toast />
	<Modal />
	{#if $isLoading}
		<div class="absolute inset-0 m-auto w-fit h-fit">
			<ProgressRadial meter="stroke-primary-500" track="stroke-primary-500/30" />
		</div>
	{/if}
	<slot />
</AppShell>
