<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeft, TriangleAlert } from 'lucide-svelte';
</script>

<svelte:head>
	<title>O-H! Oh no... | Error {$page.status} | OSU Laundry</title>
	<meta
		name="description"
		content="An error occurred on OSU Laundry. Return to the homepage to continue."
	/>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div
	class="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-red-50 to-red-100 p-4 text-center"
>
	<div
		class="w-full max-w-lg rounded-2xl border border-white/40 bg-white/60 p-8 shadow-2xl backdrop-blur-lg"
	>
		<TriangleAlert class="mx-auto mb-6 h-16 w-16 text-scarlet/80" />

		<h1 class="mb-2 font-serif text-5xl font-extrabold text-scarlet sm:text-6xl">O-H! Oh No...</h1>
		<p class="mb-6 text-lg font-medium text-gray-600 sm:text-xl">
			{#if $page.status === 404}
				The page you're looking for seems to have gone missing.
			{:else}
				It seems something went wrong on our end.
			{/if}
		</p>

		{#if $page.error?.message}
			<p class="mb-8 rounded-lg bg-gray-100 p-3 font-mono text-sm text-gray-500">
				{$page.status}: {$page.error.message}
			</p>
		{/if}

		<a
			href="/"
			class="inline-flex items-center gap-2.5 rounded-xl bg-scarlet px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
		>
			<ArrowLeft class="h-5 w-5" />
			<span>Back to Home</span>
		</a>
	</div>
</div>
