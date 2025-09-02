export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Formats an ISO time string using the browser's local time zone. When rendered
// on the server (SSR/prerender), we fall back to UTC so that hydration on the
// client can update it to the user's actual zone.
export function formatDateTimeLocal(isoString: string): string {
  const date = new Date(isoString);
  try {
    // Using Intl to explicitly bind to the client's time zone when available
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone
    }).format(date);
  } catch {
    // Fallback (older environments): default locale formatting
    return date.toLocaleString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}

export function formatRemainingTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function getStatusStyle(status: string): string {
  const base = 'text-white border';
  return {
    'AVAILABLE': `bg-blue-500 ${base} border-blue-600`,
    'IN_USE': `bg-yellow-500 ${base} border-yellow-600`,
    'COMPLETE': `bg-green-500 ${base} border-green-600`
  }[status] || `bg-red-500 ${base} border-red-600`;
}

// Returns the canonical color family for a machine status.
// Used to keep colors consistent across chips, cards, and charts.
export function getStatusColor(status: string): 'blue' | 'yellow' | 'green' | 'red' {
  if (status === 'AVAILABLE') return 'blue';
  if (status === 'IN_USE') return 'yellow';
  if (status === 'COMPLETE') return 'green';
  return 'red'; // UNAVAILABLE and any other error-like statuses
}

export function levenshteinDistance(a: string, b: string): number {
	const matrix = Array(b.length + 1)
		.fill(null)
		.map(() => Array(a.length + 1).fill(null));

	for (let i = 0; i <= a.length; i++) {
		matrix[0][i] = i;
	}

	for (let j = 0; j <= b.length; j++) {
		matrix[j][0] = j;
	}

	for (let j = 1; j <= b.length; j++) {
		for (let i = 1; i <= a.length; i++) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1;
			matrix[j][i] = Math.min(
				matrix[j][i - 1] + 1, // Deletion
				matrix[j - 1][i] + 1, // Insertion
				matrix[j - 1][i - 1] + cost // Substitution
			);
		}
	}

	return matrix[b.length][a.length];
} 