<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import type { Machine } from '$lib/types';
	import MachineTable from '../../../components/MachineTable.svelte';
	import MachineStats from '../../../components/MachineStats.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { ArrowLeft, RotateCw, WifiOff } from 'lucide-svelte';
	import PinnedMachineCard from '../../../components/PinnedMachineCard.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	let loading = false;
	let error: string | null = data.error || null;
	let stats = data.stats;
	let machines = data.machines || [];
	let lastRefresh: Date | null = data.lastRefresh ? new Date(data.lastRefresh) : new Date();
	let countdown = 10;
	let refreshInterval: ReturnType<typeof setInterval>;
	let countdownInterval: ReturnType<typeof setInterval>;
	let showErrorBanner = false;
	let pinnedMachines: Set<string> = new Set();
	let activeTab: 'washers' | 'dryers' = 'washers';

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
		if (loading) return;
		loading = true;
		try {
			const machinesResponse = await fetch(
				`${PUBLIC_API_URL}/api/buildings/${$page.params.id}/machines`
			);

			if (!machinesResponse.ok) {
				throw new Error('Failed to fetch data');
			}

			const machinesData = await machinesResponse.json();

			if (machinesData.data?.building?.rooms) {
				machines = machinesData.data.building.rooms.flatMap(
					(room: { room_name: string; machines: any[]; building_id: string }) =>
						room.machines.map((machine: any) => ({
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
			countdown = 10;
		}
	}

	onMount(() => {
		const stored = localStorage.getItem(`pinned-machines-${$page.params.id}`);
		if (stored) {
			pinnedMachines = new Set(JSON.parse(stored));
		}
		refreshInterval = setInterval(fetchBuildingDetails, 10000);
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
	$: machinesByRoom =
		machines?.reduce(
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
		) || {};

	// Sort rooms by floor number
	$: sortedRooms = Object.values(machinesByRoom).sort((a, b) => a.floorNumber - b.floorNumber);

	// Check if there's only one room
	$: hasMultipleRooms = sortedRooms.length > 1;

	// Sort machines with pinned ones first
	$: sortedMachinesByRoom = Object.values(machinesByRoom).map((room) => ({
		...room,
		washers: [...room.washers].sort((a, b) => {
			const aPinned = pinnedMachines.has(a.id);
			const bPinned = pinnedMachines.has(b.id);
			if (aPinned && !bPinned) return -1;
			if (!aPinned && bPinned) return 1;
			return a.number - b.number;
		}),
		dryers: [...room.dryers].sort((a, b) => {
			const aPinned = pinnedMachines.has(a.id);
			const bPinned = pinnedMachines.has(b.id);
			if (aPinned && !bPinned) return -1;
			if (!aPinned && bPinned) return 1;
			return a.number - b.number;
		})
	}));

	function togglePin(machineId: string) {
		if (pinnedMachines.has(machineId)) {
			pinnedMachines.delete(machineId);
		} else {
			pinnedMachines.add(machineId);
		}
		pinnedMachines = pinnedMachines; // trigger reactivity
		localStorage.setItem(`pinned-machines-${$page.params.id}`, JSON.stringify([...pinnedMachines]));
	}
</script>

<svelte:head>
	{#if data.building}
		<meta
			name="description"
			content={data.building
				? `View available laundry machines at ${data.building.organization_name} - The Ohio State University.`
				: 'Loading laundry machine information...'}
		/>
		<title>Laundry Machines at {data.building.organization_name}</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
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

<div class="min-h-screen bg-black px-4 py-4 text-white sm:px-6 md:px-8 md:py-16">
	<div class="mx-auto w-full max-w-7xl">
		<!-- Mobile Header -->
		<div class="md:hidden mb-5">
			<div class="flex items-center justify-between mb-3">
				<a
					href="/buildings"
					class="group inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-white shadow-sm"
				>
					<ArrowLeft class="h-4 w-4" />
					<span class="text-sm">Back</span>
				</a>
				
				<h1 class="font-serif text-xl font-bold text-white text-center">{data.building?.organization_name}</h1>
				
				<button
					on:click={fetchBuildingDetails}
					disabled={loading}
					class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 shadow-sm"
				>
					<RotateCw class="h-5 w-5 {loading ? 'animate-spin' : ''}" />
				</button>
			</div>
			
			<div class="flex items-center justify-center text-xs text-zinc-500 mb-1">
				<span>Updated {lastRefresh ? formatDateTime(lastRefresh.toISOString()) : ''}</span>
				<span class="mx-2 text-zinc-700">•</span>
				<span class="text-scarlet font-medium">Refreshes in {countdown}s</span>
			</div>
		</div>
        
        <!-- Desktop Header -->
        <div class="hidden md:block mb-10">
            <div class="flex flex-row items-center justify-between mb-6 gap-2">
                <a
                    href="/buildings"
                    class="group inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/80 px-5 py-3 font-medium text-white text-base"
                >
                    <ArrowLeft class="h-5 w-5" />
                    <span class="transition-transform group-hover:translate-x-[-2px]">Back to Buildings</span>
                </a>
                
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2 text-base text-zinc-400">
                        {#if lastRefresh}
                            <span>Updated {formatDateTime(lastRefresh.toISOString())}</span>
                            <span class="text-zinc-600">•</span>
                        {/if}
                        <span><span class="font-bold text-scarlet">{countdown}s</span></span>
                    </div>
                    <button
                        on:click={fetchBuildingDetails}
                        disabled={loading}
                        class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900"
                    >
                        <RotateCw class="h-5 w-5 {loading ? 'animate-spin' : ''}" />
                    </button>
                </div>
            </div>
            
            <h1 class="text-center font-serif text-4xl lg:text-6xl font-bold text-white">
                {data.building?.organization_name}
                <div class="mx-auto mt-6 h-1 w-24 bg-scarlet"></div>
            </h1>
        </div>

		{#if error}
			<div
				class="rounded-lg border border-red-800/50 bg-red-900/30 px-3 py-2 md:px-8 md:py-6 text-center text-xs md:text-lg font-medium text-red-300 backdrop-blur-sm"
			>
				{error}
			</div>
		{:else if data.building}
			{#if stats}
				<div class="mb-4 md:mb-12">
					<MachineStats {stats} />
				</div>
			{/if}

			<!-- Pinned Machines Section -->
			{#if pinnedMachines.size > 0}
				<div class="mb-4 md:mb-12">
					<h2 class="mb-2 md:mb-6 text-center text-base md:text-3xl font-bold text-white">
						<span>Pinned Machines</span>
						<div class="mx-auto mt-1 md:mt-4 h-0.5 md:h-1 w-10 md:w-16 bg-scarlet"></div>
					</h2>
					<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
						{#each machines.filter((m) => pinnedMachines.has(m.id)) as machine}
							<PinnedMachineCard {machine} onUnpin={togglePin} />
						{/each}
					</div>
				</div>
			{/if}

			<!-- Mobile Tabs (Only visible on small screens) -->
			<div class="block md:hidden mb-5">
				<div class="flex rounded-lg overflow-hidden border border-zinc-800 shadow-sm">
					<button 
						class="flex-1 py-3 text-center font-medium text-sm uppercase tracking-wide transition-colors
							{activeTab === 'washers' ? 'bg-scarlet text-white' : 'bg-zinc-900 text-zinc-400'}"
						on:click={() => activeTab = 'washers'}
					>
						Washers
					</button>
					<button 
						class="flex-1 py-3 text-center font-medium text-sm uppercase tracking-wide transition-colors
							{activeTab === 'dryers' ? 'bg-scarlet text-white' : 'bg-zinc-900 text-zinc-400'}"
						on:click={() => activeTab = 'dryers'}
					>
						Dryers
					</button>
				</div>
			</div>

			{#each sortedRooms as room}
				<div class="mb-4 md:mb-16">
					{#if hasMultipleRooms}
						<h2 class="mb-2 md:mb-8 text-center text-lg md:text-3xl font-bold">
							<span class="text-scarlet">{room.roomName}</span>
						</h2>
					{/if}

					<!-- Washers Table (Hidden on mobile when dryers tab is active) -->
					<div class="mb-3 md:mb-10 overflow-x-auto {activeTab !== 'washers' ? 'hidden md:block' : ''}">
						<MachineTable
							machines={room.washers}
							type="washer"
							{pinnedMachines}
							onTogglePin={togglePin}
						/>
					</div>

					<!-- Dryers Table (Hidden on mobile when washers tab is active) -->
					<div class="overflow-x-auto {activeTab !== 'dryers' ? 'hidden md:block' : ''}">
						<MachineTable
							machines={room.dryers}
							type="dryer"
							{pinnedMachines}
							onTogglePin={togglePin}
						/>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
