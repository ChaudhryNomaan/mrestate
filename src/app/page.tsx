import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import PropertyCard from "@/components/ui/PropertyCard";
import { prisma } from "@/lib/prisma";
// No need for Link import here anymore if we aren't using it

export default async function Home() {
  let properties = [];
  try {
    properties = await prisma.property.findMany({ orderBy: { createdAt: 'desc' }, take: 6 });
  } catch (e) {
    console.log("DB Error - Using Demo Data");
  }

  const demoData = [
    { id: "1", title: "Glass Villa", price: 4200000, location: "Beverly Hills, CA", beds: 5, baths: 6, sqft: 6200, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
    { id: "2", title: "Ocean Edge", price: 2850000, location: "Malibu, CA", beds: 4, baths: 3, sqft: 3100, image: "https://images.unsplash.com/photo-1600607687940-4e524cb35a3a" },
    { id: "3", title: "The Penthouse", price: 8900000, location: "New York, NY", beds: 3, baths: 4, sqft: 4500, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9" },
  ];

  // Keep the data clean; the PropertyCard handles formatting like .toLocaleString()
  const display = properties.length > 0 ? properties : demoData;

  return (
    <main className="bg-white min-h-screen pb-20">
      <Navbar />
      <Hero />
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-5xl font-light text-slate-900 tracking-tight">
              Curated <span className="font-bold">Collection</span>
            </h2>
            <div className="h-1.5 w-24 bg-blue-600 mt-6 rounded-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {display.map((item: any) => (
            /* Removed the extra <Link> wrapper to fix the hydration error */
            <PropertyCard key={item.id} property={item} />
          ))}
        </div>
      </section>
    </main>
  );
}