import axios, { isAxiosError } from 'axios';

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

function messageFromAxiosError(error: unknown): string {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error?.message : 'Something went wrong.';
  }
  const data = error?.response?.data;
  if (
    typeof data === 'object' &&
    data !== null &&
    'message' in data &&
    typeof (data as { message: unknown }).message === 'string'
  ) {
    return (data as { message: string }).message;
  }
  if (error?.response?.status) {
    return `Request failed (${error.response.status})`;
  }
  return error.message || 'Network error.';
}

export async function api<TResponse, TPayload = Record<string, unknown>>(
  url: string,
  payload?: TPayload,
  method: ApiMethod = 'GET',
): Promise<TResponse> {
  try {
    const upperMethod = method.toUpperCase() as ApiMethod;
    const config =
      upperMethod === 'GET'
        ? { params: payload }
        : { data: payload };

    const response = await axios.request<TResponse>({
      url,
      method: upperMethod,
      ...config,
    });

    return response.data;
  } catch (error) {
    throw new Error(messageFromAxiosError(error));
  }
}
