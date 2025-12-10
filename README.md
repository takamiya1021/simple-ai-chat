# Simple AI Chat App

Gemini APIを使用したシンプルなAIチャットアプリケーション

## 📋 プロジェクト概要

UX心理学に基づいた設計で、使いやすさと美しさを両立したチャットインターフェース

### 主な機能
- ✅ Gemini APIとのリアルタイムチャット
- ✅ 会話リセット機能
- ✅ APIキーのローカル保存
- ✅ ローディング表示（スケルトンUI）
- ✅ レスポンシブデザイン

### 技術スタック
- Next.js 14.x
- React 18.x
- TypeScript
- Tailwind CSS v3
- Gemini API (Google Generative AI SDK)

## 🎨 UX心理学に基づく設計

| 心理効果 | 実装内容 |
|---------|---------|
| 視覚的階層 | 送信ボタンを主役として大きく・高コントラスト |
| ドハティの閾値 | 即座のローディング表示（0.4秒以内） |
| 認知負荷軽減 | シンプルな初期画面、自動フォーカス |
| 美的ユーザビリティ | 余白・整列を重視したレイアウト |

## 📁 ドキュメント

- [要件定義書](./requirements.md)
- [設計書](./design.md)

## 🚀 セットアップ（PC環境で実行）

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd simple-ai-chat
```

### 2. 依存パッケージのインストール
```bash
npm install
```

### 3. 必要なパッケージ
- next
- react
- react-dom
- typescript
- @types/node
- @types/react
- @types/react-dom
- tailwindcss
- postcss
- autoprefixer
- @google/generative-ai

### 4. Gemini APIキーの取得
1. [Google AI Studio](https://makersuite.google.com/app/apikey) にアクセス
2. APIキーを取得
3. アプリ起動後、モーダルでAPIキーを入力

### 5. 開発サーバーの起動
```bash
npm run dev
```

http://localhost:3000 でアクセス

## 📂 ディレクトリ構成

```
simple-ai-chat/
├── app/
│   ├── page.tsx          # メインページ
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ChatMessage.tsx   # メッセージコンポーネント
│   ├── ChatInput.tsx     # 入力欄コンポーネント
│   ├── LoadingMessage.tsx # ローディング表示
│   ├── Header.tsx        # ヘッダーコンポーネント
│   └── ApiKeyModal.tsx   # APIキー設定モーダル
├── lib/
│   └── gemini.ts         # Gemini API統合
├── requirements.md       # 要件定義書
├── design.md            # 設計書
└── README.md
```

## 💡 使い方

1. **初回起動**: APIキー設定モーダルが表示されるので、Gemini APIキーを入力
2. **チャット開始**: 入力欄にメッセージを入力して送信ボタンをクリック
3. **会話リセット**: 右上の🔄ボタンで会話をリセット
4. **APIキー変更**: 右上の⚙️ボタンからAPIキーを再設定可能

## 🔒 セキュリティ

- APIキーは localStorage に保存（ブラウザ内のみ）
- サーバーには送信されません

## 📝 ライセンス

MIT

## 👤 作成者

あおいさん

---

**注意**: このプロジェクトは学習目的で作成されています。
