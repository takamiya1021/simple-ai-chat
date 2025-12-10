# Simple AI Chat App - 設計書

## 1. コンポーネント設計

### 1-1. コンポーネント構成図
```
page.tsx (メインページ)
├── ApiKeyModal.tsx (APIキー設定)
├── Header.tsx (ヘッダー + リセットボタン)
├── ChatArea.tsx (チャット表示エリア)
│   ├── ChatMessage.tsx (個別メッセージ)
│   └── LoadingMessage.tsx (ローディング表示)
└── ChatInput.tsx (入力欄 + 送信ボタン)
```

### 1-2. データフロー
```
[User Input] 
    ↓
[ChatInput] → [page.tsx (状態管理)]
    ↓
[Gemini API Call via SDK]
    ↓ (ローディング表示)
[Response] → [ChatArea] → [ChatMessage]
```

---

## 2. 詳細設計

### 2-1. page.tsx (メインロジック)

```typescript
'use client';

import { useState, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  // 状態管理
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // localStorage からAPIキー読み込み
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setShowApiKeyModal(true);
    }
  }, []);

  // メッセージ送信処理
  const handleSendMessage = async () => {
    if (!input.trim() || !apiKey) return;
    
    // ユーザーメッセージを追加
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Gemini API呼び出し
      const response = await sendMessageToGemini(apiKey, [...messages, userMessage]);
      
      // AIレスポンスを追加
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error:', error);
      // エラーメッセージを追加
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'エラーが発生しました。APIキーを確認してください。' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 会話リセット
  const handleResetChat = () => {
    setMessages([]);
  };

  // APIキー保存
  const handleSaveApiKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
    setShowApiKeyModal(false);
  };

  return (
    // JSX実装
  );
}
```

---

### 2-2. ChatMessage.tsx

```typescript
interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`
          max-w-[70%] rounded-lg px-4 py-3
          ${isUser 
            ? 'bg-blue-100 text-gray-900' 
            : 'bg-gray-100 text-gray-900'
          }
        `}
      >
        <div className="whitespace-pre-wrap break-words">
          {content}
        </div>
      </div>
    </div>
  );
}
```

---

### 2-3. ChatInput.tsx

```typescript
interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}

export default function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  disabled 
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
      <div className="max-w-4xl mx-auto flex gap-3">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="メッセージを入力..."
          disabled={disabled}
          autoFocus
          className="
            flex-1 resize-none rounded-lg border border-gray-300 
            px-4 py-3 focus:outline-none focus:ring-2 
            focus:ring-blue-500 disabled:bg-gray-100
          "
          rows={3}
        />
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="
            px-8 py-4 bg-blue-600 text-white font-bold 
            rounded-lg shadow-lg hover:bg-blue-700 
            disabled:bg-gray-400 disabled:cursor-not-allowed
            transition-all hover:scale-105
          "
        >
          送信
        </button>
      </div>
    </div>
  );
}
```

---

### 2-4. LoadingMessage.tsx

```typescript
export default function LoadingMessage() {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[70%] rounded-lg px-4 py-3 bg-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
          <span className="text-gray-600 text-sm">考え中...</span>
        </div>
      </div>
    </div>
  );
}
```

---

### 2-5. ApiKeyModal.tsx

```typescript
interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
  onClose?: () => void;
}

export default function ApiKeyModal({ isOpen, onSave, onClose }: ApiKeyModalProps) {
  const [key, setKey] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (key.trim()) {
      onSave(key.trim());
      setKey('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Gemini APIキーを設定</h2>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="APIキーを入力..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
          >
            保存
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              キャンセル
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

### 2-6. Header.tsx

```typescript
interface HeaderProps {
  onReset: () => void;
  onOpenSettings: () => void;
}

export default function Header({ onReset, onOpenSettings }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">AI Chat</h1>
        <div className="flex gap-2">
          <button
            onClick={onOpenSettings}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            title="設定"
          >
            ⚙️
          </button>
          <button
            onClick={onReset}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            title="会話をリセット"
          >
            🔄
          </button>
        </div>
      </div>
    </header>
  );
}
```

---

## 3. Gemini API統合設計

### 3-1. lib/gemini.ts

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

    // 会話履歴を整形（最新のユーザーメッセージのみ送信）
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

---

## 4. スタイリング設計

### 4-1. カラーパレット
```css
Primary (送信ボタン): bg-blue-600 hover:bg-blue-700
Secondary (背景): bg-gray-50
User Message: bg-blue-100
Assistant Message: bg-gray-100
Border: border-gray-200
Text: text-gray-900
```

### 4-2. レイアウト設計
```css
/* globals.css */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#__next {
  height: 100%;
}

/* メインレイアウト */
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* チャットエリア */
.chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: bg-gray-50;
}
```

---

## 5. UX心理学適用マップ

| 画面要素 | 適用効果 | 実装詳細 |
|---------|---------|---------|
| 送信ボタン | 視覚的階層 | `py-4 px-8 bg-blue-600 font-bold shadow-lg hover:scale-105` |
| ローディング | ドハティの閾値 | `LoadingMessage`コンポーネント、即座に表示 |
| 入力欄 | 認知負荷軽減 | `autoFocus` 属性、シンプルなUI |
| リセットボタン | 視覚的階層（副） | 右上、小さく配置、アイコンのみ |
| モーダル | 美的ユーザビリティ | 中央配置、オーバーレイ、余白十分 |

---

## 6. パフォーマンス最適化

### 6-1. レスポンス速度
- 送信ボタンクリック → 即座に `setIsLoading(true)`
- ローディング表示 → 0.1秒以内に表示開始
- 自動スクロール → 新メッセージ追加時に最下部へ

### 6-2. エラーハンドリング
```typescript
try {
  // API呼び出し
} catch (error) {
  // エラーメッセージをチャットに表示
  setMessages(prev => [...prev, {
    role: 'assistant',
    content: 'エラーが発生しました。APIキーを確認してください。'
  }]);
}
```

---

## 7. 実装チェックリスト

- [ ] Next.js プロジェクト作成
- [ ] Gemini SDK インストール
- [ ] 各コンポーネント実装
- [ ] Gemini API統合
- [ ] localStorage連携
- [ ] ローディング表示
- [ ] エラーハンドリング
- [ ] レスポンシブ対応
- [ ] 動作確認

---

## 参考資料

- [Gemini API Documentation](https://ai.google.dev/tutorials/node_quickstart)
- UX心理学に基づくUI設計ガイド（要件定義書参照）
