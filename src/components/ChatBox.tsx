import { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import type { TChatBoxProps } from '../types';

const MAX_MESSAGE_LENGTH = 200;

/** 聊天输入框 + 发送按钮 */
export default function ChatBox({ onSend, disabled, loading }: TChatBoxProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = text.trim().length > 0 && !disabled && !loading;

  function handleSend() {
    if (!canSend) return;
    onSend(text.trim());
    setText('');
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleChange(value: string) {
    if (value.length <= MAX_MESSAGE_LENGTH) {
      setText(value);
    }
  }

  return (
    <div className="border-t border-slate-700 bg-slate-900 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shrink-0">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的问题..."
            rows={2}
            disabled={disabled}
            className={clsx(
              'w-full resize-none rounded-lg px-3 py-2 text-sm',
              'bg-slate-800 text-slate-100 placeholder-slate-500',
              'border border-slate-700 outline-none transition-colors',
              'focus:border-amber-500',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          />
          <span className="absolute bottom-1.5 right-2 text-xs text-slate-500">
            {text.length}/{MAX_MESSAGE_LENGTH}
          </span>
        </div>
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={clsx(
            'shrink-0 p-2.5 rounded-lg transition-colors',
            canSend
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-900'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          )}
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
}
