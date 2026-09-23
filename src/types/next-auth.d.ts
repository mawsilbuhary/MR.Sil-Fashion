import { DefaultSession, DefaultUser } from "next-auth"
import { Role } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: Role | string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    role: Role | string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role | string
  }
}
