import { getSession } from "next-auth/react";
import { useCallback } from "react";

export enum LoginMode {
  LOGIN,
  GUEST,
}

export const useLoginMode = () => {
  const getLoginMode = useCallback(async () => {
    const session = await getSession();
    if (session) {
      return LoginMode.LOGIN;
    }
    return LoginMode.GUEST;
  }, []);

  return { getLoginMode };
};
