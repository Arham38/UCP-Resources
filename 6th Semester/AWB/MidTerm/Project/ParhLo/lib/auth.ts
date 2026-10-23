import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

const hasSupabaseEnv =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const devFallbackUser = {
  id: "local-dev-user"
};

export async function getAuthenticatedUser() {
  if (!hasSupabaseEnv) {
    return devFallbackUser;
  }

  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  if (error || !session?.user) {
    return null;
  }

  return session.user;
}
