import { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getAIResponse, conversationStarters } from '../../data/aiResponses';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export default function ChatPanel() {
  const {
    isChatOpen,
    toggleChat,
    messages,
    isAIThinking,
    addMessage,
    updateLastMessage,
    setAIThinking,
    clearMessages,
  } = useAppStore();

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAIThinking]);

  const handleSend = async (text: string) => {
    const userMsg = {
      id: `msg-${Date.now()}-user`,
      role: 'user' as const,
      content: text,
      timestamp: new Date(),
    };
    addMessage(userMsg);
    setAIThinking(true);

    // 800ms thinking delay
    await new Promise((r) => setTimeout(r, 800));
    setAIThinking(false);

    const responseText = getAIResponse(text);
    const assistantMsg = {
      id: `msg-${Date.now()}-ai`,
      role: 'assistant' as const,
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };
    addMessage(assistantMsg);

    // Stream word by word
    const words = responseText.split(' ');
    let current = '';
    for (const word of words) {
      await new Promise((r) => setTimeout(r, 60));
      current += (current ? ' ' : '') + word;
      updateLastMessage(current);
    }

    // Mark streaming done
    updateLastMessage(current);
    // Clear streaming flag
    useAppStore.setState((state) => {
      const msgs = [...state.messages];
      const last = { ...msgs[msgs.length - 1] };
      last.isStreaming = false;
      msgs[msgs.length - 1] = last;
      return { messages: msgs };
    });
  };

  if (!isChatOpen) return null;

  return (
    <div
      className="flex flex-col border-l border-gray-200"
      style={{
        width: '360px',
        flexShrink: 0,
        backgroundColor: '#f8fafc',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b border-gray-200"
        style={{ flexShrink: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">AI Assistant</span>
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#6366f1' }}
              title="Online"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="text-xs text-gray-500 hover:text-slate-300 transition-colors px-2 py-1 rounded"
              title="Clear conversation"
            >
              Clear
            </button>
          )}
          <button
            onClick={toggleChat}
            className="text-gray-500 hover:text-gray-500 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close AI panel"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div>
            {/* Welcome */}
            <div className="text-center mb-6 mt-2">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-gray-900 font-bold text-base mx-auto mb-3"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                AI
              </div>
              <h4 className="text-gray-900 font-semibold mb-1">StreamlineAI Assistant</h4>
              <p className="text-gray-500 text-sm">Ask me anything about your dashboard data.</p>
            </div>

            {/* Conversation starters */}
            <div className="space-y-2">
              {conversationStarters.map((starter) => (
                <button
                  key={starter}
                  onClick={() => handleSend(starter)}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200"
                  style={{
                    backgroundColor: 'rgba(99,102,241,0.08)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    color: '#a5b4fc',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(99,102,241,0.15)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(99,102,241,0.08)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.2)';
                  }}
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isAIThinking && (
          <div className="flex gap-3 mb-4">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-gray-900 flex-shrink-0 mt-0.5"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              AI
            </div>
            <div
              className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5"
              style={{ backgroundColor: '#1e293b' }}
            >
              <span className="typing-dot w-2 h-2 rounded-full bg-indigo-400" />
              <span className="typing-dot w-2 h-2 rounded-full bg-indigo-400" />
              <span className="typing-dot w-2 h-2 rounded-full bg-indigo-400" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Footer input */}
      <div className="p-4 border-t border-gray-200" style={{ flexShrink: 0 }}>
        <ChatInput onSend={handleSend} disabled={isAIThinking} />
        <p className="text-center text-xs text-slate-600 mt-2">
          Powered by StreamlineAI • Shift+Enter for newline
        </p>
      </div>
    </div>
  );
}
