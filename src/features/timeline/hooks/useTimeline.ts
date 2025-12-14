"use client";

import { useEffect, useState } from "react";
import { ThreadDTO } from "../../thread/components/ThreadCard";

const useTimeline = () => {
  const [items, setItems] = useState<ThreadDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeline = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/timeline", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`データ取得に失敗しました (${res.status})`);
      }

      const data = await res.json();
      setItems(data.threads ?? []);
    } catch (err) {
      console.error("[useTimeline]", err);
      setError(
        err instanceof Error ? err.message : "不明なエラーが発生しました"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  return {
    items,
    loading,
    error,
    refetch: fetchTimeline,
  };
};

export { useTimeline };
