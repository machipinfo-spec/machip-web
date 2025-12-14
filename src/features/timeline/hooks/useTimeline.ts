"use client";

import { useEffect, useState } from "react";
import { Thread } from "../../thread/types/Thread";

export const useTimeline = (initialItems: Thread[] = []) => {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(!initialItems.length);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/timeline");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(data.threads);
    } catch {
      setError("タイムラインの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialItems.length) refetch();
  }, []);

  return { items, loading, error, refetch };
};
