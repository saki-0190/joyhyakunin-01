import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set in environment variables.");
}

const systemContent = `あなたは日本語の短歌風の詩を生成する役割です。以下のテーマとエピソードをもとに、百人一首のような形式で一首を生成してください。出力は必ず日本語で、五七五七七に近いリズムで、一首だけを改行で区切って返してください。`;

async function generatePoem(theme: string, episode: string) {
    const prompt = `テーマ：${theme}\nエピソード：${episode}\n\n上記をもとに、百人一首の一首を日本語で生成してください。ユーモアを少し含めつつ、短歌らしいリズムを大切にしてください。出力は一首のみ、改行区切りでお願いします。`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemContent },
                { role: "user", content: prompt },
            ],
            max_tokens: 200,
            temperature: 0.85,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const message = data?.choices?.[0]?.message?.content;
    if (!message) {
        throw new Error("OpenAI response did not contain a valid message.");
    }

    return message.trim();
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const theme = String(body.theme || "営業あるある");
        const episode = String(body.episode || "");

        const poem = await generatePoem(theme, episode);
        return NextResponse.json({ poem });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "詩の生成に失敗しました。" }, { status: 500 });
    }
}
