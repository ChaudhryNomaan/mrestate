"use client";

import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Navbar from "@/components/layout/Navbar";
import { useEffect } from 'react'; // Added for the redirect logic

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  // This monitors the login state and forces a redirect once authenticated
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        window.location.href = "/dashboard"; // Instantly moves to the admin panel
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto pt-40 px-6">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 italic">LIZA<span className="text-blue-600">ESTATE</span></h1>
            <p className="text-slate-500 mt-2">Sign in to manage your listings</p>
          </div>
          
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                  },
                  radii: {
borderRadiusButton: '1rem', // Changed from buttonRadius                    inputRadius: '1rem',
                  }
                }
              }
            }}
            providers={[]} 
            redirectTo={`${origin}/dashboard`}
          />
        </div>
      </div>
    </main>
  );
}