"use server";
import { auth } from "@/lib/auth";

export const signIn = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email: email,
        password: password,
      },
    });
    return { success: true, message: "წარმატებით გაიარეთ ავტორიზაცია" };
  } catch (error) {
    const e = error as Error;
    return { success: false, message: e.message || "შეცდომა" };
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
    return { success: true, message: "წარმატებით გაიარეთ რეგისტრაცია" };
  } catch (error) {
    const e = error as Error;
    return { success: false, message: e.message || "შეცდომა" };
  }
};
