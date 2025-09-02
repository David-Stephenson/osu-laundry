<script lang="ts">
	import type { MachineStats } from '$lib/types';

	export let stats: MachineStats;

	function formatPercent(num: number): string {
		return Math.round(num) + '%';
	}

	// Calculate total used machines (in use + complete + error)
	$: washerTotal = stats.washers_in_use + stats.washers_complete + (stats.washers_error || 0);
	$: dryerTotal = stats.dryers_in_use + stats.dryers_complete + (stats.dryers_error || 0);

	// Calculate percentages based on total machines
	$: washerActivePercent = stats.washers_in_use / (stats.total_washers || 1) * 100;
	$: washerCompletePercent = stats.washers_complete / (stats.total_washers || 1) * 100;
	$: washerErrorPercent = (stats.washers_error || 0) / (stats.total_washers || 1) * 100;

	$: dryerActivePercent = stats.dryers_in_use / (stats.total_dryers || 1) * 100;
	$: dryerCompletePercent = stats.dryers_complete / (stats.total_dryers || 1) * 100;
	$: dryerErrorPercent = (stats.dryers_error || 0) / (stats.total_dryers || 1) * 100;

	// Calculate total complete machines and errors
	$: totalComplete = stats.washers_complete + stats.dryers_complete;
	$: totalError = (stats.washers_error || 0) + (stats.dryers_error || 0);
	
	// Calculate total available machines
	$: totalAvailable = (stats.washers_available || 0) + (stats.dryers_available || 0);
	$: totalMachines = (stats.total_washers || 0) + (stats.total_dryers || 0);
</script>

<!-- Desktop View (Hidden on mobile) -->
<div class="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
	<!-- Washers Stats -->
	<div class="rounded-2xl bg-white/80 ring-1 ring-gray-200 backdrop-blur-sm p-4 shadow-lg overflow-hidden">
		<h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-700 text-center">WASHERS</h3>
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<span class="text-sm text-gray-700">Available</span>
				<span class="font-semibold text-base text-gray-900">{stats.washers_available} / {stats.total_washers || 0}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-sm text-gray-700">In Use</span>
				<span class="font-semibold text-base text-gray-900">{stats.washers_in_use}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-sm text-gray-700">Complete</span>
				<span class="font-semibold text-base text-gray-900">{stats.washers_complete}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-sm text-gray-700">Out of Service</span>
				<span class="font-semibold text-base text-gray-900">{stats.washers_error || 0}</span>
			</div>
		</div>
	</div>

	<!-- Dryers Stats -->
	<div class="rounded-2xl bg-white/80 ring-1 ring-gray-200 backdrop-blur-sm p-4 shadow-lg overflow-hidden">
		<h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-700 text-center">DRYERS</h3>
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<span class="text-sm text-gray-700">Available</span>
				<span class="font-semibold text-base text-gray-900">{stats.dryers_available} / {stats.total_dryers || 0}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-sm text-gray-700">In Use</span>
				<span class="font-semibold text-base text-gray-900">{stats.dryers_in_use}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-sm text-gray-700">Complete</span>
				<span class="font-semibold text-base text-gray-900">{stats.dryers_complete}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-sm text-gray-700">Out of Service</span>
				<span class="font-semibold text-base text-gray-900">{stats.dryers_error || 0}</span>
			</div>
		</div>
	</div>

	<!-- Total Stats -->
	<div class="rounded-2xl bg-white/80 ring-1 ring-gray-200 backdrop-blur-sm p-4 shadow-lg overflow-hidden">
		<h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-700 text-center">TOTAL MACHINES</h3>
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<span class="text-sm text-gray-700">Available</span>
				<span class="font-semibold text-base text-gray-900">{totalAvailable} / {stats.total_machines || 0}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-sm text-gray-700">In Use</span>
				<span class="font-semibold text-base text-gray-900">{stats.total_in_use || 0}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-sm text-gray-700">Complete</span>
				<span class="font-semibold text-base text-gray-900">{totalComplete}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-sm text-gray-700">Out of Service</span>
				<span class="font-semibold text-base text-gray-900">{totalError}</span>
			</div>
		</div>
	</div>

	<!-- Usage Chart -->
	<div class="rounded-2xl bg-white/80 ring-1 ring-gray-200 backdrop-blur-sm p-4 shadow-lg overflow-hidden">
		<h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-700 text-center">USAGE OVERVIEW</h3>
		<div class="mb-4 flex justify-center gap-3 text-xs">
			<span class="flex items-center gap-1">
				<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
				<span class="text-gray-700">In Use</span>
			</span>
			<span class="flex items-center gap-1">
				<div class="h-3 w-3 rounded-full bg-green-500"></div>
				<span class="text-gray-700">Complete</span>
			</span>
			<span class="flex items-center gap-1">
				<div class="h-3 w-3 rounded-full bg-red-500"></div>
				<span class="text-gray-700">Out of Service</span>
			</span>
		</div>
		<div class="space-y-4">
			<div>
				<div class="mb-2 flex justify-between text-sm">
					<span class="text-gray-700">Washers</span>
					<span class="text-gray-900 font-semibold">{formatPercent((washerTotal / (stats.total_washers || 1)) * 100)}</span>
				</div>
				<div class="h-3 overflow-hidden rounded-full bg-gray-200">
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
							class="h-full bg-red-500 transition-all duration-500 caution-tape"
							style="width: {washerErrorPercent}%"
						></div>
					</div>
				</div>
			</div>
			<div>
				<div class="mb-2 flex justify-between text-sm">
					<span class="text-gray-700">Dryers</span>
					<span class="text-gray-900 font-semibold">{formatPercent((dryerTotal / (stats.total_dryers || 1)) * 100)}</span>
				</div>
				<div class="h-3 overflow-hidden rounded-full bg-gray-200">
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
							class="h-full bg-red-500 transition-all duration-500 caution-tape"
							style="width: {dryerErrorPercent}%"
						></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Mobile View (Hidden on desktop) - Ultra Compact -->
