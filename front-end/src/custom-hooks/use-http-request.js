import { useState, useCallback } from 'react';

const useHttpRequest = () => {
  const [requestIsLoading, setRequestIsLoading] = useState(false);
  const [requestError, setRequestError] = useState();

  const send = useCallback(
    async (server, method = 'GET', headers = {}, body = null) => {
      setRequestIsLoading(true);
      try {
        body = body ? JSON.stringify(body) : body;
        const response = await fetch(server, { method, headers, body });
        const responseJson = await response.json();
        if (!response || response.status > 299) {
          setRequestError(responseJson.message);
          throw new Error(responseJson.message);
        }
        setRequestIsLoading(false);
        return responseJson;
      } catch (error) {
        setRequestError(error.message);
        setRequestIsLoading(false);
        throw error;
      }
    },
    []
  );

  const clearRequestError = () => setRequestError(null);

  return { send, requestIsLoading, requestError, clearRequestError };
};

export default useHttpRequest;
