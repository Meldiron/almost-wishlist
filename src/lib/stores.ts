import { writable } from 'svelte/store';
import { account } from '$lib/appwrite';

export const authStore = {
    ...writable<any>(undefined),
    fetch: async () => {
        try {
            const response = await account.get();
            authStore.set(response);
        } catch (err) {
            authStore.set(null);
        }
    }
}