<div class="md:hidden">
	<!-- Overview Row -->
	<div class="flex items-center justify-between mb-3">
		<div class="inline-flex items-center text-xs font-semibold uppercase text-gray-700">
			<span class="mr-1">TOTAL:</span><span class="text-gray-900">{totalAvailable}/{totalMachines}</span>
		</div>
		<div class="flex items-center gap-2 text-xs">
			<span class="flex items-center gap-1">
				<div class="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
				<span class="text-gray-700">In Use</span>
			</span>
			<span class="flex items-center gap-1">
				<div class="h-2.5 w-2.5 rounded-full bg-green-500"></div>
				<span class="text-gray-700">Complete</span>
			</span>
			<span class="flex items-center gap-1">
				<div class="h-2.5 w-2.5 rounded-full bg-red-500"></div>
				<span class="text-gray-700">Error</span>
			</span>
		</div>
	</div>
	
	<!-- Washers Card -->
	<div class="rounded-xl bg-white/80 ring-1 ring-gray-200 backdrop-blur-sm p-2.5 mb-3 shadow-lg overflow-hidden">
		<div class="flex items-center justify-center mb-1.5">
			<div class="text-xs font-semibold uppercase text-gray-700">WASHERS</div>
		</div>
		
		<!-- Progress bar -->
		<div class="h-2 overflow-hidden rounded-full bg-gray-200 mb-2.5">
			<div class="flex h-full">
				<div class="h-full bg-yellow-500" style="width: {washerActivePercent}%"></div>
				<div class="h-full bg-green-500" style="width: {washerCompletePercent}%"></div>
				<div class="h-full bg-red-500" style="width: {washerErrorPercent}%"></div>
			</div>
		</div>
		
		<!-- Stats -->
		<div class="grid grid-cols-4 text-xs gap-1.5">
			<div class="flex justify-center">
				<div class="flex flex-col items-center">
					<span class="text-gray-700 mb-0.5">Available</span>
					<span class="text-gray-900 font-semibold">{stats.washers_available}/{stats.total_washers || 0}</span>
				</div>
			</div>
			<div class="flex justify-center">
				<div class="flex flex-col items-center">
					<span class="text-gray-700 mb-0.5">In Use</span>
					<span class="text-gray-900 font-semibold">{stats.washers_in_use}</span>
				</div>
			</div>
			<div class="flex justify-center">
				<div class="flex flex-col items-center">
					<span class="text-gray-700 mb-0.5">Complete</span>
					<span class="text-gray-900 font-semibold">{stats.washers_complete}</span>
				</div>
			</div>
			<div class="flex justify-center">
				<div class="flex flex-col items-center">
					<span class="text-gray-700 mb-0.5">Error</span>
					<span class="text-gray-900 font-semibold">{stats.washers_error || 0}</span>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Dryers Card -->
	<div class="rounded-xl bg-white/80 ring-1 ring-gray-200 backdrop-blur-sm p-2.5 mb-3 shadow-lg overflow-hidden">
		<div class="flex items-center justify-center mb-1.5">
			<div class="text-xs font-semibold uppercase text-gray-700">DRYERS</div>
		</div>
		
		<!-- Progress bar -->
		<div class="h-2 overflow-hidden rounded-full bg-gray-200 mb-2.5">
			<div class="flex h-full">
				<div class="h-full bg-yellow-500" style="width: {dryerActivePercent}%"></div>
				<div class="h-full bg-green-500" style="width: {dryerCompletePercent}%"></div>
				<div class="h-full bg-red-500" style="width: {dryerErrorPercent}%"></div>
			</div>
		</div>
		
		<!-- Stats -->
		<div class="grid grid-cols-4 text-xs gap-1.5">
			<div class="flex justify-center">
				<div class="flex flex-col items-center">
					<span class="text-gray-700 mb-0.5">Available</span>
					<span class="text-gray-900 font-semibold">{stats.dryers_available}/{stats.total_dryers || 0}</span>
				</div>
			</div>
			<div class="flex justify-center">
				<div class="flex flex-col items-center">
					<span class="text-gray-700 mb-0.5">In Use</span>
					<span class="text-gray-900 font-semibold">{stats.dryers_in_use}</span>
				</div>
			</div>
			<div class="flex justify-center">
				<div class="flex flex-col items-center">
					<span class="text-gray-700 mb-0.5">Complete</span>
					<span class="text-gray-900 font-semibold">{stats.dryers_complete}</span>
				</div>
			</div>
			<div class="flex justify-center">
				<div class="flex flex-col items-center">
					<span class="text-gray-700 mb-0.5">Error</span>
					<span class="text-gray-900 font-semibold">{stats.dryers_error || 0}</span>
				</div>
			</div>
		</div>
	</div>
</div>
