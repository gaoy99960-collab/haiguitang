import { useState, useCallback } from 'react';
import type { TGameStatus, TStory } from '../types';
import { STORIES } from '../data/stories';

/** 游戏状态管理 Hook */
export function useGame() {
  const [currentStory, setCurrentStory] = useState<TStory | null>(null);
  const [status, setStatus] = useState<TGameStatus>('idle');

  const startGame = useCallback((storyId: string) => {
    const story = STORIES.find((s) => s.id === storyId);
    if (story) {
      setCurrentStory(story);
      setStatus('playing');
    }
  }, []);

  const revealAnswer = useCallback(() => {
    setStatus('revealed');
  }, []);

  const endGame = useCallback(() => {
    setCurrentStory(null);
    setStatus('ended');
  }, []);

  const reset = useCallback(() => {
    setCurrentStory(null);
    setStatus('idle');
  }, []);

  return { currentStory, status, startGame, revealAnswer, endGame, reset };
}
