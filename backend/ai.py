from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import AzureOpenAI
from backend.config import OPENAI_ENDPOINT, OPENAI_API_KEY, OPENAI_API_VERSION, OPENAI_DEPLOYMENT

router = APIRouter()


class JoymanRequest(BaseModel):
    theme: str
    episode: str


def get_openai_client() -> AzureOpenAI:
    if not OPENAI_ENDPOINT or not OPENAI_API_KEY or not OPENAI_API_VERSION:
        raise HTTPException(status_code=500, detail="Azure OpenAI credentials are not configured.")

    return AzureOpenAI(
        azure_endpoint=OPENAI_ENDPOINT,
        api_key=OPENAI_API_KEY,
        api_version=OPENAI_API_VERSION,
    )


POEM_SYSTEM_PROMPT = """
あなたは、日本語の韻踏みが得意なオリジナルのお笑いラップ職人です。
ユーザーが入力した仕事あるあるを、リズム重視・韻重視の2行ネタへ変換してください。
【出力構成】
・必ず2行で出力する。
・1行当たりの文字数は10文字程度

【1行目】
・ユーザーの入力内容を一言で要約する。
・状況説明だけでよい。
・最後に韻を踏みやすいキーワードを置く。

【2行目】
・1行目の最後のキーワードと強く韻を踏む。
・内容は1行目と関係なくてよい。
・突然、動物・食べ物・スポーツ・歴史・宇宙・地名・学校・家電・芸能・日用品など、まったく無関係なテーマへ飛ぶ。
・意味がつながる必要はない。
・「なんでそれ!?」と思える飛躍を優先する。

【韻の定義】
・韻とは最後の3〜5モーラ以上の母音列が一致することである。
・語尾が1文字だけ同じものは韻とはみなさない。
・最後の単語同士のみで韻を判定する。

【韻のルール】
・各行の最後はできるだけ同じ母音列にする。
・3文字以上の韻を優先する。
・意味より音を優先する。
・同じ語尾を繰り返すだけではなく、異なる単語で韻を作る。
・1行目と2行目の語尾は異なる単語で韻を踏む。

【作成手順】
①入力から韻を作りやすい単語を1語選ぶ。
②その単語を音韻（発音）に変換する。
③その単語の最後4モーラ以上の母音列を抽出する。
例
ファシリ
母音列
a i i

山積み
母音列
a a u i

歯ぎしり
母音列
a i i i

④抽出した母音列と一致する単語を20個以上考える。
⑤一致しない単語はすべて捨てる。
⑥残った単語の中から
・最も意味が遠い
・最も突飛
・最もシュール
な単語を選ぶ。
⑦最後に2行ネタを作る。
⑧ネタ完成後に再度確認する。
・最後の単語同士の母音列は一致しているか
・一致しないなら最初から作り直す
出力はネタ2行のみ。

【禁止】
・ユーザーの内容を2行目で説明し続けない。
・オチを解説しない。
・既存のお笑い芸人・楽曲・キャラクターの決めゼリフや代表フレーズは使わない。
"""


def build_poem_prompt(theme: str, episode: str) -> str:
    return (
        "# user_input\n"
        f"theme: {theme}\n"
        f"episode: {episode}\n"
        "\n"
        "上記のthemeとepisodeを必ず踏まえて、2行ネタを作成してください。\n"
    )


@router.post("/joyman")
def joyman(request: JoymanRequest):
    client = get_openai_client()
    prompt = build_poem_prompt(request.theme, request.episode)

    response = client.chat.completions.create(
        model=OPENAI_DEPLOYMENT,
        messages=[
            {"role": "system", "content": POEM_SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
    )

    message = response.choices[0].message
    return {"result": message.content if hasattr(message, "content") else ""}