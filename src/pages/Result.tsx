import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Home, RotateCcw } from 'lucide-react';
import type { TResultLocationState } from '../types';
import StoryReveal from '../components/StoryReveal';
import Message from '../components/Message';

/** 汤底揭晓 / 结果页 */
export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as TResultLocationState | null;

  if (!state?.story) {
    return <Navigate to="/" replace />;
  }

  const { story, messages } = state;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* 标题 */}
        <h1 className="text-2xl font-bold text-center mb-6">
          <span className="text-amber-400">{story.title}</span> — 真相揭晓
        </h1>

        {/* 揭晓组件 */}
        <StoryReveal story={story} messages={messages} />

        {/* 推理历程 */}
        {messages.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg p-5 mb-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">推理历程</h3>
            <div>
              {messages.map((msg) => (
                <Message key={msg.id} message={msg} />
              ))}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:border-amber-500 hover:text-amber-400 transition-colors text-sm"
          >
            <Home size={16} />
            回到大厅
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold transition-colors text-sm"
          >
            <RotateCcw size={16} />
            再来一局
          </button>
        </div>
      </div>
    </div>
  );
}
