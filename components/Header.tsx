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
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            title="設定"
            aria-label="APIキー設定を開く"
          >
            ⚙️
          </button>
          <button
            onClick={onReset}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            title="会話をリセット"
            aria-label="会話をリセット"
          >
            🔄
          </button>
        </div>
      </div>
    </header>
  );
}
