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

	let editItemMsg = '';
	let editItem: any = null;

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
			await databases.updateDocument('main', 'profile', $authStore.$id, {
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

		newItemMsg = 'Vytvářím ...';

		try {
			if (newItem.file) {
				const res = await storage.createFile('pictures', 'unique()', newItem.file);
				newItem.fileId = res.$id;
				delete newItem.file;
			}

			items = [newItem, ...items];

			await databases.updateDocument('main', 'profile', $authStore.$id, {
				items: JSON.stringify(items)
			});
			showNewItem = false;
			newItemMsg = '';
		} catch (err: any) {
			newItemMsg = 'Nastala chyba: ' + err.message;
		}
	}

	async function onSaveEditItem(event: any) {
		const updatedItem = event.detail;

		editItemMsg = 'Ukládam ...';

		try {
			if (updatedItem.file) {
				const res = await storage.createFile('pictures', 'unique()', updatedItem.file);
				updatedItem.fileId = res.$id;
				delete updatedItem.file;
			}

			items = items.map((i: any) => (i.id === updatedItem.id ? updatedItem : i));

			await databases.updateDocument('main', 'profile', $authStore.$id, {
				items: JSON.stringify(items)
			});

			editItem = null;
			editItemMsg = '';
		} catch (err: any) {
			editItemMsg = 'Nastala chyba: ' + err.message;
		}
	}

	async function onDelete(id: string) {
		if (confirm('Skutočne chceš odstrániť tento predmet?')) {
			items = items.filter((i: any) => i.id !== id);
			await databases.updateDocument('main', 'profile', $authStore.$id, {
				items: JSON.stringify(items)
			});
		}
	}

	async function onMoveUp(itemId: string) {
		items = items.map((i: any, index: number) => {
			if ((items[index + 1] ?? {}).id === itemId) {
				return items[index + 1] ?? i;
			}

			if (i.id === itemId) {
				return items[index - 1] ?? i;
			}

			return i;
		});

		await databases.updateDocument('main', 'profile', $authStore.$id, {
			items: JSON.stringify(items)
		});
	}

	async function onMoveDown(itemId: string) {
		items = items.map((i: any, index: number) => {
			if ((items[index - 1] ?? {}).id === itemId) {
				return items[index - 1] ?? i;
			}

			if (i.id === itemId) {
				return items[index + 1] ?? i;
			}

			return i;
		});

		await databases.updateDocument('main', 'profile', $authStore.$id, {
			items: JSON.stringify(items)
		});
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
				<p class="pt-4 text-gray-600 text-center">{msg}</p>
			{/if}

			<div class="py-8 w-full">
				<div class="w-full rounded-full bg-gray-200 h-1"></div>
			</div>

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
					d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
				/>
			</svg>

			<p class="text-5xl font-bold text-center pb-8">Predměty v sezmanu</p>

			<div class="flex justify-center w-full">
				<button
					type="button"
					on:click={() => (showNewItem = true)}
					class="mt-4 w-full rounded-2xl px-8 py-3 bg-blue-100 text-blue-700 font-semibold text-lg mb-6"
				>
					<p>Pridat Predmět</p>
				</button>
			</div>

			{#if pallete}
				<div class="space-y-6 flex flex-col w-full">
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
							<div
								class="border-dashed col-span-12 border-gray-200 bg-white md:col-span-6 border-2 border rounded-3xl w-full p-6"
							>
								<p class="font-bold text-gray-900 text-xl w-full">
									{item.name}
								</p>
								<p class="text-gray-600 text-xl w-full mb-3">
									{item.description}
								</p>

								<div class="mb-3">
									<button
										type="button"
										on:click={() => onMoveUp(item.id)}
										class="inline-flex rounded-2xl p-2 bg-blue-100 text-blue-800 font-semibold"
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
												d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
											/>
										</svg>
									</button>

									<button
										type="button"
										on:click={() => onMoveDown(item.id)}
										class="inline-flex rounded-2xl p-2 bg-blue-100 text-blue-800 font-semibold"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="transform rotate-180 w-5 h-5"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
											/>
										</svg>
									</button>
								</div>

								<button
									type="button"
									on:click={() => (editItem = item)}
									class="inline-flex rounded-2xl px-8 py-3 bg-gray-200 text-gray-800 font-semibold text-lg"
								>
									<p>Upraviť</p>
								</button>

								<button
									type="button"
									on:click={() => onDelete(item.id)}
									class="inline-flex rounded-2xl px-8 py-3 bg-red-500 text-white font-semibold text-lg"
								>
									<p>Odstrániť</p>
								</button>
							</div>
						{/each}
					{/if}
				</div>

				<div class="pb-12"></div>
			{/if}
		</div>
	</div>
</div>

{#if showNewItem}
	<ItemModal on:save={onSaveNewItem} msg={newItemMsg} on:close={() => (showNewItem = false)} />
{/if}

{#if editItem}
	<ItemModal
		item={editItem}
		on:save={onSaveEditItem}
		msg={editItemMsg}
		on:close={() => (editItem = null)}
	/>
{/if}
