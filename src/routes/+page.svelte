<script lang="ts">
	import {
		ArrowRight,
		Globe2,
		WashingMachine,
		Clock,
		Pin,
		Quote,
		ChevronLeft
	} from 'lucide-svelte';
	import ovalImage from '../images/oval.webp?enhanced';
	import phoneImage from '../images/phone.png?enhanced';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	// Testimonials array for the carousel - removed role/class designations
	const testimonials = [
		{
			quote: 'I was just thinking about how bad the speed queen app is, this is a great upgrade!',
			author: 'William C.'
		},
		{
			quote: 'Morrill Tower is in need of this. 🙏🏾 fire idea',
			author: 'Ayush S.'
		},
		{
			quote: 'I wish your website existed a few years ago!',
			author: 'Matt G.'
		},
		{
			quote: 'Oh my god thank you',
			author: 'Rishi S.'
		}
	];

	let activeTestimonial = 0;
	let testimonialInterval: ReturnType<typeof setInterval> | undefined;
	let morphingDot = false;
	let isLoading = false;

	function nextTestimonial(): void {
		// Add morphing animation flag
		morphingDot = true;
		setTimeout(() => {
			morphingDot = false;
		}, 600);

		activeTestimonial = (activeTestimonial + 1) % testimonials.length;

		// Reset the interval when manually changing
		clearInterval(testimonialInterval);
		startInterval();
	}

	function prevTestimonial(): void {
		// Add morphing animation flag
		morphingDot = true;
		setTimeout(() => {
			morphingDot = false;
		}, 600);

		activeTestimonial = (activeTestimonial - 1 + testimonials.length) % testimonials.length;

		// Reset the interval when manually changing
		clearInterval(testimonialInterval);
		startInterval();
	}

	function setTestimonial(index: number): void {
		if (index === activeTestimonial) return;

		// Add morphing animation flag
		morphingDot = true;
		setTimeout(() => {
			morphingDot = false;
		}, 600);

		activeTestimonial = index;
		// Reset the interval when manually changing
		clearInterval(testimonialInterval);
		startInterval();
	}

	function startInterval(): void {
		testimonialInterval = setInterval(() => {
			// Add morphing animation flag for automatic changes too
			morphingDot = true;
			setTimeout(() => {
				morphingDot = false;
			}, 600);

			activeTestimonial = (activeTestimonial + 1) % testimonials.length;
		}, 5000); // Change testimonial every 5 seconds
	}

	// Add a refresh function with loading state
	function refreshData() {
		isLoading = true;

		// In a real app, this would be an async fetch
		// For demo, we'll just simulate loading for 1 second then reload
		setTimeout(() => {
			window.location.reload();
		}, 1000);
	}

	onMount(() => {
		startInterval();

		return () => {
			clearInterval(testimonialInterval);
		};
	});
</script>

<svelte:head>
	<title>OSU Laundry | Real-time Laundry Machine Status</title>
	<meta
		name="description"
		content="Check real-time availability of laundry machines in Ohio State University residence halls."
	/>
</svelte:head>

