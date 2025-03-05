<script>
	import { WashingMachine } from 'lucide-svelte';
</script>

<footer class="relative mt-auto border-t border-zinc-800 bg-black py-8">
	<div class="mx-auto max-w-7xl px-4 md:px-8">
		<!-- Top row with logo and tagline -->
		<div class="mb-6 flex flex-col items-center justify-between md:flex-row">
			<div class="mb-4 flex items-center gap-3 md:mb-0">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-md bg-scarlet shadow-sm shadow-scarlet/20"
				>
					<WashingMachine class="h-4 w-4 text-white" />
				</div>
				<span class="font-serif text-lg font-bold text-white">OSU Laundry</span>
			</div>

			<div class="text-sm text-zinc-500">Designed for Ohio State University students</div>
		</div>

		<!-- Attribution section -->
		<div class="space-y-2 text-center">
			<p class="text-zinc-500">
				Built for <span class="font-medium text-white">Fellow Buckeyes</span> by
				<a
					href="https://davidstephenson.net"
					target="_blank"
					rel="noopener noreferrer"
					class="font-medium text-scarlet transition-colors hover:text-scarlet/80"
				>
					David Stephenson
				</a>
			</p>
			<p class="text-sm text-zinc-600">Data provided by Alliance Laundry / Speed Queen</p>
			<p class="mx-auto mt-4 max-w-xl text-xs text-zinc-600">
				This service is not affiliated with Ohio State University, Alliance Laundry, or Speed Queen.
				This service is unofficial and may stop working at any time.
			</p>
		</div>
	</div>
</footer>
