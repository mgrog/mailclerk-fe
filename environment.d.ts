declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    NEXT_PUBLIC_AUTH_URL: string;
    NEXT_PUBLIC_MAX_RULE_COUNT: number;
    NEXT_PUBLIC_API_URL: string;
  }
}
