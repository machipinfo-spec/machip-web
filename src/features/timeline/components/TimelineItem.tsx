"use client";
import { FaRegComment, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { ThreadDTO } from "@/src/features/thread/components/ThreadCard";

interface Props {
  thread: ThreadDTO;
  isBookmarked: boolean;
  onToggleBookmark: (threadId: string) => void;
  onReply: (thread: ThreadDTO) => void;
  onOpenImage: (url: string) => void;
}

export const TimelineItem = ({
  thread,
  isBookmarked,
  onToggleBookmark,
  onReply,
  onOpenImage,
}: Props) => {
  const router = useRouter();

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diff < 60) return `${diff}秒前`;
    if (diff < 3600) return `${Math.floor(diff / 60)}分前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`;
    if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}日前`;

    return d.toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
    });
  };

  const formatSelectDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article
      className="px-4 py-3 hover:bg-gray-50 transition cursor-pointer"
      onClick={() => router.push(`/timeline/${thread.threadId}`)}
    >
      <div className="flex gap-3">
        {/* icon */}
        <img
          src={thread.ownerUserProfile.imageUrl ?? "/default-user.png"}
          alt={thread.ownerUserProfile.userName}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/profile/${thread.ownerUserId}`);
          }}
          className="w-12 h-12 rounded-full object-cover cursor-pointer"
        />

        {/* content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-gray-900">
              {thread.ownerUserProfile.userName}
            </span>
            <span className="text-gray-500 text-sm">
              · {formatDate(thread.createdAt)}
            </span>
          </div>

          <div className="text-gray-900 text-[15px] mb-2 whitespace-pre-wrap">
            {thread.threadName}
          </div>

          {thread.selectDate && (
            <div className="mb-2 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">
              📅 {formatSelectDate(thread.selectDate)}
            </div>
          )}

          {thread.imageUrl && (
            <img
              src={thread.imageUrl}
              className="rounded-2xl w-9/12 max-h-96 object-cover border mt-2"
              onClick={(e) => {
                e.stopPropagation();
                onOpenImage(thread.imageUrl!);
              }}
            />
          )}

          <div className="flex items-center gap-6 mt-3 text-gray-500">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReply(thread);
              }}
              className="flex items-center gap-2 hover:text-blue-500"
            >
              <FaRegComment />
              {thread.childThreadCount > 0 && (
                <span>{thread.childThreadCount}</span>
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(thread.threadId);
              }}
              className={`hover:text-blue-500 ${
                isBookmarked ? "text-blue-500" : ""
              }`}
            >
              {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
