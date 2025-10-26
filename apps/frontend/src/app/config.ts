import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const BACKEND_URL = "http://localhost:3001";
export const HOOKS_URL = "http://localhost:3002";

export default function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);
}
