<script lang="ts">
	import { goto } from '$app/navigation';
	import { FileButton, FileDropzone, toastStore } from '@skeletonlabs/skeleton';
	import { ImagePlus } from 'lucide-svelte';
	import { homeNftList, nftId } from '../../../store';
	let files: FileList;
	let img: string;
	let name: string;
	let desc: string;
	let num: number;
	let price: number;
	let filename: string;

	let btnDisabled = false;
	$: {
		console.log(files);

		if (files && files.length > 0) {
			filename = files[0].name;

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
			<input class="input py-2 px-3" bind:value={name} />
		</label>
		<label class="label">
			<span>发行数量</span>
			<input class="input py-2 px-3" type="number" bind:value={num} />
		</label>
		<label class="label">
			<span>发行价(元)</span>
			<input class="input py-2 px-3" bind:value={price} />
		</label>
		<label class="label">
			<span>描述</span>
			<input class="textarea py-10 px-3" bind:value={desc} />
		</label>
		<button
			class="btn variant-filled-secondary w-full mt-5 "
			on:click={() => {
				if (!(img && name && desc && num && price)) {
					toastStore.trigger({ message: '请填写完整信息', background: 'variant-filled-error' });
					return;
				}
				btnDisabled = true;
				toastStore.trigger({ message: '铸造藏品提交成功', background: 'variant-filled-success' });
				$nftId += 1;
				console.log('nftId:', $nftId);
				$homeNftList = [
					...$homeNftList,
					{
						id: $nftId,
						name,
						desc,
						all: num,
						img: './' + filename,
						number: 1,
						price,
						createTime: '2023-0512',
						checkStatus: 0,
						creatorId: 1,
						ownerId: 1
					}
				];

				setTimeout(() => {
					goto(`/my?tab=1`);
				}, 500);
			}}
			disabled={btnDisabled}>提交</button
		>
	</form>
</div>
