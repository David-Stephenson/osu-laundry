
<script lang="ts">
	import { Loader2, AlertCircle, Search, Home, X, Star } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	export let data: PageData;

	let searchQuery = '';

	// Favorites state (persisted to localStorage)
	const FAVORITES_KEY = 'osu-laundry:favorites';
	let favoriteIds: string[] = [];

	onMount(() => {
		try {
			const raw = localStorage.getItem(FAVORITES_KEY);
			const parsed = raw ? (JSON.parse(raw) as unknown[]) : [];
			if (Array.isArray(parsed)) favoriteIds = parsed.map((v) => String(v));
		} catch {
			favoriteIds = [];
		}
	});

	function saveFavorites(ids: string[]) {
		favoriteIds = ids;
		try {
			localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
		} catch {}
	}

	function isFavorite(id: string) {
		return favoriteIds.includes(String(id));
	}

	function toggleFavorite(id: string) {
		const idStr = String(id);
		const next = favoriteIds.includes(idStr)
			? favoriteIds.filter((x) => x !== idStr)
			: [...favoriteIds, idStr];
		saveFavorites(next);
	}

	function clearSearch() {
		searchQuery = '';
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			clearSearch();
		}
	}

	function scrollToLetter(letter: string) {
		const element = document.getElementById(`letter-${letter}`);
		if (!element) return;
		const yOffset = 88; // offset for sticky header space
		const y = element.getBoundingClientRect().top + window.pageYOffset - yOffset;
		window.scrollTo({ top: y, behavior: 'smooth' });
	}

	function scrollToFavorites() {
		const element = document.getElementById('favorites-section');
		if (!element) return;
		const yOffset = 88;
		const y = element.getBoundingClientRect().top + window.pageYOffset - yOffset;
		window.scrollTo({ top: y, behavior: 'smooth' });
	}

	$: buildings = data.buildings || [];
	$: error = data.error || null;
	$: filteredBuildings = buildings.filter((building) =>
		building.organization_name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	$: favoriteBuildings = filteredBuildings.filter((b) => favoriteIds.includes(String(b.id)));

	// Alphabetical grouping for quick scanning
	const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
	$: groupedBuildings = filteredBuildings.reduce<Record<string, typeof filteredBuildings>>(
		(acc, b) => {
			const letter = b.organization_name.charAt(0).toUpperCase();
			if (!acc[letter]) acc[letter] = [];
			acc[letter].push(b);
			return acc;
		},
		{}
	);
	$: availableLetters = new Set(Object.keys(groupedBuildings));
	$: groupedList = Object.keys(groupedBuildings)
		.sort()
		.map((letter) => ({ letter, items: groupedBuildings[letter] }));
</script>

<svelte:head>
	<title>Select Your Residence | OSU Laundry</title>
	<meta
		name="description"
		content="View available laundry machines across residence halls at The Ohio State University."
	/>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
	/>
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="OSU Laundry" />
	<meta property="og:title" content="Select Your Residence | OSU Laundry" />
	<meta
		property="og:description"
		content="View available laundry machines across residence halls at The Ohio State University."
	/>
	<meta property="og:image" content="/images/page.png" />
	<meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Select Your Residence | OSU Laundry" />
	<meta
		name="twitter:description"
		content="View available laundry machines across residence halls at The Ohio State University."
	/>
	<meta name="twitter:image" content="/images/page.png" />
	<link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<div class="min-h-screen">
	<!-- Decorative background wrapper to align with the homepage look -->
	<section
		class="relative bg-gradient-to-br from-gray-50 via-red-50 to-red-100 sm:m-4 sm:rounded-3xl"
	>
		<div class="mx-auto max-w-6xl px-6 py-10 md:py-14">
			<!-- Page header -->
			<div class="mb-6 text-center md:mb-10" in:fade={{ duration: 400, delay: 150 }}>
				<h1 class="mb-2 text-3xl font-extrabold leading-tight text-gray-900 md:mb-3 md:text-5xl">
					<span class="inline-block">Select Your</span>
					<span class="text-scarlet">Residence Hall</span>
				</h1>
				<p class="mx-auto max-w-lg text-sm text-gray-700 md:text-base">
					Check real-time machine availability in your building
				</p>
			</div>

			<!-- Search + meta row -->
			<div class="mb-5 md:mb-8" in:fade={{ duration: 400, delay: 250 }}>
				<div class="relative mx-auto max-w-2xl">
					<div
						class="group relative rounded-2xl bg-white/80 shadow-lg ring-1 ring-gray-200 backdrop-blur-sm transition-all focus-within:bg-white"
					>
						<input
							type="text"
							bind:value={searchQuery}
							placeholder="Search your residence hall..."
							class="w-full rounded-2xl border-0 bg-transparent px-4 py-3 pl-11 pr-12 text-sm text-gray-900 placeholder-gray-500 outline-none md:px-5 md:py-4 md:pl-12 md:pr-14 md:text-base"
						/>
						<Search
							class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 transition-colors duration-200 group-focus-within:text-scarlet md:h-5 md:w-5"
						/>
						{#if searchQuery}
							<button
								on:click={clearSearch}
								class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 md:right-3"
							>
								<X class="h-4 w-4" />
							</button>
						{/if}
					</div>
					<div class="mt-2 flex items-center justify-end">
						<div
							class="rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200 backdrop-blur-sm"
						>
							{filteredBuildings.length} result{filteredBuildings.length === 1 ? '' : 's'}
						</div>
					</div>
				</div>
			</div>

			<!-- A-Z quick jump (scrollable) -->
			<div class="mb-6 py-4" in:fade={{ duration: 300, delay: 300 }}>
				<div
					class="mx-auto flex flex-wrap justify-center gap-1 rounded-2xl bg-white/80 p-2 text-xs shadow-md ring-1 ring-gray-200 backdrop-blur-sm sm:gap-1.5 sm:text-sm lg:w-max lg:flex-nowrap"
				>
					<button
						on:click={scrollToFavorites}
						disabled={favoriteBuildings.length === 0}
						class="inline-flex items-center justify-center rounded-lg px-2 py-1 text-gray-700 transition focus:outline-none enabled:hover:bg-gray-100 enabled:hover:text-scarlet disabled:cursor-not-allowed disabled:opacity-40 md:px-2.5 md:py-1.5"
						aria-label="Favorites"
						title="Favorites"
					>
					
						<Star class="h-4 w-4 md:h-5 md:w-5 text-scarlet align-middle mt-px" fill="currentColor" />
					</button>
					{#each alphabet as letter}
						<button
							on:click={() => scrollToLetter(letter)}
							disabled={!availableLetters.has(letter)}
							class="rounded-lg px-2 py-1 text-gray-700 transition focus:outline-none enabled:hover:bg-gray-100 enabled:hover:text-scarlet disabled:cursor-not-allowed disabled:opacity-40 md:px-2.5 md:py-1.5"
						>
							{letter}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</section>

	{#if data.buildings === undefined}
		<div class="flex h-48 items-center justify-center md:h-64" in:fade>
			<div class="text-center">
				<Loader2 class="mx-auto h-12 w-12 animate-spin text-scarlet md:h-16 md:w-16" />
				<p class="mt-3 text-gray-600 md:mt-4">Loading buildings...</p>
			</div>
		</div>
	{:else if error}
		<div
			class="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50/80 px-4 py-4 text-red-700 backdrop-blur-sm md:px-6 md:py-6"
			in:fade
		>
			<p class="flex items-center justify-center gap-2">
				<AlertCircle class="h-5 w-5 flex-shrink-0" />
				<span>{error}</span>
			</p>
		</div>
	{:else}
		<div class="mx-auto max-w-6xl px-6 py-8 md:py-10">
			{#if favoriteBuildings.length > 0}
				<section id="favorites-section" class="scroll-mt-20 pb-10">
					<div
						class="sticky top-0 z-10 -mx-6 mb-3 border-b border-gray-200/70 bg-white/80 px-6 py-2 backdrop-blur-md"
					>
						<h2 class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-700">
							<Star class="h-4 w-4 text-scarlet align-middle mt-px" fill="currentColor" /> Favorites
						</h2>
					</div>
					<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-5 lg:grid-cols-3">
						{#each favoriteBuildings as building, i (building.id)}
							<a
								href={`/buildings/${building.id}`}
								in:fly={{ y: 20, delay: 80 + i * 40, duration: 300, easing: quintOut }}
								class="group relative flex min-h-[84px] w-full items-center justify-center overflow-hidden rounded-2xl px-4 py-5 text-center shadow-lg ring-1 ring-gray-200 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:ring-gray-300 focus:outline-none focus:ring-2 focus:ring-scarlet/60 focus:ring-offset-2 focus:ring-offset-transparent active:scale-[0.98] sm:min-h-[96px] md:min-h-[110px] md:p-6 {building.image
									? 'bg-white/80'
									: 'bg-scarlet'}"
							>
								{#if building.image}
									<div
										class="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
										style={`background-image: url(${building.image})`}
									></div>
									<div
										class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent"
									></div>
								{/if}
								<button
									on:click|preventDefault|stopPropagation={() => toggleFavorite(building.id)}
									aria-label={favoriteIds.includes(String(building.id)) ? 'Unfavorite' : 'Favorite'}
									class="absolute right-2 top-2 z-20 inline-flex items-center justify-center rounded-lg bg-white/80 p-1.5 text-gray-700 shadow ring-1 ring-gray-200 backdrop-blur-sm transition hover:bg-white hover:text-scarlet focus:outline-none focus:ring-2 focus:ring-scarlet/60"
								>
									<Star
										class="h-4 w-4 md:h-5 md:w-5 align-middle mt-px {favoriteIds.includes(String(building.id)) ? 'text-scarlet' : ''}"
										stroke="currentColor"
										fill={favoriteIds.includes(String(building.id)) ? 'currentColor' : 'none'}
									/>
								</button>
								<div class="relative flex flex-col items-center justify-center gap-1.5">
									<Home
										class="h-4 w-4 text-white transition-opacity group-hover:opacity-100 md:h-5 md:w-5 {building.image
											? 'opacity-80 drop-shadow-sm'
											: ''}"
									/>
									<h3
										class="text-lg font-bold text-white transition-colors sm:text-xl md:text-2xl {building.image
											? 'drop-shadow-sm group-hover:text-scarlet'
											: ''}"
									>
										{building.organization_name}
									</h3>
								</div>
							</a>
						{/each}
					</div>
				</section>
			{/if}
			{#each groupedList as group, gi (group.letter)}
				<section id={`letter-${group.letter}`} class="scroll-mt-20 pb-10">
					<div
						class="sticky top-0 z-10 -mx-6 mb-3 border-b border-gray-200/70 bg-white/80 px-6 py-2 backdrop-blur-md"
					>
						<h2 class="text-sm font-semibold uppercase tracking-wider text-gray-700">
							{group.letter}
						</h2>
					</div>
					<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-5 lg:grid-cols-3">
						{#each group.items as building, i (building.id)}
							<a
								href={`/buildings/${building.id}`}
								in:fly={{ y: 20, delay: 100 + gi * 20 + i * 40, duration: 300, easing: quintOut }}
								class="group relative flex min-h-[84px] w-full items-center justify-center overflow-hidden rounded-2xl px-4 py-5 text-center shadow-lg ring-1 ring-gray-200 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:ring-gray-300 focus:outline-none focus:ring-2 focus:ring-scarlet/60 focus:ring-offset-2 focus:ring-offset-transparent active:scale-[0.98] sm:min-h-[96px] md:min-h-[110px] md:p-6 {building.image
									? 'bg-white/80'
									: 'bg-scarlet'}"
							>
								{#if building.image}
									<div
										class="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
										style={`background-image: url(${building.image})`}
									></div>
									<div
										class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent"
									></div>
								{/if}
								<button
									on:click|preventDefault|stopPropagation={() => toggleFavorite(building.id)}
									aria-label={favoriteIds.includes(String(building.id)) ? 'Unfavorite' : 'Favorite'}
									class="absolute right-2 top-2 z-20 inline-flex items-center justify-center rounded-lg bg-white/80 p-1.5 text-gray-700 shadow ring-1 ring-gray-200 backdrop-blur-sm transition hover:bg-white hover:text-scarlet focus:outline-none focus:ring-2 focus:ring-scarlet/60"
								>
									<Star
										class="h-4 w-4 md:h-5 md:w-5 align-middle mt-px {favoriteIds.includes(String(building.id)) ? 'text-scarlet' : ''}"
										stroke="currentColor"
										fill={favoriteIds.includes(String(building.id)) ? 'currentColor' : 'none'}
									/>
								</button>
								<div class="relative flex flex-col items-center justify-center gap-1.5">
									<Home
										class="h-4 w-4 text-white transition-opacity group-hover:opacity-100 md:h-5 md:w-5 {building.image
											? 'opacity-80 drop-shadow-sm'
											: ''}"
									/>
									<h3
										class="text-lg font-bold text-white transition-colors sm:text-xl md:text-2xl {building.image
											? 'drop-shadow-sm group-hover:text-scarlet'
											: ''}"
									>
										{building.organization_name}
									</h3>
								</div>
							</a>
						{/each}
					</div>
				</section>
			{/each}
		</div>

		{#if filteredBuildings.length === 0}
			<div class="mx-auto max-w-md px-6 pb-16 pt-10 text-center md:pt-14" in:fade>
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/70 shadow ring-1 ring-gray-200 backdrop-blur-sm md:mb-6 md:h-20 md:w-20"
				>
					<AlertCircle class="h-8 w-8 text-gray-500 md:h-10 md:w-10" />
				</div>
				<p class="text-lg text-gray-700 md:text-xl">
					No buildings found matching "<span class="font-semibold text-gray-900">{searchQuery}</span
					>"
				</p>
				<p class="mt-2 text-gray-600">Try a different search term</p>
				<button
					on:click={clearSearch}
					class="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow ring-1 ring-gray-200 backdrop-blur-sm transition hover:bg-gray-50"
				>
					Clear search
				</button>
			</div>
		{/if}
	{/if}
</div>
