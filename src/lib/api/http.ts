import { env } from '@/env';

export type RequestConfig<TData = unknown> = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  baseURL?: string;
  params?: Record<string, unknown>;
  data?: TData | FormData;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export type ResponseConfig<TData = unknown> = {
  data: TData;
  status: number;
  statusText: string;
  headers?: Headers;
};

export type ResponseErrorConfig<TError = unknown> = {
  status: number;
  statusText: string;
  data: TError;
};

export type Client = <TData, _TError = unknown, TVariables = unknown>(
  config: RequestConfig<TVariables>,
) => Promise<ResponseConfig<TData>>;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const buildQuery = (params?: Record<string, unknown>) => {
  if (!params) return '';
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) v.forEach((item) => search.append(k, String(item)));
    else search.append(k, String(v));
  }
  const s = search.toString();
  return s ? `?${s}` : '';
};

export async function client<TData, TError = unknown, TVariables = unknown>(
  config: RequestConfig<TVariables>,
): Promise<ResponseConfig<TData>> {
  const baseURL = config.baseURL ?? env.NEXT_PUBLIC_API_URL;
  const url = `${baseURL}${config.url}${buildQuery(config.params)}`;
  const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;

  const headers: Record<string, string> = { ...config.headers };
  let body: BodyInit | undefined;
  if (config.data !== undefined && config.method !== 'GET') {
    if (isFormData) {
      body = config.data as FormData;
    } else {
      headers['Content-Type'] ??= 'application/json';
      body = JSON.stringify(config.data);
    }
  }

  const res = await fetch(url, {
    method: config.method,
    headers,
    body,
    signal: config.signal,
    credentials: 'same-origin',
  });

  const contentType = res.headers.get('content-type') ?? '';
  const data = contentType.includes('application/json')
    ? ((await res.json()) as TData)
    : ((await res.text()) as unknown as TData);

  if (!res.ok) {
    throw new ApiError(`${res.status} ${res.statusText}`, res.status, data) as unknown as TError &
      Error;
  }

  return { data, status: res.status, statusText: res.statusText, headers: res.headers };
}

export default client as Client;
