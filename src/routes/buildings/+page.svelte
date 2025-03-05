<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Building } from '$lib/types';
	import { Loader2, AlertCircle, Search } from 'lucide-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let searchQuery = '';

	function selectBuilding(building: Building) {
		goto(`/buildings/${building.id}`);
	}

	$: buildings = data.buildings || [];
	$: error = data.error || null;
	$: filteredBuildings = buildings.filter((building) =>
		building.organization_name.toLowerCase().includes(searchQuery.toLowerCase())
	);
</script>

<svelte:head>
	<title>Select Your Residence | OSU Laundry</title>
	<meta
		name="description"
		content="View available laundry machines across residence halls at The Ohio State University."
	/>
</svelte:head>

<div class="relative min-h-screen overflow-hidden bg-black px-4 py-10 text-white md:px-8 md:py-16">
	<div class="mx-auto max-w-7xl">
		<!-- Page header -->
		<div class="mb-16 text-center">
			<h1 class="mb-6 font-serif text-4xl font-bold leading-tight md:text-5xl">
				Select Your
				<span class="text-scarlet">Residence Hall</span>
			</h1>
			<p class="mx-auto mb-10 max-w-md text-lg text-zinc-400">
				Check real-time machine availability in your building
			</p>
		</div>

		<!-- Search Section -->
		<div class="mb-12">
			<div class="relative mx-auto max-w-xl">
				<div class="group relative">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search your residence hall..."
						class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-5 py-4 pl-12 text-base
							text-white placeholder-zinc-500 transition-colors duration-200 focus:border-scarlet
							focus:outline-none focus:ring-1 focus:ring-scarlet"
					/>
					<Search
						class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500 transition-colors duration-200 group-focus-within:text-scarlet"
					/>
				</div>
			</div>
		</div>

		{#if data.buildings === undefined}
			<div class="flex h-64 items-center justify-center">
				<div class="text-center">
					<Loader2 class="mx-auto h-16 w-16 animate-spin text-scarlet" />
					<p class="mt-4 text-zinc-400">Loading buildings...</p>
				</div>
			</div>
		{:else if error}
			<div
				class="mx-auto max-w-md rounded-lg border border-red-700/30 bg-red-950/30 px-6 py-6 text-red-300"
			>
				<p class="flex items-center justify-center gap-2">
					<AlertCircle class="h-5 w-5" />
					{error}
				</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each filteredBuildings as building}
					<button
						on:click={() => selectBuilding(building)}
						class="flex min-h-[120px] w-full items-center justify-center rounded-lg
							border border-zinc-800 bg-zinc-900 p-8 text-center
							transition-all duration-300 hover:border-scarlet/50 hover:bg-zinc-800
							focus:outline-none focus:ring-2 focus:ring-scarlet focus:ring-offset-2 focus:ring-offset-black"
					>
						<h3 class="text-2xl font-bold">{building.organization_name}</h3>
					</button>
				{/each}
			</div>

			{#if filteredBuildings.length === 0}
				<div class="mt-12 text-center">
					<div
						class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900"
					>
						<AlertCircle class="h-10 w-10 text-zinc-600" />
					</div>
					<p class="text-xl text-zinc-400">
						No buildings found matching "<span class="font-medium text-white">{searchQuery}</span>"
					</p>
					<p class="mt-2 text-zinc-500">Try a different search term</p>
				</div>
			{/if}
		{/if}
	</div>
</div>
