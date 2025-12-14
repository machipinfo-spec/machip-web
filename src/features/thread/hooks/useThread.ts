import { useEffect, useState } from "react";

export interface ThreadDTO {
  threadId: string;
  threadName: string;
  createdAt: string;
  ownerUserId: string;
  ownerUserProfile: {
    userId: string;
    userName: string;
    imageUrl: string | null;
  };
  parentThreadId: string | null;
  childThreadIds: string[];
  mapPointInfoId: string | null;
  imageUrl: string | null;
  selectDate: string | null;
  childThreadCount: number;
}

interface ThreadResponse {
  thread: ThreadDTO;
  childThreads: {
    thread: ThreadDTO;
    childThreads: [];
    parentThread: ThreadDTO;
  }[];
  parentThread: ThreadDTO | null;
}

export const useThread = (threadId: string) => {
  const [thread, setThread] = useState<ThreadDTO | null>(null);
  const [childThreads, setChildThreads] = useState<ThreadDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchThread = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/timeline/${threadId}`);

      if (!res.ok) {
        throw new Error(`スレッド取得に失敗しました (${res.status})`);
      }

      const data: ThreadResponse = await res.json();

      setThread(data.thread);
      setChildThreads(data.childThreads.map((c) => c.thread));
    } catch (e) {
      console.error(e);
      setError("スレッド情報の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const submitReply = async (
    replyTargetId: string,
    text: string,
    image: string | null
  ) => {
    const body = {
      threadName: text,
      parentThreadId: replyTargetId,
      imageBase64: image || null,
    };

    const res = await fetch("/api/timeline/thread/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`返信の投稿に失敗しました (${res.status})`);
    }

    await fetchThread();
  };

  useEffect(() => {
    fetchThread();
  }, [threadId]);

  return {
    thread,
    childThreads,
    loading,
    error,
    fetchThread,
    submitReply,
  };
};
