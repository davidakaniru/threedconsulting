export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiErrorDetails = Record<string, string>;

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetails;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorResponse;
