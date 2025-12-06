"use client";
import { getAuthToken } from "@/src/services/actions";
import { useState, useEffect, useRef } from "react";

interface UserProfile {
  profileId: string;
  userName: string;
  imageUrl: string;
  introduction: string;
}

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [originalData, setOriginalData] = useState<UserProfile>({
    profileId: "",
    userName: "",
    imageUrl: "",
    introduction: "",
  });

  const [userData, setUserData] = useState({
    nickname: "",
    profileImage: null as File | null,
    bio: "",
  });

  // プロフィール情報を取得
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsFetching(true);
    setError(null);

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error("認証情報が見つかりません");
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const endpoint = `${apiUrl}/user/profile`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Authorization": `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`プロフィール取得に失敗しました (${response.status})`);
      }

      const data: UserProfile = await response.json();
      setOriginalData(data);
      setUserData({
        nickname: data.userName,
        profileImage: null,
        bio: data.introduction,
      });

      if (data.imageUrl) {
        setImagePreview(data.imageUrl);
      }
    } catch (err) {
      console.error("プロフィール取得エラー:", err);
      setError(
        err instanceof Error ? err.message : "プロフィールの取得に失敗しました"
      );
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("画像ファイルは5MB以下にしてください");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("画像ファイルを選択してください");
        return;
      }

      setUserData({ ...userData, profileImage: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleImageRemove = () => {
    setUserData({ ...userData, profileImage: null });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        setError("画像ファイルは5MB以下にしてください");
        return;
      }

      setUserData({ ...userData, profileImage: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    // 元のデータに戻す
    setUserData({
      nickname: originalData.userName,
      profileImage: null,
      bio: originalData.introduction,
    });
    if (originalData.imageUrl) {
      setImagePreview(originalData.imageUrl);
    } else {
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!userData.nickname.trim()) {
        throw new Error("ニックネームを入力してください");
      }

      const token = await getAuthToken();
      if (!token) {
        throw new Error("認証情報が見つかりません。再度ログインしてください。");
      }

      // 画像をBase64に変換（新しい画像がアップロードされた場合のみ）
      let imageBase64 = "";
      if (userData.profileImage) {
        imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            const base64String = result.split(",")[1];
            resolve(base64String);
          };
          reader.onerror = reject;
          reader.readAsDataURL(userData.profileImage!);
        });
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const endpoint = `${apiUrl}/user/profile`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          userName: userData.nickname,
          imageBase64: imageBase64, // 新しい画像がある場合のみBase64を送信
          introduction: userData.bio,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `エラーが発生しました (${response.status})`
        );
      }

      const result = await response.json();
      console.log("API レスポンス:", result);

      // プロフィール情報を再取得して最新の状態に更新
      await fetchProfile();

      setShowSuccess(true);
      setIsEditing(false);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("エラー詳細:", err);
      setError(
        err instanceof Error ? err.message : "予期せぬエラーが発生しました"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const SuccessMessage = () => (
    <div className="fixed top-4 right-4 z-50 animate-[slideIn_0.3s_ease-out]">
      <div className="bg-white rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.2)] p-4 flex items-center gap-3 min-w-[300px]">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100 flex-shrink-0">
          <svg
            className="h-6 w-6 text-emerald-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-800">更新完了</h4>
          <p className="text-xs text-gray-600">
            プロフィールを更新しました
          </p>
        </div>
      </div>
    </div>
  );

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-500">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-white/30 rounded-full border-t-white animate-spin"></div>
          <p className="mt-4 text-white text-sm">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-500 p-4 relative">
      <div className="max-w-[480px] w-full bg-white rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.2)] overflow-hidden relative z-10">
        <div className="p-8 sm:p-6">
          {/* ヘッダー部分 */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-tight">
              {isEditing ? "プロフィール編集" : "プロフィール"}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {isEditing
                ? "情報を編集してください"
                : "あなたのプロフィール情報"}
            </p>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="mb-6">
              <div className="bg-red-50 border-l-4 border-red-400 rounded p-4 flex">
                <svg
                  className="h-5 w-5 text-red-400 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-700 ml-3">{error}</p>
              </div>
            </div>
          )}

          <div className="block">
            <div className="flex flex-col gap-5">
              {/* プロフィール画像 */}
              <div className="mb-0">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  プロフィール画像
                </label>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="プロフィール"
                          className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                        />
                        {isEditing && (
                          <button
                            type="button"
                            onClick={handleImageRemove}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1.5 border-2 border-white shadow-md hover:bg-red-600 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <svg
                        className="mx-auto h-8 w-8 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">
                        クリックまたはドラッグ&ドロップ
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF (最大5MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* ニックネーム */}
              <div className="mb-0">
                <label
                  htmlFor="nickname"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  ニックネーム
                </label>
                {isEditing ? (
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute top-0 bottom-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
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
                    </div>
                    <input
                      type="text"
                      name="nickname"
                      id="nickname"
                      value={userData.nickname}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-3 text-sm leading-6 text-gray-800 bg-white border border-gray-300 rounded-lg shadow-none transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15 placeholder:text-gray-400"
                      placeholder="あなたのニックネーム"
                    />
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-800">
                      {userData.nickname || "未設定"}
                    </p>
                  </div>
                )}
              </div>

              {/* 自己紹介 */}
              <div className="mb-0">
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  自己紹介
                </label>
                {isEditing ? (
                  <>
                    <div className="relative rounded-lg shadow-sm">
                      <textarea
                        name="bio"
                        id="bio"
                        rows={4}
                        value={userData.bio}
                        onChange={handleChange}
                        maxLength={500}
                        className="block w-full px-4 py-3 text-sm leading-6 text-gray-800 bg-white border border-gray-300 rounded-lg shadow-none transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15 placeholder:text-gray-400 resize-none"
                        placeholder="あなたについて簡単に教えてください..."
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {userData.bio.length} / 500文字
                    </p>
                  </>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[100px]">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                      {userData.bio || "自己紹介が未設定です"}
                    </p>
                  </div>
                )}
              </div>

              {/* ボタン */}
              <div className="pt-4">
                {isEditing ? (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-3 focus:ring-gray-300/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      キャンセル
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className={`flex-1 flex justify-center items-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-700 border-0 rounded-lg shadow-md cursor-pointer transition-[background,transform] duration-200 hover:from-indigo-700 hover:to-purple-800 hover:-translate-y-0.5 focus:outline-none focus:ring-3 focus:ring-indigo-600/40 active:translate-y-0.5 ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
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
                    className="w-full flex justify-center items-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-700 border-0 rounded-lg shadow-md cursor-pointer transition-[background,transform] duration-200 hover:from-indigo-700 hover:to-purple-800 hover:-translate-y-0.5 focus:outline-none focus:ring-3 focus:ring-indigo-600/40 active:translate-y-0.5"
                  >
                    編集する
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && <SuccessMessage />}

      <style>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;