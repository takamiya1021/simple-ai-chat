# Simple AI Chat App - 実装計画書

## 📋 実装概要

本ドキュメントは、Simple AI Chat Appの実装を段階的に進めるための詳細な計画書です。

**プロジェクト**: Simple AI Chat App
**技術スタック**: Next.js 14.x + React 18.x + TypeScript + Tailwind CSS v3 + Gemini API
**実装方針**: コンポーネント駆動開発、段階的な機能追加

---

## 🎯 実装の目標

1. UX心理学に基づいた直感的なUIの実装
2. Gemini APIとのシームレスな連携
3. エラーハンドリングを含む堅牢な実装
4. レスポンシブデザインの実現

---

## 📅 実装フェーズ

### Phase 0: 環境構築
### Phase 1: 基本レイアウトとUIコンポーネント
### Phase 2: 状態管理とロジック実装
### Phase 3: Gemini API統合
### Phase 4: UX最適化とエラーハンドリング
### Phase 5: テストと最終調整

---

## Phase 0: 環境構築

### 優先度: 🔴 最優先

### 実装タスク

#### 0-1. Next.jsプロジェクトのセットアップ
```bash
npx create-next-app@14 . --typescript --tailwind --app --use-npm
```

**確認項目**:
- `app/` ディレクトリが作成されている
- `tailwind.config.ts` が存在する
- TypeScriptの設定ファイル (`tsconfig.json`) が存在する

#### 0-2. 依存パッケージのインストール
```bash
npm install @google/generative-ai
```

**パッケージ一覧**:
- `next`: 14.x
- `react`: 18.x
- `react-dom`: 18.x
- `typescript`: latest
- `@google/generative-ai`: latest
- `tailwindcss`: 3.x

#### 0-3. ディレクトリ構成の準備
```bash
mkdir -p components lib
```

**作成するディレクトリ**:
```
simple-ai-chat/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ChatMessage.tsx
│   ├── ChatInput.tsx
│   ├── LoadingMessage.tsx
│   ├── Header.tsx
│   └── ApiKeyModal.tsx
└── lib/
    └── gemini.ts
```

#### 0-4. グローバルスタイルの設定

**ファイル**: `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#__next {
  height: 100%;
}
```

**完了条件**:
- ✅ `npm run dev` でサーバーが起動する
- ✅ http://localhost:3000 でデフォルトページが表示される
- ✅ TypeScriptのエラーがない

---

## Phase 1: 基本レイアウトとUIコンポーネント

### 優先度: 🔴 最優先

### 実装タスク

#### 1-1. Header コンポーネントの実装

**ファイル**: `components/Header.tsx`

**実装内容**:
- タイトル表示 ("AI Chat")
- リセットボタン (🔄)
- 設定ボタン (⚙️)

**Props**:
```typescript
interface HeaderProps {
  onReset: () => void;
  onOpenSettings: () => void;
}
```

**スタイリング要件**:
- 背景: `bg-white`
- ボーダー: `border-b border-gray-200`
- ボタンホバー: `hover:bg-gray-100`

**テストポイント**:
- ボタンクリックでコールバックが呼ばれる
- レスポンシブ対応（モバイルでも表示が崩れない）

#### 1-2. ChatMessage コンポーネントの実装

**ファイル**: `components/ChatMessage.tsx`

**実装内容**:
- ユーザーメッセージとAIメッセージの表示
- メッセージの左右配置（ユーザー: 右、AI: 左）
- 長文の折り返し対応

**Props**:
```typescript
interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}
```

**スタイリング要件**:
- ユーザー: `bg-blue-100 text-gray-900` (右寄せ)
- AI: `bg-gray-100 text-gray-900` (左寄せ)
- 最大幅: `max-w-[70%]`
- テキスト折り返し: `whitespace-pre-wrap break-words`

**テストポイント**:
- 長文が正しく折り返される
- 改行が保持される (`\n` が表示される)

#### 1-3. LoadingMessage コンポーネントの実装

**ファイル**: `components/LoadingMessage.tsx`

