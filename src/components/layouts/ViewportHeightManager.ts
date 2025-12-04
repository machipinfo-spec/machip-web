"use client";

import { useEffect } from "react";

/**
 * クライアントサイドでのみビューポート高さを管理するコンポーネント
 * SSRハイドレーションエラーを回避
 */
export const ViewportHeightManager: React.FC = () => {
  useEffect(() => {
    function setVH() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    // 初期設定
    setVH();

    // リサイズ時の処理（デバウンス付き）
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setVH, 100);
    };

    window.addEventListener("resize", handleResize);

    // Visual Viewport API対応
    let visualViewportCleanup: (() => void) | undefined;

    if (window.visualViewport) {
      const handleViewportChange = () => {
        // キーボードが閉じられた時のみ更新
        if (window.visualViewport!.height >= window.innerHeight * 0.75) {
          setVH();
        }
      };

      window.visualViewport.addEventListener("resize", handleViewportChange);

      visualViewportCleanup = () => {
        window.visualViewport!.removeEventListener(
          "resize",
          handleViewportChange
        );
      };
    }

    // クリーンアップ
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
      if (visualViewportCleanup) {
        visualViewportCleanup();
      }
    };
  }, []);

  // このコンポーネントは何もレンダリングしない
  return null;
};
