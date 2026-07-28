"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const screenshots = [
  {
    id: "dashboard",
    title: "Dashboard",
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "course",
    title: "Course Player",
    src: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "workshop",
    title: "Workshop",
    src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "achievements",
    title: "Achievements",
    src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2000&auto=format&fit=crop",
  },
];

export function MarketingPlatformPreview() {
  const [activeTab, setActiveTab] = useState(screenshots[0]);

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            İçeriden Bir Bakış
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg leading-relaxed"
          >
            Modern, hızlı ve dikkat dağıtmayan Premium arayüz ile sadece öğrenmeye odaklanın.
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {screenshots.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab.id === item.id
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Screenshot View */}
        <div className="relative rounded-2xl border border-white/10 bg-slate-900/50 p-2 shadow-2xl backdrop-blur-sm overflow-hidden min-h-[300px] md:min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative aspect-[16/10] md:aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950"
            >
              <Image
                src={activeTab.src}
                alt={activeTab.title}
                fill
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
