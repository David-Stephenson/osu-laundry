<script lang="ts">
	import type { Machine } from '$lib/types';
	import { formatDateTimeLocal, formatRemainingTime, getStatusStyle } from '$lib/utils';
	import { Pin } from 'lucide-svelte';
	import { onMount, afterUpdate } from 'svelte';

	export let machines: Machine[];
	export let type: 'washer' | 'dryer';
	export let pinnedMachines: Set<string>;
	export let onTogglePin: (id: string) => void;

	function isUnavailable(machine: Machine): boolean {
		const nonOperational =
			machine.status !== 'AVAILABLE' &&
			machine.status !== 'IN_USE' &&
			machine.status !== 'COMPLETE';
		return nonOperational || (machine as any).is_active === false;
	}

	function getRowClasses(machine: Machine) {
		if (isUnavailable(machine)) {
			return 'caution-tape';
		}

		const classes = ['transition-colors', 'hover:bg-gray-50'];
		if (pinnedMachines.has(machine.id)) {
			classes.push('bg-white');
		} else {
			classes.push('odd:bg-white', 'even:bg-gray-50/50');
		}
		if (!machine.is_active) {
			classes.push('opacity-60');
		}
		return classes.join(' ');
	}

	// Returns the human-readable status label for a machine.
	// Maps network-related errors to "OUT OF SERVICE" to avoid confusing users.
	function displayStatus(status: string): string {
		const normalized = status.replace(/\s+/g, '_').toUpperCase();
		if (normalized === 'UNAVAILABLE' || normalized === 'NETWORK_ERROR') {
			return 'OUT OF SERVICE';
		}
		return status.replace('_', ' ');
	}

	let rootEl: HTMLElement;

	// Keep caution tape stripes aligned across rows by offsetting each row's
	// background position based on its vertical position relative to its table.
	function alignCautionStripes() {
		if (!rootEl) return;
		const rows = Array.from(rootEl.querySelectorAll<HTMLTableRowElement>('tr.caution-tape'));
		if (rows.length === 0) return;

		// Stripe repeat period along Y for a -45deg gradient with 15px + 15px bands
		// equals approximately 42.43px. We use 42px to match the CSS background-size.
		const STRIPE_PERIOD_Y = 42; // px

		for (const row of rows) {
			const table = row.closest('table') as HTMLElement | null;
			const baseRect = (table ?? rootEl).getBoundingClientRect();
			const rowRect = row.getBoundingClientRect();
			const deltaY = rowRect.top - baseRect.top; // px from table top
			// Compute offset so each row starts at the same phase
			let offset = (-deltaY) % STRIPE_PERIOD_Y;
			if (offset > 0) offset -= STRIPE_PERIOD_Y; // ensure negative or zero for consistency
			row.style.setProperty('--stripe-offset', `${offset}px`);
		}
	}

	onMount(() => {
		alignCautionStripes();
		const onResize = () => alignCautionStripes();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	});

	afterUpdate(() => {
		alignCautionStripes();
	});
</script>

<div bind:this={rootEl}>
	<h2 class="mb-3 text-xl font-bold text-gray-900 md:mb-6 md:text-2xl">
		{machines.length}
		{type === 'washer' ? 'Washers' : 'Dryers'}
	</h2>
	
	<!-- Mobile Table View (Only visible on small screens) -->
	<div class="md:hidden overflow-hidden rounded-xl bg-white/80 ring-1 ring-gray-200 shadow-xl shadow-gray-900/10">
		<div class="overflow-x-auto">
			<table class="w-full backdrop-blur-sm">
				<thead class="bg-gray-100/70 sticky top-0 z-10 backdrop-blur-sm">
					<tr class="border-b border-gray-200">
						<th class="px-2.5 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-gray-900">#</th>
						<th class="w-12 px-2 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-gray-900">PIN</th>
						<th class="w-36 px-2.5 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-gray-900">STATUS</th>
						<th class="px-2.5 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-gray-900">TIME</th>
					</tr>
				</thead>
				<tbody>
					{#each machines.sort((a, b) => a.number - b.number) as machine}
						<tr class={getRowClasses(machine)}>
							<td class="px-2.5 py-2.5 text-left">
								<span class="text-base font-bold text-gray-900">#{machine.number}</span>
							</td>
							<td class="w-12 px-2 py-2.5 text-center">
								<button
									class="flex h-7 w-7 mx-auto items-center justify-center rounded-full transition-colors {isUnavailable(machine)
										? 'text-white hover:bg-black/20'
										: 'text-gray-700 hover:text-scarlet hover:bg-gray-200'}"
									on:click|stopPropagation={() => onTogglePin(machine.id)}
								>
									<Pin
										class="h-4 w-4 {pinnedMachines.has(machine.id)
											? 'fill-current text-scarlet'
											: ''}"
									/>
								</button>
							</td>
							<td class="w-36 px-2.5 py-2.5 text-center">
								<span
									class={`mx-auto inline-flex items-center justify-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold leading-none shadow-sm border ${getStatusStyle(machine.status)}`}
								>
									{displayStatus(machine.status)}
								</span>
							</td>
							<td class="px-2.5 py-2.5 text-center text-sm font-mono font-bold text-gray-900">
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
	</div>
	
	<!-- Desktop Table View (Hidden on mobile) -->
	<div class="hidden md:block overflow-hidden rounded-2xl bg-white/80 ring-1 ring-gray-200 shadow-xl shadow-gray-900/10">
		<div class="overflow-x-auto">
			<table class="w-full backdrop-blur-sm">
				<thead class="bg-gray-100/70 sticky top-0 z-10 backdrop-blur-sm">
					<tr class="border-b border-gray-200">
						<th
							class="w-16 px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-900"
							>#</th
						>
						<th
							class="w-14 px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-900"
							>Pin</th
						>
						<th class="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-900"
							>Status</th
						>
						<th
							class="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-900"
							>Time Left</th
						>
						<th
							class="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-900"
							>Finishes At</th
						>
					</tr>
				</thead>
				<tbody>
					{#each machines.sort((a, b) => a.number - b.number) as machine}
						<tr class={getRowClasses(machine)}>
							<td class="w-16 px-3 py-3 text-left">
								<span class="text-lg font-bold text-gray-900">#{machine.number}</span>
							</td>
							<td class="w-14 px-3 py-3">
								<button
									class="flex h-7 w-7 items-center justify-center rounded-full transition-colors text-gray-700 hover:text-scarlet hover:bg-gray-200"
									on:click|stopPropagation={() => onTogglePin(machine.id)}
								>
									<Pin
										class="h-4 w-4 {pinnedMachines.has(machine.id)
											? 'fill-current text-scarlet'
											: ''}"
									/>
								</button>
							</td>
							<td class="px-4 py-3 text-center">
								<span
									class={`mx-auto inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold leading-none shadow-sm border ${getStatusStyle(machine.status)}`}
								>
									{displayStatus(machine.status)}
								</span>
							</td>
							<td class="px-3 py-3 text-center text-sm font-mono font-bold text-gray-900">
								{#if machine.status === 'IN_USE'}
									{formatRemainingTime(machine.remaining_seconds)}
								{:else}
									-
								{/if}
							</td>
							<td class="px-3 py-3 text-center text-sm font-bold text-gray-900">
								{#if machine.status === 'IN_USE' && machine.estimated_end !== "0001-01-01T00:00:00Z"}
									{formatDateTimeLocal(machine.estimated_end)}
								{:else}
									-
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
