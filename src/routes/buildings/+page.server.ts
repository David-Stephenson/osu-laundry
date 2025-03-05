import type { PageServerLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import type { Building, ApiResponse } from '$lib/types';

export const prerender = true;

export const load: PageServerLoad = async () => {
	try {
		const response = await fetch(`${PUBLIC_API_URL}/api/buildings`);
		const data: ApiResponse<Building[]> = await response.json();

		return {
			buildings: data.data.sort((a, b) => a.organization_name.localeCompare(b.organization_name))
		};
	} catch (error) {
		return {
			buildings: [],
			error: 'Failed to load buildings'
		};
	}
};
