<script lang="ts">
	import { browser } from '$app/environment';
	import { databases, storage } from '$lib/appwrite';
	import { authStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import Item from '../p/[profile]/Item.svelte';
	import getPalette from 'tailwindcss-palette-generator';
	import ItemModal from '../p/[profile]/ItemModal.svelte';

	let pallete: any = null;

	let showNewItem = false;
	let newItemMsg = '';

	$: {
		if (color) {
			const samples = getPalette([
				{
					color: color,
					name: 'primary'
				}
			]).primary;

			pallete = {};

			Object.keys(samples).forEach((key) => {
				pallete[key] = {
					bg: `background-color: ${samples[key]}`,
					text: `color: ${samples[key]}`,
					border: `border-color: ${samples[key]}`
				};
			});
		}
	}

	let name = '';
	let note = '';
	let color = '';
	let items: any[] = [];

	let msg = '';

	async function refreshData() {
		const response = await databases.getDocument('main', 'profile', $authStore.$id);
		name = response.name;
		color = response.color;
		note = response.note;
		items = JSON.parse(response.items);
	}

	onMount(async () => {
		if (browser) {
			await refreshData();
		}
	});

	async function onSave() {
		msg = 'Ukladám ...';
		try {
			const response = await databases.updateDocument('main', 'profile', $authStore.$id, {
				name,
				note,
				color
			});
			msg = 'Zmeny profilu úspešne uložené.';
		} catch (err: any) {
			msg = 'Nastala chyba: ' + err.message;
		}
	}

	async function onSaveNewItem(event: any) {
		const newItem = event.detail;

		console.log(newItem);
		newItemMsg = 'Vytvářím ...';

		try {
			if (newItem.file) {
				const res = await storage.createFile('pictures', 'unique()', newItem.file);
				newItem.fileId = res.$id;
				delete newItem.file;
			}

			await databases.updateDocument('main', 'profile', $authStore.$id, {
				items: JSON.stringify([newItem, ...items])
			});
			showNewItem = false;
			items = [newItem, ...items];
			items = items;
			newItemMsg = '';
		} catch (err: any) {
			newItemMsg = 'Nastala chyba: ' + err.message;
		}
	}
</script>

<div class="max-w-6xl w-full mx-auto mt-6 px-4">
	<div class="flex flex-col items-center space-y-4">
		<a href="/" class="w-full">
			<div class="p-3 rounded-full w-full bg-gradient-to-r from-white via-gray-100 to-gray-100">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
				</svg>
			</div></a
		>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="0.6"
			stroke="currentColor"
			class="w-32 h-32 text-blue-500"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
			/>
		</svg>

		<p class="text-5xl font-bold text-center">Můj seznam přání</p>
		<a
			href={`${window.location.origin}/p/${$authStore?.$id}`}
			target="_blank"
			style="word-break: break-all;"
			class="text-center text-lg text-blue-600 bg-blue-100 rounded-3xl py-2 px-6"
			>{window.location.origin}/p/{$authStore?.$id}</a
		>

		<div class="flex items-center flex-col space-y-3 pt-6 w-full justify-center mx-auto max-w-xl">
			<form on:submit={onSave} class="flex w-full flex-col space-y-3">
				<p class="text-lg font-semibold text-gray-800">Tohle je seznam:</p>
				<input
					bind:value={name}
					type="text"
					placeholder="Matěje"
					class="w-full rounded-2xl px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold text-lg"
				/>
				<p class="text-lg font-semibold text-gray-800">Poděkováni na závěr:</p>
				<input
					bind:value={note}
					type="text"
					placeholder="Ďekujúúúú."
					class="w-full rounded-2xl px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold text-lg"
				/>
				<p class="text-lg font-semibold text-gray-800">Oblibená barva:</p>
				<input
					bind:value={color}
					type="color"
					class="h-14 w-full rounded-2xl px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold text-lg"
				/>
				<button
					type="submit"
					class=" w-full rounded-2xl px-8 py-3 bg-blue-500 text-white font-semibold text-lg"
				>
					<p>Uložit</p>
				</button>
			</form>
			{#if msg}
				<p class="pt-4 text-gray-600">{msg}</p>
			{/if}

			<div class="py-8 w-full">
				<div class="w-full rounded-full bg-gray-200 h-1"></div>
			</div>

			{#if pallete}
				<div class="grid grid-cols-6 gap-6 w-full">
					{#if items.length <= 0}
						<div
							class="border-dashed col-span-12 border-gray-200 bg-white md:col-span-6 border-2 border rounded-3xl w-full p-6"
						>
							<p class="font-bold text-gray-900 text-xl w-full text-center">
								Váš seznam je prázdny.
							</p>
						</div>
					{:else}
						{#each items as item}
							<Item on:delete={refreshData} {item} {pallete} allowDelete={true} />
						{/each}
					{/if}
				</div>

				<div class="flex justify-center w-full">
					<button
						type="button"
						on:click={() => (showNewItem = true)}
						class="mt-4 rounded-2xl px-8 py-3 bg-blue-500 text-white font-semibold text-lg"
					>
						<p>Pridat Predmět</p>
					</button>
				</div>

				<div class="pb-12"></div>
			{/if}
		</div>
	</div>
</div>

{#if showNewItem}
	<ItemModal on:save={onSaveNewItem} msg={newItemMsg} on:close={() => (showNewItem = false)} />
{/if}
