import React from 'react';
import { Search } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative h-[85vh] w-full flex items-center justify-center pt-20">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071" 
          alt="Modern Villa"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/40" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Find Your <span className="text-blue-400">Signature</span> Home.
        </h1>
        <p className="text-xl text-white/90 mb-10 font-light max-w-2xl mx-auto">
          Exclusive access to the world's most sophisticated architectural masterpieces.
        </p>
        
        {/* Updated: Added form action to navigate to /browse */}
        <form 
          action="/browse" 
          method="GET" 
          className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto"
        >
          <div className="flex-1 flex items-center gap-3 px-4 py-3">
            <Search className="text-blue-600" size={22} />
            <input 
              name="query" // This name 'query' matches our browse page logic
              type="text" 
              placeholder="Enter city, neighborhood, or ZIP..." 
              className="w-full outline-none text-slate-800 bg-transparent"
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold transition-all transform active:scale-95"
          >
            Search Properties
          </button>
        </form>
      </div>
    </div>
  );
}