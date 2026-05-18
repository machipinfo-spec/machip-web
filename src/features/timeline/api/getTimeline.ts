import { Thread } from "../../thread/types/Thread";

type GetTimelineParams = {
  offset: number;
  limit: number;
  ownerUserId?: string | null;
};

type GetTimelineResponse = {
  threads: Thread[];
  total?: number;
};

const mapBackendThreadToFrontend = (t: any): Thread => {
  if (!t) return t;
  return {
    threadId: t.threadId,
    threadName: t.threadName,
    createdAt: t.createdAt,
    ownerUserId: t.ownerUserId,
    ownerUserProfile: t.ownerUserProfile || {
      userId: t.ownerUserId,
      userName: t.ownerName || "ユーザー",
      imageUrl: t.ownerAvatar || null,
    },
    category: t.category,
    categoryContent: t.categoryContent || { imageUrl: null },
    childThreadCount: typeof t.replyCount === "number" ? t.replyCount : (t.childThreadCount || 0),
    parentThreadId: t.parentThreadId || null,
    childThreadIds: t.childThreadIds || [],
    mapPointInfoId: t.mapPointInfoId || null,
  };
};

export const getTimeline = async ({
  offset,
  limit,
  ownerUserId,
}: GetTimelineParams): Promise<Thread[]> => {
  const url = ownerUserId
    ? `/api/timeline/thread?ownerUserId=${ownerUserId}&limit=${limit}&offset=${offset}`
    : `/api/timeline?limit=${limit}&offset=${offset}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch timeline");
  }

  const data = await res.json();
  
  const rawThreads: any[] = ownerUserId
    ? (Array.isArray(data) ? data : [])
    : ((data as GetTimelineResponse).threads || []);

  return rawThreads.map(mapBackendThreadToFrontend);
};
