<script lang="ts">
	import { FileButton, FileDropzone } from '@skeletonlabs/skeleton';
	import { ImagePlus } from 'lucide-svelte';
	let files: FileList;
	$: {
		console.log(files);
	}
	function handleChange(e) {
		console.log(e);
	}
</script>

<div class="p-5">
	<div>铸造藏品</div>
	<form method="post ">
		<FileDropzone name="files" on:change={handleChange} bind:files>
			<svelte:fragment slot="lead">
				<ImagePlus class="mx-auto" />
			</svelte:fragment>
			<svelte:fragment slot="message">上传藏品</svelte:fragment>
		</FileDropzone>
		<label class="label">
			<span>名称</span>
			<input class="input py-2" />
		</label>
		<label class="label">
			<span>发行数量</span>
			<input class="input py-2" type="number" />
		</label>
		<label class="label">
			<span>描述</span>
			<input class="textarea py-10" />
		</label>
		<button class="btn variant-filled-secondary w-full mt-5 ">提交</button>
	</form>
</div>
