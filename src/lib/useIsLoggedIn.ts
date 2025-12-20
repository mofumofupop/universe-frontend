import { useEffect, useState } from "react";

export function useIsLoggedIn(): boolean | undefined {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        const userId = localStorage.getItem("userId");
        const passwordHash = localStorage.getItem("passwordHash");
        setIsLoggedIn(!!(userId && passwordHash));
      }
    };

    check();

    // 認証情報が更新されたら再チェック（同一タブではカスタムイベントを使用）
    window.addEventListener("auth:changed", check);
    window.addEventListener("storage", check);

    return () => {
      window.removeEventListener("auth:changed", check);
      window.removeEventListener("storage", check);
    };
  }, []);

  return isLoggedIn;
}
