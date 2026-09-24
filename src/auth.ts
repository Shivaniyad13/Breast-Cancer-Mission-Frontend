import { getCurrentUserAction, loginUserAction, logoutUserAction } from "@/app/actions/auth";

export async function auth() {
  try {
    const sessionData = await getCurrentUserAction();
    if (!sessionData || !sessionData.userId) {
      return null;
    }
    return {
      user: {
        id: sessionData.userId,
        name: sessionData.fullName || sessionData.user?.name || "User",
        email: sessionData.user?.email || "",
        role: sessionData.role,
      },
    };
  } catch (error) {
    console.error("Error in auth() helper:", error);
    return null;
  }
}

export async function signIn(provider?: string, options?: any) {
  if (options?.email && options?.password) {
    const res = await loginUserAction(options.email, options.password);
    if (res.error) {
      return { error: res.error };
    }
    return { ok: true, url: options.callbackUrl || "/dashboard" };
  }
  return { error: "Credentials required" };
}

export async function signOut(options?: any) {
  return logoutUserAction();
}

export const handlers = {
  GET: async () => new Response("OK"),
  POST: async () => new Response("OK"),
};