**実装内容**:
- アニメーションする3つのドット
- "考え中..." テキスト表示
- UX心理学: ドハティの閾値（0.4秒以内にフィードバック）

**スタイリング要件**:
- ドット: `w-2 h-2 bg-gray-400 rounded-full animate-bounce`
- アニメーション遅延: `0ms`, `150ms`, `300ms`
- 背景: `bg-gray-100`

**テストポイント**:
- アニメーションが滑らかに動作する
- メッセージエリアの左側に配置される

#### 1-4. ChatInput コンポーネントの実装

**ファイル**: `components/ChatInput.tsx`

**実装内容**:
- テキストエリア (複数行対応)
- 送信ボタン (視覚的階層を強調)
- Enterキーで送信 (Shift+Enterで改行)
- 自動フォーカス

**Props**:
```typescript
interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}
```

**スタイリング要件**:
- 送信ボタン: `px-8 py-4 bg-blue-600 text-white font-bold shadow-lg hover:scale-105`
- テキストエリア: `flex-1 resize-none rounded-lg border border-gray-300`
- フォーカス: `focus:ring-2 focus:ring-blue-500`
- 無効状態: `disabled:bg-gray-400 disabled:cursor-not-allowed`

**テストポイント**:
- Enterキーで送信される
- Shift+Enterで改行される
- 空白のみの入力では送信ボタンが無効になる

#### 1-5. ApiKeyModal コンポーネントの実装

**ファイル**: `components/ApiKeyModal.tsx`

**実装内容**:
- APIキー入力欄 (パスワード形式)
- 保存ボタン
- キャンセルボタン (オプション)
- モーダルオーバーレイ

**Props**:
```typescript
interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
  onClose?: () => void;
}
```

**スタイリング要件**:
- オーバーレイ: `fixed inset-0 bg-black bg-opacity-50 z-50`
- モーダル: `bg-white rounded-lg p-6 max-w-md w-full`
- ボタン: `bg-blue-600 text-white font-bold rounded-lg`

**テストポイント**:
- `isOpen=false` の時は表示されない
- APIキーが空の場合、保存ボタンが機能しない
- 保存後、入力欄がクリアされる

**完了条件**:
- ✅ 全コンポーネントがエラーなくビルドできる
- ✅ Storybookまたは単体で表示確認できる
- ✅ レスポンシブデザインが機能する

---

## Phase 2: 状態管理とロジック実装

### 優先度: 🔴 最優先

### 実装タスク

#### 2-1. メインページの状態管理

**ファイル**: `app/page.tsx`

**実装する状態**:
```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [apiKey, setApiKey] = useState<string | null>(null);
const [showApiKeyModal, setShowApiKeyModal] = useState(false);
```

**型定義**:
```typescript
interface Message {
  role: 'user' | 'assistant';
  content: string;
}
```

#### 2-2. localStorage連携の実装

**実装内容**:
- 初回マウント時にAPIキーを読み込み
- APIキーが存在しない場合、モーダルを表示
- APIキー保存時にlocalStorageに書き込み

**コード例**:
```typescript
useEffect(() => {
  const savedKey = localStorage.getItem('gemini_api_key');
  if (savedKey) {
    setApiKey(savedKey);
  } else {
    setShowApiKeyModal(true);
  }
}, []);
```

**テストポイント**:
- 初回アクセス時にモーダルが表示される
- APIキー保存後、リロードしてもモーダルが表示されない
- localStorageにキーが保存されている

#### 2-3. メッセージ送信ロジックの実装

**実装内容**:
```typescript
const handleSendMessage = async () => {
  if (!input.trim() || !apiKey) return;

  // ユーザーメッセージを追加
  const userMessage: Message = { role: 'user', content: input };
  setMessages(prev => [...prev, userMessage]);
  setInput('');
  setIsLoading(true);

  try {
    // Gemini API呼び出し (Phase 3で実装)
    const response = await sendMessageToGemini(apiKey, [...messages, userMessage]);

    // AIレスポンスを追加
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
  } catch (error) {
    console.error('Error:', error);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: 'エラーが発生しました。APIキーを確認してください。'
    }]);
  } finally {
    setIsLoading(false);
  }
};
```

