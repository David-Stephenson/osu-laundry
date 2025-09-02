<script lang="ts">
	import {
		Globe2,
		WashingMachine,
		Clock,
		Users,
		RefreshCw,
		Building2,
		ArrowRight,
		Star,
		Pin,
		BarChart2,
		Globe
	} from 'lucide-svelte';
	import PolaroidBackground from '../components/PolaroidBackground.svelte';
	import { dorms } from '$lib/dorms';
	import { page } from '$app/stores';
	import phonePng from '../images/phone.png';
	import pagePng from '../images/page.png';
	import ogImage from '../images/page.png';
	import trackPng from '../images/track.png';
	import favoritesPng from '../images/favorites.png';
	import pinnedPng from '../images/pinned.png';
	import ovalWebp from '../images/oval.webp';

	// Testimonials array
	const testimonials = [
		{
			quote: 'I was just thinking about how bad the speed queen app is, this is a great upgrade!',
			author: 'William C.',
			role: 'OSU Student'
		},
		{
			quote: 'Morrill Tower is in need of this. 🙏🏾 fire idea',
			author: 'Ayush S.',
			role: 'OSU Student'
		},
		{
			quote: 'I wish your website existed a few years ago!',
			author: 'Matt G.',
			role: 'OSU Alumni'
		},
		{
			quote: 'Oh my god thank you',
			author: 'Rishi S.',
			role: 'OSU Student'
		},
		{
			quote: 'Great Work',
			author: 'Anonymous',
			role: 'OSU Student'
		},
		{
			quote: 'Very Useful',
			author: 'Janae C.',
			role: 'OSU Student'
		}
	];

	// SEO constants
	const HOME_TITLE = 'OSU Laundry | Real-time Laundry Machine Status';
	const HOME_DESCRIPTION =
		'Check real-time Washing Machine and Dryer availability in OSU Dorm Laundry Rooms at The Ohio State University.';
	$: canonicalUrl = $page?.url?.href || '';

	// Demo stats for the Quick Statistics card (homepage only)
	const demoStats = {
		washers_available: 12,
		washers_in_use: 8,
		washers_complete: 3,
		washers_error: 1,
		dryers_available: 10,
		dryers_in_use: 6,
		dryers_complete: 4,
		dryers_error: 0,
		total_washers: 24,
		total_dryers: 20
	};

	const demoTotalAvailable = (demoStats.washers_available || 0) + (demoStats.dryers_available || 0);
	const demoTotalMachines = (demoStats.total_washers || 0) + (demoStats.total_dryers || 0);

	const demoWasherActivePercent = (demoStats.washers_in_use / (demoStats.total_washers || 1)) * 100;
	const demoWasherCompletePercent =
		(demoStats.washers_complete / (demoStats.total_washers || 1)) * 100;
	const demoWasherErrorPercent =
		((demoStats.washers_error || 0) / (demoStats.total_washers || 1)) * 100;

	const demoDryerActivePercent = (demoStats.dryers_in_use / (demoStats.total_dryers || 1)) * 100;
	const demoDryerCompletePercent =
		(demoStats.dryers_complete / (demoStats.total_dryers || 1)) * 100;
	const demoDryerErrorPercent =
		((demoStats.dryers_error || 0) / (demoStats.total_dryers || 1)) * 100;
</script>

<svelte:head>
	<title>{HOME_TITLE}</title>
	<meta name="description" content={HOME_DESCRIPTION} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="OSU Laundry" />
	<meta property="og:title" content={HOME_TITLE} />
	<meta property="og:description" content={HOME_DESCRIPTION} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:url" content={canonicalUrl} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={HOME_TITLE} />
	<meta name="twitter:description" content={HOME_DESCRIPTION} />
	<meta name="twitter:image" content={ogImage} />
	<link rel="canonical" href={canonicalUrl} />
</svelte:head>

