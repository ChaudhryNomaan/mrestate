"use client";
import { useState } from "react";
import { deleteProperty } from "@/app/actions/delete-property";
import DeleteModal from "@/components/ui/DeleteModal";
import { Trash2 } from "lucide-react";

export default function DeletePropertyButton({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    console.log("Button clicked for ID:", id);
    const result = await deleteProperty(id);
    
    if (result.success) {
      // Use window.location.href to force a hard refresh so the list updates
      window.location.href = "/browse";
    } else {
      setLoading(false);
      setIsOpen(false);
      alert("Database refused to delete. Check your terminal logs.");
    }
  };

  return (
    <div className="mt-6 border-t border-slate-100 pt-6">
      <button 
        type="button"
        onClick={() => {
          console.log("Opening Modal...");
          setIsOpen(true);
        }}
        className="w-full flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-50 py-4 rounded-2xl transition-all border border-red-100"
      >
        <Trash2 size={20} />
        Delete this Listing
      </button>

      {/* This MUST be here to show up */}
      <DeleteModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}