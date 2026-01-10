"use client";

import { useState } from "react";
import { Thread } from "../types/Thread";

export const useThread = (
  initialThread: Thread | null = null,
  initialChildThreads: Thread[] = []
) => {
  const [thread, setThread] = useState(initialThread);
  const [childThreads, setChildThreads] = useState(initialChildThreads);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createThread = async (threadName: string, imageUrl: string | null) => {
    try {
      const res = await fetch("/api/timeline/thread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadName, imageUrl }),
      });

      if (!res.ok) throw new Error("failed");

      const newThread = await res.json();
      return newThread;
    } catch (err) {
      setError("投稿に失敗しました");
      throw err;
    }
  };

  const submitReply = async (
    parentThreadId: string,
    threadName: string,
    imageUrl: string | null
  ) => {
    try {
      const res = await fetch("/api/timeline/thread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentThreadId, threadName, imageUrl }),
      });

      if (!res.ok) throw new Error("failed");

      const newThread = await res.json();

      // 現在表示中のメインスレッドへの直接の返信の場合
      if (thread && parentThreadId === thread.threadId) {
        // 末尾に追加
        setChildThreads((prev) => [...prev, newThread]);

        // メインスレッドの返信数を更新
        setThread({
          ...thread,
          childThreadCount: thread.childThreadCount + 1,
        });
      }
      // 子スレッドへの返信の場合
      else {
        setChildThreads((prev) =>
          prev.map((t) =>
            t.threadId === parentThreadId
              ? { ...t, childThreadCount: t.childThreadCount + 1 }
              : t
          )
        );
      }
      return newThread;
    } catch (err) {
      setError("返信に失敗しました");
      throw err;
    }
  };

  // APIを呼ばずにローカルステートのみ更新する（ThreadCard等で別途APIが呼ばれた場合用）
  const removeLocalThread = (threadId: string) => {
    // 削除対象が現在のリスト（メインスレッドへの直接の返信）に含まれているか確認
    const isDirectReply = childThreads.some((t) => t.threadId === threadId);

    setChildThreads((prev) => prev.filter((t) => t.threadId !== threadId));

    if (thread?.threadId === threadId) {
      setThread(null);
    } else if (thread && isDirectReply) {
      // メインスレッドへの返信が削除された場合、カウントを減らす
      setThread({
        ...thread,
        childThreadCount: Math.max(0, thread.childThreadCount - 1),
      });
    }
  };

  const deleteThread = async (threadId: string) => {
    try {
      const res = await fetch(`/api/timeline/thread?threadId=${threadId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("failed");

      removeLocalThread(threadId);
    } catch {
      setError("削除に失敗しました");
    }
  };

  const fetchThreadsByDate = async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true);
      const startDateStr = startDate.toISOString().split("T")[0];
      const endDateStr = endDate.toISOString().split("T")[0];

      const res = await fetch(
        `/api/timeline/query?startDate=${startDateStr}&endDate=${endDateStr}&limit=20`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error(`データ取得に失敗しました (${res.status})`);

      const data = await res.json();
      return data.threads || [];
    } catch {
      setError("タイムラインの取得に失敗しました");
      throw new Error("Failed to fetch threads");
    } finally {
      setLoading(false);
    }
  };

  return {
    thread,
    childThreads,
    loading,
    error,
    createThread,
    submitReply,
    deleteThread,
    removeLocalThread,
    fetchThreadsByDate,
  };
};
