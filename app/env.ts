// app/env.ts
export const HTTP_SERVER =
    (process.env.NEXT_PUBLIC_HTTP_SERVER as string) || "http://localhost:4000";
