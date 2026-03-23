import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TStory, TDifficulty } from '../types';
import { STORIES } from '../data/stories';
import GameCard from '../components/GameCard';
import clsx from 'clsx';

/** 是否已配置 AI Key（未配置时仍可浏览题库，但无法对局） */
const HAS_AI_API_KEY = Boolean(import.meta.env.VITE_AI_API_KEY?.trim());

const TABS: { label: string; value: TDifficulty | 'all' }[] = [
  { label: '全部', value: 'all' },
  { label: '简单', value: 'easy' },
  { label: '中等', value: 'medium' },
  { label: '困难', value: 'hard' },
];

/** 游戏大厅页面 */
export default function Home() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<TDifficulty | 'all'>('all');

  const filtered = filter === 'all' ? STORIES : STORIES.filter((s) => s.difficulty === filter);

  function handleSelect(story: TStory) {
    navigate(`/game/${story.id}`);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="pt-10 md:pt-12 pb-6 md:pb-8 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
          <span className="text-amber-400">AI</span> 海龟汤
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          向 AI 主持人提问，推理出隐藏的真相
        </p>
      </header>

      {/* 未配置 API Key 时提示（密钥仅放在 .env，勿提交） */}
      {!HAS_AI_API_KEY && (
        <div
          className="mx-4 mb-6 max-w-2xl md:mx-auto rounded-lg border border-amber-500/40 bg-slate-800/80 shadow-lg px-4 py-3 text-sm text-amber-200/90 text-center"
          role="status"
        >
          尚未配置 <code className="text-amber-400">VITE_AI_API_KEY</code>
          。请复制 <code className="text-slate-400">.env.example</code> 为{' '}
          <code className="text-slate-400">.env</code> 后填入密钥，再重启{' '}
          <code className="text-slate-400">npm run dev</code>。
        </div>
      )}

      {/* 难度筛选 */}
      <div className="flex flex-wrap justify-center gap-2 px-4 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={clsx(
              'px-4 py-1.5 rounded-lg text-sm transition-colors shadow-lg',
              filter === tab.value
                ? 'bg-amber-500 text-slate-900 font-semibold'
                : 'border border-slate-600 text-slate-400 hover:border-amber-500 hover:text-amber-400'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 卡片网格 */}
      <main className="flex-1 px-4 pb-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((story) => (
            <GameCard key={story.id} story={story} onSelect={handleSelect} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-600">
        AI 海龟汤 &copy; {new Date().getFullYear()} — 一款 AI 驱动的推理游戏
      </footer>
    </div>
  );
}
