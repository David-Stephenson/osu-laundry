<script lang="ts">
	import type { MachineStats } from '$lib/types';

	export let stats: MachineStats;

	function formatPercent(num: number): string {
		return Math.round(num) + '%';
	}

	// Calculate total used machines (in use + complete + error)
	$: washerTotal = stats.washers_in_use + stats.washers_complete + stats.washers_error;
	$: dryerTotal = stats.dryers_in_use + stats.dryers_complete + stats.dryers_error;

	// Calculate percentages based on total machines
	$: washerActivePercent = (stats.washers_in_use / stats.total_washers) * 100;
	$: washerCompletePercent = (stats.washers_complete / stats.total_washers) * 100;
	$: washerErrorPercent = (stats.washers_error / stats.total_washers) * 100;

	$: dryerActivePercent = (stats.dryers_in_use / stats.total_dryers) * 100;
	$: dryerCompletePercent = (stats.dryers_complete / stats.total_dryers) * 100;
	$: dryerErrorPercent = (stats.dryers_error / stats.total_dryers) * 100;

	// Calculate total complete machines and errors
	$: totalComplete = stats.washers_complete + stats.dryers_complete;
	$: totalError = stats.washers_error + stats.dryers_error;
</script>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
	<!-- Washers Stats -->
	<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm">
		<h3 class="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-400">Washers</h3>
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<span class="text-zinc-400">Available</span>
				<span class="font-medium text-white">{stats.washers_available} / {stats.total_washers}</span
				>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-zinc-400">In Use</span>
				<span class="font-medium text-white">{stats.washers_in_use}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-zinc-400">Complete</span>
				<span class="font-medium text-white">{stats.washers_complete}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-zinc-400">Error</span>
				<span class="font-medium text-white">{stats.washers_error}</span>
			</div>
		</div>
	</div>

	<!-- Dryers Stats -->
	<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm">
		<h3 class="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-400">Dryers</h3>
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<span class="text-zinc-400">Available</span>
				<span class="font-medium text-white">{stats.dryers_available} / {stats.total_dryers}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-zinc-400">In Use</span>
				<span class="font-medium text-white">{stats.dryers_in_use}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-zinc-400">Complete</span>
				<span class="font-medium text-white">{stats.dryers_complete}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-zinc-400">Error</span>
				<span class="font-medium text-white">{stats.dryers_error}</span>
			</div>
		</div>
	</div>

	<!-- Total Stats -->
	<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm">
		<h3 class="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-400">Total Machines</h3>
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<span class="text-zinc-400">Available</span>
				<span class="font-medium text-white">{stats.total_available} / {stats.total_machines}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-zinc-400">In Use</span>
				<span class="font-medium text-white">{stats.total_in_use}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-zinc-400">Complete</span>
				<span class="font-medium text-white">{totalComplete}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-zinc-400">Error</span>
				<span class="font-medium text-white">{totalError}</span>
			</div>
		</div>
	</div>

	<!-- Usage Chart -->
	<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm">
		<h3 class="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-400">Usage Overview</h3>
		<div class="mb-6 flex gap-4 text-xs">
			<span class="flex items-center gap-1">
				<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
				<span class="text-zinc-400">In Use</span>
			</span>
			<span class="flex items-center gap-1">
				<div class="h-3 w-3 rounded-full bg-green-500"></div>
				<span class="text-zinc-400">Complete</span>
			</span>
			<span class="flex items-center gap-1">
				<div class="h-3 w-3 rounded-full bg-red-500"></div>
				<span class="text-zinc-400">Error</span>
			</span>
		</div>
		<div class="space-y-5">
			<div>
				<div class="mb-2 flex justify-between text-sm">
					<span class="text-zinc-400">Washers</span>
					<span class="text-white">{formatPercent((washerTotal / stats.total_washers) * 100)}</span>
				</div>
				<div class="h-3 overflow-hidden rounded-full bg-zinc-800">
					<div class="flex h-full">
						<div
							class="h-full bg-yellow-500 transition-all duration-500"
							style="width: {washerActivePercent}%"
						></div>
						<div
							class="h-full bg-green-500 transition-all duration-500"
							style="width: {washerCompletePercent}%"
						></div>
						<div
							class="h-full bg-red-500 transition-all duration-500"
							style="width: {washerErrorPercent}%"
						></div>
					</div>
				</div>
			</div>
			<div>
				<div class="mb-2 flex justify-between text-sm">
					<span class="text-zinc-400">Dryers</span>
					<span class="text-white">{formatPercent((dryerTotal / stats.total_dryers) * 100)}</span>
				</div>
				<div class="h-3 overflow-hidden rounded-full bg-zinc-800">
					<div class="flex h-full">
						<div
							class="h-full bg-yellow-500 transition-all duration-500"
							style="width: {dryerActivePercent}%"
						></div>
						<div
							class="h-full bg-green-500 transition-all duration-500"
							style="width: {dryerCompletePercent}%"
						></div>
						<div
							class="h-full bg-red-500 transition-all duration-500"
							style="width: {dryerErrorPercent}%"
						></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
