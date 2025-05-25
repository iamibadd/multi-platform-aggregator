export interface ErrorResponse {
  status: 'error';
  msg: string;
}

export function handleError(error: unknown): ErrorResponse {
  if (error instanceof Error) {
    return {
      status: 'error',
      msg: error.message,
    };
  }

  return {
    status: 'error',
    msg: 'Something went wrong',
  };
}
