import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
    status?: number;
    code?: string;

    constructor(message: string, status?: number, code?: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.code = code;
    }
}

const apiClient = axios.create({
    baseURL,
    timeout: 15_000,
    headers: { Accept: "application/json" },
    paramsSerializer: {
        serialize: (params) => {
            const entries = params instanceof URLSearchParams
                ? Array.from(params.entries())
                : Object.entries(params);

            return entries
                .filter(([, value]) => value !== undefined && value !== null)
                .map(([key, value]) => {
                    return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
                })
                .join("&");
        },
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }

        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.message ??
                error.response?.data?.error ??
                error.message ??
                "The request failed.";

            return Promise.reject(
                new ApiError(String(message), error.response?.status, error.code),
            );
        }

        return Promise.reject(new ApiError("The request failed."));
    },
);

export function isRequestCanceled(error: unknown): boolean {
    return axios.isCancel(error);
}

export default apiClient;
