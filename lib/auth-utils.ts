import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  const role = (user as any).role

  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    redirect("/")
  }

  return user
}
