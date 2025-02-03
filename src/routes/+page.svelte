<script>
	import Footer from '$components/Footer.svelte';
	import { ArrowRight, Smartphone, Globe2, Sparkles } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	// Pick a random number between 1 and 6 for the background image
	const randomImageNumber = Math.floor(Math.random() * 5) + 1;
	const backgroundImage = `/images/${randomImageNumber}.webp`;
</script>

<svelte:head>
	<title>OSU Laundry | Real-time Laundry Machine Status</title>
	<meta
		name="description"
		content="Check real-time availability of laundry machines in Ohio State University residence halls."
	/>
</svelte:head>

<div class="flex min-h-screen flex-col overflow-x-hidden text-white">
	<!-- Hero Section -->
	<div class="relative min-h-screen overflow-hidden">
		<!-- Background Image -->
		<div class="absolute inset-0">
			<img src={backgroundImage} alt="" class="h-full w-full object-cover opacity-15 grayscale" />
		</div>

		<!-- Dark Overlay -->
		<div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent"></div>

		<!-- Hero Backgrounds -->
		<div class="pointer-events-none absolute inset-0">
			<div
				class="animate-blob absolute -left-[10%] top-0 h-[40vw] w-[40vw] rounded-full bg-red-500/10 blur-3xl will-change-transform"
			></div>
			<div
				class="animate-blob animation-delay-2000 absolute -right-[10%] top-[20%] h-[35vw] w-[35vw] rounded-full bg-scarlet/10 blur-3xl will-change-transform"
			></div>
			<div
				class="animate-blob animation-delay-4000 absolute bottom-[10%] left-[20%] h-[30vw] w-[30vw] rounded-full bg-red-600/10 blur-3xl"
			></div>
		</div>

		<!-- Animated Grid -->
		<div
			class="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]"
		>
			<div class="animate-grid h-full w-full [background-size:60px_60px]"></div>
		</div>

		<div class="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-24 md:px-8">
			<div class="mx-auto max-w-3xl text-center" in:fade={{ duration: 400 }}>
				<div
					class="animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gradient-to-br from-white/5 to-transparent px-6 py-2 backdrop-blur-sm"
				>
					<span class="relative flex h-2 w-2">
						<span class="absolute inline-flex h-full w-full animate-ping animate-duration-1000 rounded-full bg-scarlet opacity-75"></span>
						<span class="relative inline-flex h-2 w-2 rounded-full bg-scarlet"></span>
					</span>
					<span
						class="bg-gradient-to-r from-scarlet to-red-500 bg-clip-text text-sm text-transparent"
					>
						Now Live Across Campus
					</span>
				</div>
				<h1 class="mb-8 font-serif text-6xl font-bold leading-tight md:text-8xl">
					<span class="text-white">
						Laundry at Ohio State
						<span
							class="bg-gradient-to-r from-scarlet to-red-500 bg-clip-text italic text-transparent"
							>reimagined</span
						>.
					</span>
				</h1>
				<p class="mb-12 text-2xl text-gray-300">
					The future of campus laundry management is here. Real-time tracking, predictive analytics,
					and seamless integration.
				</p>
				<div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
					<a
						href="/buildings"
						class="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-scarlet to-red-600 px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
					>
						<span class="relative z-10">Get Started</span>
						<ArrowRight class="z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
						<div
							class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
						></div>
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Value Proposition -->
	<div class="border-y border-gray-800 bg-gradient-to-b from-black to-gray-900/50 py-24">
		<div class="mx-auto max-w-7xl px-4 md:px-8">
			<div class="grid gap-16 md:grid-cols-3">
				<div
					class="animate-fade-in rounded-3xl border border-gray-800 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-xl transition-all hover:border-gray-700"
				>
					<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-scarlet/20">
						<Globe2 class="h-6 w-6 text-scarlet" />
					</div>
					<h3 class="mb-4 font-serif text-2xl font-bold">Universal Access</h3>
					<p class="text-gray-300">
						Access real-time machine status from any device, anywhere. No app installs required.
					</p>
				</div>

				<div
					class="animate-fade-in rounded-3xl border border-gray-800 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-xl transition-all hover:border-gray-700"
					style="animation-delay: 100ms"
				>
					<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-scarlet/20">
						<Sparkles class="h-6 w-6 text-scarlet" />
					</div>
					<h3 class="mb-4 font-serif text-2xl font-bold">Smart Predictions</h3>
					<p class="text-gray-300">
						AI-powered predictions for machine availability and optimal laundry times.
					</p>
				</div>

				<div
					class="animate-fade-in rounded-3xl border border-gray-800 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-xl transition-all hover:border-gray-700"
					style="animation-delay: 200ms"
				>
					<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-scarlet/20">
						<Smartphone class="h-6 w-6 text-scarlet" />
					</div>
					<h3 class="mb-4 font-serif text-2xl font-bold">Live Alerts</h3>
					<p class="text-gray-300">
						Push notifications when your laundry is done or machines become available.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Why This Was Made -->
	<div class="relative border-y border-gray-800 bg-black py-32">
		<!-- Subtle Background Effect -->
		<div class="pointer-events-none absolute inset-0">
			<div
				class="animate-blob absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-red-500/5 blur-3xl"
			></div>
		</div>

		<div class="relative mx-auto max-w-7xl px-4 md:px-8">
			<div class="mx-auto max-w-3xl text-center">
				<h2 class="mb-16 font-serif text-5xl font-bold">
					<span class="bg-gradient-to-r from-scarlet to-red-500 bg-clip-text text-transparent"
						>Why</span
					>
					<span class="text-white"> This Was Made</span>
				</h2>
			</div>

			<div class="grid gap-8 md:grid-cols-2">
				<div
					class="group rounded-3xl border border-gray-800 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-xl transition-all hover:border-gray-700"
				>
					<h3 class="mb-4 font-serif text-2xl font-bold text-white">Limited Mobile App</h3>
					<p class="text-lg text-gray-300">
						The official Speed Queen app is restricted to mobile devices and provides a frustrating
						experience. By reverse engineering their API, we've created a modern alternative that
						works everywhere.
					</p>
				</div>

				<div
					class="group rounded-3xl border border-gray-800 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-xl transition-all hover:border-gray-700"
				>
					<h3 class="mb-4 font-serif text-2xl font-bold text-white">Better Technology</h3>
					<p class="text-lg text-gray-300">
						Built with modern web technologies and designed with students in mind, this project
						represents what campus laundry monitoring should be: fast, intuitive, and accessible.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- CTA Section -->
	<div class="bg-gradient-to-br from-black via-red-950/50 to-black py-32">
		<div class="mx-auto max-w-4xl px-4 text-center md:px-8">
			<h2 class="mb-6 font-serif text-5xl font-bold">
				<span class="bg-gradient-to-r from-scarlet to-red-500 bg-clip-text text-transparent">
					Ready to Transform
				</span>
				<br />
				Your Laundry Experience?
			</h2>
			<p class="mb-8 text-xl text-gray-300">
				Join thousands of students already using the future of laundry management
			</p>
			<div class="flex justify-center">
				<a
					href="/buildings"
					class="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-scarlet to-red-600 px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
				>
					<span class="relative z-10">Get Started Now</span>
					<ArrowRight class="z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
					<div
						class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
					></div>
				</a>
			</div>
		</div>
	</div>

	<Footer />
</div>

<style global>
	@keyframes grid {
		from {
			background-position: 0 0;
		}
		to {
			background-position: 60px 60px;
		}
	}

	.animate-grid {
		background-image: linear-gradient(to right, #ffffff10 1px, transparent 1px),
			linear-gradient(to bottom, #ffffff10 1px, transparent 1px);
		animation: grid 12s linear infinite;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.6s ease-out forwards;
		opacity: 0;
	}
</style>
