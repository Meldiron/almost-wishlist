<script lang="ts">
	export let pallete: any;
	export let item: any;
</script>

<div
	style={`${pallete['500'].border}; ${pallete['500'].bg}`}
	class="relative col-span-12 md:col-span-6 bg-white border rounded-3xl w-full grid grid-cols-12"
>
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
				<p>Odkaz</p>

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
