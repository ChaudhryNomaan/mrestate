import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import { Bed, Bath, Maximize, MapPin } from "lucide-react";
import { notFound } from "next/navigation";

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const property = await prisma.property.findUnique({
    where: { id: BigInt(id) },
  });

  if (!property) return notFound();

  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-32 px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="rounded-[3rem] overflow-hidden h-[500px] shadow-2xl">
            <img 
              src={property.image || ""} 
              className="w-full h-full object-cover" 
              alt={property.title} 
            />
          </div>
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-slate-900">{property.title}</h1>
            <p className="text-3xl text-blue-600 font-bold">${property.price.toLocaleString()}</p>
            <div className="flex items-center text-slate-500 text-lg">
              <MapPin className="mr-2" /> {property.location}
            </div>
            <p className="text-slate-600 leading-relaxed text-lg">{property.description}</p>
            <div className="grid grid-cols-3 gap-4 py-8">
              <div className="bg-slate-50 p-6 rounded-3xl text-center">
                <Bed className="mx-auto mb-2 text-blue-600" />
                <span className="block font-bold text-xl">{property.beds}</span>
                <span className="text-slate-400 text-sm uppercase">Beds</span>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl text-center">
                <Bath className="mx-auto mb-2 text-blue-600" />
                <span className="block font-bold text-xl">{property.baths}</span>
                <span className="text-slate-400 text-sm uppercase">Baths</span>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl text-center">
                <Maximize className="mx-auto mb-2 text-blue-600" />
                <span className="block font-bold text-xl">{property.sqft}</span>
                <span className="text-slate-400 text-sm uppercase">Sq Ft</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}