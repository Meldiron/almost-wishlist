<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import { browser } from '$app/environment';
	import { authStore } from '$lib/stores';

	onMount(async () => {
		if (browser) {
			authStore.fetch();
		}
	});
</script>

<slot />
