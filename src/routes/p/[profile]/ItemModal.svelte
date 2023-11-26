<script lang="ts">
	import { storage } from '$lib/appwrite';
	import { createEventDispatcher } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';

	export let item: any = {};
	export let msg = '';

	let name = item.name ?? '';
	let description = item.description ?? '';
	let url = item.url ?? '';
	let file: any = null;
	let id = item.id ?? uuidv4();

	const dispatch: any = createEventDispatcher();

	async function onSave() {
		dispatch('save', {
			id: id,
			name,
			description,
			url,
			file: file ? file : undefined,
			fileId: item.fileId ? item.fileId : undefined
		});
	}

	async function onClose() {
		dispatch('close');
	}

	async function onFile(event: any) {
		file = event.target.files[0];
	}
</script>

<div class="fixed inset-0 bg-black bg-opacity-50">
	<div class="mt-12 max-w-xl w-full mx-auto bg-white rounded-3xl p-6">
		<div class="w-full flex items-center justify-between">
			<h1 class="text-2xl font-bold pb-6">Predmet</h1>
			<button on:click={onClose} class="p-2 rounded-lg bg-gray-100">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<form on:submit={onSave} class="flex w-full flex-col space-y-3">
			<p class="text-lg font-semibold text-gray-800">Názov:</p>
			<input
				required={true}
				bind:value={name}
				type="text"
				placeholder="Slúchadká"
				class="w-full rounded-2xl px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold text-lg"
			/>
			<p class="text-lg font-semibold text-gray-800">Detail:</p>
			<input
				required={true}
				bind:value={description}
				type="text"
				placeholder="SteelSeries Arctis Pro Wireless"
				class="w-full rounded-2xl px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold text-lg"
			/>
			<p class="text-lg font-semibold text-gray-800">Odkaz:</p>
			<input
				required={true}
				bind:value={url}
				type="text"
				placeholder="www.alza.cz/arctis-d5285279.htm"
				class="w-full rounded-2xl px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold text-lg"
			/>

			<p class="text-lg font-semibold text-gray-800">Fotka:</p>
			{#if item.fileId}
				<div class="w-[250px] h-[250px] rounded-md">
					<img
						class="w-full h-full object-cover rounded-md"
						src={`https://cloud.appwrite.io/v1/storage/buckets/pictures/files/${item.fileId}/preview?project=almost-wishlist&width=500&height=500`}
						alt="Product"
					/>
				</div>
			{/if}
			<input
				accept="image/png, image/jpeg"
				required={item.fileId ? false : true}
				on:change={onFile}
				type="file"
				class="w-full rounded-2xl px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold text-lg"
			/>

			<button
				type="submit"
				class=" w-full rounded-2xl px-8 py-3 bg-blue-500 text-white font-semibold text-lg"
			>
				<p>{item.id ? 'Uložit' : 'Vytvořit'}</p>
			</button>
		</form>

		{#if msg}
			<p class="pt-4 text-gray-600 text-center">{msg}</p>
		{/if}
	</div>
</div>
