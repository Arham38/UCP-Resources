"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authEnabled = Boolean(supabase);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const getUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white">SlideIQ</span>
          </Link>

          <div className="flex items-center gap-4">
            {!loading && user ? (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user.email?.[0].toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate-600 dark:text-slate-300"
                >
                  Logout
                </Button>
              </>
            ) : authEnabled ? (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
