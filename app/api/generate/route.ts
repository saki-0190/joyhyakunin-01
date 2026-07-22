import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backendUrl";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const backendUrl = getBackendUrl();

        const response = await fetch(`${backendUrl}/joyman`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Backend request failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return NextResponse.json({ poem: data.result ?? "" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "詩の生成に失敗しました。" }, { status: 500 });
    }
}
