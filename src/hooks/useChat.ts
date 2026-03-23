import { useState, useCallback } from 'react';
import type { TMessage } from '../types';

/** 对话历史管理 Hook */
export function useChat() {
  const [messages, setMessages] = useState<TMessage[]>([]);

  const addMessage = useCallback((role: TMessage['role'], content: string) => {
    const msg: TMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role,
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, addMessage, clearMessages };
}
