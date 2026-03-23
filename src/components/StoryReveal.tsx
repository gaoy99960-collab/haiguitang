import type { TStoryRevealProps } from '../types';

/** 汤底揭晓动画组件 */
export default function StoryReveal({ story, messages }: TStoryRevealProps) {
  const questionCount = messages.filter((m) => m.role === 'user').length;

  return (
    <div className="animate-reveal">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-amber-400 font-semibold text-lg mb-1">汤底揭晓</h3>
        <p className="text-xs text-slate-500 mb-4">你一共提出了 {questionCount} 个问题</p>
        <p className="text-slate-200 leading-relaxed text-sm">{story.bottom}</p>
      </div>
    </div>
  );
}
