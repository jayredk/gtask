import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export function useAuth() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      return router.push('/login');
    } else {
      setAccessToken(token);
    }
  }, [router])

  return accessToken;
}