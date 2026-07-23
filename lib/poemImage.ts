import { toPng } from "html-to-image";

const FALLBACK_THEME = "無題";

function sanitizeFilenamePart(value: string): string {
    const sanitized = value
        .replace(/[\\/:*?"<>|]/g, "-")
        .replace(/\s+/g, " ")
        .trim();

    return sanitized || FALLBACK_THEME;
}

function formatDateYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
}

export function buildPoemImageFileName(theme: string, now = new Date()): string {
    const safeTheme = sanitizeFilenamePart(theme);
    const datePart = formatDateYYYYMMDD(now);
    return `${safeTheme}-${datePart}.png`;
}

type DownloadPoemImageOptions = {
    sourceElement: HTMLElement;
    theme: string;
};

export async function downloadPoemImage({
    sourceElement,
    theme,
}: DownloadPoemImageOptions): Promise<void> {
    const mount = document.createElement("div");
    mount.style.position = "fixed";
    mount.style.left = "-10000px";
    mount.style.top = "0";
    mount.style.zIndex = "-1";

    const frame = document.createElement("div");
    frame.style.display = "inline-flex";
    frame.style.flexDirection = "column";
    frame.style.alignItems = "center";
    frame.style.gap = "14px";
    frame.style.padding = "20px";
    frame.style.borderRadius = "18px";
    frame.style.background = "#f8f6f2";

    const clone = sourceElement.cloneNode(true) as HTMLElement;
    frame.appendChild(clone);

    const logo = document.createElement("div");
    logo.textContent = "joyhyakunin";
    logo.style.padding = "6px 12px";
    logo.style.borderRadius = "9999px";
    logo.style.border = "1px solid #d9c7a1";
    logo.style.background = "#fffdf8";
    logo.style.color = "#6b2f37";
    logo.style.fontFamily = "serif";
    logo.style.fontSize = "13px";
    logo.style.letterSpacing = "0.08em";
    frame.appendChild(logo);

    mount.appendChild(frame);
    document.body.appendChild(mount);

    try {
        const dataUrl = await toPng(frame, {
            cacheBust: true,
            pixelRatio: 2,
            backgroundColor: "#f8f6f2",
        });

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = buildPoemImageFileName(theme);
        link.click();
    } finally {
        mount.remove();
    }
}
