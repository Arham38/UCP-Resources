"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom");
  const authEnabled = Boolean(supabase);

  useEffect(() => {
    if (!supabase) return;

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const redirectUrl = redirectedFrom || "/dashboard";
        router.push(redirectUrl);
      }
    });

    return () => subscription?.unsubscribe();
  }, [router, redirectedFrom]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">
            SlideIQ
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-300 text-sm mb-8">
            Sign in to continue
          </p>
          {authEnabled ? (
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={["google"]}
              theme="dark"
            />
          ) : (
            <div className="text-center text-sm text-slate-600 dark:text-slate-300 space-y-4">
              <p>Authentication is disabled.</p>
              <p>Add Supabase credentials in your .env.local file to enable login.</p>
              <Button onClick={() => router.push("/dashboard")} className="w-full">
                Continue as Guest
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
