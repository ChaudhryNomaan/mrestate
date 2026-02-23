"use client";

import { createClient } from '@supabase/supabase-js';
import { useState, useEffect, use } from 'react';
import Navbar from "@/components/layout/Navbar";
import { Bed, Bath, Maximize, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PropertyDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function getProperty() {
      const { data } = await supabase.from('Property').select('*').eq('id', id).single();
      if (data) setProperty(data);
      setLoading(false);
    }
    getProperty();
  }, [id]);

  if (loading) return <div className="pt-40 text-center font-bold text-slate-400">Loading Property...</div>;
  if (!property) return <div className="pt-40 text-center">Property not found.</div>;

  const images = Array.isArray(property.image) ? property.image : [property.image];

  return (
    <main className="bg-white min-h-screen pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-32 px-6">
        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Main Large Image */}
          <div className="lg:col-span-2 relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl">
            <img src={images[activeImage]} className="w-full h-full object-cover transition-all duration-700" alt={property.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
               <span className="bg-blue-600 px-4 py-1 rounded-xl text-sm font-bold mb-3 inline-block">For {property.category}</span>
               <h1 className="text-4xl font-bold">{property.title}</h1>
            </div>
          </div>

          {/* Thumbnail Sidebar */}
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
            {images.map((url: string, index: number) => (
              <button 
                key={index} 
                onClick={() => setActiveImage(index)}
                className={`relative flex-shrink-0 w-32 h-32 lg:w-full lg:h-44 rounded-[2rem] overflow-hidden border-4 transition-all ${activeImage === index ? 'border-blue-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={url} className="w-full h-full object-cover" alt="thumbnail" />
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-2 text-slate-500 text-lg">
              <MapPin className="text-blue-600" /> {property.location}
            </div>

            <div className="flex gap-8 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Bedrooms</span>
                <div className="flex items-center gap-2 text-2xl font-bold"><Bed className="text-blue-600" /> {property.beds}</div>
              </div>
              <div className="w-[1px] bg-slate-200" />
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Bathrooms</span>
                <div className="flex items-center gap-2 text-2xl font-bold"><Bath className="text-blue-600" /> {property.baths}</div>
              </div>
              <div className="w-[1px] bg-slate-200" />
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Square Feet</span>
                <div className="flex items-center gap-2 text-2xl font-bold"><Maximize className="text-blue-600" /> {property.sqft}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">About this property</h2>
              <p className="text-slate-600 leading-relaxed text-lg">{property.description}</p>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="lg:col-start-3">
            <div className="sticky top-32 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
               <span className="text-slate-400 font-bold uppercase text-sm tracking-widest">Price</span>
               <div className="text-5xl font-bold text-slate-900 mb-8 mt-2">
                 ${property.price?.toLocaleString()}
               </div>
               <button className="w-full bg-slate-900 text-white py-6 rounded-2xl text-xl font-bold hover:bg-blue-600 transition-all mb-4">
                 Contact Agent
               </button>
               <button className="w-full bg-white text-slate-900 border border-slate-200 py-6 rounded-2xl text-xl font-bold hover:bg-slate-50 transition-all">
                 Take a Tour
               </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}