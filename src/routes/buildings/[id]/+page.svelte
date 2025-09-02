<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import type { Machine } from '$lib/types';
	import MachineTable from '../../../components/MachineTable.svelte';
	import MachineStats from '../../../components/MachineStats.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { ArrowLeft, RotateCw, WifiOff, Pin } from 'lucide-svelte';
	import PinnedMachineCard from '../../../components/PinnedMachineCard.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	let loading = false;
	let stats = data.stats;
	let machines = data.machines || [];
	let lastRefresh: Date | null = data.lastRefresh ? new Date(data.lastRefresh) : new Date();
	let countdown = 10;
	let refreshInterval: ReturnType<typeof setInterval>;
	let countdownInterval: ReturnType<typeof setInterval>;
	let showErrorBanner = false;
	let pinnedMachines: Set<string> = new Set();
	let activeFloor: string | null = null;
	const FLOOR_SCROLL_OFFSET = 88; // space below the sticky header

	let idToMachine: Map<string, Machine> = new Map();
	$: idToMachine = new Map(machines.map((m) => [m.id, m] as [string, Machine]));
	// Preserve order they were pinned (insertion order of the Set)
	$: pinnedMachineList = [...pinnedMachines]
		.map((id) => idToMachine.get(id))
		.filter(Boolean) as Machine[];

	// Helper function to format date to local time
	function formatDateTime(isoString: string): string {
		const date = new Date(isoString);
		return date.toLocaleString(undefined, {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
	}

	function scrollToElementWithOffset(elementId: string) {
		if (typeof window === 'undefined') return;
		const target = document.getElementById(elementId);
		if (!target) return;
		const y = target.getBoundingClientRect().top + window.pageYOffset - FLOOR_SCROLL_OFFSET;
		window.scrollTo({ top: y, behavior: 'smooth' });
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

		// Set up intersection observer for floor navigation
		const observerOptions = {
			root: null,
			rootMargin: '-20% 0px -70% 0px',
			threshold: 0
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const floorId = entry.target.id.replace('room-', '');
					activeFloor = floorId;
					// Update URL hash for deep-linking/bookmarking
					if (typeof window !== 'undefined') {
						const newHash = `#${entry.target.id}`;
						if (window.location.hash !== newHash) {
							window.history.replaceState(null, '', newHash);
						}
					}
				}
			});
		}, observerOptions);

		// Observe floor sections (will be set up after DOM updates)
		setTimeout(() => {
			document.querySelectorAll('[id^="room-"]').forEach((el) => {
				observer.observe(el);
			});
			// If URL has a hash, scroll to that floor on load with offset
			if (typeof window !== 'undefined' && window.location.hash) {
				const id = window.location.hash.slice(1);
				scrollToElementWithOffset(id);
			}
		}, 100);

		return () => {
			observer.disconnect();
		};
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
					// Try to extract floor number, but use room name for sorting if no number exists
					const floorMatch = machine.room_name.match(/\d+/);
					const floorNumber = floorMatch ? parseInt(floorMatch[0]) : 0;

					acc[roomKey] = {
						roomId: machine.room_id,
						roomName: machine.room_name,
						floorNumber: floorNumber,
						sortKey: floorNumber > 0 ? floorNumber : machine.room_name, // Use room name for non-numbered rooms
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
					sortKey: number | string;
					washers: Machine[];
					dryers: Machine[];
				}
			>
		) || {};

	// Sort rooms - by floor number if they have them, otherwise alphabetically by name
	$: sortedRooms = Object.values(machinesByRoom).sort((a, b) => {
		// If both have actual floor numbers (>0), sort by floor number
		if (a.floorNumber > 0 && b.floorNumber > 0) {
			return a.floorNumber - b.floorNumber;
		}
		// Otherwise sort alphabetically by room name
		return a.roomName.localeCompare(b.roomName);
	});

	// Check if there's only one room
	$: hasMultipleRooms = sortedRooms.length > 1;

	// Always show navigation if there are multiple rooms - no filtering
	$: shouldShowNavigation = hasMultipleRooms;

	// Function to clean up room names for mobile display
	function getCleanRoomName(roomName: string, _buildingName: string): string {
		return roomName; // backend now provides clean names
	}

	// Function to get shortened room name for desktop navigation
	function getShortRoomName(roomName: string, buildingName: string, allRooms: any[]): string {
		const base = getCleanRoomName(roomName, buildingName).trim();

		// If the room name references numbered floors (e.g., "4th, 5th, and 6th Floors"),
		// display a compact numeric range for the sidebar like "4-6". If there's only
		// one number, show that single number. If numbers are non-consecutive, join them
		// with "/" (e.g., "4/6"). This keeps labels short without changing box size.
		const numberMatches = base.match(/\d+/g)?.map((n) => parseInt(n, 10)) || [];
		if (numberMatches.length > 0) {
			const uniqueSorted = Array.from(new Set(numberMatches)).sort((a, b) => a - b);
			if (uniqueSorted.length === 1) {
				return String(uniqueSorted[0]);
			}
			let isConsecutive = true;
			for (let i = 1; i < uniqueSorted.length; i++) {
				if (uniqueSorted[i] !== uniqueSorted[i - 1] + 1) {
					isConsecutive = false;
					break;
				}
			}
			if (isConsecutive) {
				return `${uniqueSorted[0]}-${uniqueSorted[uniqueSorted.length - 1]}`;
			}
			return uniqueSorted.join('/');
		}

		// Prefer directional suffixes like "E/W/N/S" or "East/West/North/South"
		const dirLetterFromName = (name: string): string | null => {
			// Match trailing single letter direction or full-word direction
			const single = name.match(/(?:^|\b|[-_])([EWNS])\s*$/i);
			if (single) return single[1].toUpperCase();
			const word = name.match(/\b(East|West|North|South)\s*$/i);
			if (word) return word[1].charAt(0).toUpperCase();
			return null;
		};

		const candidate = dirLetterFromName(base);
		if (candidate) {
			// Ensure uniqueness among all rooms; if conflict, fall back to minimal unique prefix
			const transformedAll = allRooms.map((r) => dirLetterFromName(getCleanRoomName(r.roomName, buildingName)) || '');
			const conflictCount = transformedAll.filter((c) => c === candidate).length;
			if (conflictCount <= 1) return candidate; // unique
		}

		// Fallback: minimal unique-prefix generator
		const all = allRooms.map((r) => getCleanRoomName(r.roomName, buildingName));
		let len = 1;
		let short = base.substring(0, len);
		while (len < base.length) {
			const conflicts = all.filter(
				(n) => n !== base && n.toLowerCase().startsWith(short.toLowerCase())
			);
			if (conflicts.length === 0) break;
			len++;
			short = base.substring(0, len);
		}
		return short;
	}

	function togglePin(machineId: string) {
		if (pinnedMachines.has(machineId)) {
			pinnedMachines.delete(machineId);
		} else {
			pinnedMachines.add(machineId);
		}
		pinnedMachines = pinnedMachines;
		localStorage.setItem(`pinned-machines-${$page.params.id}`, JSON.stringify([...pinnedMachines]));
	}
