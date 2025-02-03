<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { Building, ApiResponse } from '$lib/types';
	import Footer from '$components/Footer.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { ArrowRight, Loader2, AlertCircle, WashingMachine } from 'lucide-svelte';

	let buildings: Building[] = [];
	let loading = true;
	let error: string | null = null;

	async function fetchBuildings() {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/api/buildings`);
			const data: ApiResponse<Building[]> = await response.json();
			buildings = data.data.sort((a, b) => a.organization_name.localeCompare(b.organization_name));
		} catch (e) {
			error = 'Failed to load buildings';
		} finally {
			loading = false;
		}
	}

	function selectBuilding(building: Building) {
		goto(`/buildings/${building.id}`);
	}

	onMount(fetchBuildings);
</script>

<svelte:head>
	<title>OSU Laundry | Select a Residence</title>
	<meta
		name="description"
		content="Select a residence hall to view available laundry machines at The Ohio State University."
	/>
</svelte:head>

<div
	class="flex min-h-screen flex-col bg-gradient-to-b from-black to-black/95 p-4 text-white md:p-8"
>
	<div class="mx-auto w-full max-w-7xl flex-grow">
		<div class="mb-12 text-center">
			<h1 class="mb-3 font-serif text-5xl font-bold text-white">Select Your Residence</h1>
			<p class="text-lg text-gray-400">Check real-time laundry availability in your building</p>
		</div>

		{#if loading}
			<div class="flex h-64 items-center justify-center">
				<Loader2 class="h-16 w-16 animate-spin text-scarlet" />
			</div>
		{:else if error}
			<div
				class="mx-auto max-w-md rounded-xl border border-red-700 bg-red-900/50 px-6 py-4 text-red-300"
			>
				<p class="flex items-center justify-center gap-2">
					<AlertCircle class="h-5 w-5" />
					{error}
				</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{#each buildings as building}
					<button
						on:click={() => selectBuilding(building)}
						class="group relative aspect-[21/9] transform overflow-hidden rounded-2xl
							border border-gray-800 text-left transition-all duration-300
							hover:-translate-y-2 hover:border-scarlet hover:shadow-lg hover:shadow-scarlet/20"
					>
						<div class="absolute inset-0">
							<div
								class="h-full w-full bg-gradient-to-br from-scarlet to-[#8B0000]
								opacity-90 transition-all duration-300 group-hover:opacity-100"
							></div>
						</div>

						<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

						<div class="relative flex h-full flex-col items-center justify-center p-4">
							<WashingMachine
								class="mb-2 h-6 w-6 text-white/70 transition-all duration-300 group-hover:scale-110"
							/>
							<h2
								class="text-center font-serif text-2xl font-bold text-white drop-shadow-lg
								transition-transform duration-300 group-hover:scale-105"
							>
								{building.organization_name}
							</h2>
							<div
								class="mt-2 flex items-center gap-2 text-gray-200 opacity-0
								transition-all duration-300 group-hover:opacity-100"
							>
								<span>View Machines</span>
								<ArrowRight class="h-4 w-4" />
							</div>
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>
	<Footer />
</div>
