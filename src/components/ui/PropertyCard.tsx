import { Bed, Bath, Maximize, MapPin } from "lucide-react";
import Link from "next/link";

export default function PropertyCard({ property }: { property: any }) {
  return (
    <Link href={`/property/${property.id}`} className="block"> 
      <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all">
        <div className="relative h-64">
          <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4 bg-white px-4 py-1 rounded-xl font-bold">
            ${property.price?.toLocaleString()}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold truncate">{property.title}</h3>
          <div className="flex items-center text-slate-500 text-sm mt-2">
            <MapPin size={14} className="mr-1" /> {property.location}
          </div>
          <div className="flex justify-between mt-4 p-3 bg-slate-50 rounded-xl text-sm">
            <span>{property.beds} Beds</span>
            <span>{property.baths} Baths</span>
            <span>{property.sqft} Sqft</span>
          </div>
        </div>
      </div>
    </Link>
  );
}