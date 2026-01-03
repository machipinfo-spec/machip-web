"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AlertMessage } from "@/src/features/user/components/AlertMessage";
import { FormInput } from "@/src/features/user/components/FormInput";
import { FormTextarea } from "@/src/features/user/components/FormTextarea";
import { ProfileImageUpload } from "@/src/features/user/components/ProfileImageUpload";
import { SuccessToast } from "@/src/features/user/components/SuccessToast";
import { useImageUpload } from "@/src/features/user/hooks/useImageUpload";
import { useProfile } from "@/src/features/user/hooks/useProfile";

const ProfilePage: React.FC = () => {
  const params = useParams();
  const userId = (params as { userId?: string })?.userId;

  // useProfile の戻り値名に合わせる
  const {
    data, // UserProfile | null
    isFetching,
    isOwnProfile,
    error: profileError,
    fetchProfile,
    updateProfile,
    setError,
  } = useProfile(userId);

  const {
    imagePreview,
    handleImageChange,
    handleImageRemove,
    setInitialPreview,
    getImageBase64,
  } = useImageUpload();

  // ローカル UI state
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // form のコントロール値（編集中に使う）
  const [userData, setUserData] = useState({
    nickname: "",
    bio: "",
    url: "",
  });

  // プロフィール取得: 初回 & userId変更時
  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // fetchProfile depends on userId internally; trigger when userId changes

  // original data が入ったらフォーム初期化
  useEffect(() => {
    if (data) {
      setUserData({
        nickname: data.userName,
        bio: data.introduction,
        url: data.url,
      });
      if (data.imageUrl) setInitialPreview(data.imageUrl);
      else setInitialPreview(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    if (data) {
      setUserData({
        nickname: data.userName,
        bio: data.introduction,
        url: data.url,
      });
      if (data.imageUrl) setInitialPreview(data.imageUrl);
      else setInitialPreview(null);
    } else {
      setUserData({ nickname: "", bio: "", url: "" });
      setInitialPreview(null);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!userData.nickname.trim()) {
        throw new Error("ニックネームを入力してください");
      }

      // useImageUpload のユーティリティで Base64 を取得
      const imageBase64 = await getImageBase64();

      const success = await updateProfile({
        nickname: userData.nickname,
        bio: userData.bio,
        imageBase64,
        url: userData.url,
      });

      if (!success) {
        throw new Error("更新に失敗しました");
      }

      // fetchProfile は updateProfile 内で呼ばれる想定ですが、万が一のため再取得
      await fetchProfile();

      setShowSuccess(true);
      setIsEditing(false);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "予期せぬエラーが発生しました"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 表示中のエラーは hook の error を優先して表示
  const displayError = profileError ?? null;

  // Loading Skeleton
  if (isFetching) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="mb-8 text-center">
          <div className="h-10 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
        </div>

        <div className="flex flex-col gap-8 max-w-xl mx-auto">
          {/* Image Upload Skeleton */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>

          {/* Form Fields Skeleton */}
          <div className="space-y-6">
            <div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-32 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight">
            {isEditing ? "プロフィール編集" : "プロフィール"}
          </h2>
        </div>

        {displayError && (
          <div className="mb-6">
            <AlertMessage message={displayError} type="error" />
          </div>
        )}

        <div className="flex flex-col gap-8">
          <ProfileImageUpload
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onImageRemove={handleImageRemove}
            disabled={!isEditing}
            onError={(msg) => setError(msg)}
          />

          <div className="space-y-6">
            <FormInput
              label="ニックネーム"
              name="nickname"
              value={userData.nickname}
              onChange={handleChange}
              placeholder="あなたのニックネーム"
              disabled={!isEditing}
              icon={
                isEditing ? (
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : undefined
              }
            />
            <FormInput
              label="URL"
              name="url"
              value={userData.url}
              onChange={handleChange}
              placeholder=""
              disabled={!isEditing}
            />

            <FormTextarea
              label="自己紹介"
              name="bio"
              value={userData.bio}
              onChange={handleChange}
              placeholder="あなたについて簡単に教えてください..."
              disabled={!isEditing}
            />

            {isOwnProfile && (
              <div className="pt-6">
                {isEditing ? (
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="flex-1 px-4 py-3 text-sm font-bold bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all disabled:opacity-50"
                    >
                      キャンセル
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className={`flex-1 flex justify-center items-center px-4 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                      {isLoading ? (
                        <>
                          <span className="inline-block w-5 h-5 mr-3 border-2 border-white/30 rounded-full border-t-white animate-spin"></span>
                          保存中...
                        </>
                      ) : (
                        <>保存する</>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="w-full flex justify-center items-center px-4 py-3 text-sm font-bold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-100"
                  >
                    プロフィールを編集
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showSuccess && (
        <SuccessToast
          title="更新完了"
          message="プロフィールを更新しました"
          position="top-right"
        />
      )}
    </div>
  );
};

export default ProfilePage;
