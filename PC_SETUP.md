# PC作業手順書

## 📤 GitHubへのアップロード手順

### 1. このフォルダをPCにダウンロード

simple-ai-chat フォルダ全体をPCの `~/projects/` にダウンロードしてください。

---

### 2. WSL2 Ubuntuで作業

```bash
# プロジェクトディレクトリに移動
cd ~/projects/simple-ai-chat

# ブランチ名をmainに変更
git branch -M main

# GitHubリポジトリをリモートとして追加
git remote add origin https://github.com/takamiya1021/simple-ai-chat.git

# GitHubにプッシュ
git push -u origin main
```

---

### 3. GitHubで確認

https://github.com/takamiya1021/simple-ai-chat にアクセスして、ファイルがアップロードされているか確認してください。

---

### 4. 次のステップ：実装開始

```bash
cd ~/projects/simple-ai-chat

# Next.jsプロジェクトを作成（既存ファイルを残したまま）
npx create-next-app@14 . --typescript --tailwind --app --use-npm

# Gemini SDKをインストール
npm install @google/generative-ai

# 開発サーバー起動
npm run dev
```

---

## ✅ 完了したこと

- ✅ Gitリポジトリ初期化
- ✅ 要件定義書・設計書・README追加
- ✅ .gitignore作成
- ✅ 初回コミット完了

## 🚧 これから（PCで）

1. GitHubにプッシュ
2. Next.jsプロジェクト作成
3. コンポーネント実装
4. Gemini API統合
5. 動作確認

---

**注意**: Personal Access Token は既に会話に表示されているので、作業完了後は必ず無効化してください！
