<script lang="ts">
	import { databases } from '$lib/appwrite';
	import { authStore } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let pallete: any;
	export let item: any;
	export let allowDelete = false;

	async function onDelete() {
		if (confirm('Skutočne chceš odstrániť tento predmet?')) {
			const profile = await databases.getDocument('main', 'profile', $authStore.$id);
			profile.items = JSON.parse(profile.items).filter((i: any) => i.id !== item.id);
			await databases.updateDocument('main', 'profile', $authStore.$id, {
				items: JSON.stringify(profile.items)
			});
			dispatch('delete');
		}
	}
</script>

<div
	style={`${pallete['700'].border}; ${pallete['500'].bg}`}
	class="relative col-span-12 md:col-span-6 bg-white border rounded-3xl w-full grid grid-cols-12"
>
	{#if allowDelete}
		<button
			on:click={onDelete}
			class="absolute top-0 right-0 p-2 rounded-full bg-red-500 text-white border-2 border-gray-100 transform -translate-y-1/2 translate-x-1/2"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-5 h-5"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
				/>
			</svg>
		</button>
	{/if}
	{#if item.fileId}
		<div class="h-full w-full col-span-4 rounded-3xl">
			<img
				class="w-full h-full object-cover rounded-3xl rounded-r-none"
				src={`https://cloud.appwrite.io/v1/storage/buckets/pictures/files/${item.fileId}/preview?project=almost-wishlist&width=500&height=500`}
				alt="Product"
			/>
		</div>
	{/if}
	<div class="p-6 col-span-8 w-full flex flex-col space-y-4 h-full justify-between items-between">
		<div>
			<p class="font-bold text-white text-xl">{item.name}</p>
			<p class="text-xl" style={`${pallete['900'].text}`}>{item.description}</p>
		</div>
		<a href={item.url} target="_blank" class="w-full">
			<button
				type="button"
				class="rounded-2xl px-8 py-3 bg-white font-semibold text-lg flex items-center space-x-3"
				style={`${pallete['600'].text}`}
			>
				<p>Kup Mě</p>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6 -translate-y-[2px] transform"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
					/>
				</svg>
			</button>
		</a>
	</div>
</div>
