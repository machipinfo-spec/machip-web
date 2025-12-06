// // lib/profileApi.ts - React Query版
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { UserProfile } from "@/types/profile";
// import { v4 as uuidv4 } from "uuid";

// const API_BASE_URL = "/api/user/profile";

// // Helper functions
// function generateUUID(): string {
//   if (typeof crypto !== "undefined" && crypto.randomUUID) {
//     return crypto.randomUUID();
//   }
//   return uuidv4();
// }

// async function toBase64(file: File): Promise<string> {
//   return new Promise<string>((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = (error) => reject(error);
//   });
// }

// async function fetchWithErrorHandling<T>(
//   input: RequestInfo,
//   init?: RequestInit
// ): Promise<T> {
//   const res = await fetch(input, init);
//   if (!res.ok) {
//     throw new Error(`Server error: ${res.statusText}`);
//   }
//   return res.json();
// }

// // Base API functions
// const fetchUserProfile = async (): Promise<UserProfile> => {
//   try {
//     const userData = await fetchWithErrorHandling<UserProfile>(API_BASE_URL, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     // データを正規化してデフォルト値を保証
//     const normalizedData: UserProfile = {
//       ...userData,
//       availableEquipment: userData.availableEquipment || [],
//       healthConditions: userData.healthConditions || [],
//       promptCustomizations: {
//         detailLevel: userData.promptCustomizations?.detailLevel || "standard",
//         focusAreas: userData.promptCustomizations?.focusAreas || [],
//         preferredExerciseTypes:
//           userData.promptCustomizations?.preferredExerciseTypes || [],
//         dietaryRestrictions:
//           userData.promptCustomizations?.dietaryRestrictions || [],
//         excludedExercises:
//           userData.promptCustomizations?.excludedExercises || [],
//         customInstructions:
//           userData.promptCustomizations?.customInstructions || [],
//       },
//     };

//     return normalizedData;
//   } catch (error) {
//     console.error("Error fetching user data:", error);

//     // フォールバックとしてモックデータを返す
//     const randomUserId = generateUUID();
//     const fallbackData: UserProfile = {
//       id: randomUserId,
//       name: "new user",
//       image: "/images/default-avatar.png",
//       age: 30,
//       height: 170,
//       weight: 65,
//       gender: "other",
//       fitnessGoal: "筋肉増強",
//       trainingFrequency: "週3回",
//       trainingExperience: "中級者",
//       healthConditions: [],
//       promptCustomizations: {
//         detailLevel: "standard",
//         focusAreas: [],
//         preferredExerciseTypes: [],
//         dietaryRestrictions: [],
//         excludedExercises: [],
//         customInstructions: [],
//       },
//       availableEquipment: [],
//     };

//     return fallbackData;
//   }
// };

// // React Query hooks
// export const useUserProfile = () => {
//   return useQuery({
//     queryKey: ["userProfile"],
//     queryFn: fetchUserProfile,
//     staleTime: 30 * 60 * 1000, // 30分間は fresh
//     gcTime: 60 * 60 * 1000, // 1時間後にガベージコレクション
//     retry: 1, // プロフィールデータは1回だけリトライ
//   });
// };

// export const useUpdateUserProfile = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (
//       userData: Partial<UserProfile>
//     ): Promise<UserProfile> => {
//       const response = await fetchWithErrorHandling<{ profile: UserProfile }>(
//         API_BASE_URL,
//         {
//           method: "PUT",
//           body: JSON.stringify(userData),
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       return response.profile;
//     },
//     onSuccess: (updatedData) => {
//       // キャッシュを更新
//       queryClient.setQueryData(["userProfile"], updatedData);
//     },
//   });
// };

// export const useCreateUserProfile = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (userData: UserProfile): Promise<UserProfile> => {
//       const response = await fetchWithErrorHandling<{ profile: UserProfile }>(
//         API_BASE_URL,
//         {
//           method: "POST",
//           body: JSON.stringify(userData),
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       return response.profile;
//     },
//     onSuccess: (createdData) => {
//       // キャッシュに保存
//       queryClient.setQueryData(["userProfile"], createdData);
//     },
//   });
// };

// export const useUpdateUserProfileWithImage = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       userData,
//       imageFile,
//       token,
//     }: {
//       userData: Partial<UserProfile>;
//       imageFile: File;
//       token: string;
//     }): Promise<UserProfile> => {
//       const base64Image = await toBase64(imageFile);
//       const base64Only = base64Image.replace(/^data:.*;base64,/, "");
//       const profileWithImage = {
//         ...userData,
//         imageData: base64Only,
//       };

//       const response = await fetchWithErrorHandling<{ profile: UserProfile }>(
//         API_BASE_URL,
//         {
//           method: "POST",
//           body: JSON.stringify(profileWithImage),
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: token,
//           },
//         }
//       );

//       return response.profile;
//     },
//     onSuccess: (updatedData) => {
//       // キャッシュを更新
//       queryClient.setQueryData(["userProfile"], updatedData);
//     },
//   });
// };

// export const useUploadProfileImage = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (file: File): Promise<string> => {
//       const formData = new FormData();
//       formData.append("image", file);

//       const response = await fetch(`${API_BASE_URL}/upload-image`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const { imageUrl } = await response.json();
//       return imageUrl;
//     },
//     onSuccess: (imageUrl) => {
//       // キャッシュ内の画像URLも更新
//       queryClient.setQueryData(
//         ["userProfile"],
//         (oldData: UserProfile | undefined) => {
//           if (oldData) {
//             return {
//               ...oldData,
//               image: imageUrl,
//             };
//           }
//           return oldData;
//         }
//       );
//     },
//   });
// };

// // 従来の関数形式のAPI（React Query使わない場合）
// const personalInfoApi = {
//   fetchUserProfile: async (): Promise<UserProfile> => {
//     return fetchUserProfile();
//   },

//   updateUserProfile: async (
//     userData: Partial<UserProfile>
//   ): Promise<UserProfile> => {
//     const response = await fetchWithErrorHandling<{ profile: UserProfile }>(
//       API_BASE_URL,
//       {
//         method: "PUT",
//         body: JSON.stringify(userData),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.profile;
//   },

//   createUserProfile: async (userData: UserProfile): Promise<UserProfile> => {
//     const response = await fetchWithErrorHandling<{ profile: UserProfile }>(
//       API_BASE_URL,
//       {
//         method: "POST",
//         body: JSON.stringify(userData),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.profile;
//   },

//   updateUserProfileWithImage: async (
//     userData: Partial<UserProfile>,
//     imageFile: File,
//     token: string
//   ): Promise<UserProfile> => {
//     const base64Image = await toBase64(imageFile);
//     const base64Only = base64Image.replace(/^data:.*;base64,/, "");
//     const profileWithImage = {
//       ...userData,
//       imageData: base64Only,
//     };

//     const response = await fetchWithErrorHandling<{ profile: UserProfile }>(
//       API_BASE_URL,
//       {
//         method: "POST",
//         body: JSON.stringify(profileWithImage),
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token,
//         },
//       }
//     );

//     return response.profile;
//   },

//   uploadProfileImage: async (file: File): Promise<string> => {
//     const formData = new FormData();
//     formData.append("image", file);

//     const response = await fetch(`${API_BASE_URL}/upload-image`, {
//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const { imageUrl } = await response.json();
//     return imageUrl;
//   },
// };

// export default personalInfoApi;
