"use client";

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import Navbar from "@/components/layout/Navbar";
import Link from 'next/link';
import DeleteModal from "@/components/ui/DeleteModal"; 
import { deleteProperty } from "@/app/actions/delete-property";
import toast from "react-hot-toast"; // 1. Added this import

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [myProperties, setMyProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchUserListings();
  }, []);

  async function fetchUserListings() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data } = await supabase
      .from('Property')
      .select('*')
      .eq('user_id', user.id);

    if (data) setMyProperties(data);
    setLoading(false);
  }

  function openDeleteConfirm(id: string) {
    setPropertyToDelete(id);
    setIsModalOpen(true);
  }

  async function handleConfirmDelete() {
    if (!propertyToDelete) return;
    
    setDeleteLoading(true);
    const result = await deleteProperty(propertyToDelete);
    
    if (result.success) {
      setIsModalOpen(false);
      setPropertyToDelete(null);
      toast.success("Listing removed successfully"); // 2. Modern success message
      fetchUserListings(); 
    } else {
      // 3. Replaced the old alert with a luxury toast
      toast.error("Could not delete listing. Please try again.");
    }
    setDeleteLoading(false);
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
          <div className="text-center py-20 text-slate-400 font-medium">Loading your properties...</div>
        ) : (
          <div className="grid gap-4">
            {myProperties.map((p) => (
              <div key={p.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-6 w-full">
                  <img src={p.image} className="w-24 h-24 rounded-2xl object-cover shadow-sm" alt="" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{p.title}</h3>
                    <p className="text-blue-600 font-bold">${p.price.toLocaleString()}</p>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase font-bold tracking-widest mt-1 inline-block">
                      {p.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3 w-full md:w-auto">
                  <Link 
                    href={`/edit-property/${p.id}`}
                    className="flex-1 md:flex-none px-8 py-3 bg-slate-50 text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition text-center border border-slate-100"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => openDeleteConfirm(p.id.toString())}
                    className="flex-1 md:flex-none px-8 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition border border-red-50"
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

      <DeleteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </main>
  );
}