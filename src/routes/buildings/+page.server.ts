import type { PageServerLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import type { Building, ApiResponse } from '$lib/types';
import { dorms } from '$lib/dorms';
import { levenshteinDistance } from '$lib/utils';
import { error } from '@sveltejs/kit'

export const prerender = false;

export const load: PageServerLoad = async () => {
	try {
		const response = await fetch(`${PUBLIC_API_URL}/api/buildings`);
		const data: ApiResponse<Building[]> = await response.json();

		const buildingsWithImages = data.data.map((building) => {
			const buildingNameLower = building.organization_name.toLowerCase();

			// Find a matching dorm, considering the 'shouldBe' property
			const matchedDorm = dorms.find((d) => d.name.toLowerCase() === buildingNameLower);

			// Use the 'shouldBe' name if it exists, otherwise use the original name
			const displayName = matchedDorm?.shouldBe || building.organization_name;

			// This code is dumb, I didn't want to hardcode anything, so I came up with this complex mess. OSU should also name their buildings correctly on the silly little app
			let bestMatch: { dorm: (typeof dorms)[0]; score: number } | null = null;

			// 1. Prioritize exact match (case-insensitive)
			const exactMatch = dorms.find((d) => d.name.toLowerCase() === buildingNameLower);

			if (exactMatch) {
				bestMatch = { dorm: exactMatch, score: 0 };
			} else {
				// 2. If no exact match, use a word-by-word Levenshtein to find the best fuzzy match
				const buildingWords = buildingNameLower.split(/[\s-]+/);

				for (const dorm of dorms) {
					const dormWords = dorm.name.toLowerCase().split(/[\s-]+/);
					let totalDistance = 0;

					for (const buildingWord of buildingWords) {
						let minWordDistance = Infinity;
						for (const dormWord of dormWords) {
							const distance = levenshteinDistance(buildingWord, dormWord);
							if (distance < minWordDistance) {
								minWordDistance = distance;
							}
						}
						totalDistance += minWordDistance;
					}

					const score = totalDistance / buildingWords.length; // Normalize score

					if (bestMatch === null || score < bestMatch.score) {
						bestMatch = { dorm, score };
					}
				}
			}

			// Adjust threshold for the normalized score
			const threshold = 3.5;
			let image = bestMatch && bestMatch.score < threshold ? bestMatch.dorm.image : undefined;

			return {
				...building,
				organization_name: displayName, // a t,
				image
			};
		});

		return {
			buildings: buildingsWithImages.sort((a, b) =>
				a.organization_name.localeCompare(b.organization_name)
			)
		};
	} catch (e) {
		throw error(500, {
			message: `Failed to load buildings: ${e}`
		});
	}
};
