export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
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
  return {
    'AVAILABLE': 'bg-blue-900/50 text-blue-300 border border-blue-700',
    'IN_USE': 'bg-yellow-900/50 text-yellow-300 border border-yellow-700',
    'COMPLETE': 'bg-green-900/50 text-green-300 border border-green-700'
  }[status] || 'bg-red-900/50 text-red-300 border border-red-700';
} 