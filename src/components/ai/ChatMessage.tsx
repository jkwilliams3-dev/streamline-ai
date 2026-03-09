import type { Message } from '../../store/useAppStore';

interface Props {
  message: Message;
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div style={{ maxWidth: '80%' }}>
          <div
            className="px-4 py-3 rounded-2xl rounded-br-sm text-sm text-white"
            style={{ backgroundColor: '#4f46e5' }}
          >
            {message.content}
          </div>
          <p className="text-right mt-1 text-xs" style={{ color: '#64748b' }}>
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mb-4">
      {/* AI avatar */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
      >
        AI
      </div>
      <div style={{ maxWidth: '85%' }}>
        <div
          className="px-4 py-3 rounded-2xl rounded-bl-sm text-sm"
          style={{
            backgroundColor: '#f1f5f9',
            color: '#cbd5e1',
            lineHeight: 1.6,
          }}
        >
          {message.content}
          {message.isStreaming && (
            <span className="streaming-cursor" aria-hidden="true" />
          )}
        </div>
        <p className="mt-1 text-xs" style={{ color: '#64748b' }}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
