"use client";
import toast from "react-hot-toast";
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar"; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ListPropertyPage() {
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to list a property.");
        window.location.href = "/login";
      }
      setUser(user);
    };
    getUser();
  }, []);
  
  async function handleMultipleUploads(event: any) {
    try {
      setUploading(true);
      const files = Array.from(event.target.files as FileList);
      if (files.length === 0) return;

      const newUrls = [...imageUrls];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        
        let { error: uploadError } = await supabase.storage
          .from('property-images') 
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);

        newUrls.push(data.publicUrl);
      }

      setImageUrls(newUrls);
      toast.success("Images uploaded!");
    } catch (error) {
      toast.error('Upload failed!');
    } finally {
      setUploading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get fresh user to avoid the {} error
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      toast.error("User session not found. Please log in again.");
      return;
    }

    if (imageUrls.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    const target = e.target as any;
    
    try {
      const { error } = await supabase
        .from('Property')
        .insert([
          {
            title: target.title.value,
            description: target.description.value, 
            price: Number(target.price.value),
            location: target.location.value,
            beds: Number(target.beds.value),
            baths: Number(target.baths.value),
            sqft: Number(target.sqft.value),
            category: target.category.value,
            image: imageUrls[0], 
            gallery: imageUrls,   
            user_id: currentUser.id 
          }
        ])
        .select(); // This helps show the real error if it fails

      if (error) {
        console.error("Supabase Database Error:", error.message, error.details);
        throw error;
      }
      
      toast.success("Property listed successfully! 🏡");
      
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
      
    } catch (error: any) {
      console.error("Submit Catch Error:", error);
      toast.error(error.message || "Database rejected the listing. Check RLS policies.");
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto py-20 px-6">
        <div className="bg-white rounded-[3rem] shadow-xl p-12 border border-slate-100 mt-10">
          <h1 className="text-4xl font-bold mb-8 italic">Create <span className="text-blue-600">Listing</span></h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-2">Upload Gallery</label>
              <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center hover:bg-blue-50 transition-all relative group">
                <input 
                  type="file" 
                  accept="image/*"
                  multiple 
                  onChange={handleMultipleUploads}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {imageUrls.length > 0 ? (
                  <div className="grid grid-cols-4 gap-4">
                    {imageUrls.map((url, i) => (
                      <div key={i} className="relative aspect-square">
                         <img src={url} className="h-full w-full object-cover rounded-xl shadow-sm" alt="Preview" />
                      </div>
                    ))}
                    <div className="aspect-square flex items-center justify-center border-2 border-dashed rounded-xl text-slate-400 bg-slate-50 group-hover:border-blue-300">
                        <span className="text-2xl">+</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-4">
                    <p className="text-slate-500 font-medium">{uploading ? "Uploading estates..." : "Drag and drop or click to upload images"}</p>
                    <p className="text-xs text-slate-400 mt-1">High-quality JPG or PNG preferred</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Property Title</label>
                <input name="title" placeholder="e.g. Modern Glass Villa" required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Price ($)</label>
                <input name="price" type="number" placeholder="500,000" required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Category</label>
                <select name="category" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none">
                  <option value="Sale">For Sale</option>
                  <option value="Rent">For Rent</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Location</label>
                <input name="location" placeholder="City, Country" required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Description</label>
                <textarea name="description" placeholder="Tell the world about this luxury estate..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl h-32 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-2 uppercase text-center block">Beds</label>
                <input name="beds" type="number" placeholder="0" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-center" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-2 uppercase text-center block">Baths</label>
                <input name="baths" type="number" placeholder="0" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-center" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-2 uppercase text-center block">Sqft</label>
                <input name="sqft" type="number" placeholder="0" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-center" />
              </div>
            </div>

            <button type="submit" disabled={uploading} className={`w-full py-6 rounded-[2rem] text-xl font-bold transition-all shadow-lg active:scale-95 ${uploading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-blue-100'}`}>
              {uploading ? "Uploading Estates..." : "Post Listing"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}