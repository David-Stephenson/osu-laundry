<script lang="ts">
	import '../app.scss';

	import Footer from '../components/Footer.svelte';
</script>

<svelte:head>
	<link rel="icon" href="/vector/shirt-solid.svg" />
</svelte:head>

<div class="flex flex-col">
	<slot />
</div>

<Footer />
