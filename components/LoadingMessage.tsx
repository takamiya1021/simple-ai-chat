export default function LoadingMessage() {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[70%] rounded-lg px-4 py-3 bg-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            ></span>
            <span
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            ></span>
            <span
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            ></span>
          </div>
          <span className="text-gray-600 text-sm">考え中...</span>
        </div>
      </div>
    </div>
  );
}
