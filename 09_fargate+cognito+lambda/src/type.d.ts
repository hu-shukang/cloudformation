declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    LOG_LEVEL: string;
    USER_POOL_CLIENT_ID: string;
    CRYPTO_KEY: string;
  }
}
