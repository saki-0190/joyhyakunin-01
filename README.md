This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Disclaimer

This repository is published for educational and proof-of-concept (PoC) purposes only.

- This project is intended for learning and technical verification.
- It is an independent personal project and is not affiliated with or endorsed by my employer or any organization.
- It is not intended for commercial use.

---

## 免責事項

本リポジトリは、学習および技術検証（PoC）を目的として作成した個人プロジェクトです。

- 個人の学習・技術検証を目的として公開しています。
- 所属する会社・団体・組織とは一切関係ありません。
- 所属組織の見解や方針を示すものではありません。
- 商用利用を目的としたものではありません。

## Backend (MySQL) 運用メモ

- 本プロジェクトは MySQL を前提にしています。`DATABASE_URL` は必須です。
- API 起動時に DB 初期化を試行し、接続不可でもプロセス自体は起動を継続します。
- DB 接続不可時は DB 依存 API が `503` を返します（無応答やクラッシュを回避）。

### ローカル起動前チェック

1. `.env.local` に `DATABASE_URL=mysql+pymysql://...` を設定
2. バックエンド起動: `uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload`
3. ヘルスチェック: `GET /health/db`
	- `{"ok": true, "database": "up"}` なら DB 到達成功
	- `{"ok": false, "database": "down"}` なら DB 到達失敗

### デプロイ時の再発防止ポイント

1. `DATABASE_URL` を環境変数で必ず注入（未設定で起動しない）
2. `health/db` を監視対象に追加（死活監視・アラート）
3. DB 側のFW/許可IP/SSL証明書設定を事前検証
4. 起動直後のスモークテストに `GET /health/db` と `GET /posts?sort=latest` を追加