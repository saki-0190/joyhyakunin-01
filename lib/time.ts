export function parseUtcDate(value: string): Date {
    return new Date(/([zZ]|[+\-]\d{2}:?\d{2})$/.test(value) ? value : `${value}Z`);
}

export function formatRelativeTime(createdAt: string, nowMs: number): string {
    const date = parseUtcDate(createdAt);
    const diffMs = nowMs - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMinutes < 1) return "たった今";
    if (diffMinutes < 60) return `${diffMinutes}分前`;
    if (diffHours < 24) return `${diffHours}時間前`;
    if (diffHours < 48) return "昨日";

    return `${Math.floor(diffHours / 24)}日前`;
}
