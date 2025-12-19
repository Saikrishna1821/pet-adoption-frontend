import { useMemo } from "react";

const decodeToken = (token) => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const useAuth = () => {
  const token = localStorage.getItem("token");
  // or read cookie if non-httpOnly

  const user = useMemo(() => decodeToken(token), [token]);
console.log("user",user)
  return {
    name: user?.name ?? null,
    user_id: user?.user_id ?? null,
    role: user?.role ?? "VISITOR",
    isLoggedIn: !!user,
  };
};
