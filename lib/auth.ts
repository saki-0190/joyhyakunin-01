export type AuthUser = {
    id: number;
    email?: string;
    nickname?: string;
    full_name?: string;
    industry?: string;
    profile_image_url?: string;
    access_token?: string;
};

function normalizeUserId(rawId: unknown): number | null {
    if (typeof rawId === "number" && Number.isInteger(rawId) && rawId > 0) {
        return rawId;
    }
    if (typeof rawId === "string") {
        const parsed = Number(rawId);
        if (Number.isInteger(parsed) && parsed > 0) {
            return parsed;
        }
    }
    return null;
}

export function getStoredUser(): AuthUser | null {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const raw = localStorage.getItem("user");
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const normalizedId = normalizeUserId(parsed.id);
        if (!normalizedId) {
            return null;
        }

        return {
            id: normalizedId,
            email: typeof parsed.email === "string" ? parsed.email : undefined,
            nickname: typeof parsed.nickname === "string" ? parsed.nickname : undefined,
            full_name: typeof parsed.full_name === "string" ? parsed.full_name : undefined,
            industry: typeof parsed.industry === "string" ? parsed.industry : undefined,
            profile_image_url:
                typeof parsed.profile_image_url === "string" ? parsed.profile_image_url : undefined,
            access_token: typeof parsed.access_token === "string" ? parsed.access_token : undefined,
        };
    } catch (error) {
        console.error("ユーザー情報の読み込みに失敗しました:", error);
        return null;
    }
}

export function isLoggedIn(): boolean {
    const user = getStoredUser();
    return Boolean(user?.access_token);
}

export function getAuthorizationHeader(): Record<string, string> {
    const user = getStoredUser();
    if (!user?.access_token) {
        return {};
    }
    return { Authorization: `Bearer ${user.access_token}` };
}
