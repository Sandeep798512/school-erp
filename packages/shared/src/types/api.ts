export interface ApiResponseMeta {
  page?: number;
  limit?: number;
  totalItems?: number;
  totalPages?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: ApiResponseMeta;
  timestamp: string;
  correlationId: string;
}

export interface ApiErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  correlationId: string;
  errors?: Record<string, string[]>;
}
