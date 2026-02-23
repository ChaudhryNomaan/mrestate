"use client";

import { createClient } from '@supabase/supabase-js';
import { useState, useEffect, use } from 'react';
import Navbar from "@/components/layout/Navbar"; 
import toast from "react-hot-toast"; // 1. Added modern toasts
import { updateProperty } from "@/app/actions/update-property"; // 2. Added the save action

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [propertyData, setPropertyData] = useState<any>(null);

  useEffect(() => {
    async function getProperty() {
      const { data } = await supabase.from('Property').select('*').eq('id', id).single();
      if (data) {
        setPropertyData(data);
        setImageUrl(data.image);
      }
      setLoading(false);
    }
    getProperty();
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `property-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('property-images').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
      toast.success("Image uploaded successfully!"); // Modern toast
    } catch (error) {
      toast.error("Error uploading image!");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as any;

    const data = {
      title: target.title.value,
      description: target.description.value,
      price: target.price.value,
      location: target.location.value,
      beds: target.beds.value,
      baths: target.baths.value,
      sqft: target.sqft.value,
      category: target.category.value,
      image: imageUrl
    };

    try {
      // 3. Using our Server Action to ensure DB updates and cache revalidation
      const result = await updateProperty(id, data);

      if (result.success) {
        toast.success("Listing updated successfully!");
        setTimeout(() => {
            window.location.href = "/dashboard";
        }, 1500);
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      toast.error("Failed to save changes.");
    }
  };

  if (loading) return <div className="pt-40 text-center font-bold text-slate-400">Loading details...</div>;

  return (
    <main className="bg-slate-50 min-h-screen pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-32 px-6">
        <div className="bg-white rounded-[3rem] p-12 shadow-xl border border-slate-100">
          <h1 className="text-3xl font-bold mb-8 italic text-slate-900">Edit <span className="text-blue-600">Listing</span></h1>
          
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 ml-2">Property Image</label>
              <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-[2rem] border border-dashed border-slate-300">
                <img src={imageUrl} className="w-32 h-32 rounded-2xl object-cover shadow-md" alt="Preview" />
                <div className="flex-1">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-slate-400 mt-2">{uploading ? "Uploading..." : "Click to change image"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Title</label>
                <input name="title" defaultValue={propertyData?.title} className="px-6 py-4 bg-slate-50 rounded-2xl border w-full focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Price ($)</label>
                <input name="price" type="number" defaultValue={propertyData?.price} className="px-6 py-4 bg-slate-50 rounded-2xl border w-full focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Category</label>
                <select name="category" defaultValue={propertyData?.category} className="px-6 py-4 bg-slate-50 rounded-2xl border w-full outline-none">
                  <option value="Sale">Sale</option>
                  <option value="Rent">Rent</option>
                </select>
               </div>
               <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Location</label>
                <input name="location" defaultValue={propertyData?.location} className="px-6 py-4 bg-slate-50 rounded-2xl border w-full outline-none" required />
               </div>
            </div>
            
            <div className="space-y-1">
               <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Description</label>
               <textarea name="description" defaultValue={propertyData?.description} className="px-6 py-4 bg-slate-50 rounded-2xl border w-full h-32 outline-none" required />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Beds</label>
                  <input name="beds" type="number" defaultValue={propertyData?.beds} className="px-6 py-4 bg-slate-50 rounded-2xl border w-full" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Baths</label>
                  <input name="baths" type="number" defaultValue={propertyData?.baths} className="px-6 py-4 bg-slate-50 rounded-2xl border w-full" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Sq Ft</label>
                  <input name="sqft" type="number" defaultValue={propertyData?.sqft} className="px-6 py-4 bg-slate-50 rounded-2xl border w-full" required />
                </div>
            </div>

            <button 
              type="submit" 
              disabled={uploading}
              className={`w-full py-5 rounded-2xl font-bold text-lg transition shadow-xl ${uploading ? 'bg-slate-300' : 'bg-blue-600 text-white hover:bg-slate-900 shadow-blue-200 active:scale-95'}`}
            >
              {uploading ? "Processing..." : "Save Luxury Changes"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}