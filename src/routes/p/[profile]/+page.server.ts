import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { databases } from '$lib/appwrite';

export const load: PageServerLoad = async ({ params }) => {
    const response = await databases.getDocument('main', 'profile', params.profile);

	return {
		...response,
		items: JSON.parse(response.items)
	};
    
	throw error(404, 'Not found');
};
