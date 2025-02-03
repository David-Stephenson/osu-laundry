<script lang="ts">
	import type { Machine } from '$lib/types';
	import { formatDateTime, formatRemainingTime, getStatusStyle } from '$lib/utils';

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
	<h2 class="mb-6 text-2xl font-bold text-white">
		{machines.length}
		{type === 'washer' ? 'Washers' : 'Dryers'}
	</h2>
	<div class="overflow-hidden rounded-2xl border border-gray-800/50">
		<table class="w-full overflow-hidden bg-gray-900/30 backdrop-blur-sm">
			<thead>
				<tr>
					<th
						class="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider text-gray-400"
						>#</th
					>
					<th
						class="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider text-gray-400"
						>Status</th
					>
					<th
						class="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider text-gray-400"
						>Time Remaining</th
					>
					<th
						class="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider text-gray-400"
						>Estimated Completion</th
					>
					<th
						class="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider text-gray-400"
						>Last Updated</th
					>
					<th
						class="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider text-gray-400"
						>Info</th
					>
				</tr>
			</thead>
			<tbody class="border-t border-gray-800/50">
				{#each machines.sort((a, b) => a.number - b.number) as machine}
					<tr
						class={`transition-colors hover:bg-gray-800/30 ${!machine.is_active ? 'opacity-50' : ''}`}
					>
						<td class="px-6 py-4 text-center">
							<span class="text-xl font-semibold text-white">{machine.number}</span>
						</td>
						<td class="px-6 py-4 text-center">
							<span
								class={`inline-block rounded-full px-4 py-1.5 text-sm font-medium
                ${getStatusStyle(machine.status)}`}
							>
								{machine.status.replace('_', ' ')}
							</span>
						</td>
						<td class="px-6 py-4 text-center font-medium text-gray-300">
							{#if machine.status === 'IN_USE'}
								{formatRemainingTime(machine.remaining_seconds)}
							{:else}
								-
							{/if}
						</td>
						<td class="px-6 py-4 text-center font-medium text-gray-300">
							{#if machine.status === 'IN_USE'}
								{formatDateTime(machine.estimated_end)}
							{:else}
								-
							{/if}
						</td>
						<td class="px-6 py-4 text-center text-sm text-gray-400">
							{formatLastUpdated(machine.received_at)}
						</td>
						<td class="space-x-2 px-6 py-4 text-center text-sm text-gray-400">
							{#if !machine.is_active}
								<span class="inline-flex items-center gap-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fill-rule="evenodd"
											d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
											clip-rule="evenodd"
										/>
									</svg>
									<span>Inactive</span>
								</span>
							{/if}
							{#if machine.is_door_open}
								<span class="inline-flex items-center gap-1 text-yellow-400">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z"
										/>
									</svg>
									<span>Door Open</span>
								</span>
							{/if}
							{#if machine.can_top_off}
								<span class="inline-flex items-center gap-1 text-blue-400">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
											clip-rule="evenodd"
										/>
									</svg>
									<span>Can Add Time</span>
								</span>
							{/if}
						</td>
					</tr>
					{#if machine !== machines[machines.length - 1]}
						<tr>
							<td colspan="6" class="p-0">
								<div class="border-t border-gray-800/50"></div>
							</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
</div>