<div class="relative min-h-screen overflow-hidden bg-zinc-950 text-white">
	<!-- Header -->
	<header class="sticky top-0 z-20 border-b border-zinc-900/70 bg-zinc-950/80 backdrop-blur-sm">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8">
			<div class="flex items-center gap-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-md bg-scarlet shadow-lg shadow-scarlet/20"
				>
					<WashingMachine class="h-6 w-6 text-white" />
				</div>
				<span class="font-serif text-xl font-bold">OSU Laundry</span>
			</div>
			<a
				href="/buildings"
				class="rounded-md bg-scarlet px-4 py-2 text-sm font-medium text-white shadow-md shadow-scarlet/20"
			>
				Get Started
			</a>
		</div>
	</header>

	<!-- Hero Section with monochrome oval background and gradient blobs -->
	<section
		class="relative flex min-h-[80vh] items-center overflow-hidden pb-16 pt-20 md:pb-32 md:pt-24"
	>
		<div class="absolute inset-0 z-0 overflow-hidden">
			<div class="absolute inset-0 h-full w-full opacity-15">
				<enhanced:img
					src={ovalImage}
					alt="Background shape"
					class="h-full w-full object-cover object-center grayscale"
				/>
			</div>
		</div>

		<div class="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8">
			<div class="grid items-center gap-16 md:grid-cols-2 md:gap-12 lg:gap-20">
				<!-- Left side: Content -->
				<div class="relative">
					<div
						class="mb-6 inline-flex items-center rounded-full border border-scarlet/20 bg-scarlet/10 px-3 py-1 text-sm font-medium text-scarlet backdrop-blur-sm"
					>
						<span class="mr-1.5 h-2 w-2 animate-pulse rounded-full bg-scarlet"></span>
						Live across all residence halls
					</div>

					<h1 class="mb-8 font-serif text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
						Modern laundry for
						<span class="relative">
							<span class="relative z-10 text-scarlet">modern students</span>
							<span class="absolute bottom-2 left-0 -z-10 h-3 w-full bg-scarlet/20 blur-sm"></span>
						</span>
					</h1>

					<p class="mb-8 max-w-md text-lg text-zinc-400">
						Real-time machine availability, status updates, and convenient features for laundry
						management at Ohio State.
					</p>

					<div class="flex flex-wrap gap-4">
						<a
							href="/buildings"
							class="flex items-center gap-2 rounded-md bg-scarlet px-6 py-3 text-white shadow-lg shadow-scarlet/20"
						>
							Find Your Building
							<ArrowRight class="h-5 w-5" />
						</a>

						<a
							href="#features"
							class="flex items-center gap-2 rounded-md border border-zinc-800 px-6 py-3 text-white backdrop-blur-sm"
						>
							Learn More
						</a>
					</div>
				</div>

				<!-- Right side: Dashboard Preview -->
				<div class="perspective-container relative flex items-center justify-center">
					<div class="phone-mockup dashboard-preview">
						<enhanced:img src={phoneImage} alt="OSU Laundry mobile app" class="h-auto w-full" />
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Stats Section -->
	<section class="relative bg-zinc-900/70 py-16 backdrop-blur-md">
		<div class="mx-auto max-w-7xl px-4 md:px-8">
			<div class="grid gap-8 md:grid-cols-3">
				<div class="text-center">
					<div class="text-4xl font-bold text-white">200+</div>
					<div class="mt-2 text-zinc-400">Students using daily</div>
				</div>

				<div class="text-center">
					<div class="text-4xl font-bold text-white">24/7</div>
					<div class="mt-2 text-zinc-400">Real-time updates</div>
				</div>

				<div class="text-center">
					<div class="text-4xl font-bold text-white">All</div>
					<div class="mt-2 text-zinc-400">Residence halls covered</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section id="features" class="relative py-20 md:py-24">
		<div class="mx-auto max-w-7xl px-4 md:px-8">
			<div class="mb-16 text-center">
				<h2 class="mb-4 font-serif text-3xl font-bold text-white md:text-4xl">
					Designed for <span class="text-scarlet">OSU students</span>
				</h2>
				<p class="mx-auto max-w-2xl text-xl text-zinc-400">
					Features that make laundry management efficient and hassle-free
				</p>
			</div>

			<div class="grid gap-8 md:grid-cols-3">
				<div
					class="rounded-lg border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg backdrop-blur-sm"
				>
					<div class="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-scarlet/20">
						<Globe2 class="h-6 w-6 text-scarlet" />
					</div>
					<h3 class="mb-3 font-serif text-xl font-bold">Universal Access</h3>
					<p class="text-zinc-400">
						Access from any device, anywhere on campus. No downloads or installs needed.
					</p>
				</div>

				<div
					class="rounded-lg border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg backdrop-blur-sm"
				>
					<div class="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-scarlet/20">
						<Pin class="h-6 w-6 text-scarlet" />
					</div>
					<h3 class="mb-3 font-serif text-xl font-bold">Pin Favorite Machines</h3>
					<p class="text-zinc-400">
						Save your preferred machines for easy access and tracking when you return to do laundry.
					</p>
				</div>

				<div
					class="rounded-lg border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg backdrop-blur-sm"
				>
					<div class="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-scarlet/20">
						<Clock class="h-6 w-6 text-scarlet" />
					</div>
					<h3 class="mb-3 font-serif text-xl font-bold">Live Updates</h3>
					<p class="text-zinc-400">
						Real-time machine status and timers showing exactly when machines will be available.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Testimonials Section -->
	<section class="relative bg-zinc-900/50 py-20 backdrop-blur-sm md:py-24">
		<div class="mx-auto max-w-7xl px-4 md:px-8">
			<div class="mb-16 text-center">
				<h2 class="mb-4 font-serif text-3xl font-bold text-white md:text-4xl">
					What <span class="text-scarlet">students</span> are saying
				</h2>
				<p class="mx-auto max-w-2xl text-xl text-zinc-400">
					Hear from students who use OSU Laundry every day
				</p>
			</div>

			<div class="relative mx-auto max-w-3xl">
				<!-- Testimonial Carousel -->
				<div
					class="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/80 p-10 shadow-lg backdrop-blur-sm"
				>
					<!-- Left/Right Navigation Buttons -->
					<button
						class="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700/30 bg-zinc-800/50 text-zinc-400 backdrop-blur-sm transition-colors hover:text-white"
						on:click={prevTestimonial}
					>
						<ChevronLeft class="h-5 w-5" />
					</button>

					<button
						class="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700/30 bg-zinc-800/50 text-zinc-400 backdrop-blur-sm transition-colors hover:text-white"
						on:click={nextTestimonial}
					>
						<ArrowRight class="h-5 w-5" />
					</button>

					<div class="relative h-44">
						{#key activeTestimonial}
							<div
								class="absolute inset-0 flex flex-col items-center justify-center"
								in:fade={{ duration: 200, delay: 200 }}
								out:fade={{ duration: 200 }}
							>
								<div class="mb-6 flex justify-center text-scarlet">
									<Quote class="h-10 w-10 opacity-50" />
								</div>
								<p class="mb-6 max-w-xl text-xl italic text-zinc-300">
									{testimonials[activeTestimonial].quote}
								</p>
								<div class="text-center text-sm text-zinc-400">
									— {testimonials[activeTestimonial].author}
								</div>
							</div>
						{/key}
					</div>
				</div>

				<!-- Dot Navigation -->
				<div class="mt-8 flex justify-center gap-3">
					{#each testimonials as _, i}
						<button
							class="group relative"
							on:click={() => setTestimonial(i)}
							aria-label={`Testimonial ${i + 1}`}
						>
							<div
								class="h-3 {i === activeTestimonial
									? 'w-8 rounded-full bg-scarlet'
									: 'w-3 rounded-full bg-zinc-700 hover:bg-zinc-600'} 
								transition-all duration-300 ease-in-out"
							></div>

							{#if i === activeTestimonial}
								<div
									class="animate-ping-slow pointer-events-none absolute -inset-1 rounded-full bg-scarlet/20 opacity-70 blur-md"
								></div>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="relative border-t border-zinc-900/70 py-16 backdrop-blur-sm">
		<div class="mx-auto max-w-7xl px-4 md:px-8">
			<div class="flex flex-col items-center text-center">
				<h2 class="mb-4 max-w-2xl font-serif text-3xl font-bold text-white md:text-4xl">
					Ready to transform your laundry experience?
				</h2>
				<p class="mb-8 max-w-2xl text-xl text-zinc-400">
					Join thousands of Ohio State students already using the future of campus laundry
					management.
				</p>
				<a
					href="/buildings"
					class="flex items-center gap-2 rounded-md bg-scarlet px-8 py-3 text-lg font-medium text-white shadow-lg shadow-scarlet/20"
				>
					Get Started Now
					<ArrowRight class="h-5 w-5" />
				</a>
			</div>
		</div>
	</section>
</div>

<style>
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes ping-slow {
		0% {
			transform: scale(0.8);
			opacity: 0.8;
		}
		50% {
			transform: scale(1.2);
			opacity: 0.4;
		}
		100% {
			transform: scale(0.8);
			opacity: 0.8;
		}
	}

	.animate-ping-slow {
		animation: ping-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	.perspective-container {
		perspective: 1500px;
		transform-style: preserve-3d;
		padding: 20px 0;
	}

	.dashboard-preview {
		position: relative;
		transform: rotateY(-10deg) rotateX(5deg);
		animation: levitate 6s ease-in-out infinite;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}

	.dashboard-preview:hover {
		transform: rotateY(-8deg) rotateX(3deg) scale(1.02);
	}

	.phone-mockup {
		max-width: 320px;
		margin: 0 auto;
	}

	@keyframes levitate {
		0%,
		100% {
			transform: rotateY(-10deg) rotateX(5deg) translateY(0);
		}
		50% {
			transform: rotateY(-10deg) rotateX(5deg) translateY(-10px);
		}
	}
</style>
