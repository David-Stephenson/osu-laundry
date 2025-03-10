import type { PageServerLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import type { Building, Machine, ApiResponse, BuildingResponse } from '$lib/types';

export const prerender = false;

export const load: PageServerLoad = async ({ params }) => {
	try {
		const [buildingResponse, machinesResponse] = await Promise.all([
			fetch(`${PUBLIC_API_URL}/api/buildings`),
			fetch(`${PUBLIC_API_URL}/api/buildings/${params.id}/machines`)
		]);

		if (!buildingResponse.ok || !machinesResponse.ok) {
			throw new Error('Failed to fetch data');
		}

		const buildingsData: ApiResponse<Building[]> = await buildingResponse.json();
		const machinesData: ApiResponse<BuildingResponse> = await machinesResponse.json();

		const building = buildingsData.data.find((b) => b.id === params.id);

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
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Failed to load building details'
		};
	}
};
