import type { TMessageProps } from '../types';
import { Check, X, Minus, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

/** 格式化时间戳为 HH:MM */
function formatTime(ts: number): string {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** AI 回答的图标和颜色 */
function getAnswerStyle(content: string) {
  const trimmed = content.trim();
  if (trimmed === '是') return { icon: <Check size={16} />, color: 'text-green-400' };
  if (trimmed === '否') return { icon: <X size={16} />, color: 'text-red-400' };
  if (trimmed === '无关') return { icon: <Minus size={16} />, color: 'text-slate-400' };
  return { icon: <AlertCircle size={16} />, color: 'text-red-400' };
}

/** 单条消息气泡 */
export default function Message({ message }: TMessageProps) {
  const isUser = message.role === 'user';
  const isError = message.role === 'assistant' && message.content.trim() === 'error';

  if (isUser) {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-[75%]">
          <div className="bg-blue-900/60 text-white px-4 py-2.5 rounded-lg rounded-br-sm shadow-lg">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
          <p className="text-xs text-slate-500 text-right mt-1">{formatTime(message.timestamp)}</p>
        </div>
      </div>
    );
  }

  const style = getAnswerStyle(message.content);

  return (
    <div className="flex justify-start mb-3">
      <div className="max-w-[75%]">
        <div
          className={clsx(
            'px-4 py-2.5 rounded-lg rounded-bl-sm shadow-lg',
            isError ? 'bg-red-900/30 border border-red-500/40' : 'bg-slate-700/60'
          )}
        >
          {isError ? (
            <p className="text-sm text-red-400 flex items-center gap-1.5">
              <AlertCircle size={16} />
              请求失败，请稍后重试
            </p>
          ) : (
            <p className={clsx('text-sm font-medium flex items-center gap-1.5', style.color)}>
              {style.icon}
              {message.content}
            </p>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1">{formatTime(message.timestamp)}</p>
      </div>
    </div>
  );
}
