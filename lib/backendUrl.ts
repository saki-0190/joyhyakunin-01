const DEFAULT_DEV_BACKEND_URL = "http://127.0.0.1:8000";

export function getBackendUrl(): string {
    const configuredUrl = process.env.BACKEND_URL?.trim();
    if (configuredUrl) {
        return configuredUrl.replace(/\/$/, "");
    }

    if (process.env.NODE_ENV === "production") {
        throw new Error("BACKEND_URL is not configured in production environment.");
    }

    return DEFAULT_DEV_BACKEND_URL;
}
