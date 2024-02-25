import { useCallback, useEffect, useState } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState();
  const [token, setToken] = useState();

  const login = useCallback((uid, token, expirationDate) => {
    setUserId(uid);
    setToken(token);

    const expirationTokenDate =
      expirationDate || new Date(Date.now() + 1000 * 60 * 60);

    setTokenExpirationDate(expirationTokenDate);

    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        expiration: expirationTokenDate.toISOString(),
        token: token,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    setTokenExpirationDate(null);
    setToken(null);

    localStorage.clear();
  }, []);

  useEffect(() => {
    const storedUserID = JSON.parse(localStorage.getItem('userData'));

    if (
      storedUserID &&
      storedUserID.token &&
      new Date(storedUserID.expiration) > new Date().getTime()
    ) {
      login(
        storedUserID.userId,
        storedUserID.token,
        new Date(storedUserID.expiration)
      );
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [logout, tokenExpirationDate, token]);

  return { token, userId, login, logout };
};
