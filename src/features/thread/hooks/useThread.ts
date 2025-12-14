"use client";

import { useState } from "react";
import { Thread } from "../types/Thread";

export const useThread = (
  initialThread: Thread | null,
  initialChildThreads: Thread[]
) => {
  const [thread, setThread] = useState(initialThread);
  const [childThreads, setChildThreads] = useState(initialChildThreads);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReply = async (
    parentThreadId: string,
    threadName: string,
    imageBase64: string | null
  ) => {
    console.log("Submitting reply to thread:", parentThreadId);
    try {
      const res = await fetch("/api/timeline/thread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentThreadId, threadName, imageBase64 }),
      });

      if (!res.ok) throw new Error("failed");

      const newThread = await res.json();
      console.log("Reply created:", newThread);
      setChildThreads((prev) => [newThread, ...prev]);
    } catch {
      setError("返信に失敗しました");
    }
  };

  return {
    thread,
    childThreads,
    loading,
    error,
    submitReply,
  };
};
