import type { PageServerLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import type { Building, Machine, ApiResponse, BuildingResponse } from '$lib/types';
import { error } from '@sveltejs/kit'

export const prerender = true;

export const load: PageServerLoad = async ({ params }) => {
	const [buildingResponse, machinesResponse] = await Promise.all([
		fetch(`${PUBLIC_API_URL}/api/buildings`),
		fetch(`${PUBLIC_API_URL}/api/buildings/${params.id}/machines`)
	]);

	if (!buildingResponse.ok || !machinesResponse.ok) {
		throw error(404, {
			message: 'Building not found',
			code: 'NOT_FOUND'
		});
	}

	const buildingsData: ApiResponse<Building[]> = await buildingResponse.json();
	const machinesData: ApiResponse<BuildingResponse> = await machinesResponse.json();

	let building = buildingsData.data.find((b) => b.id === params.id);

	if (!building) {
		throw new Error('Building not found');
	}

	let machines: Machine[] = [];
	let stats = null;

	if (machinesData.data.building.rooms) {
		machines = machinesData.data.building.rooms.flatMap((room) =>
			room.machines.map((machine) => ({
				...machine,
				room_name: room.room_name,
				building_id: room.building_id,
				building_name: room.room_name
			}))
		);

		const washers = machines.filter((m) => m.type === 'washer');
		const dryers = machines.filter((m) => m.type === 'dryer');

		stats = {
			...machinesData.data.stats,
			washers_complete: washers.filter((m) => m.status === 'COMPLETE').length,
			dryers_complete: dryers.filter((m) => m.status === 'COMPLETE').length
		};
	}

	return {
		building,
		machines,
		stats,
		lastRefresh: new Date().toISOString()
	};
};
