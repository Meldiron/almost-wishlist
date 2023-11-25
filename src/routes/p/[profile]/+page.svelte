<script lang="ts">
	import Item from './Item.svelte';
	import getPalette from 'tailwindcss-palette-generator';
	import type { PageData } from './$types';

	export let data: PageData;

	const samples = getPalette([
		{
			color: data.color,
			name: 'primary'
		}
	]).primary;

	const pallete: any = {};

	Object.keys(samples).forEach((key) => {
		pallete[key] = {
			bg: `background-color: ${samples[key]}`,
			text: `color: ${samples[key]}`,
			border: `border-color: ${samples[key]}`
		};
	});
</script>

<div class="max-w-6xl w-full mx-auto mt-12 px-4">
	<div class="flex flex-col items-center space-y-4">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="0.6"
			stroke="currentColor"
			class="w-32 h-32"
			style={`${pallete['500'].text}`}
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
			/>
		</svg>

		<p class="text-5xl font-bold text-center">Seznam Přání</p>
		{#if data.name}
			<p class="text-2xl" style={`${pallete['600'].text}`}>{data.name}</p>
		{/if}
	</div>

	<div class="grid grid-cols-12 gap-6 my-12">
		{#each data.items as item}
			<Item {pallete} {item} />
		{/each}
	</div>
	{#if data.note}
		<p class="text-center text-6xl opacity-50 my-24" style={`${pallete['500'].text}`}>
			{data.note}
		</p>
	{/if}
</div>
