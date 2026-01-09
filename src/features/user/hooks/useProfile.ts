"use client";

import { useProfileContext } from "@/src/contexts/ProfileContext";

export interface UserProfile {
  profileId: string;
  userName: string;
  imageUrl: string;
  introduction: string;
  url: string;
}

export function useProfile(userId?: string) {
  const context = useProfileContext();

  // If userId is provided and different from current, fetch that user's profile
  // This maintains backward compatibility for viewing other users' profiles
  if (userId && context.data?.profileId !== userId) {
    // For now, we'll use the context's fetchProfile
    // In a more complete implementation, you might want to handle
    // multiple user profiles separately
  }

  return {
    data: context.data,
    isFetching: context.isFetching,
    isOwnProfile: context.isOwnProfile,
    error: context.error,
    fetchProfile: context.fetchProfile,
    updateProfile: context.updateProfile,
    clearProfile: context.clearProfile,
  };
}
