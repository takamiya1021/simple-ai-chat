import React from 'react';

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
            disabled:cursor-not-allowed
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
            transition-all hover:scale-105 active:scale-95
          "
        >
          送信
        </button>
      </div>
    </div>
  );
}
