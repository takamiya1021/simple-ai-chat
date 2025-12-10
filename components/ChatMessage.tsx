import React from 'react';

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
