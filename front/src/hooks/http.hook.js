import { useState, useCallback, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = useContext(AuthContext);

  const request = useCallback(
    async (url, method = "GET", body = null, files = null, headers = {}) => {
      setLoading(true);
      try {
        const formData = new FormData();
        if (body && files) {
          body = JSON.stringify(body);
          formData.append("data", body);
          for (let i = 0; i < files.length; i++) {
            formData.append("pic", files[i]);
          }
          body = formData;
        }
        if (body && !files) {
          body = JSON.stringify(body);
          headers["Content-Type"] = "application/json";
        }
        const response = await fetch(url, {
          method,
          body,
          headers,
          credentials: "include",
        });

        const data = await response.json();

        if (response.status === 401 && auth.accessToken !== undefined) {
          try {
            const refreshTokenResponse = await fetch("/api/user/refresh");

            if (refreshTokenResponse.ok) {
              const { accessToken } = await refreshTokenResponse.json();
              
              if(accessToken !== undefined){
                auth.login(accessToken);

                const retryResponse = await fetch(url, {
                  method,
                  body,
                  headers: {
                    ...headers,
                    Authorization: `Bearer ${accessToken}`,
                  },
                  credentials: "include",
                });
  
                const retryData = await retryResponse.json();
                setLoading(false);
                return retryData;
              }
              else{
                auth.logout();
                window.location.reload();
              }
            }
            else{
              auth.logout();
              window.location.reload();
            }
          } catch (error) {
            throw new Error("Unauthorised");
          }
        } 
        else if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        setLoading(false);

        return data;
      } catch (e) {
        setLoading(false);
        setError(e.message);
        throw e;
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);
  return { loading, request, error, clearError };
};