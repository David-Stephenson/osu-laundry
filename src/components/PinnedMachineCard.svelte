<script lang="ts">
    import type { Machine } from '$lib/types';
    import { formatRemainingTime, getStatusStyle, formatDateTime } from '$lib/utils';
    import { Star, Clock } from 'lucide-svelte';

    export let machine: Machine;
    export let onUnpin: (id: string) => void;

    // Get background color based on status
    $: bgColor = machine.status === 'AVAILABLE' 
        ? 'bg-blue-900/50' 
        : machine.status === 'COMPLETE' 
            ? 'bg-emerald-900/50' 
            : 'bg-yellow-900/50';
</script>

<div class="relative h-[120px] rounded-lg border border-gray-800 p-3 {bgColor}">
    <div class="absolute left-3 right-3 top-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <span class="text-lg font-bold text-white">#{machine.number}</span>
            <span class="rounded bg-gray-800 px-2 py-0.5 text-sm font-medium text-gray-300">
                {machine.type === 'washer' ? 'Washer' : 'Dryer'}
            </span>
        </div>
        <button
            class="text-scarlet transition-colors hover:text-scarlet/80"
            on:click={() => onUnpin(machine.id)}
        >
            <Star class="h-4 w-4 fill-current" />
        </button>
    </div>

    <div class="flex h-full items-center justify-center">
        {#if machine.status === 'IN_USE'}
            <div class="flex flex-col items-center gap-1 text-center">
                <span class="text-lg font-bold text-yellow-300">In Use</span>
                <div class="flex items-center gap-1.5 text-gray-300">
                    <Clock class="h-3.5 w-3.5" />
                    <span>{formatRemainingTime(machine.remaining_seconds)}</span>
                </div>
                <span class="text-xs text-gray-400">
                    Done at {formatDateTime(machine.estimated_end)}
                </span>
            </div>
        {:else}
            <span class="text-2xl font-bold {machine.status === 'AVAILABLE' ? 'text-blue-300' : 'text-emerald-300'}">
                {machine.status === 'AVAILABLE' ? 'Available' : 'Complete'}
            </span>
        {/if}
    </div>
</div> 