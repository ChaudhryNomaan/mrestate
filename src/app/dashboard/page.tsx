"use client";

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import Navbar from "@/components/layout/Navbar";
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [myProperties, setMyProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserListings();
  }, []);

  async function fetchUserListings() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from('Property')
      .select('*')
      .eq('user_id', user.id); // Security: Only show my own posts

    if (data) setMyProperties(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    const { error } = await supabase
      .from('Property')
      .delete()
      .eq('id', id); // Row Level Security ensures only owner can delete

    if (error) alert("Error deleting: " + error.message);
    else fetchUserListings();
  }

  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-32 px-6 pb-20">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Admin Panel</h1>
            <p className="text-slate-500">Manage your active property listings</p>
          </div>
          <Link href="/list-property" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition">
            + New Listing
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-20">Loading your properties...</div>
        ) : (
          <div className="grid gap-4">
            {myProperties.map((p) => (
              <div key={p.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition">
                <div className="flex items-center gap-6 w-full">
                  <img src={p.image} className="w-24 h-24 rounded-2xl object-cover" alt="" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{p.title}</h3>
                    <p className="text-blue-600 font-semibold">${p.price.toLocaleString()}</p>
                    <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase font-bold tracking-wider">
                      {p.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3 w-full md:w-auto">
                  {/* UPDATED: Link to the dynamic edit page */}
                  <Link 
                    href={`/edit-property/${p.id}`}
                    className="flex-1 md:flex-none px-6 py-3 bg-slate-50 text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition text-center"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="flex-1 md:flex-none px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {myProperties.length === 0 && (
              <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
                <p className="text-slate-400 text-lg">You haven't posted any properties yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}