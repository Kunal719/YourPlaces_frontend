import { useState, useEffect, useCallback, useRef } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // to cancel request if we switch component in between fetching request
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortControl = new AbortController();
      activeHttpRequests.current.push(httpAbortControl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortControl.signal, // can use to cancel the request
          credentials: 'include',
        });

        const responseData = await response.json();

        // remove current activeHttpRequests if the request is succesful
        activeHttpRequests.current.filter(
          (reqControl) => reqControl !== httpAbortControl
        );

        // since fetch always return a error in form of a response so our catch block has to be
        // executed with this following code
        if (!response.ok) {
          throw Error(responseData.msg);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setIsLoading(false);
        setError(err.message);

        // basically a server error if occurs
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  // used as a cleanup function when the component that uses this hooks gets unmounted so
  // the request is then cancelled using the following code
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach((abortControl) =>
        abortControl.abort()
      );
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
