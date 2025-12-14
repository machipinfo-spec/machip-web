"use client";
import { useRef, useState } from "react";
import { ThreadDTO } from "@/src/features/thread/components/ThreadCard";

export const useReplyThread = (onSuccess: () => Promise<void>) => {
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyTarget, setReplyTarget] = useState<ThreadDTO | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyImage, setReplyImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openReply = (thread: ThreadDTO) => {
    setReplyTarget(thread);
    setReplyModalOpen(true);
    setReplyText("");
    setReplyImage(null);
  };

  const closeReply = () => {
    setReplyModalOpen(false);
    setReplyTarget(null);
  };

  const selectImage = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setReplyImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submitReply = async () => {
    if (!replyText.trim() || !replyTarget) return;

    setSubmitting(true);
    try {
      await fetch("/api/timeline/thread/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadName: replyText,
          parentThreadId: replyTarget.threadId,
          imageBase64: replyImage,
        }),
      });

      closeReply();
      await onSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  return {
    replyModalOpen,
    replyTarget,
    replyText,
    setReplyText,
    replyImage,
    submitting,
    fileInputRef,
    openReply,
    closeReply,
    selectImage,
    submitReply,
  };
};
