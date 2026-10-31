import { useEffect, useRef } from "react";
import type { AxiosResponse } from "axios";

import { ApiError, isRequestCanceled } from "./apiClient";

interface UseApiRequestOptions<T> {
    request: (signal: AbortSignal) => Promise<AxiosResponse<T>>;
    onSuccess: (data: T) => void;
    onError?: (error: ApiError) => void;
    dependencies: readonly unknown[];
}

function useApiRequest<T>({
    request,
    onSuccess,
    onError,
    dependencies,
}: UseApiRequestOptions<T>) {
    const successRef = useRef(onSuccess);
    const errorRef = useRef(onError);

    successRef.current = onSuccess;
    errorRef.current = onError;

    useEffect(() => {
        const controller = new AbortController();

        request(controller.signal)
            .then((response) => successRef.current(response.data))
            .catch((error: unknown) => {
                if (isRequestCanceled(error)) return;

                const apiError = error instanceof ApiError
                    ? error
                    : new ApiError("The request failed.");

                errorRef.current?.(apiError);
            });

        return () => controller.abort();
        // The request and callbacks are intentionally kept in refs; dependencies control refetching.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
}

export default useApiRequest;
