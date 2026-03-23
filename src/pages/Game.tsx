import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import type { TMessage } from '../types';
import { STORIES } from '../data/stories';
import { askAI } from '../services/aiService';
import Message from '../components/Message';
import ChatBox from '../components/ChatBox';

/** 游戏页面 */
export default function Game() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const story = STORIES.find((s) => s.id === id);

  const [messages, setMessages] = useState<TMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [surfaceExpanded, setSurfaceExpanded] = useState(true);
  const [showConfirm, setShowConfirm] = useState<'reveal' | 'quit' | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  /** 自动滚动到底部 */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /** 发送消息 */
  const handleSend = useCallback(
    async (text: string) => {
      if (!story || isLoading) return;

      const userMsg: TMessage = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        content: text,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setQuestionCount((c) => c + 1);
      setIsLoading(true);

      try {
        const answer = await askAI(text, story, messages);
        const aiMsg: TMessage = {
          id: `msg-${Date.now()}-ai`,
          role: 'assistant',
          content: answer,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch {
        const errMsg: TMessage = {
          id: `msg-${Date.now()}-err`,
          role: 'assistant',
          content: 'error',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [story, isLoading, messages]
  );

  /** 揭晓汤底 */
  function handleReveal() {
    setIsRevealed(true);
    setShowConfirm(null);
    navigate('/result', { state: { story, messages } });
  }

  /** 结束游戏 */
  function handleQuit() {
    setShowConfirm(null);
    navigate('/');
  }

  if (!story) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="h-dvh min-h-0 bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] border-b border-slate-700 bg-slate-900">
        <button onClick={() => setShowConfirm('quit')} className="text-slate-400 hover:text-slate-200">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h2 className="text-sm font-semibold text-slate-100">{story.title}</h2>
          <p className="text-xs text-slate-500">已提问 {questionCount} 次</p>
        </div>
        <button
          onClick={() => setShowConfirm('reveal')}
          className="text-amber-400 hover:text-amber-300 text-xs flex items-center gap-1"
        >
          <Eye size={16} />
          查看汤底
        </button>
      </header>

      {/* 汤面展示 */}
      <div className="shrink-0 border-b border-slate-700">
        <button
          onClick={() => setSurfaceExpanded(!surfaceExpanded)}
          className="w-full flex items-center justify-between px-4 py-2 text-xs text-amber-400 hover:bg-slate-800/50"
        >
          <span>汤面</span>
          {surfaceExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {surfaceExpanded && (
          <div className="px-4 pb-3">
            <p className="text-sm text-slate-300 leading-relaxed">{story.surface}</p>
          </div>
        )}
      </div>

      {/* 聊天区域 */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="text-center text-slate-500 text-sm mt-8">
            开始向 AI 主持人提问吧！只会回答"是"、"否"或"无关"
          </p>
        )}
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* 输入框 */}
      <ChatBox onSend={handleSend} disabled={isRevealed} loading={isLoading} />

      {/* 确认弹窗 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-slate-100 font-semibold mb-2">
              {showConfirm === 'reveal' ? '确定查看汤底？' : '确定结束游戏？'}
            </h3>
            <p className="text-sm text-slate-400 mb-5">
              {showConfirm === 'reveal'
                ? '查看后将揭晓答案，本局游戏结束。'
                : '退出后本局进度将不会保存。'}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(null)}
                className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:border-amber-500 hover:text-amber-400 transition-colors text-sm"
              >
                取消
              </button>
              <button
                onClick={showConfirm === 'reveal' ? handleReveal : handleQuit}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold transition-colors text-sm"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