**テストポイント**:
- 送信後、入力欄がクリアされる
- ローディング状態が正しく切り替わる
- エラー時にエラーメッセージが表示される

#### 2-4. 会話リセット機能の実装

**実装内容**:
```typescript
const handleResetChat = () => {
  setMessages([]);
};
```

**追加機能 (オプション)**:
- リセット前に確認ダイアログを表示

**テストポイント**:
- リセットボタンクリックでメッセージが全削除される

#### 2-5. APIキー保存機能の実装

**実装内容**:
```typescript
const handleSaveApiKey = (key: string) => {
  localStorage.setItem('gemini_api_key', key);
  setApiKey(key);
  setShowApiKeyModal(false);
};
```

**テストポイント**:
- APIキー保存後、モーダルが閉じる
- localStorageに正しく保存される

#### 2-6. 自動スクロール機能の実装

**実装内容**:
- メッセージ追加時に最下部へ自動スクロール

**コード例**:
```typescript
const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);
```

**テストポイント**:
- 新しいメッセージが追加されると自動的にスクロールする
- スクロールがスムーズに動作する

**完了条件**:
- ✅ 全ての状態管理が正しく動作する
- ✅ localStorage連携が機能する
- ✅ エラーハンドリングが実装されている

---

## Phase 3: Gemini API統合

### 優先度: 🟠 高

### 実装タスク

#### 3-1. Gemini API関数の実装

**ファイル**: `lib/gemini.ts`

**実装内容**:
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendMessageToGemini(
  apiKey: string,
  messages: Message[]
): Promise<string> {
  try {
    // Gemini SDK初期化
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // 最新のユーザーメッセージを取得
    const lastMessage = messages[messages.length - 1];
    const prompt = lastMessage.content;

    // API呼び出し
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error: any) {
    console.error('Gemini API Error:', error);

    if (error.message?.includes('API_KEY_INVALID')) {
      throw new Error('APIキーが無効です。設定を確認してください。');
    }

    throw new Error('メッセージの送信に失敗しました。');
  }
}
```

**テストポイント**:
- 正しいAPIキーで正常にレスポンスが返る
- 無効なAPIキーでエラーメッセージが返る
- ネットワークエラー時に適切なエラーが返る

#### 3-2. 会話履歴の管理 (オプション拡張)

**実装内容**:
- 現在の実装: 最新のメッセージのみ送信
- 将来の拡張: 会話履歴全体を送信する場合の対応

**会話履歴を含める場合のコード**:
```typescript
// Gemini APIのチャット機能を使用
const chat = model.startChat({
  history: messages.slice(0, -1).map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  })),
});

const result = await chat.sendMessage(lastMessage.content);
const response = await result.response;
const text = response.text();
```

#### 3-3. エラーハンドリングの強化

**実装するエラータイプ**:
- `API_KEY_INVALID`: APIキーが無効
- `QUOTA_EXCEEDED`: クォータ超過
- `NETWORK_ERROR`: ネットワークエラー
- `TIMEOUT`: タイムアウト

**エラーメッセージのカスタマイズ**:
```typescript
if (error.message?.includes('API_KEY_INVALID')) {
  throw new Error('APIキーが無効です。設定を確認してください。');
} else if (error.message?.includes('QUOTA_EXCEEDED')) {
  throw new Error('APIの使用制限に達しました。しばらくしてから再度お試しください。');
} else if (error.message?.includes('NETWORK_ERROR')) {
  throw new Error('ネットワークエラーが発生しました。接続を確認してください。');
} else {
  throw new Error('メッセージの送信に失敗しました。');
}
```

**完了条件**:
- ✅ Gemini APIとの通信が成功する
- ✅ エラーハンドリングが正しく動作する
- ✅ ユーザーにわかりやすいエラーメッセージが表示される

---

## Phase 4: UX最適化とエラーハンドリング

### 優先度: 🟡 中

### 実装タスク

#### 4-1. ローディングUXの最適化

**実装内容**:
- 送信ボタンクリック後、即座にローディング表示
- ドハティの閾値 (0.4秒以内) を意識した実装

**確認項目**:
- ✅ 送信ボタンクリック後、0.1秒以内にローディングが表示される
- ✅ ローディング中は入力欄が無効化される
- ✅ ローディング中は送信ボタンが無効化される

#### 4-2. 入力欄のUX改善

**実装内容**:
- 自動フォーカス (`autoFocus`)
- プレースホルダーテキスト ("メッセージを入力...")
- 文字数制限 (オプション: 最大2000文字)

**追加機能 (オプション)**:
```typescript
const MAX_INPUT_LENGTH = 2000;

