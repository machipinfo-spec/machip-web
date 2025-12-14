"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ThreadCard } from "@/src/features/thread/components/ThreadCard";
import { ReplyModal } from "@/src/features/thread/components/ReplyModal";
import { ImageModal } from "@/src/features/thread/components/ImageModal";
import { ThreadSkeleton } from "@/src/features/thread/components/ThreadSkeleton";
import { useThread, ThreadDTO } from "@/src/features/thread/hooks/useThread";

export default function ThreadPage() {
  const params = useParams();
  const threadId = params.threadId as string;

  const { thread, childThreads, loading, error, submitReply } =
    useThread(threadId);

  const [bookmarkedThreads, setBookmarkedThreads] = useState<Set<string>>(
    new Set()
  );

  // --- モーダル関連 ---
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyTarget, setReplyTarget] = useState<ThreadDTO | null>(null);
  const [openImage, setOpenImage] = useState<string | null>(null);

  const handleReply = (thread: ThreadDTO) => {
    setReplyTarget(thread);
    setReplyModalOpen(true);
  };

  const closeReplyModal = () => {
    setReplyModalOpen(false);
    setReplyTarget(null);
  };

  const handleSubmitReply = async (text: string, image: string | null) => {
    if (!replyTarget) return;

    try {
      await submitReply(replyTarget.threadId, text, image);
      closeReplyModal();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleBookmark = (threadId: string) => {
    setBookmarkedThreads((prev) => {
      const set = new Set(prev);
      set.has(threadId) ? set.delete(threadId) : set.add(threadId);
      return set;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto border-x border-gray-200 min-h-screen overflow-y-auto">
        {/* --- エラー --- */}
        {error && (
          <div className="m-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}

        {/* --- ローディング --- */}
        {loading && <ThreadSkeleton count={3} />}

        {/* --- 親スレッド --- */}
        {!loading && thread && (
          <ThreadCard
            thread={thread}
            onReply={handleReply}
            onImageClick={setOpenImage}
            isBookmarked={bookmarkedThreads.has(thread.threadId)}
            onToggleBookmark={toggleBookmark}
            isCompact={false}
          />
        )}

        {/* --- 子スレッド一覧 --- */}
        {!loading && childThreads.length > 0 && (
          <div className="divide-y divide-gray-200">
            {childThreads.map((child) => (
              <div
                key={child.threadId}
                className="relative pl-10" // 子スレッドを右にずらす
              >
                {/* 左の縦ライン（X風） */}
                {/* <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-300" /> */}

                <ThreadCard
                  thread={child}
                  onReply={handleReply}
                  onImageClick={setOpenImage}
                  isBookmarked={bookmarkedThreads.has(child.threadId)}
                  onToggleBookmark={toggleBookmark}
                  isCompact={true}
                />
              </div>
            ))}
          </div>
        )}

        {/* --- スレッドがない場合 --- */}
        {!loading && !thread && (
          <div className="p-6 text-center text-gray-500">
            スレッドが見つかりませんでした
          </div>
        )}
      </div>

      {/* --- 返信モーダル --- */}
      <ReplyModal
        isOpen={replyModalOpen}
        replyTarget={replyTarget}
        onClose={closeReplyModal}
        onSubmit={handleSubmitReply}
      />

      {/* --- 画像モーダル --- */}
      <ImageModal imageUrl={openImage} onClose={() => setOpenImage(null)} />
    </div>
  );
}
