"use client";

import { useState, useEffect, useCallback } from "react";
import { UserProfile } from "../types/UserProfile";
import { useSession } from "next-auth/react";

export function useFollow() {
  const [followingProfiles, setFollowingProfiles] = useState<UserProfile[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { status } = useSession();

  const fetchFollowing = useCallback(async () => {
    if (status !== "authenticated") {
      // ログインしていない（ゲストなど）の場合はAPIを叩かず空のままにする
      setFollowingProfiles([]);
      setFollowingIds(new Set());
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/user/following");
      
      if (res.status === 403 || res.status === 401) {
        // バックエンドDBにユーザープロファイルが未登録、またはセッション切れの場合は空配列で正常終了とする
        setFollowingProfiles([]);
        setFollowingIds(new Set());
        return;
      }

      if (!res.ok) {
        throw new Error("フォロー中ユーザーの取得に失敗しました");
      }
      
      const data = await res.json();
      const profiles: UserProfile[] = data || [];
      
      setFollowingProfiles(profiles);
      setFollowingIds(new Set(profiles.map((p) => p.userId)));
    } catch (err) {
      console.error("fetchFollowing error:", err);
      setError(err instanceof Error ? err.message : "フォロー中ユーザー取得エラー");
    } finally {
      setLoading(false);
    }
  }, [status]);

  const toggleFollow = useCallback(async (targetUserId: string) => {
    if (status !== "authenticated") {
      alert("フォロー機能の利用にはログインが必要です");
      return;
    }

    const isCurrentlyFollowing = followingIds.has(targetUserId);

    // Optimistic UI updates
    setFollowingIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyFollowing) {
        next.delete(targetUserId);
      } else {
        next.add(targetUserId);
      }
      return next;
    });

    try {
      if (isCurrentlyFollowing) {
        const res = await fetch(`/api/user/follow?targetUserId=${targetUserId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          throw new Error("フォロー解除に失敗しました");
        }
      } else {
        const res = await fetch("/api/user/follow", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ targetUserId }),
        });
        if (!res.ok) {
          throw new Error("フォロー登録に失敗しました");
        }
      }
      // Re-fetch list to sync details
      await fetchFollowing();
    } catch (err) {
      console.error("toggleFollow error:", err);
      // Revert optimistic updates on error
      setFollowingIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlyFollowing) {
          next.add(targetUserId);
        } else {
          next.delete(targetUserId);
        }
        return next;
      });
      alert(err instanceof Error ? err.message : "フォロー処理に失敗しました");
    }
  }, [followingIds, fetchFollowing, status]);

  useEffect(() => {
    fetchFollowing();
  }, [fetchFollowing]);

  return {
    followingProfiles,
    followingIds,
    loading,
    error,
    toggleFollow,
    refetch: fetchFollowing,
  };
}
