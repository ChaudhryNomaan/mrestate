import Navbar from "@/components/layout/Navbar";
import PropertyCard from "@/components/ui/PropertyCard";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function BrowsePage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const rawProperties = await prisma.property.findMany({
    where: {
      category: params.type ? { equals: params.type, mode: 'insensitive' } : undefined,
      location: params.location ? { contains: params.location, mode: 'insensitive' } : undefined,
    },
    orderBy: { createdAt: "desc" },
  });

  const properties = rawProperties.map(p => ({
    ...p,
    id: p.id.toString(),
    image: p.image || "https://placehold.co/600x400?text=No+Image" // Use a placeholder ONLY if empty
  }));

  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-32 px-6">
        <h1 className="text-3xl font-bold mb-8 italic">Search Results</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </main>
  );
}