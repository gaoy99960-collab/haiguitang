/** 难度枚举 */
export type TDifficulty = 'easy' | 'medium' | 'hard';

/** 海龟汤故事 */
export interface TStory {
  id: string;
  title: string;
  difficulty: TDifficulty;
  surface: string;
  bottom: string;
  tags: string[];
}

/** 对话消息 */
export interface TMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

/** 游戏状态 */
export type TGameStatus = 'idle' | 'playing' | 'revealed' | 'ended';

/** AI 回答类型 */
export type TAIAnswer = '是' | '否' | '无关' | 'error';

/** 路由 state：结果页 */
export type TResultLocationState = {
  story: TStory;
  messages: TMessage[];
};

/** 游戏卡片 */
export type TGameCardProps = {
  story: TStory;
  onSelect: (story: TStory) => void;
};

/** 聊天输入区 */
export type TChatBoxProps = {
  onSend: (text: string) => void;
  disabled: boolean;
  loading: boolean;
};

/** 单条消息 */
export type TMessageProps = {
  message: TMessage;
};

/** 汤底揭晓 */
export type TStoryRevealProps = {
  story: TStory;
  messages: TMessage[];
};
