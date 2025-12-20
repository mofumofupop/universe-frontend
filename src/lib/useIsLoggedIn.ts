import { useEffect, useState } from "react";

export function useIsLoggedIn() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const uuid = localStorage.getItem("uuid");
      const password = localStorage.getItem("password");
      setIsLoggedIn(!!(uuid && password));
    }
  }, []);

  return isLoggedIn;
}
