<script lang="ts">
	import { WashingMachine } from 'lucide-svelte';

	interface Dorm {
		name: string;
		image?: string;
	}

	export let dorms: Dorm[] = [];

	// Map original dorm image paths to preprocessed outputs under /generated/dorms
	function normalizeDormPath(p?: string): string {
		if (!p) return '';
		return p.startsWith('/src/') ? p : p.replace(/^\/?images\//, '/src/images/');
	}

	function generatedBase(path?: string): string | null {
		const key = normalizeDormPath(path);
		if (!key) return null;
		const base = key.substring(key.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '');
		return `/generated/dorms/${base}`;
	}

	function processedWebp(path?: string, width = 400): string | null {
		const base = generatedBase(path);
		if (!base) return null;
		return `${base}-${width}.webp`;
	}
</script>

<!-- Flowing Polaroid Background -->
<div class="absolute inset-0 z-0 overflow-hidden">
	<div class="flowing-container">
		{#each Array(6) as _, rowIndex}
			<div class="flow-row" style="top: {rowIndex * 18}%; height: 15%;">
				<div class="flow-track">
					{#each Array(4) as _}
						{#each dorms as dorm}
							<div class="flow-polaroid" style="transform: rotate({(Math.random() - 0.5) * 8}deg);">
								{#if dorm.image && dorm.image !== ''}
									<img src={processedWebp(dorm.image) || dorm.image} alt={dorm.name} class="polaroid-image" loading="lazy" decoding="async" />
								{:else}
									<div class="polaroid-image flex items-center justify-center bg-scarlet">
										<WashingMachine class="h-6 w-6 text-white" />
									</div>
								{/if}
								<div class="polaroid-caption">{dorm.name}</div>
							</div>
						{/each}
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	/* Flowing container */
	.flowing-container {
		position: absolute;
		inset: -20%;
		pointer-events: none;
		transform: rotate(-25deg) scale(1.3);
		transform-origin: center center;
	}

	/* Individual flow rows */
	.flow-row {
		position: absolute;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
	}

	/* Flow track that moves */
	.flow-track {
		display: flex;
		gap: 40px;
		animation-duration: 250s;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		white-space: nowrap;
		will-change: transform;
	}

	/* Alternating directions for rows */
	.flow-row:nth-child(odd) .flow-track {
		animation-name: flow-left-to-right;
	}

	.flow-row:nth-child(even) .flow-track {
		animation-name: flow-right-to-left;
	}

	/* Individual polaroid in the flow */
	.flow-polaroid {
		flex: none;
		width: 160px;
		height: 200px;
		background: linear-gradient(to bottom, #ffffff, #f3f4f6);
		padding: 10px;
		padding-bottom: 15px;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		gap: 6px;
		opacity: 0.6;
		position: relative;
	}

	.polaroid-image {
		width: 100%;
		height: 130px;
		object-fit: cover;
		border-radius: 6px;
		background: #f8f8f8;
	}

	.polaroid-caption {
		margin-top: 12px;
		font-family: 'Marker Felt', 'Comic Sans MS', cursive, sans-serif;
		font-size: 12px;
		text-align: center;
		color: #1f2937;
		font-weight: 400;
		line-height: 1.3;
		width: 100%;
		word-wrap: break-word;
		overflow-wrap: break-word;
		hyphens: auto;
		transform: rotate(-0.5deg);
		letter-spacing: 0.2px;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Flow animations */
	@keyframes flow-left-to-right {
		0% {
			transform: translateX(-25%);
		}
		100% {
			transform: translateX(0%);
		}
	}

	@keyframes flow-right-to-left {
		0% {
			transform: translateX(0%);
		}
		100% {
			transform: translateX(-25%);
		}
	}



	/* Mobile Responsive */
	@media (max-width: 768px) {
		.flowing-container {
			transform: rotate(-25deg) scale(1.0);
			inset: -10%;
		}

		.flow-track {
			gap: 30px;
		}

		.polaroid-caption {
			font-size: 10px;
			margin-top: 8px;
			line-height: 1.2;
		}
	}
</style>
