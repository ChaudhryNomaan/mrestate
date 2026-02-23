"use client";

import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar"; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ListPropertyPage() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(""); // Fixed: Single string instead of array
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please log in to list a property.");
        window.location.href = "/login";
      }
      setUser(user);
    };
    getUser();
  }, []);
  
  // Updated to handle a single file upload correctly
  async function handleUpload(event: any) {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('property-images') 
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      setImageUrl(data.publicUrl); // Store the single URL string
    } catch (error) {
      alert('Upload failed!');
      console.log(error);
    } finally {
      setUploading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert("Please upload a property image.");
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
            price: parseInt(target.price.value),
            location: target.location.value,
            beds: parseInt(target.beds.value),
            baths: parseInt(target.baths.value),
            sqft: parseInt(target.sqft.value),
            category: target.category.value,
            image: imageUrl, // Fixed: Sending the string to the TEXT column
            user_id: user.id 
          }
        ]);

      if (error) throw error;
      alert("Property listed successfully!");
      window.location.href = "/"; 
    } catch (error) {
      console.error("Error saving property:", error);
      alert("Failed to save property.");
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto py-20 px-6">
        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/60 p-12 border border-slate-100">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight italic">List Your <span className="text-blue-600">Property</span></h1>
            <p className="text-slate-500 mt-3 text-lg">Upload a photo to showcase your property.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Property Photo</label>
              <div className="relative group border-2 border-dashed border-slate-200 rounded-[2rem] p-8 transition-all hover:border-blue-400 hover:bg-blue-50/30 text-center">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {imageUrl ? (
                  <div className="relative h-64 w-full">
                    <img src={imageUrl} alt="Preview" className="h-full w-full object-cover rounded-2xl shadow-sm" />
                    <p className="mt-2 text-sm text-blue-600 font-bold">Image selected! Click to change.</p>
                  </div>
                ) : (
                  <div className="py-8">
                    <p className="text-slate-600 font-medium">{uploading ? "Uploading..." : "Click to select a photo"}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Property Title</label>
                <input name="title" type="text" placeholder="e.g. Modern Glass Villa" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Price ($)</label>
                <input name="price" type="number" placeholder="4500000" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Listing Type</label>
                <select name="category" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl appearance-none">
                  <option value="Sale">For Sale</option>
                  <option value="Rent">For Rent</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Location</label>
                <input name="location" type="text" placeholder="e.g. Beverly Hills, CA" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Description</label>
              <textarea name="description" placeholder="Describe the property..." required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl h-32" />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Beds</label>
                <input name="beds" type="number" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Baths</label>
                <input name="baths" type="number" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sq Ft</label>
                <input name="sqft" type="number" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl" />
              </div>
            </div>

            <button type="submit" disabled={uploading || !user} className="w-full bg-slate-900 text-white py-6 rounded-[2rem] text-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 disabled:opacity-50">
              {uploading ? "Saving Listing..." : "Post Listing"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}