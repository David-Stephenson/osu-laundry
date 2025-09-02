<script lang="ts">
	import '../app.scss';

	import Footer from '../components/Footer.svelte';
	import { page } from '$app/stores';

	const DEFAULT_TITLE = 'OSU Laundry';
	const DEFAULT_DESCRIPTION =
		'Real-time laundry machine status across Ohio State University residence halls at The Ohio State University.';
	import defaultOg from '../images/page.png';
	const DEFAULT_IMAGE = defaultOg;

	$: canonicalUrl = $page?.url?.href || '';
	</script>

<svelte:head>
	<link rel="icon" href="/vector/shirt-solid.svg" />
	<meta name="application-name" content="OSU Laundry" />
	<meta name="theme-color" content="#ba0c2f" />
	<meta property="og:site_name" content="OSU Laundry" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={DEFAULT_TITLE} />
	<meta property="og:description" content={DEFAULT_DESCRIPTION} />
	<meta property="og:image" content={DEFAULT_IMAGE} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={DEFAULT_TITLE} />
	<meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
	<meta name="twitter:image" content={DEFAULT_IMAGE} />
	<link rel="canonical" href={canonicalUrl} />
</svelte:head>

<div class="flex flex-col">
	<slot />
</div>

<Footer />

