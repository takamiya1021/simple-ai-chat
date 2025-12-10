'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import ChatMessage from '@/components/ChatMessage';
import LoadingMessage from '@/components/LoadingMessage';
import ChatInput from '@/components/ChatInput';
import ApiKeyModal from '@/components/ApiKeyModal';
import { sendMessageToGemini } from '@/lib/gemini';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // localStorage からAPIキー読み込み
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setShowApiKeyModal(true);
    }
  }, []);

  // 自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // メッセージ送信処理
  const handleSendMessage = async () => {
    if (!input.trim() || !apiKey) return;

    // ユーザーメッセージを追加
    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Gemini API呼び出し
      const response = await sendMessageToGemini(apiKey, [...messages, userMessage]);

      // AIレスポンスを追加
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error:', error);
      // エラーメッセージを追加
      const errorMessage = error instanceof Error ? error.message : 'エラーが発生しました。APIキーを確認してください。';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 会話リセット
  const handleResetChat = () => {
    if (messages.length > 0) {
      if (confirm('会話をリセットしますか?')) {
        setMessages([]);
      }
    }
  };

  // APIキー保存
  const handleSaveApiKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
    setShowApiKeyModal(false);
  };

  // 設定を開く
  const handleOpenSettings = () => {
    setShowApiKeyModal(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* APIキー設定モーダル */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onSave={handleSaveApiKey}
        onClose={apiKey ? () => setShowApiKeyModal(false) : undefined}
      />

      {/* ヘッダー */}
      <Header onReset={handleResetChat} onOpenSettings={handleOpenSettings} />

      {/* チャットエリア */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p className="text-lg mb-2">👋 こんにちは！</p>
                <p className="text-sm">メッセージを入力して会話を始めましょう</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                />
              ))}
            </>
          )}
          {isLoading && <LoadingMessage />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 入力エリア */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSendMessage}
        disabled={isLoading || !apiKey}
      />
    </div>
  );
}
