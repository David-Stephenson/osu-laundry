<script lang="ts">
    import { page } from '$app/stores';
    import { ArrowLeft } from 'lucide-svelte';
</script>

<svelte:head>
    <title>O-H! Oh no... | Error {$page.status}</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center bg-black p-4 text-center text-white">
    <div class="max-w-xl">
        <h1 class="mb-4 font-serif text-6xl font-bold text-scarlet">O-H!</h1>
        <h2 class="mb-8 font-serif text-4xl font-bold text-white">Oh no...</h2>
        
        <p class="mb-4 text-xl text-gray-400">
            {#if $page.status === 404}
                This page seems to have gone missing.
            {:else}
                Something went wrong on our end.
            {/if}
        </p>

        <p class="mb-8 text-gray-500">Error {$page.status}: {$page.error?.message}</p>

        <a
            href="/"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-black px-6 py-3 
            text-white transition-colors hover:border-scarlet hover:text-scarlet"
        >
            <ArrowLeft class="h-5 w-5" />
            <span>Back to Home</span>
        </a>
    </div>
</div>
