<script lang="ts">
    import type { Machine } from '$lib/types';
    import { formatRemainingTime, getStatusStyle, formatDateTime } from '$lib/utils';
    import { Star, Clock } from 'lucide-svelte';

    export let machine: Machine;
    export let onUnpin: (id: string) => void;

    // Get card style configuration based on status
    $: cardStyle = machine.status === 'AVAILABLE' 
        ? { bg: 'bg-blue-900/30', border: 'border-blue-800/50', text: 'text-blue-300' }
        : machine.status === 'COMPLETE' 
            ? { bg: 'bg-emerald-900/30', border: 'border-emerald-800/50', text: 'text-emerald-300' }
            : machine.status === 'IN_USE'
                ? { bg: 'bg-yellow-900/30', border: 'border-yellow-800/50', text: 'text-yellow-300' }
                : { bg: 'bg-red-900/30', border: 'border-red-800/50', text: 'text-red-300' };
</script>

<div class="rounded-lg border {cardStyle.border} {cardStyle.bg} h-[85px] sm:h-[95px] md:h-[110px] shadow-md">
    <!-- Header: Machine info and pin -->
    <div class="flex items-center justify-between px-2 sm:px-3 py-1 border-b border-opacity-20 {cardStyle.border}">
        <div class="flex items-center gap-1 sm:gap-1.5">
            <span class="text-xs sm:text-sm font-bold text-white">#{machine.number}</span>
            <span class="text-[10px] sm:text-xs font-medium text-zinc-300">
                {machine.type === 'washer' ? 'Washer' : 'Dryer'}
            </span>
        </div>
        <button
            class="flex h-4 sm:h-5 w-4 sm:w-5 items-center justify-center rounded-full text-scarlet"
            on:click={() => onUnpin(machine.id)}
        >
            <Star class="h-3 sm:h-4 w-3 sm:w-4 fill-current" />
        </button>
    </div>
    
    <!-- Main content -->
    <div class="relative h-[58px] sm:h-[65px] md:h-[75px]">
        <!-- Time left (centered) -->
        {#if machine.status === 'IN_USE'}
            <div class="absolute top-1.5 sm:top-2 left-0 right-0 flex items-center justify-center gap-1 text-zinc-300">
                <Clock class="h-2.5 sm:h-3 w-2.5 sm:w-3" />
                <span class="text-[10px] sm:text-xs font-medium">{formatRemainingTime(machine.remaining_seconds)}</span>
            </div>
        {/if}
        
        <!-- Status (centered) -->
        <div class="flex h-full items-center justify-center">
            <div class="font-medium {cardStyle.text} text-sm sm:text-base md:text-lg">
                {machine.status === 'AVAILABLE' 
                    ? 'Available' 
                    : machine.status === 'COMPLETE'
                        ? 'Complete'
                        : machine.status === 'IN_USE'
                            ? 'In Use'
                            : 'Unavailable'
                }
            </div>
        </div>
        
        <!-- Done at (bottom) -->
        {#if machine.status === 'IN_USE'}
            <div class="absolute bottom-1 sm:bottom-1.5 left-0 right-0 text-center text-[9px] sm:text-[10px] text-zinc-400">
                Done: {formatDateTime(machine.estimated_end)}
            </div>
        {/if}
    </div>
</div> 