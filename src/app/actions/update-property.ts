"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProperty(id: string, formData: any) {
  try {
    // We convert the ID to BigInt and update the record in PostgreSQL
    await prisma.property.update({
      where: { id: BigInt(id) },
      data: {
        title: formData.title,
        price: parseInt(formData.price),
        location: formData.location,
        description: formData.description,
        beds: parseInt(formData.beds),
        baths: parseInt(formData.baths),
        sqft: parseInt(formData.sqft),
        category: formData.category,
        // If you want to update images, you'd add them here too
      },
    });

    // This clears the cache so the "Details" page shows the new info
    revalidatePath("/browse");
    revalidatePath(`/property/${id}`);
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false };
  }
}