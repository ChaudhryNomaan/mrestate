"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteProperty(id: string) {
  console.log("Attempting to delete ID:", id); // Check your terminal for this!
  try {
    const deleted = await prisma.property.delete({
      where: { id: BigInt(id) },
    });
    
    console.log("Delete successful:", deleted);
    revalidatePath("/browse");
    return { success: true };
  } catch (error) {
    console.error("DATABASE DELETE ERROR:", error);
    return { success: false };
  }
}