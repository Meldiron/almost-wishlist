<script lang="ts">
  import { page } from '$app/stores'

	import { browser } from "$app/environment";
	import { onMount } from "svelte";
	import { goto } from '$app/navigation';
	import { account } from '$lib/appwrite';
	import { authStore } from '$lib/stores';

  let msg = 'Přihlašuji ...';

  onMount(async () => {
    if(browser) {
      const userId = $page.url.searchParams.get('userId') ?? '';
      const secret = $page.url.searchParams.get('secret') ?? '';

      try {
        await account.updateMagicURLSession(userId, secret);
        await authStore.fetch();
        msg = 'Přihlášeni úspešné';
        goto('/');
      } catch(err: any) {
        msg = 'Nastala chyba: ' + err.message;
      }
    }
  })
</script>

<div class="max-w-6xl w-full mx-auto mt-6 px-4">
    <div class="flex flex-col items-center space-y-4">
        <a href="/" class="w-full">
          <div class="p-3 rounded-full w-full bg-gradient-to-r from-white via-gray-100 to-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>        
          </div></a>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0.6" stroke="currentColor" class="w-32 h-32 text-blue-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          
        <p class="text-5xl font-bold">{msg}</p>
    </div>  
</div>