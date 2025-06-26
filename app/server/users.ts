"use server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const signIn = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email: email,
        password: password,
      },
    });
    redirect("/");
  } catch (error) {
    const e = error as Error;
    throw new Error(e.message || "შეცდომა ავტორიზაციისას");
  }
};

export const signUp = async (email: string, password: string, name: string) => {
  try {
    await auth.api.signUpEmail({
      body: {
        email: email,
        password: password,
        name: name,
      },
    });
    redirect("/login");
  } catch (error) {
    const e = error as Error;
    return { success: false, message: e.message || "შეცდომา" };
  }
};

export const signOutAction = async () => {
  try {
    await auth.api.signOut({
      headers: new Headers(),
    });
    redirect("/");
  } catch (error) {
    const e = error as Error;
    throw new Error(e.message || "შეცდომა გასვლისას");
  }
};
