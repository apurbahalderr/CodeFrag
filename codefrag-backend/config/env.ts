function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const ACCESS_TOKEN_SECRET = required('ACCESS_TOKEN_SECRET');
export const REFRESH_TOKEN_SECRET = required('REFRESH_TOKEN_SECRET');
export const ACCESS_TOKEN_EXPIRES = required('ACCESS_TOKEN_EXPIRES');
export const REFRESH_TOKEN_EXPIRES = required('REFRESH_TOKEN_EXPIRES');
export const MONGODB_URI = required('MONGODB_URI');