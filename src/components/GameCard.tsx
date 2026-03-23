import type { TGameCardProps } from '../types';
import clsx from 'clsx';

/** 难度标签颜色映射 */
const DIFFICULTY_CONFIG = {
  easy: { label: '简单', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  medium: { label: '中等', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  hard: { label: '困难', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
} as const;

/** 游戏大厅中的故事卡片 */
export default function GameCard({ story, onSelect }: TGameCardProps) {
  const diff = DIFFICULTY_CONFIG[story.difficulty];
  const preview = story.surface.length > 60 ? story.surface.slice(0, 60) + '...' : story.surface;

  return (
    <button
      onClick={() => onSelect(story)}
      className={clsx(
        'w-full text-left p-5 rounded-lg border shadow-lg transition-all duration-300 cursor-pointer',
        'bg-slate-800 border-slate-700 hover:border-amber-500/60',
        'hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/20'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-100">{story.title}</h3>
        <span className={clsx('text-xs px-2 py-0.5 rounded border', diff.color)}>
          {diff.label}
        </span>
      </div>

      <p className="text-sm text-slate-400 mb-3 leading-relaxed">{preview}</p>

      <div className="flex flex-wrap gap-1.5">
        {story.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded bg-slate-700/60 text-slate-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
