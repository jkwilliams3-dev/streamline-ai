import { useState, useRef, type KeyboardEvent } from 'react';

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <div
      className="flex items-end gap-2 p-3 rounded-xl border"
      style={{
        backgroundColor: '#f1f5f9',
        borderColor: '#334155',
      }}
      onFocus={() => {
        const el = document.querySelector('.chat-input-wrap') as HTMLDivElement;
        if (el) {
          el.style.borderColor = '#6366f1';
          el.style.boxShadow = '0 0 0 1px rgba(99,102,241,0.3)';
        }
      }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        disabled={disabled}
        rows={1}
        placeholder="Ask about your data..."
        aria-label="Chat message input"
        className="flex-1 bg-transparent text-sm resize-none outline-none placeholder-slate-600"
        style={{
          color: '#e2e8f0',
          minHeight: '24px',
          maxHeight: '120px',
          lineHeight: '1.5',
        }}
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        aria-label="Send message"
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
        style={{
          backgroundColor: value.trim() && !disabled ? '#4f46e5' : 'rgba(99,102,241,0.15)',
          cursor: value.trim() && !disabled ? 'pointer' : 'not-allowed',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={value.trim() && !disabled ? 'white' : '#6366f1'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
}
