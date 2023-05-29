import { useState, useCallback, useEffect } from "react";

const storageName = "accountData";

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = JSON.parse(localStorage.getItem(storageName));

      if (token) {
        try {
          setAccessToken(token.accessToken);
        } catch (error) {
          localStorage.removeItem(storageName);
          localStorage.removeItem("accessToken");
          setAccessToken(null);
        }
      }
    };
    checkAuth();
  }, []);

  const login = useCallback((jwtToken) => {
    setAccessToken(jwtToken);
    localStorage.setItem(
      storageName,
      JSON.stringify({
        accessToken: jwtToken,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);

    localStorage.removeItem(storageName);
    localStorage.removeItem("accessToken");
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.accessToken) {
      login(data.accessToken);
    }
    setReady(true);
  }, [login]);

  return {
    login,
    logout,
    accessToken,
    ready
  };
};