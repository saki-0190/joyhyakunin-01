import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backendUrl";

export async function POST(request: NextRequest) {
    try {
        const backendUrl = getBackendUrl();
        const body = await request.json();

        const response = await fetch(`${backendUrl}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(body),
            cache: "no-store",
        });

        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const json = await response.json();
            return NextResponse.json(json, { status: response.status });
        }

        const text = await response.text();
        return NextResponse.json(
            { detail: text || "ログインに失敗しました" },
            { status: response.status },
        );
    } catch (error) {
        console.error("Failed to login via backend:", error);
        return NextResponse.json(
            { detail: "バックエンドに接続できません。サーバー起動を確認してください。" },
            { status: 503 },
        );
    }
}
