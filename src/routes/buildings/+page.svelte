<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Building } from '$lib/types';
	import { Loader2, AlertCircle, Search, Home } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let data: PageData;

	let searchQuery = '';
	let searchInputRef: HTMLInputElement;

	function selectBuilding(building: Building) {
		goto(`/buildings/${building.id}`);
	}

	function focusSearch() {
		searchInputRef?.focus();
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
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
</svelte:head>

<div class="relative min-h-screen bg-black px-4 py-8 text-white sm:px-6 md:px-10 md:py-20">
	<div class="mx-auto max-w-6xl">
		<!-- Page header -->
		<div class="mb-8 md:mb-14 text-center" in:fade={{ duration: 400, delay: 200 }}>
			<h1 class="font-serif text-3xl md:text-5xl font-bold leading-tight mb-3 md:mb-5">
				<span class="inline-block">Select Your</span>
				<span class="text-scarlet block md:inline md:ml-3">Residence Hall</span>
			</h1>
			<p class="mx-auto max-w-lg text-sm md:text-base text-zinc-400 mb-6 md:mb-10">
				Check real-time machine availability in your building
			</p>
		</div>

		<!-- Search Section -->
		<div class="mb-8 md:mb-10" in:fade={{ duration: 400, delay: 300 }}>
			<div class="relative mx-auto max-w-xl">
				<div class="group relative rounded-lg shadow-lg shadow-black/20">
					<input
						type="text"
						bind:this={searchInputRef}
						bind:value={searchQuery}
						placeholder="Search your residence hall..."
						class="w-full rounded-xl border border-zinc-800/80 bg-zinc-900/90 px-4 py-3 md:px-5 md:py-4 pl-11 md:pl-12 text-sm md:text-base
							text-white placeholder-zinc-500 transition-all duration-200 backdrop-blur-sm
							focus:border-scarlet/70 focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-scarlet/30"
					/>
					<Search
						class="absolute left-3.5 top-1/2 h-4 w-4 md:h-5 md:w-5 -translate-y-1/2 text-zinc-500 transition-colors duration-200 group-focus-within:text-scarlet"
					/>
				</div>
			</div>
		</div>

		{#if data.buildings === undefined}
			<div class="flex h-48 md:h-64 items-center justify-center" in:fade>
				<div class="text-center">
					<Loader2 class="mx-auto h-12 w-12 md:h-16 md:w-16 animate-spin text-scarlet" />
					<p class="mt-3 md:mt-4 text-zinc-400">Loading buildings...</p>
				</div>
			</div>
		{:else if error}
			<div
				class="mx-auto max-w-md rounded-lg border border-red-700/30 bg-red-950/30 px-4 py-4 md:px-6 md:py-6 text-red-300"
				in:fade
			>
				<p class="flex items-center justify-center gap-2">
					<AlertCircle class="h-5 w-5 flex-shrink-0" />
					<span>{error}</span>
				</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-3 sm:gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each filteredBuildings as building, i (building.id)}
					<button
						on:click={() => selectBuilding(building)}
						in:fly={{ y: 20, delay: 150 + i * 50, duration: 300, easing: quintOut }}
						class="group flex min-h-[80px] sm:min-h-[90px] md:min-h-[110px] w-full items-center justify-center rounded-xl
							border border-zinc-800/90 bg-zinc-900/90 px-4 py-5 md:p-6 text-center
							transition-all duration-300 hover:border-scarlet/60 hover:bg-zinc-800/90 hover:shadow-lg hover:shadow-scarlet/5
							active:scale-[0.98] active:bg-zinc-800 active:border-scarlet/70
							focus:outline-none focus:ring-2 focus:ring-scarlet/60 focus:ring-offset-1 focus:ring-offset-black"
					>
						<div class="flex flex-col items-center justify-center gap-1.5">
							<Home class="h-4 w-4 md:h-5 md:w-5 text-scarlet opacity-70 group-hover:opacity-100 transition-opacity" />
							<h3 class="text-lg sm:text-xl md:text-2xl font-bold group-hover:text-scarlet/90 transition-colors">
								{building.organization_name}
							</h3>
						</div>
					</button>
				{/each}
			</div>

			{#if filteredBuildings.length === 0}
				<div class="mt-8 md:mt-12 text-center" in:fade>
					<div
						class="mx-auto mb-4 md:mb-6 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full border border-zinc-800/80 bg-zinc-900/80 backdrop-blur-sm"
					>
						<AlertCircle class="h-8 w-8 md:h-10 md:w-10 text-zinc-600" />
					</div>
					<p class="text-lg md:text-xl text-zinc-400">
						No buildings found matching "<span class="font-medium text-white">{searchQuery}</span>"
					</p>
					<p class="mt-2 text-zinc-500">Try a different search term</p>
					<button
						on:click={() => { searchQuery = ''; focusSearch(); }}
						class="mt-4 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-white hover:border-scarlet/50 hover:bg-zinc-800 transition-colors"
					>
						Clear search
					</button>
				</div>
			{/if}
		{/if}
	</div>
</div>