<div class="min-h-screen">
	<!-- Hero Section -->
	<section
		class="relative min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-red-100 sm:m-4 sm:min-h-[calc(100vh-2rem)] sm:rounded-3xl"
	>
		<!-- Polaroid Background -->
		<div class="absolute inset-0 overflow-hidden sm:rounded-3xl">
			<PolaroidBackground {dorms} />
		</div>

		<!-- Content -->
		<div
			class="relative z-10 mx-auto grid min-h-[calc(100vh-22rem)] max-w-[92rem] place-items-center px-6 text-center sm:min-h-[calc(100vh-2rem-22rem)]"
		>
			<div
				class="mx-auto w-full max-w-4xl rounded-[28px] bg-white/60 p-5 shadow-lg ring-1 ring-gray-200 backdrop-blur-xl sm:p-8"
			>
				<div class="mb-6 text-center">
					<span
						class="inline-flex items-center rounded-full bg-scarlet px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md"
					>
						<span class="relative mr-1.5 flex h-2 w-2">
							<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/75"
							></span>
							<span class="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
						</span>
						Live across all dorms
					</span>
				</div>
				<h1
					class="text-[3.5rem] font-black leading-[1.05] tracking-tight text-gray-900 sm:text-[4.5rem] md:text-[5rem]"
				>
					OSU <span class="text-scarlet">Laundry</span>
				</h1>
				<h2
					class="mt-4 text-[1.6rem] font-extrabold leading-[1.15] tracking-tight text-gray-900 sm:text-[2rem] md:text-[2.5rem]"
				>
					Modern laundry for <span class="text-scarlet">modern students</span>
				</h2>
				<p class="mx-auto mt-6 max-w-3xl text-lg font-medium text-gray-700 sm:text-xl">
					Real-time washing machine and dryer availability, smart reminders, and campus-wide
					coverage for dorm laundry rooms at The Ohio State University.
				</p>
				<div class="mt-8 text-center">
					<a
						href="/buildings"
						class="group inline-flex items-center gap-2 rounded-xl bg-scarlet px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
					>
						<span>Find Your Dorm</span>
						<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Pop-out Screenshot -->
	<div class="relative z-20 -mt-[22rem] px-6">
		<!-- Mobile Screenshot -->
		<div class="mx-auto max-w-sm sm:hidden">
			<div class="rounded-[28px] bg-white/60 p-2 shadow-lg ring-1 ring-gray-200 backdrop-blur-xl">
				<img src={phonePng} alt="OSU Laundry on mobile" class="w-full rounded-[18px]" />
			</div>
		</div>

		<!-- Desktop Screenshot -->
		<div class="mx-auto hidden max-w-[85rem] sm:block">
			<div
				class="rounded-[28px] bg-white/60 p-2 shadow-lg ring-1 ring-gray-200 backdrop-blur-xl sm:p-3"
			>
				<div class="relative aspect-[3/2] overflow-hidden rounded-2xl">
					<img
						src={pagePng}
						alt="OSU Laundry page preview"
						class="h-full w-full object-cover"
						sizes="min(1280px, 100vw)"
					/>
					<div
						class="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20"
					></div>
				</div>
			</div>
		</div>
	</div>

	<!-- Solutions Section -->
	<section class="bg-white pb-24 pt-[2rem] sm:pb-32 sm:pt-[4rem] lg:pt-[6rem]">
		<div class="mx-auto max-w-[85rem] px-6 lg:px-8">
			<div class="text-center">
				<!-- Removed Solutions tag as requested by user -->
			</div>

			<!-- Top benefits -->
			<div class="mx-auto grid max-w-[85rem] grid-cols-1 gap-6 sm:grid-cols-3">
				<div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-scarlet/10">
							<Clock class="h-5 w-5 text-scarlet" />
						</div>
						<div class="text-left">
							<div class="font-semibold text-gray-900">Real-time status</div>
							<div class="text-sm text-gray-600">Know which machines are free before you go</div>
						</div>
					</div>
				</div>
				<div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-scarlet/10">
							<WashingMachine class="h-5 w-5 text-scarlet" />
						</div>
						<div class="text-left">
							<div class="font-semibold text-gray-900">Smart reminders</div>
							<div class="text-sm text-gray-600">Get notified when cycles are about to finish</div>
						</div>
					</div>
				</div>
				<div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-scarlet/10">
							<Globe2 class="h-5 w-5 text-scarlet" />
						</div>
						<div class="text-left">
							<div class="font-semibold text-gray-900">Every dorm covered</div>
							<div class="text-sm text-gray-600">Live data for every dorm laundry room</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Big preview card -->
			<!-- Removed this section as it was a duplicate of the main pop-out image -->
		</div>
	</section>

	<!-- Features Section -->
	<section class="bg-gray-50 py-24 sm:py-32">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div class="mx-auto max-w-7xl text-center">
				<h2 class="text-[2.25rem] font-bold tracking-tight text-gray-900 sm:text-[3rem]">
					Everything you need for a frictionless laundry experience
				</h2>
				<p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
					Skip the guesswork and the wasted trips. OSU Laundry brings real-time status, quick stats
					and personalized shortcuts together in one simple, beautiful dashboard.
				</p>
			</div>

			<!-- Features Grid -->
			<div class="mt-12 space-y-10 lg:mt-16 lg:space-y-14">
				<!-- Row 1 -->
				<div class="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
					<!-- Card 1: Real-time tracking -->
					<div class="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5">
						<div class="mb-3 flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-scarlet/10">
								<WashingMachine class="h-5 w-5 text-scarlet" />
							</div>
							<h3 class="text-[1.5rem] font-semibold leading-8 text-gray-900">
								Real‑time Tracking
							</h3>
						</div>
						<p class="mt-4 text-base leading-7 text-gray-600">
							You’ll know exactly when your laundry will be done. We show the finish time and how
							many minutes are left, updating in real time.
						</p>
						<div
							class="relative mt-6 aspect-[16/10] overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-gray-200"
						>
							<img
								src={trackPng}
								alt="Real-time tracking screenshot"
								class="absolute inset-0 h-full w-full object-cover"
								sizes="min(1024px, 100vw)"
							/>
						</div>
					</div>

					<!-- Card 2: Favorite Dorms -->
					<div class="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5">
						<div class="mb-3 flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-scarlet/10">
								<Star class="h-5 w-5 text-scarlet" />
							</div>
							<h3 class="text-[1.5rem] font-semibold leading-8 text-gray-900">Favorite Dorms</h3>
						</div>
						<p class="mt-4 text-base leading-7 text-gray-600">
							Star your residence hall to jump to it instantly. Favorites appear at the top of the
							list and are remembered on your device.
						</p>
						<div
							class="relative mt-6 aspect-[16/10] overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-gray-200"
						>
							<img
								src={favoritesPng}
								alt="Favorites screenshot"
								class="absolute inset-0 h-full w-full object-cover"
								sizes="min(1024px, 100vw)"
							/>
						</div>
					</div>
				</div>

				<!-- Row 2 -->
				<div class="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
					<!-- Card 3: Pin Machines -->
					<div class="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5">
						<div class="mb-3 flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-scarlet/10">
								<Pin class="h-5 w-5 text-scarlet" />
							</div>
							<h3 class="text-[1.5rem] font-semibold leading-8 text-gray-900">Pin Machines</h3>
						</div>
						<p class="mt-4 text-base leading-7 text-gray-600">
							Pin the washers and dryers you’re using to watch remaining time and status changes at
							the top of the page, no scrolling required.
						</p>
						<div
							class="relative mt-6 aspect-[16/10] overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-gray-200"
						>
							<img
								src={pinnedPng}
								alt="Real-time tracking screenshot"
								class="absolute inset-0 h-full w-full object-cover"
								sizes="min(1024px, 100vw)"
							/>
						</div>
					</div>

					<!-- Card 4: Quick Statistics -->
					<div class="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5">
						<div class="mb-3 flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-scarlet/10">
								<BarChart2 class="h-5 w-5 text-scarlet" />
							</div>
							<h3 class="text-[1.5rem] font-semibold leading-8 text-gray-900">Quick Statistics</h3>
						</div>
						<p class="mt-4 text-base leading-7 text-gray-600">
							A compact overview of washers and dryers that adapts to your screen.
						</p>
						<div class="mt-6">
							<div class="hidden grid-cols-2 gap-4 md:grid">
								<div
									class="rounded-2xl bg-white/80 p-4 shadow ring-1 ring-gray-200 backdrop-blur-sm"
								>
									<h4
										class="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-gray-700"
									>
										Washers
									</h4>
									<div class="space-y-2 text-sm">
										<div class="flex items-center justify-between">
											<span class="text-gray-700">Available</span><span
												class="font-semibold text-gray-900"
												>{demoStats.washers_available} / {demoStats.total_washers}</span
											>
										</div>
										<div class="flex items-center justify-between">
											<span class="text-gray-700">In Use</span><span
												class="font-semibold text-gray-900">{demoStats.washers_in_use}</span
											>
										</div>
										<div class="flex items-center justify-between">
											<span class="text-gray-700">Complete</span><span
												class="font-semibold text-gray-900">{demoStats.washers_complete}</span
											>
										</div>
										<div class="flex items-center justify-between">
											<span class="text-gray-700">Out of Service</span><span
												class="font-semibold text-gray-900">{demoStats.washers_error}</span
											>
										</div>
									</div>
								</div>
								<div
									class="rounded-2xl bg-white/80 p-4 shadow ring-1 ring-gray-200 backdrop-blur-sm"
								>
									<h4
										class="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-gray-700"
									>
										Dryers
									</h4>
									<div class="space-y-2 text-sm">
										<div class="flex items-center justify-between">
											<span class="text-gray-700">Available</span><span
												class="font-semibold text-gray-900"
												>{demoStats.dryers_available} / {demoStats.total_dryers}</span
											>
										</div>
										<div class="flex items-center justify-between">
											<span class="text-gray-700">In Use</span><span
												class="font-semibold text-gray-900">{demoStats.dryers_in_use}</span
											>
										</div>
										<div class="flex items-center justify-between">
											<span class="text-gray-700">Complete</span><span
												class="font-semibold text-gray-900">{demoStats.dryers_complete}</span
											>
										</div>
										<div class="flex items-center justify-between">
											<span class="text-gray-700">Out of Service</span><span
												class="font-semibold text-gray-900">{demoStats.dryers_error}</span
											>
										</div>
									</div>
								</div>
							</div>

							<div class="md:hidden">
								<div class="mb-3 flex items-center justify-between text-xs">
									<span class="inline-flex items-center font-semibold uppercase text-gray-700"
										>Total:&nbsp;<span class="text-gray-900"
											>{demoTotalAvailable}/{demoTotalMachines}</span
										></span
									>
									<div class="flex items-center gap-2">
										<span class="flex items-center gap-1"
											><span class="h-2.5 w-2.5 rounded-full bg-yellow-500"></span><span
												>In Use</span
											></span
										>
										<span class="flex items-center gap-1"
											><span class="h-2.5 w-2.5 rounded-full bg-green-500"></span><span
												>Complete</span
											></span
										>
										<span class="flex items-center gap-1"
											><span class="h-2.5 w-2.5 rounded-full bg-red-500"></span><span>Error</span
											></span
										>
									</div>
								</div>
								<div class="grid grid-cols-2 gap-3">
									<div
										class="rounded-xl bg-white/80 p-2.5 shadow ring-1 ring-gray-200 backdrop-blur-sm"
									>
										<div class="mb-1.5 text-center text-xs font-semibold uppercase text-gray-700">
											Washers
										</div>
										<div class="mb-2 h-2 overflow-hidden rounded-full bg-gray-200">
											<div class="flex h-full">
												<div
													class="h-full bg-yellow-500"
													style="width: {demoWasherActivePercent}%"
												></div>
												<div
													class="h-full bg-green-500"
													style="width: {demoWasherCompletePercent}%"
												></div>
												<div
													class="h-full bg-red-500"
													style="width: {demoWasherErrorPercent}%"
												></div>
											</div>
										</div>
										<div class="grid grid-cols-2 gap-1 text-[11px]">
											<div class="text-center">
												<div class="text-gray-700">Available</div>
												<div class="font-semibold text-gray-900">
													{demoStats.washers_available}/{demoStats.total_washers}
												</div>
											</div>
											<div class="text-center">
												<div class="text-gray-700">In Use</div>
												<div class="font-semibold text-gray-900">{demoStats.washers_in_use}</div>
											</div>
											<div class="text-center">
												<div class="text-gray-700">Complete</div>
												<div class="font-semibold text-gray-900">{demoStats.washers_complete}</div>
											</div>
											<div class="text-center">
												<div class="text-gray-700">Error</div>
												<div class="font-semibold text-gray-900">{demoStats.washers_error}</div>
											</div>
										</div>
									</div>
									<div
										class="rounded-xl bg-white/80 p-2.5 shadow ring-1 ring-gray-200 backdrop-blur-sm"
									>
										<div class="mb-1.5 text-center text-xs font-semibold uppercase text-gray-700">
											Dryers
										</div>
										<div class="mb-2 h-2 overflow-hidden rounded-full bg-gray-200">
											<div class="flex h-full">
												<div
													class="h-full bg-yellow-500"
													style="width: {demoDryerActivePercent}%"
												></div>
												<div
													class="h-full bg-green-500"
													style="width: {demoDryerCompletePercent}%"
												></div>
												<div
													class="h-full bg-red-500"
													style="width: {demoDryerErrorPercent}%"
												></div>
											</div>
										</div>
										<div class="grid grid-cols-2 gap-1 text-[11px]">
											<div class="text-center">
												<div class="text-gray-700">Available</div>
												<div class="font-semibold text-gray-900">
													{demoStats.dryers_available}/{demoStats.total_dryers}
												</div>
											</div>
											<div class="text-center">
												<div class="text-gray-700">In Use</div>
												<div class="font-semibold text-gray-900">{demoStats.dryers_in_use}</div>
											</div>
											<div class="text-center">
												<div class="text-gray-700">Complete</div>
												<div class="font-semibold text-gray-900">{demoStats.dryers_complete}</div>
											</div>
											<div class="text-center">
												<div class="text-gray-700">Error</div>
												<div class="font-semibold text-gray-900">{demoStats.dryers_error}</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Usage Overview charts (compact clone) -->
							<div
								class="mt-4 rounded-2xl bg-white/80 p-4 shadow ring-1 ring-gray-200 backdrop-blur-sm"
							>
								<h4
									class="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-700"
								>
									Usage Overview
								</h4>
								<div class="space-y-4">
									<div>
										<div class="mb-2 flex justify-between text-sm">
											<span class="text-gray-700">Washers</span><span
												class="font-semibold text-gray-900"
												>{Math.round(
													((demoStats.washers_in_use +
														demoStats.washers_complete +
														(demoStats.washers_error || 0)) /
														(demoStats.total_washers || 1)) *
														100
												)}%</span
											>
										</div>
										<div class="h-3 overflow-hidden rounded-full bg-gray-200">
											<div class="flex h-full">
												<div
													class="h-full bg-yellow-500"
													style="width: {demoWasherActivePercent}%"
												></div>
												<div
													class="h-full bg-green-500"
													style="width: {demoWasherCompletePercent}%"
												></div>
												<div
													class="h-full bg-red-500"
													style="width: {demoWasherErrorPercent}%"
												></div>
											</div>
										</div>
									</div>
									<div>
										<div class="mb-2 flex justify-between text-sm">
											<span class="text-gray-700">Dryers</span><span
												class="font-semibold text-gray-900"
												>{Math.round(
													((demoStats.dryers_in_use +
														demoStats.dryers_complete +
														(demoStats.dryers_error || 0)) /
														(demoStats.total_dryers || 1)) *
														100
												)}%</span
											>
										</div>
										<div class="h-3 overflow-hidden rounded-full bg-gray-200">
											<div class="flex h-full">
												<div
													class="h-full bg-yellow-500"
													style="width: {demoDryerActivePercent}%"
												></div>
												<div
													class="h-full bg-green-500"
													style="width: {demoDryerCompletePercent}%"
												></div>
												<div
													class="h-full bg-red-500"
													style="width: {demoDryerErrorPercent}%"
												></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- Row 1 extra cards -->
				<div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
					<!-- Card: Exact Finish Time -->
					<div class="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5">
						<div class="mb-3 flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-scarlet/10">
								<Clock class="h-5 w-5 text-scarlet" />
							</div>
							<h3 class="text-[1.5rem] font-semibold leading-8 text-gray-900">Exact Finish Time</h3>
						</div>
						<p class="mt-4 text-base leading-7 text-gray-600">
							We’ll show you exactly when your laundry will finish and how many minutes are left.
							Live updates keep timing accurate.
						</p>
					</div>

					<!-- Card: Cross‑platform -->
					<div class="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5">
						<div class="mb-3 flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-scarlet/10">
								<Globe class="h-5 w-5 text-scarlet" />
							</div>
							<h3 class="text-[1.5rem] font-semibold leading-8 text-gray-900">Cross‑platform</h3>
						</div>
						<p class="mt-4 text-base leading-7 text-gray-600">
							You can track and manage your laundry from any device. Track from your laptop, iPad,
							phone, or anything else with a web browser.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Governance / Metrics Section -->
	<section class="relative overflow-hidden bg-gray-50 py-24 sm:py-32">
		<!-- Background Oval -->
		<img
			src={ovalWebp}
			alt="Oval Background Pattern"
			class="absolute inset-0 h-full w-full object-cover opacity-20"
			sizes="100vw"
		/>
		<div class="absolute inset-0 bg-white/60 backdrop-blur-sm sm:rounded-3xl"></div>

		<div class="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
			<!-- Metrics Grid -->
			<div class=" grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
				<!-- Metric 1 -->
				<div
					class="rounded-3xl bg-gradient-to-br from-white/80 to-white/60 p-8 shadow-xl ring-1 ring-gray-200 backdrop-blur-xl"
				>
					<div
						class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-scarlet/10"
					>
						<Users class="h-6 w-6 text-scarlet" />
					</div>
					<p class="text-[3rem] font-extrabold text-scarlet">300+</p>
					<p class="mt-2 text-lg font-semibold text-gray-900">Students Using Daily</p>
				</div>
				<!-- Metric 2 -->
				<div
					class="rounded-3xl bg-gradient-to-br from-white/80 to-white/60 p-8 shadow-xl ring-1 ring-gray-200 backdrop-blur-xl"
				>
					<div
						class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-scarlet/10"
					>
						<RefreshCw class="h-6 w-6 text-scarlet" />
					</div>
					<p class="text-[3rem] font-extrabold text-scarlet">24/7</p>
					<p class="mt-2 text-lg font-semibold text-gray-900">Real-time updates</p>
				</div>
				<!-- Metric 3 -->
				<div
					class="rounded-3xl bg-gradient-to-br from-white/80 to-white/60 p-8 shadow-xl ring-1 ring-gray-200 backdrop-blur-xl"
				>
					<div
						class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-scarlet/10"
					>
						<Building2 class="h-6 w-6 text-scarlet" />
					</div>
					<p class="text-[3rem] font-extrabold text-scarlet">All</p>
					<p class="mt-2 text-lg font-semibold text-gray-900">Dorms Covered</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Testimonial Gallery Section -->
	<section class="bg-gray-50 py-24 sm:py-32">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div class="mx-auto max-w-2xl text-center">
				<h2 class="text-[1.875rem] font-bold tracking-tight text-gray-900 sm:text-[2.25rem]">
					Loved by Students, Built for Students
				</h2>
				<p class="mt-6 text-lg leading-8 text-gray-600">
					Real feedback from Ohio State students who've said goodbye to laundry day stress.
				</p>
			</div>
			<div class="mx-auto mt-16 flow-root sm:mt-20">
				<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{#each testimonials as testimonial}
						<div class="flex flex-col rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
							<figure class="flex flex-grow flex-col justify-between">
								<blockquote class="flex-grow text-gray-900">
									<p>"{testimonial.quote}"</p>
								</blockquote>
								<figcaption class="mt-6 flex items-center gap-x-4">
									<div
										class="flex h-10 w-10 items-center justify-center rounded-full bg-scarlet font-bold text-white"
									>
										{testimonial.author.charAt(0)}
									</div>
									<div>
										<div class="font-semibold">{testimonial.author}</div>
										<div class="text-gray-600">{testimonial.role}</div>
									</div>
								</figcaption>
							</figure>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="bg-scarlet py-20 sm:py-28">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div class="relative">
				<div class="relative mx-auto max-w-3xl text-center">
					<div
						class="mx-auto w-full rounded-3xl bg-white/10 p-8 shadow-lg ring-1 ring-inset ring-white/20 backdrop-blur-sm sm:p-12"
					>
						<h2 class="text-[2.25rem] font-bold tracking-tight text-white sm:text-[3rem]">
							Ready to simplify your laundry?
						</h2>
						<p class="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/90">
							Join hundreds of Ohio State students who've made laundry day stress-free.
						</p>
						<div class="mt-8">
							<a
								href="/buildings"
								class="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-scarlet shadow-sm transition-colors hover:bg-gray-100"
							>
								Find Your Dorm
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	@keyframes float {
		0% {
			transform: translateY(0px) rotate(var(--start-rotate));
		}
		50% {
			transform: translateY(-15px) rotate(var(--end-rotate));
		}
		100% {
			transform: translateY(0px) rotate(var(--start-rotate));
		}
	}
</style>
