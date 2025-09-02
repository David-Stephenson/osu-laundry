<script>
	import { WashingMachine } from 'lucide-svelte';
</script>

<footer class="relative mt-auto border-t border-gray-200 bg-white py-12">
	<div class="mx-auto max-w-6xl px-4 md:px-8">
		<!-- Main footer content -->
		<div class="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
			<!-- Logo and brand -->
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-scarlet shadow-lg">
					<WashingMachine class="h-5 w-5 text-white" />
				</div>
				<div>
					<p class="text-xl font-bold text-gray-900">OSU Laundry</p>
					<p class="text-sm text-gray-600">Real-time laundry machine status</p>
				</div>
			</div>

			<!-- Attribution and links -->
			<div class="flex flex-col items-center text-center md:items-start md:text-left">
				<p class="text-base text-gray-700">
					A project by
					<a
						href="https://davidstephenson.net"
						target="_blank"
						rel="noopener noreferrer"
						class="font-semibold text-scarlet transition-colors hover:text-scarlet/80"
					>
						David Stephenson
					</a>
				</p>
				<p class="text-sm text-gray-500">Made for Buckeyes by Buckeyes</p>
			</div>
		</div>

		<!-- Disclaimer -->
		<div class="mt-8 border-t border-gray-100 pt-6 text-center">
			<p class="mx-auto text-sm text-gray-500">
				This service is not affiliated with The Ohio State University, Alliance Laundry Systems, or
				Speed Queen. It is an unofficial service and may stop working at any time.
			</p>
		</div>
	</div>
</footer>
