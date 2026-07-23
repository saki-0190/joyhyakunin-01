import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backendUrl";

type CreatePostRequest = {
  poem_text: string;
  theme: string;
  image_url: string;
};

export async function GET(request: NextRequest) {
  try {
    const backendUrl = getBackendUrl();

    const { searchParams } = new URL(request.url);

    const sort =
      searchParams.get("sort") === "popular"
        ? "popular"
        : "latest";

    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? "10";

    const authorization = request.headers.get("authorization");

    const response = await fetch(
      `${backendUrl}/posts?sort=${sort}&page=${page}&limit=${limit}`,
      {
        headers: {
          Accept: "application/json",
          ...(authorization
            ? { Authorization: authorization }
            : {}),
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "投稿一覧の取得に失敗しました",
        },
        {
          status: response.status,
        }
      );
    }

    const data = await response.json();

    // ★ バックエンドのレスポンスをそのまま返す
    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "Failed to fetch posts from backend:",
      error
    );

    return NextResponse.json(
      {
        error:
          "バックエンドに接続できません。サーバー起動を確認してください。",
      },
      {
        status: 503,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const backendUrl = getBackendUrl();

    const body =
      (await request.json()) as CreatePostRequest;

    const authorization =
      request.headers.get("authorization");

    const response = await fetch(
      `${backendUrl}/posts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(authorization
            ? { Authorization: authorization }
            : {}),
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        {
          error: `投稿に失敗しました: ${errorText}`,
        },
        {
          status: response.status,
        }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "Failed to create post via backend:",
      error
    );

    return NextResponse.json(
      {
        error:
          "バックエンドに接続できません。サーバー起動を確認してください。",
      },
      {
        status: 503,
      }
    );
  }
}