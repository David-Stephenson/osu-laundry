<script lang="ts">
	import '../app.scss';
	import toast, { Toaster } from 'svelte-french-toast';
</script>

<svelte:head>
	<link rel="icon" href="/vector/shirt-solid.svg" />
</svelte:head>

<div class="flex flex-col">
	<Toaster />
	<slot />
</div>
