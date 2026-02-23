import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import { Bed, Bath, Maximize, MapPin, ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import GalleryButton from "@/components/ui/GalleryButton";
import DeletePropertyButton from "@/components/ui/DeletePropertyButton"; 
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();

  // 1. Supabase Server Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  let property;
  try {
    property = await prisma.property.findUnique({
      where: { id: BigInt(id) },
    });
  } catch (e) {
    return notFound();
  }

  if (!property) return notFound();

  const isOwner = user && user.id === property.user_id;

  // 2. Clean Gallery Logic
  const rawGallery = property.gallery && property.gallery.length > 0 
    ? property.gallery 
    : [property.image];
    
  const slides = rawGallery
    .filter((url): url is string => typeof url === 'string' && url !== null)
    .map((url) => ({ src: url }));

  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-32 px-6 pb-20">
        <Link href="/browse" className="inline-flex items-center text-slate-500 hover:text-blue-600 font-medium mb-8 transition-colors group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="relative group">
            <div className="rounded-[3rem] overflow-hidden h-[600px] shadow-2xl bg-slate-100 border border-slate-100">
              <img 
                src={property.image || ""} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                alt={property.title} 
              />
            </div>
            <div className="absolute bottom-6 left-6">
              <GalleryButton slides={slides} />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-xs font-bold uppercase tracking-widest">
                  For {property.category}
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
                {property.title}
              </h1>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-blue-600">
                  ${property.price.toLocaleString()}
                </span>
                {property.category === "Rent" && <span className="text-slate-500 font-medium">/ month</span>}
              </div>
              
              <div className="flex items-center text-slate-500 text-lg py-4 border-y border-slate-100">
                <MapPin className="mr-2 text-blue-600" size={22} />
                {property.location}
              </div>

              <div className="py-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">The Space</h3>
                <p className="text-slate-600 leading-relaxed text-lg italic">
                  "{property.description}"
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="bg-slate-50 p-6 rounded-[2.5rem] text-center">
                  <Bed className="mx-auto mb-2 text-blue-600" size={24} />
                  <span className="block font-bold text-2xl text-slate-900">{property.beds}</span>
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Beds</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-[2.5rem] text-center">
                  <Bath className="mx-auto mb-2 text-blue-600" size={24} />
                  <span className="block font-bold text-2xl text-slate-900">{property.baths}</span>
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Baths</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-[2.5rem] text-center">
                  <Maximize className="mx-auto mb-2 text-blue-600" size={24} />
                  <span className="block font-bold text-2xl text-slate-900">{property.sqft}</span>
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Sq Ft</span>
                </div>
              </div>

              <div className="pt-8 flex flex-col gap-4">
                <button className="w-full bg-slate-900 text-white py-6 rounded-[2rem] text-xl font-bold hover:bg-blue-700 transition-all shadow-xl active:scale-95">
                  Contact Agent
                </button>
                {isOwner && <DeletePropertyButton id={id} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}