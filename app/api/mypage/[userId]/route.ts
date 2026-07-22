import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backendUrl";

type RouteContext = {
    params: Promise<{ userId: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
    try {
        const backendUrl = getBackendUrl();
        const { userId } = await context.params;

        const response = await fetch(`${backendUrl}/mypage/${userId}`, {
            headers: {
                Accept: "application/json",
            },
            cache: "no-store",
        });

        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const json = await response.json();
            return NextResponse.json(json, { status: response.status });
        }

        const text = await response.text();
        return NextResponse.json(
            { detail: text || "マイページ情報の取得に失敗しました" },
            { status: response.status },
        );
    } catch (error) {
        console.error("Failed to fetch mypage via backend:", error);
        return NextResponse.json(
            { detail: "バックエンドに接続できません。サーバー起動を確認してください。" },
            { status: 503 },
        );
    }
}
