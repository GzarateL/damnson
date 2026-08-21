'use server'

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"

export async function loginAction(prevState: any, formData: FormData) {
  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirectTo: "/admin",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales inválidas." }
        default:
          return { error: "Ocurrió un error inesperado." }
      }
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/login' });
}
