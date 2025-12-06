// lib/userApi.ts - React Query版
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserData } from "@/types/user";

export interface BasalMetabolismDto {
  month: number;
  value: number;
}

// Base API functions
const fetchCurrentUser = async (): Promise<UserData | null> => {
  const response = await fetch(`/api/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user data: ${response.status}`);
  }

  return response.json();
};

const fetchMetabolismCurrentMonth = async (): Promise<number | null> => {
  const response = await fetch(`/api/user/metabolism`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user data: ${response.status}`);
  }

  const data = await response.json();
  const metabolism: BasalMetabolismDto[] = data;
  const currentMonth = new Date().getMonth() + 1;

  const metabolismCurrentMonth = metabolism.find(
    (m) => currentMonth === m.month
  );

  if (!metabolismCurrentMonth) {
    return null;
  }

  return metabolismCurrentMonth.value;
};

// React Query hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: 30 * 60 * 1000, // 30分間は fresh
    gcTime: 60 * 60 * 1000, // 1時間後にガベージコレクション
  });
};

export const useMetabolismCurrentMonth = () => {
  return useQuery({
    queryKey: ["metabolism", "current"],
    queryFn: fetchMetabolismCurrentMonth,
    staleTime: 60 * 60 * 1000, // 1時間は fresh
    gcTime: 2 * 60 * 60 * 1000, // 2時間後にガベージコレクション
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: {
      name: string;
      gender: string;
      height: number;
      weight: number;
      age: number;
    }): Promise<UserData | null> => {
      const response = await fetch(`/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      // ユーザーが作成されたので関連するクエリを無効化
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["metabolism"] });
    },
  });
};

// 従来の関数形式のAPI（React Query使わない場合）
export async function getCurrentUser(): Promise<UserData | null> {
  return fetchCurrentUser();
}

export async function createUser(
  name: string,
  gender: string,
  height: number,
  weight: number,
  age: number
): Promise<UserData | null> {
  const response = await fetch(`/api/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      gender: gender,
      height: height,
      weight: weight,
      age: age,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user data: ${response.status}`);
  }

  return response.json();
}

export async function getMetabolismCurrentMonth(): Promise<number | null> {
  return fetchMetabolismCurrentMonth();
}