</script>

<svelte:head>
	{#if data.building}
		<title>{`${data.building.organization_name} Laundry Machines | OSU Laundry`}</title>
		<meta
			name="description"
			content={`View available laundry machines at ${data.building.organization_name} - The Ohio State University.`}
		/>
		<meta property="og:type" content="website" />
		<meta property="og:site_name" content="OSU Laundry" />
		<meta
			property="og:title"
			content={`${data.building.organization_name} Laundry Machines | OSU Laundry`}
		/>
		<meta
			property="og:description"
			content={`View available laundry machines at ${data.building.organization_name} - The Ohio State University.`}
		/>
		<meta property="og:image" content="/images/page.png" />
		<meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
		<meta name="twitter:card" content="summary_large_image" />
		<meta
			name="twitter:title"
			content={`${data.building.organization_name} Laundry Machines | OSU Laundry`}
		/>
		<meta
			name="twitter:description"
			content={`View available laundry machines at ${data.building.organization_name} - The Ohio State University.`}
		/>
		<meta name="twitter:image" content="/images/page.png" />
		<link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
	{:else}
		<title>Loading laundry machine information... | OSU Laundry</title>
		<meta name="description" content="Loading laundry machine information..." />
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>

<!-- Error Banner -->
{#if showErrorBanner}
	<div class="caution-tape border border-red-200 bg-red-100 text-red-800">
		<div class="flex items-center justify-center gap-2 px-4 py-2">
			<WifiOff class="h-4 w-4" />
			<span>We lost connection to our servers.</span>
		</div>
	</div>
{/if}

<div class="min-h-screen bg-gray-100">
	<div
		class="relative min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-red-100 px-4 py-8 sm:px-6 md:px-10 md:py-20"
	>
		<div class="mx-auto w-full max-w-7xl">
			<!-- Mobile Header -->
			<div class="mb-6 md:mb-12">
				<div
					class="flex items-center justify-between gap-2 rounded-2xl bg-white/80 px-3 py-2 shadow-lg ring-1 ring-gray-200 backdrop-blur-sm md:gap-6 md:px-6 md:py-4"
				>
					<a
						href="/buildings"
						class="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm transition-all hover:bg-gray-100"
					>
						<ArrowLeft class="h-4 w-4 md:h-5 md:w-5" />
						<span class="hidden text-sm sm:inline md:text-base">Back to Buildings</span>
						<span class="text-sm sm:hidden">Back</span>
					</a>

					<div class="min-w-0 flex-1 text-center">
						<h1 class="truncate font-serif text-2xl font-bold text-gray-900 md:text-5xl">
							{data.building?.organization_name}
						</h1>
						<div
							class="mt-1 flex items-center justify-center gap-2 text-xs text-gray-600 md:text-sm"
						>
							{#if lastRefresh}
								<span class="inline-flex items-center gap-1">
									Updated {formatDateTime(lastRefresh.toISOString())}
								</span>
								<span class="text-gray-400">•</span>
							{/if}
							<span class="inline-flex items-center gap-1">
								Auto refresh in <span class="font-semibold text-scarlet">{countdown}s</span>
							</span>
						</div>
					</div>

					<div class="flex items-center gap-2">
						<button
							on:click={fetchBuildingDetails}
							disabled={loading}
							class="inline-flex h-9 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 shadow-sm transition-all hover:bg-gray-100 md:h-10 md:px-4"
						>
							<RotateCw
								class="h-4 w-4 text-gray-700 md:h-5 md:w-5 {loading ? 'animate-spin' : ''}"
							/>
							<span class="hidden text-sm font-medium md:inline">Refresh</span>
						</button>
					</div>
				</div>
			</div>

			{#if stats}
				<div class="mb-4 md:mb-12">
					<MachineStats {stats} />
				</div>
			{/if}

			<!-- Pinned Machines Section -->
			{#if pinnedMachineList.length > 0}
				<div class="mb-4 md:mb-12">
					<div class="mb-4 text-center md:mb-8">
						<div
							class="inline-block rounded-2xl bg-white/80 px-6 py-3 shadow-lg ring-1 ring-gray-200 backdrop-blur-sm"
						>
							<h2
								class="flex items-center justify-center gap-2 text-base font-bold text-gray-900 md:text-2xl"
							>
								<Pin class="h-5 w-5 text-scarlet md:h-6 md:w-6" />
								<span>Pinned Machines</span>
							</h2>
						</div>
					</div>

					<!-- Mobile: 2-column grid -->
					<div class="grid grid-cols-2 gap-3 sm:gap-4 md:hidden">
						{#each pinnedMachineList as machine}
							<div>
								<PinnedMachineCard {machine} onUnpin={togglePin} />
							</div>
						{/each}
					</div>

					<!-- Desktop: preserve existing layout -->
					<div class="hidden flex-wrap items-center justify-center gap-6 md:flex">
						{#each pinnedMachineList as machine}
							<div class="flex-1" style="min-width: 280px; max-width: 302px">
								<PinnedMachineCard {machine} onUnpin={togglePin} />
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Mobile Floor Navigation (Only visible on small screens with multiple floors) -->
			{#if shouldShowNavigation}
				<div class="mb-5 block md:hidden">
					<div class="scrollbar-hide flex items-center gap-2 overflow-x-auto pb-2">
						<span class="whitespace-nowrap pr-2 text-sm font-medium text-gray-700">Rooms:</span>
						{#each sortedRooms as room}
							{@const isActive = activeFloor === room.roomId}
							<button
								on:click={() => scrollToElementWithOffset(`room-${room.roomId}`)}
								class="flex-shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all
										{isActive
									? 'bg-scarlet text-white shadow-sm'
									: 'border border-white/40 bg-white/70 text-gray-700 hover:bg-white'}"
							>
								{getCleanRoomName(room.roomName, data.building?.organization_name || '')}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Sticky Floor Navigation (Desktop only) -->
			{#if shouldShowNavigation && sortedRooms.length > 1}
				<div class="fixed right-0 top-1/2 z-20 hidden -translate-y-1/2 md:block">
					<div
						class="flex flex-col gap-1 rounded-l-2xl border border-r-0 border-white/40 bg-white/80 p-2 shadow-lg backdrop-blur-sm"
					>
						<div class="mb-1 text-center text-xs font-semibold text-gray-600">Rooms</div>
						{#each sortedRooms as room}
							{@const isActive = activeFloor === room.roomId}
							<button
								on:click={() => scrollToElementWithOffset(`room-${room.roomId}`)}
								class="flex h-10 w-auto min-w-[2.5rem] items-center justify-center rounded-lg px-1 text-sm font-bold transition-all duration-200
										{isActive
									? 'bg-scarlet text-white shadow-md'
									: 'border border-white/40 bg-white/50 text-gray-700 hover:bg-white hover:text-scarlet'}"
								title="Room {room.roomName}"
							>
								<span class="whitespace-nowrap">
									{getShortRoomName(
										room.roomName,
										data.building?.organization_name || '',
										sortedRooms
									)}
								</span>
							</button>
						{/each}
					</div>
				</div>
			{/if}

			{#each sortedRooms as room}
				<div class="mb-4 md:mb-16" id="room-{room.roomId}">
					{#if hasMultipleRooms}
						<div class="mb-4 text-center md:mb-8">
							<div
								class="inline-block rounded-2xl bg-white/80 px-6 py-3 shadow-lg ring-1 ring-gray-200 backdrop-blur-sm"
							>
								<h2 class="text-lg font-bold text-scarlet md:text-2xl">
									{getCleanRoomName(room.roomName, data.building?.organization_name || '')}
								</h2>
							</div>
						</div>
					{/if}

					<!-- Washers Table -->
					<div class="mb-3 px-4 py-4 md:mb-10">
						<MachineTable
							machines={room.washers}
							type="washer"
							{pinnedMachines}
							onTogglePin={togglePin}
						/>
					</div>

					<!-- Dryers Table -->
					<div class="px-4 py-4">
						<MachineTable
							machines={room.dryers}
							type="dryer"
							{pinnedMachines}
							onTogglePin={togglePin}
						/>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
