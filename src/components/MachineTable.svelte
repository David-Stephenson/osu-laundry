<script lang="ts">
	import type { Machine } from '$lib/types';
	import { formatDateTime, formatRemainingTime, getStatusStyle } from '$lib/utils';
	import { Star, Clock } from 'lucide-svelte';

	export let machines: Machine[];
	export let type: 'washer' | 'dryer';
	export let pinnedMachines: Set<string>;
	export let onTogglePin: (id: string) => void;

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
	<h2 class="mb-3 text-xl font-bold text-white md:mb-6 md:text-2xl">
		{machines.length}
		{type === 'washer' ? 'Washers' : 'Dryers'}
	</h2>
	
	<!-- Mobile Table View (Only visible on small screens) -->
	<div class="md:hidden overflow-hidden rounded-lg border border-zinc-800 shadow-md">
		<table class="w-full overflow-hidden bg-zinc-900/30 backdrop-blur-sm">
			<thead>
				<tr class="border-b border-zinc-800">
					<th class="px-2.5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">#</th>
					<th class="w-12 px-2 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-zinc-400">PIN</th>
					<th class="px-2.5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">STATUS</th>
					<th class="px-2.5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-zinc-400">TIME</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-zinc-800/30">
				{#each machines.sort((a, b) => a.number - b.number) as machine}
					<tr class={`transition-colors hover:bg-zinc-800/20 ${pinnedMachines.has(machine.id) ? 'bg-zinc-800/30' : ''}`}>
						<td class="px-2.5 py-2.5 text-left">
							<span class="text-base font-semibold text-white">#{machine.number}</span>
						</td>
						<td class="w-12 px-2 py-2.5 text-center">
							<button
								class="flex h-7 w-7 mx-auto items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-800/50"
								on:click|stopPropagation={() => onTogglePin(machine.id)}
							>
								<Star
									class="h-4 w-4 {pinnedMachines.has(machine.id)
										? 'fill-current text-scarlet'
										: ''}"
								/>
							</button>
						</td>
						<td class="px-2.5 py-2.5 text-left">
							<span
								class={`inline-block rounded-full px-2.5 py-1 text-sm font-medium shadow-sm ${getStatusStyle(machine.status)}`}
							>
								{machine.status.replace('_', ' ')}
							</span>
						</td>
						<td class="px-2.5 py-2.5 text-center text-sm font-medium text-zinc-300">
							{#if machine.status === 'IN_USE'}
								{formatRemainingTime(machine.remaining_seconds)}
							{:else}
								-
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	
	<!-- Desktop Table View (Hidden on mobile) -->
	<div class="hidden md:block overflow-hidden rounded-xl border border-zinc-800 shadow-md">
		<table class="w-full overflow-hidden bg-zinc-900/30 backdrop-blur-sm">
			<thead>
				<tr class="border-b border-zinc-800">
					<th
						class="w-16 px-4 py-4 text-left text-sm font-medium uppercase tracking-wider text-zinc-400"
						>#</th
					>
					<th
						class="w-14 px-3 py-4 text-center text-sm font-medium uppercase tracking-wider text-zinc-400"
						>Pin</th
					>
					<th class="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider text-zinc-400"
						>Status</th
					>
					<th
						class="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider text-zinc-400"
						>Time Left</th
					>
					<th
						class="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider text-zinc-400"
						>Est. Done</th
					>
					<th
						class="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider text-zinc-400"
						>Updated</th
					>
				</tr>
			</thead>
			<tbody class="divide-y divide-zinc-800/30">
				{#each machines.sort((a, b) => a.number - b.number) as machine}
					<tr
						class={`transition-colors hover:bg-zinc-800/30 ${!machine.is_active ? 'opacity-60' : ''} 
						${pinnedMachines.has(machine.id) ? 'bg-zinc-800/30' : ''}`}
					>
						<td class="w-16 px-4 py-5 text-left">
							<span class="text-xl font-semibold text-white">#{machine.number}</span>
						</td>
						<td class="w-14 px-3 py-5">
							<button
								class="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:text-scarlet hover:bg-zinc-800/50"
								on:click|stopPropagation={() => onTogglePin(machine.id)}
							>
								<Star
									class="h-5 w-5 {pinnedMachines.has(machine.id)
										? 'fill-current text-scarlet'
										: ''}"
								/>
							</button>
						</td>
						<td class="px-6 py-5 text-left">
							<span
								class={`inline-block rounded-full px-4 py-2 text-sm font-medium shadow-sm ${getStatusStyle(machine.status)}`}
							>
								{machine.status.replace('_', ' ')}
							</span>
						</td>
						<td class="px-6 py-5 text-center text-base font-medium text-zinc-300">
							{#if machine.status === 'IN_USE'}
								{formatRemainingTime(machine.remaining_seconds)}
							{:else}
								-
							{/if}
						</td>
						<td class="px-6 py-5 text-center font-medium text-zinc-300">
							{#if machine.status === 'IN_USE' && machine.estimated_end !== "0001-01-01T00:00:00Z"}
								{formatDateTime(machine.estimated_end)}
							{:else}
								-
							{/if}
						</td>
						<td class="px-6 py-5 text-center text-sm text-zinc-400">
							{formatLastUpdated(machine.received_at)}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
