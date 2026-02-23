"use client";

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if a user is currently logged in
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for login/logout changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="fixed w-full z-50 px-6 py-6">
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-white/20 rounded-[2.5rem] px-8 py-4 flex items-center justify-between shadow-lg shadow-slate-200/50">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-slate-900 tracking-tighter italic">
          LIZA<span className="text-blue-600">ESTATE</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/browse?type=Sale" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">Buy</Link>
          <Link href="/browse?type=Rent" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">Rent</Link>
          
          {/* Conditional Links based on Auth State */}
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-semibold text-blue-600 hover:underline">My Listings</Link>
              <button 
                onClick={handleLogout}
                className="text-sm font-semibold text-red-500 hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">
              Login
            </Link>
          )}

          <Link 
            href="/list-property" 
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-blue-600 transition shadow-lg shadow-blue-100"
          >
            List a Home
          </Link>
        </div>
      </div>
    </nav>
  );
}