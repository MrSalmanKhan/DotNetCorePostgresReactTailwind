
import { useState, useCallback } from "react";

// State type for API requests
type ApiState<T> = {
    data: T | null;
    error: string | null;
    loading: boolean;
};

/**
 * useApi - custom hook for API requests with loading and error state.
 * @param apiFunc - async function to call (should return a promise)
 */
export function useApi<T>(apiFunc: (...args: any[]) => Promise<T>) {
    const [state, setState] = useState<ApiState<T>>({ data: null, error: null, loading: false });

    const request = useCallback(async (...args: any[]) => {
        setState({ data: null, error: null, loading: true });
        try {
            const data = await apiFunc(...args);
            setState({ data, error: null, loading: false });
            return data;
        } catch (err: any) {
            setState({
                data: null,
                error: err.response?.data?.message || err.message || "Unknown error",
                loading: false,
            });
            throw err;
        }
    }, [apiFunc]);

    return { ...state, request };
}
