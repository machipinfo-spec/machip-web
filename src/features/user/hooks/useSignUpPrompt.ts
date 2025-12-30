"use client";

import { useState, useCallback } from "react";

/**
 * ゲストユーザーにサインアップを促すダイアログの状態管理フック
 */
export const useSignUpPrompt = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    openDialog,
    closeDialog,
  };
};
