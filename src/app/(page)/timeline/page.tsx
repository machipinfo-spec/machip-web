"use client";
import { useState, useEffect } from "react";
import { getAuthToken } from "../../../services/actions";

// X風タイムライン画面
// /api/timeline からデータ取得
// NewUserPage と同じ UI/エラーハンドリング構造で全面作り直し

export interface ThreadDTO {
  id: string;
  threadName: string;
  createdAt: string | Date;
  deleatedAt: string | null;
  ownerUserId: string;
  parentThreadId: string | null;
  childThreadIds: string[];
  mapPointInfoId: string | null;
  imageUrl: string | null;
}

const TimelinePage = () => {
  const [items, setItems] = useState<ThreadDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [openImage, setOpenImage] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    if (!isMounted) return;

    setLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      if (!token) throw new Error("認証エラー: 再ログインしてください。");

      const res = await fetch("/api/timeline", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!res.ok) throw new Error(`データ取得に失敗しました (${res.status})`);

      const data = await res.json();
      const normalized = data.threads.map((d: {thred: ThreadDTO}) => ({
        ...d,
        // createdAt: new Date(d.thred.createdAt).toISOString(),
      }));
      setItems(normalized);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return d.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-500 p-4">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.2)] p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">タイムライン</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end mb-4">
          <button
            onClick={fetchTimeline}
            disabled={loading}
            className={`px-4 py-2 text-sm text-white rounded-md shadow-md bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "読み込み中..." : "更新"}
          </button>
        </div>

        {/* 投稿なし */}
        {!loading && !error && items.length === 0 && (
          <div className="text-center text-gray-500 py-10">投稿がありません</div>
        )}

        {/* ローディング */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-gray-200 h-20 rounded-lg"></div>
            ))}
          </div>
        )}

        {/* タイムライン */}
        <div className="space-y-4">
          {items.map((t) => (
            <div
              key={t.id}
              className="p-4 border rounded-lg bg-white shadow hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center">
                <div className="font-semibold text-gray-800">{t.threadName}</div>
                <div className="text-gray-400 text-sm">{formatDate(String(t.createdAt))}</div>
              </div>

              {t.imageUrl && (
                <div className="mt-3">
                  <img
                    src={t.imageUrl}
                    onClick={() => setOpenImage(t.imageUrl)}
                    className="rounded-lg max-h-64 object-cover cursor-pointer"
                  />
                </div>
              )}

              <div className="mt-3 text-gray-500 text-xs">ID: {t.id}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 画像モーダル */}
      {openImage && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setOpenImage(null)}
        >
          <img
            src={openImage}
            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-xl"
          />
        </div>
      )}
    </div>
  );
};

export default TimelinePage;
