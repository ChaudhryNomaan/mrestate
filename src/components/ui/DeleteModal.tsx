"use client";
import { Trash2 } from "lucide-react";

export default function DeleteModal({ isOpen, onClose, onConfirm, loading }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Dark Blur Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white rounded-[3rem] p-12 max-w-sm w-full shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <Trash2 className="text-red-500" size={40} />
        </div>
        
        <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Delete Listing?</h3>
        <p className="text-slate-500 mb-10 text-lg leading-relaxed">
          This luxury property will be permanently removed from your collection.
        </p>
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={onConfirm}
            disabled={loading}
            className="w-full bg-red-500 text-white py-5 rounded-2xl font-bold text-lg hover:bg-red-600 transition-all shadow-lg shadow-red-200 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Yes, Delete Property"}
          </button>
          <button 
            onClick={onClose}
            className="w-full bg-slate-50 text-slate-500 py-5 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}