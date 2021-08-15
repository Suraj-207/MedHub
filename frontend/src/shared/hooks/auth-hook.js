import { useState, useEffect, useCallback } from "react";

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [isToken, setIsToken] = useState(true);
  const [userId, setUserId] = useState(null);
  const [load, setLoad] = useState(true);

  const login = useCallback((user, token) => {
    setToken(token);
    setUserId(user);
    localStorage.setItem("userData", JSON.stringify({ token: token }));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setIsToken(false);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    let fetchData;
    try {
      fetchData = async () => {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        if (storedData === null) {
          setIsToken(false);
          setLoad(false);
          console.log("no token");
        } else {
          const data = storedData.token;
          const response = await fetch(
            "/api/check-token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
          const result = await response.json();
          if (result === null) {
            setIsToken(false);
            setLoad(false);
            console.log("unidentified token");
          } else if (result.user && result.token) {
            login(result.user, result.token);
            setLoad(false);
          }
          if (response.ok) {
            console.log("done");
          }
        }
      };
    } catch (err) {
      console.log(err);
    }
    fetchData();
  }, [login, setIsToken, setLoad]);

  return { token, login, logout, userId, load, isToken };
};
