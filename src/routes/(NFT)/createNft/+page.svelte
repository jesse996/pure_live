<script lang="ts">
	import { goto } from '$app/navigation';
	import { FileButton, FileDropzone, toastStore } from '@skeletonlabs/skeleton';
	import { ImagePlus } from 'lucide-svelte';
	let files: FileList;
	let img: string;
	let name: string;
	let desc: string;
	let num: number;
	$: {
		console.log(files);
		if (files && files.length > 0) {
			let reader = new FileReader();
			reader.readAsDataURL(files[0]);
			reader.onload = function () {
				img = reader.result as string;
			};
		}
	}
</script>

<div class="p-5">
	<div>铸造藏品</div>
	<form method="post ">
		<!-- <FileDropzone name="files" on:change={handleChange} bind:files>
			<svelte:fragment slot="lead">
				<ImagePlus class="mx-auto" />
			</svelte:fragment>
			<svelte:fragment slot="message">上传藏品</svelte:fragment>
		</FileDropzone> -->
		{#if !files || files.length === 0}
			<FileDropzone name="files" bind:files>
				<svelte:fragment slot="lead">
					<ImagePlus class="mx-auto" />
				</svelte:fragment>
				<svelte:fragment slot="message">上传藏品</svelte:fragment>
			</FileDropzone>
		{:else}
			<img src={img} alt="img" />
		{/if}

		<label class="label">
			<span>名称</span>
			<input class="input py-2" bind:value={name} />
		</label>
		<label class="label">
			<span>发行数量</span>
			<input class="input py-2" type="number" bind:value={num} />
		</label>
		<label class="label">
			<span>描述</span>
			<input class="textarea py-10" bind:value={desc} />
		</label>
		<button
			class="btn variant-filled-secondary w-full mt-5 "
			on:click={() => {
				toastStore.trigger({ message: '铸造藏品提交成功', background: 'variant-filled-success' });
				setTimeout(() => {
					console.log(img);

					goto(`/my?tab=1&img=${img}&name=${name}&num=${num}&desc=${desc}`);
				}, 500);
			}}>提交</button
		>
	</form>
</div>
