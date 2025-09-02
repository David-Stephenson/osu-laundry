<script lang="ts">
    import type { Machine } from '$lib/types';
    import { formatRemainingTime, formatDateTimeLocal, getStatusColor } from '$lib/utils';
    import { Pin, Clock } from 'lucide-svelte';


    export let machine: Machine;
    export let onUnpin: (id: string) => void;

    // Match pinned card color family with table status chips and stats bars
    function getCardStyleForColor(color: 'blue' | 'yellow' | 'green' | 'red') {
        const map = {
            // Darken body (200) and ring (400) for better legibility
            blue:   { bg: 'bg-blue-200',   ring: 'ring-blue-400',   text: 'text-blue-900',   headerBg: 'bg-blue-600',   headerText: 'text-white' },
            // Yellow has better contrast with dark text in header
            yellow: { bg: 'bg-yellow-200', ring: 'ring-yellow-400', text: 'text-yellow-900', headerBg: 'bg-yellow-500', headerText: 'text-gray-900' },
            green:  { bg: 'bg-green-200',  ring: 'ring-green-400',  text: 'text-green-900',  headerBg: 'bg-green-600',  headerText: 'text-white' },
            red:    { bg: 'bg-red-200',    ring: 'ring-red-400',    text: 'text-red-900',    headerBg: 'bg-red-600',    headerText: 'text-white' }
        } as const;
        return map[color];
    }

    $: statusColor = getStatusColor(machine.status);
    $: cardStyle = getCardStyleForColor(statusColor);

    // Only show ETA when provided by API
    $: showEta =
        machine.status === 'IN_USE' &&
        machine.estimated_end

    // Whether to render caution tape on the header
    $: isUnavailable = (machine.status !== 'AVAILABLE' && machine.status !== 'IN_USE' && machine.status !== 'COMPLETE') || (machine as any).is_active === false;
</script>

<div class="rounded-xl {cardStyle.bg} h-[85px] sm:h-[95px] md:h-[110px] shadow-lg overflow-hidden ring-1 {cardStyle.ring} {machine.is_active === false ? 'opacity-60' : ''} transition-all hover:shadow-xl">
    <!-- Header: Machine info and pin -->
    <div class="flex items-center justify-between px-2 sm:px-3 py-1 {cardStyle.headerBg} {isUnavailable ? 'caution-tape' : ''}">
        <div class="flex items-center gap-1 sm:gap-1.5">
            <span class="text-xs sm:text-sm font-bold {cardStyle.headerText}">#{machine.number}</span>
            <span class="text-[10px] sm:text-xs font-bold {cardStyle.headerText}">
                {machine.type === 'washer' ? 'Washer' : 'Dryer'}
            </span>
        </div>
        <button
            class="flex h-4 sm:h-5 w-4 sm:w-5 items-center justify-center rounded-full {cardStyle.headerText} hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
            title="Unpin machine #{machine.number}"
            aria-label="Unpin machine #{machine.number}"
            on:click={() => onUnpin(machine.id)}
        >
            <Pin class="h-3 sm:h-4 w-3 sm:w-4 fill-current" />
        </button>
    </div>
    
    <!-- Main content -->
    <div class="relative h-[58px] sm:h-[65px] md:h-[75px]">
        <!-- Time left (centered) -->
        {#if machine.status === 'IN_USE'}
            <div class="absolute top-1.5 sm:top-2 left-0 right-0 flex items-center justify-center gap-1 text-gray-900">
                <Clock class="h-2.5 sm:h-3 w-2.5 sm:w-3" />
                <span class="text-[10px] sm:text-xs font-bold">{formatRemainingTime(machine.remaining_seconds)}</span>
            </div>
        {/if}
        
        <!-- Status (centered) -->
        <div class="flex h-full items-center justify-center">
            <div class="font-black {cardStyle.text} text-sm sm:text-base md:text-lg">
                {machine.status === 'AVAILABLE' 
                    ? 'Available' 
                    : machine.status === 'COMPLETE'
                        ? 'Complete'
                        : machine.status === 'IN_USE'
                            ? 'In Use'
                            : 'Out of Service'
                }
            </div>
        </div>
        
        <!-- Done at (bottom) -->
        {#if showEta}
            <div class="absolute bottom-1 sm:bottom-1.5 left-0 right-0 text-center text-[9px] sm:text-[10px] text-gray-900 font-bold">
                Done: {formatDateTimeLocal(machine.estimated_end)}
            </div>
        {/if}
    </div>
</div> 