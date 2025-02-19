<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import type { Building, Machine, ApiResponse, BuildingResponse } from '$lib/types';
	import Footer from '$components/Footer.svelte';
	import MachineTable from '$components/MachineTable.svelte';
	import MachineStats from '$components/MachineStats.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { ArrowLeft, RotateCw, Wifi, WifiOff } from 'lucide-svelte';

	const buildingId = $page.params.id;
	let building: Building | null = null;
	let machines: Machine[] = [];
	let loading = false;
	let initialLoad = true;
	let error: string | null = null;
	let stats: MachineStats | null = null;
	let lastRefresh: Date | null = null;
	let countdown = 10;
	let refreshInterval: NodeJS.Timer;
	let countdownInterval: NodeJS.Timer;
	let showErrorBanner = false;

	// Helper function to format date to local time
	function formatDateTime(isoString: string): string {
		const date = new Date(isoString);
		return date.toLocaleString(undefined, {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
	}

	async function fetchBuildingDetails() {
		if (loading && !initialLoad) return;
		loading = true;
		try {
			const [buildingResponse, machinesResponse] = await Promise.all([
				fetch(`${PUBLIC_API_URL}/api/buildings`),
				fetch(`${PUBLIC_API_URL}/api/buildings/${buildingId}/machines`)
			]);

			if (!buildingResponse.ok || !machinesResponse.ok) {
				throw new Error('Failed to fetch data');
			}

			const buildingsData: ApiResponse<Building[]> = await buildingResponse.json();
			const machinesData: ApiResponse<BuildingResponse> = await machinesResponse.json();

			building = buildingsData.data.find((b) => b.id === buildingId) || building;
			
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
			showErrorBanner = false;
			lastRefresh = new Date();
		} catch (e) {
			console.error('Error fetching building details:', e);
			showErrorBanner = true;
		} finally {
			loading = false;
			initialLoad = false;
			countdown = 10;
		}
	}

	onMount(() => {
		fetchBuildingDetails();
		refreshInterval = setInterval(fetchBuildingDetails, 10000);
		// Start countdown interval but don't reset countdown here
		countdownInterval = setInterval(() => {
			countdown--;
			if (countdown <= 0) {
				countdown = 10;
			}
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(refreshInterval);
		clearInterval(countdownInterval);
	});

	// Group machines by room and type
	$: machinesByRoom = machines.reduce(
		(acc, machine) => {
			const roomKey = machine.room_id;
			if (!acc[roomKey]) {
				acc[roomKey] = {
					roomId: machine.room_id,
					roomName: machine.room_name,
					floorNumber: parseInt(machine.room_name.match(/\d+/)?.[0] || '0'),
					washers: [],
					dryers: []
				};
			}
			if (machine.type === 'washer') {
				acc[roomKey].washers.push(machine);
			} else {
				acc[roomKey].dryers.push(machine);
			}
			return acc;
		},
		{} as Record<
			string,
			{
				roomId: string;
				roomName: string;
				floorNumber: number;
				washers: Machine[];
				dryers: Machine[];
			}
		>
	);

	// Sort rooms by floor number
	$: sortedRooms = Object.values(machinesByRoom).sort((a, b) => a.floorNumber - b.floorNumber);

	// Check if there's only one room
	$: hasMultipleRooms = sortedRooms.length > 1;
</script>

<svelte:head>
	{#if building}
		<meta
			name="description"
			content={building
				? `View available laundry machines at ${building.organization_name} - The Ohio State University.`
				: 'Loading laundry machine information...'}
		/>
		<title>Laundry Machines at {building.organization_name}</title>
	{:else}
		<title>Loading laundry machine information...</title>
	{/if}
</svelte:head>

<!-- Error Banner -->
{#if showErrorBanner}
	<div class="bg-red-900 text-red-200">
		<div class="flex items-center justify-center gap-2 px-4 py-2">
			<WifiOff class="h-4 w-4" />
			<span>Failed to fetch data. Will try again soon.</span>
		</div>
	</div>
{/if}

<div class="flex min-h-screen flex-col p-4 text-white md:p-8">
	<div class="mx-auto w-full max-w-full flex-grow">
		<div class="mb-8">
			<a
				href="/buildings"
				class="group flex items-center gap-2 font-medium text-gray-400 transition-colors hover:text-white"
			>
				<ArrowLeft class="h-5 w-5" />
				<span class="transition-transform group-hover:translate-x-[-4px]">Back to Buildings</span>
			</a>
		</div>

		{#if initialLoad}
			<div class="flex h-64 items-center justify-center">
				<div
					class="h-12 w-12 animate-spin rounded-full border-2 border-gray-800 border-t-white"
				></div>
			</div>
		{:else if error}
			<div
				class="rounded-xl border border-red-800/50 bg-red-900/30 px-6 py-4 font-medium text-red-300 backdrop-blur-sm"
			>
				{error}
			</div>
		{:else if building}
			<h1 class="mb-12 font-serif text-5xl font-bold text-white drop-shadow-lg">
				{building.organization_name}
			</h1>

			<div class="mb-8 flex items-center justify-between gap-4">
				<div class="flex items-center gap-2 text-sm text-gray-400">
					{#if lastRefresh}
						<span>Last updated {formatDateTime(lastRefresh.toISOString())}</span>
						<span>•</span>
					{/if}
					<span>Refreshing in {countdown}s</span>
				</div>
				<button
					on:click={fetchBuildingDetails}
					disabled={loading}
					class="inline-flex h-9 w-[88px] items-center justify-center gap-2 rounded-lg border border-gray-800 bg-black text-sm font-medium text-white transition-colors hover:border-gray-700 disabled:opacity-50"
				>
					{#if loading}
						<RotateCw class="h-4 w-4 animate-spin" />
					{/if}
					Refresh
				</button>
			</div>

			{#if stats}
				<MachineStats {stats} />
			{/if}

			{#each sortedRooms as room}
				<div class="mb-12">
					{#if hasMultipleRooms}
						<h2 class="mb-6 text-2xl font-bold">
							<span class="text-gray-400">{room.roomName}</span>
						</h2>
					{/if}

					<!-- Washers Table -->
					<div class="mb-8 overflow-x-auto">
						<MachineTable machines={room.washers} type="washer" />
					</div>

					<!-- Dryers Table -->
					<div class="overflow-x-auto">
						<MachineTable machines={room.dryers} type="dryer" />
					</div>
				</div>
			{/each}
		{/if}
	</div>
	<Footer />
</div>

<style>
	.animate-fade-in {
		animation: fadeIn 0.3s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-100%);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
