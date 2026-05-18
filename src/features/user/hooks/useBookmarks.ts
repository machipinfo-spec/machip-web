"use client";

import { useState, useEffect, useCallback } from "react";
import { Thread } from "../../thread/types/Thread";
import { useSession } from "next-auth/react";

export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [bookmarkedThreads, setBookmarkedThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { status } = useSession();

  const fetchBookmarks = useCallback(async () => {
    if (status !== "authenticated") {
      // ログインしていない（ゲストなど）の場合はAPIを叩かず空のままにする
      setBookmarkedThreads([]);
      setBookmarkedIds(new Set());
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/user/bookmark");
      
      if (res.status === 403 || res.status === 401) {
        // バックエンドDBにユーザープロファイルが未登録、またはセッション切れの場合は空配列で正常終了とする
        setBookmarkedThreads([]);
        setBookmarkedIds(new Set());
        return;
      }

      if (!res.ok) {
        throw new Error("ブックマークの取得に失敗しました");
      }
      
      const data = await res.json();
      
      // レスポンスが配列直接であるか、Swagger定義の { threads: Thread[] } であるかを自動判別
      const rawThreads: any[] = Array.isArray(data) ? data : data.threads || [];
      
      // バックエンドの平坦化されたレスポンスをフロントエンドの標準Thread構造にマッピング変換する
      const threads: Thread[] = rawThreads.map((t: any) => ({
        threadId: t.threadId,
        threadName: t.threadName,
        createdAt: t.createdAt,
        ownerUserId: t.ownerUserId,
        ownerUserProfile: {
          userId: t.ownerUserId,
          userName: t.ownerName || "ユーザー",
          imageUrl: t.ownerAvatar || null,
        },
        category: t.category,
        categoryContent: t.categoryContent || { imageUrl: null },
        childThreadCount: t.replyCount || 0,
        parentThreadId: t.parentThreadId || null,
        childThreadIds: t.childThreadIds || [],
        mapPointInfoId: t.mapPointInfoId || null,
      }));
      
      setBookmarkedThreads(threads);
      setBookmarkedIds(new Set(threads.map((t) => t.threadId)));
    } catch (err) {
      console.error("fetchBookmarks error:", err);
      setError(err instanceof Error ? err.message : "ブックマーク取得エラー");
    } finally {
      setLoading(false);
    }
  }, [status]);

  const toggleBookmark = useCallback(async (threadId: string) => {
    if (status !== "authenticated") {
      alert("ブックマーク機能の利用にはログインが必要です");
      return;
    }

    const isCurrentlyBookmarked = bookmarkedIds.has(threadId);

    // Optimistic UI updates
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyBookmarked) {
        next.delete(threadId);
      } else {
        next.add(threadId);
      }
      return next;
    });

    try {
      if (isCurrentlyBookmarked) {
        const res = await fetch(`/api/user/bookmark?threadId=${threadId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          throw new Error("ブックマーク解除に失敗しました");
        }
      } else {
        const res = await fetch("/api/user/bookmark", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ threadId }),
        });
        if (!res.ok) {
          throw new Error("ブックマーク登録に失敗しました");
        }
      }
      // Re-fetch in the background to ensure syncing
      await fetchBookmarks();
    } catch (err) {
      console.error("toggleBookmark error:", err);
      // Revert optimistic updates on error
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlyBookmarked) {
          next.add(threadId);
        } else {
          next.delete(threadId);
        }
        return next;
      });
      alert(err instanceof Error ? err.message : "ブックマーク処理に失敗しました");
    }
  }, [bookmarkedIds, fetchBookmarks, status]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    bookmarkedIds,
    bookmarkedThreads,
    loading,
    error,
    toggleBookmark,
    refetch: fetchBookmarks,
  };
}
