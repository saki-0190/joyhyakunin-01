import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backendUrl";

type RouteContext = {
    params: Promise<{ postId: string }>;
};

export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const backendUrl = getBackendUrl();
        const { postId } = await context.params;
        const authorization = request.headers.get("authorization");

        const response = await fetch(`${backendUrl}/posts/${postId}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                ...(authorization ? { Authorization: authorization } : {}),
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
            { error: text || "削除に失敗しました" },
            { status: response.status },
        );
    } catch (error) {
        console.error("Failed to delete post via backend:", error);
        return NextResponse.json(
            { error: "バックエンドに接続できません。サーバー起動を確認してください。" },
            { status: 503 },
        );
    }
}
