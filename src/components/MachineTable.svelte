<script lang="ts">
	import type { Machine } from '$lib/types';
	import { formatDateTime, formatRemainingTime, getStatusStyle } from '$lib/utils';
	import { Ban, Lock, Plus } from 'lucide-svelte';

	export let machines: Machine[];
	export let type: 'washer' | 'dryer';

	function formatLastUpdated(isoString: string): string {
		const date = new Date(isoString);
		const now = new Date();
		const isToday = date.toDateString() === now.toDateString();

		if (isToday) {
			return date.toLocaleString(undefined, {
				hour: 'numeric',
				minute: '2-digit',
				second: '2-digit',
				hour12: true
			});
		} else {
			return date.toLocaleString(undefined, {
				month: 'short',
				day: 'numeric',
				hour: 'numeric',
				minute: '2-digit',
				hour12: true
			});
		}
	}
</script>

<div>
	<h2 class="mb-4 md:mb-6 text-xl md:text-2xl font-bold text-white">
		{machines.length}
		{type === 'washer' ? 'Washers' : 'Dryers'}
	</h2>
	<div class="overflow-hidden rounded-2xl border border-gray-800/50">
		<table class="w-full overflow-hidden bg-gray-900/30 backdrop-blur-sm">
			<thead>
				<tr>
					<th class="w-10 px-1 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-gray-400">#</th>
					<th class="px-2 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-gray-400">Status</th>
					<th class="px-2 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-gray-400">Time Left</th>
					<th class="hidden md:table-cell px-6 py-4 text-center text-sm font-medium uppercase tracking-wider text-gray-400">Est. Done</th>
					<th class="px-2 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-gray-400">Updated</th>
				</tr>
			</thead>
			<tbody class="border-t border-gray-800/50">
				{#each machines.sort((a, b) => a.number - b.number) as machine}
					<tr class={`transition-colors hover:bg-gray-800/30 ${!machine.is_active ? 'opacity-50' : ''}`}>
						<td class="w-10 px-1 py-3 md:py-4 text-center">
							<span class="text-base md:text-lg font-semibold text-white">{machine.number}</span>
						</td>
						<td class="px-2 md:px-6 py-3 md:py-4 text-center">
							<span class={`inline-block rounded-full px-2 md:px-4 py-1 md:py-1.5 text-xs md:text-sm font-medium ${getStatusStyle(machine.status)}`}>
								{machine.status.replace('_', ' ')}
							</span>
						</td>
						<td class="px-2 md:px-6 py-3 md:py-4 text-center text-sm md:text-base font-medium text-gray-300">
							{#if machine.status === 'IN_USE'}
								{formatRemainingTime(machine.remaining_seconds)}
							{:else}
								-
							{/if}
						</td>
						<td class="hidden md:table-cell px-6 py-4 text-center font-medium text-gray-300">
							{#if machine.status === 'IN_USE'}
								{formatDateTime(machine.estimated_end)}
							{:else}
								-
							{/if}
						</td>
						<td class="px-2 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm text-gray-400">
							{formatLastUpdated(machine.received_at)}
						</td>
					</tr>
					{#if machine !== machines[machines.length - 1]}
						<tr>
							<td colspan="5" class="p-0">
								<div class="border-t border-gray-800/50"></div>
							</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
</div>
