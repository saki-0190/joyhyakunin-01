import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backendUrl";

type RouteContext = {
    params: Promise<{ userId: string }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        const backendUrl = getBackendUrl();
        const { userId } = await context.params;
        const authorization = request.headers.get("authorization");
        const body = await request.json();

        const response = await fetch(`${backendUrl}/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...(authorization ? { Authorization: authorization } : {}),
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
            { detail: text || "プロフィールの更新に失敗しました" },
            { status: response.status },
        );
    } catch (error) {
        console.error("Failed to update user via backend:", error);
        return NextResponse.json(
            { detail: "バックエンドに接続できません。サーバー起動を確認してください。" },
            { status: 503 },
        );
    }
}
