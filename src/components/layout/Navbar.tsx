"use client";

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Added for responsive icons

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed w-full z-50 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-[2.5rem] px-8 py-4 flex items-center justify-between shadow-lg shadow-slate-200/50">
          
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-slate-900 tracking-tighter italic hover:scale-105 transition-transform">
            LIZA<span className="text-blue-600">ESTATE</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/browse?type=Sale" className="text-sm font-semibold text-slate-600 hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-200">Buy</Link>
            <Link href="/browse?type=Rent" className="text-sm font-semibold text-slate-600 hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-200">Rent</Link>
            
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm font-semibold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline transition-all">My Listings</Link>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-semibold text-red-500 hover:text-red-600 hover:scale-105 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-all duration-200">
                Login
              </Link>
            )}

            <Link 
              href="/list-property" 
              className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 hover:-translate-y-1 transition-all duration-300 active:scale-95"
            >
              List a Home
            </Link>
          </div>

          {/* Mobile Toggle Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-slate-900 p-2 hover:bg-slate-100 rounded-full transition-colors">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white/95 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 shadow-2xl flex flex-col gap-5 animate-in slide-in-from-top-5 duration-300">
            <Link href="/browse?type=Sale" onClick={toggleMenu} className="text-lg font-semibold text-slate-700 border-b border-slate-50 pb-2">Buy</Link>
            <Link href="/browse?type=Rent" onClick={toggleMenu} className="text-lg font-semibold text-slate-700 border-b border-slate-50 pb-2">Rent</Link>
            
            {user ? (
              <>
                <Link href="/dashboard" onClick={toggleMenu} className="text-lg font-semibold text-blue-600">My Listings</Link>
                <button onClick={() => { handleLogout(); toggleMenu(); }} className="text-left text-lg font-semibold text-red-500">Logout</button>
              </>
            ) : (
              <Link href="/login" onClick={toggleMenu} className="text-lg font-semibold text-slate-700">Login</Link>
            )}

            <Link 
              href="/list-property" 
              onClick={toggleMenu}
              className="bg-blue-600 text-white text-center py-4 rounded-2xl text-lg font-bold shadow-lg"
            >
              List a Home
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}