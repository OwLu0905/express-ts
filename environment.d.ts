import { Secret } from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      MONGODB_PASS: string;
      MONGODB_URL: string;
      DATABASE_LOCAL: string;
      JWT_SECRET: any;
      JWT_EXPIRES_IN: any;
    }
  }
}
export {};
