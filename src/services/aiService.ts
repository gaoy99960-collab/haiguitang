import type { TMessage, TStory, TAIAnswer } from '../types';

/** 从环境变量读取，勿在代码中硬编码密钥 */
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY;
const AI_BASE_URL =
  import.meta.env.VITE_AI_BASE_URL ?? 'https://api.deepseek.com/v1';
const AI_MODEL = import.meta.env.VITE_AI_MODEL ?? 'deepseek-chat';

const SYSTEM_PROMPT = (surface: string, bottom: string) => `
你是一个海龟汤推理游戏的主持人。

【当前故事汤面】
${surface}

【故事汤底（真相）】
${bottom}

【规则】
玩家会向你提问，你只能且必须从以下三个回答中选择一个：
- "是"：玩家的问题或推测与汤底内容相符
- "否"：玩家的问题或推测与汤底内容矛盾
- "无关"：玩家的问题与推断汤底无关，或无法从汤底判断

【严格限制】
1. 你的回答只能是"是"、"否"、"无关"三个字之一，不能有任何其他内容
2. 不能给出任何提示、解释或额外信息
3. 严格根据汤底判断，不要自行推理扩展
4. 保持神秘感，绝对不能透露汤底内容

只输出：是 / 否 / 无关
`.trim();

const VALID_AI_ANSWERS: TAIAnswer[] = ['是', '否', '无关'];

/** 防抖标志 */
let isRequesting = false;

/**
 * 解析 AI 回答，提取有效的 TAIAnswer
 */
function parseAnswer(raw: string): TAIAnswer {
  const trimmed = raw.trim();
  for (const answer of VALID_AI_ANSWERS) {
    if (trimmed.includes(answer)) {
      return answer;
    }
  }
  return 'error';
}

/**
 * 向 AI 主持人提问，返回"是"/"否"/"无关"/"error"
 */
export async function askAI(
  question: string,
  story: TStory,
  history: TMessage[]
): Promise<TAIAnswer> {
  if (isRequesting) {
    return 'error';
  }

  if (!AI_API_KEY) {
    console.error('Missing VITE_AI_API_KEY');
    return 'error';
  }

  isRequesting = true;

  try {
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT(story.surface, story.bottom) },
      ...history
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: question },
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages,
        max_tokens: 10,
        temperature: 0,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errBody = await response.json().catch(() => null);
      const errMsg = errBody?.error?.message || `HTTP ${response.status}`;
      console.error('[aiService] API error:', errMsg);
      if (response.status === 402) {
        console.error('[aiService] API 余额不足，请充值或更换 API Key');
      }
      return 'error';
    }

    const data = await response.json();
    const raw: string = data.choices?.[0]?.message?.content ?? '';
    return parseAnswer(raw);
  } catch (e) {
    console.error('[aiService] Request failed:', e);
    return 'error';
  } finally {
    isRequesting = false;
  }
}
