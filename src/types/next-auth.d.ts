// src/types/next-auth.d.ts

import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      image?: string;
    };
  }
}