<textarea
  value={input}
  onChange={(e) => {
    if (e.target.value.length <= MAX_INPUT_LENGTH) {
      setInput(e.target.value);
    }
  }}
  placeholder={`メッセージを入力... (${input.length}/${MAX_INPUT_LENGTH})`}
/>
```

#### 4-3. レスポンシブデザインの最適化

**実装内容**:
- モバイル: 1カラムレイアウト
- タブレット: 中央寄せ、最大幅制限
- デスクトップ: 最大幅 `max-w-4xl`

**Tailwindクラス例**:
```tsx
<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* コンテンツ */}
</div>
```

**テストポイント**:
- iPhone SE (375px) で表示が崩れない
- iPad (768px) で適切に表示される
- デスクトップ (1920px) で中央寄せされる

#### 4-4. アクセシビリティの向上

**実装内容**:
- ボタンに `aria-label` を追加
- フォームに `role` 属性を追加
- キーボードナビゲーション対応

**コード例**:
```tsx
<button
  onClick={onReset}
  aria-label="会話をリセット"
  title="会話をリセット"
>
  🔄
</button>
```

#### 4-5. パフォーマンス最適化

**実装内容**:
- `React.memo` でコンポーネントを最適化
- 不要な再レンダリングを防ぐ

**コード例**:
```typescript
export default React.memo(ChatMessage);
```

**完了条件**:
- ✅ レスポンシブデザインが全デバイスで機能する
- ✅ アクセシビリティ基準を満たす
- ✅ パフォーマンスが最適化されている

---

## Phase 5: テストと最終調整

### 優先度: 🟡 中

### 実装タスク

#### 5-1. 機能テスト

**テスト項目**:
- [ ] APIキー設定が正しく動作する
- [ ] メッセージ送信が成功する
- [ ] 会話リセットが機能する
- [ ] ローディング表示が正しく動作する
- [ ] エラーハンドリングが正しく動作する
- [ ] localStorage連携が機能する
- [ ] 自動スクロールが動作する

#### 5-2. UIテスト

**テスト項目**:
- [ ] モバイル (375px) で表示が崩れない
- [ ] タブレット (768px) で適切に表示される
- [ ] デスクトップ (1920px) で中央寄せされる
- [ ] ダークモード対応 (オプション)
- [ ] ホバー効果が機能する
- [ ] フォーカス状態が視認できる

#### 5-3. パフォーマンステスト

**テスト項目**:
- [ ] 初期ロードが3秒以内
- [ ] メッセージ送信後、0.4秒以内にフィードバック
- [ ] 100件のメッセージでもスムーズにスクロールする
- [ ] メモリリークがない

#### 5-4. セキュリティチェック

**チェック項目**:
- [ ] APIキーがlocalStorageにのみ保存される
- [ ] APIキーがサーバーに送信されない
- [ ] XSS対策がされている (Reactのデフォルトで対応済み)
- [ ] CSRF対策が不要であることを確認 (静的サイト)

#### 5-5. ドキュメント更新

**更新するファイル**:
- [ ] README.md (セットアップ手順の確認)
- [ ] requirements.md (必要に応じて更新)
- [ ] design.md (実装との差異があれば更新)

**完了条件**:
- ✅ 全機能テストが合格
- ✅ UIテストが合格
- ✅ パフォーマンステストが合格
- ✅ セキュリティチェックが合格
- ✅ ドキュメントが最新の状態

---

## 🚀 デプロイ計画

### Vercelへのデプロイ

#### ステップ1: Vercelアカウント作成
1. https://vercel.com にアクセス
2. GitHubアカウントで連携

#### ステップ2: プロジェクトのインポート
1. Vercelダッシュボードで「New Project」
2. GitHubリポジトリを選択
3. フレームワーク: Next.js (自動検出)
4. ビルド設定: デフォルトのまま

#### ステップ3: 環境変数の設定
- 不要 (APIキーはクライアントサイドで管理)

#### ステップ4: デプロイ実行
- 自動でビルド&デプロイが開始
- デプロイ完了後、URLが発行される

**完了条件**:
- ✅ Vercelで正常にデプロイされる
- ✅ 本番環境で全機能が動作する

---

## 📊 進捗管理

### 実装チェックリスト

#### Phase 0: 環境構築
- [ ] Next.jsプロジェクト作成
- [ ] 依存パッケージインストール
- [ ] ディレクトリ構成準備
- [ ] グローバルスタイル設定

#### Phase 1: UIコンポーネント
- [ ] Header コンポーネント
- [ ] ChatMessage コンポーネント
- [ ] LoadingMessage コンポーネント
- [ ] ChatInput コンポーネント
- [ ] ApiKeyModal コンポーネント

#### Phase 2: 状態管理
- [ ] メインページの状態管理
- [ ] localStorage連携
- [ ] メッセージ送信ロジック
- [ ] 会話リセット機能
- [ ] APIキー保存機能
- [ ] 自動スクロール機能

#### Phase 3: API統合
- [ ] Gemini API関数実装
- [ ] エラーハンドリング強化

#### Phase 4: UX最適化
- [ ] ローディングUX最適化
- [ ] 入力欄UX改善
- [ ] レスポンシブデザイン最適化
- [ ] アクセシビリティ向上
- [ ] パフォーマンス最適化

#### Phase 5: テスト
- [ ] 機能テスト
- [ ] UIテスト
- [ ] パフォーマンステスト
- [ ] セキュリティチェック
- [ ] ドキュメント更新

---

## 🔧 トラブルシューティング

### よくある問題と解決策

#### 問題1: Gemini APIエラー
**症状**: "API_KEY_INVALID" エラー
**解決策**:
- APIキーが正しいか確認
- Google AI Studioで新しいキーを発行
- APIキーに余分なスペースがないか確認

#### 問題2: localStorageエラー
**症状**: APIキーが保存されない
**解決策**:
- ブラウザのプライベートモードでないか確認
- localStorageが有効か確認
- ブラウザのキャッシュをクリア

#### 問題3: ビルドエラー
**症状**: TypeScriptエラーが発生
**解決策**:
```bash
npm run build
```
でエラー内容を確認し、型定義を修正

#### 問題4: スタイルが反映されない
**症状**: Tailwindのクラスが適用されない
**解決策**:
- `tailwind.config.ts` の `content` パスを確認
- `npm run dev` を再起動

---

## 📚 参考資料

### 公式ドキュメント
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Gemini API Documentation](https://ai.google.dev/tutorials/node_quickstart)

### 内部ドキュメント
- [要件定義書](./requirements.md)
- [設計書](./design.md)
- [README](./README.md)

---

## ✅ 完了基準

### 最終チェックリスト

#### 機能面
- ✅ Gemini APIとチャットできる
- ✅ 会話履歴が表示される
- ✅ 会話をリセットできる
- ✅ APIキーを設定・変更できる
- ✅ ローディング表示が機能する
- ✅ エラーメッセージが表示される

#### UX面
- ✅ 送信ボタンが視覚的に強調されている
- ✅ 入力欄に自動フォーカスされる
- ✅ ローディングが0.4秒以内に表示される
- ✅ レスポンシブデザインが機能する
- ✅ メッセージが自動スクロールされる

#### 技術面
- ✅ TypeScriptエラーがない
- ✅ ビルドが成功する
- ✅ パフォーマンスが最適化されている
- ✅ セキュリティ要件を満たす

---

**作成日**: 2025-12-10
**最終更新**: 2025-12-10
**バージョン**: 1.0.0
