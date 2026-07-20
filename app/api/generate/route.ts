import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${BACKEND_URL}/joyman`, {
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
