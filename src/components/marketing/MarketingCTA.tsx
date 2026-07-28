"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function MarketingCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/20 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-10 md:p-16 text-center shadow-2xl shadow-indigo-500/20 overflow-hidden relative"
        >
          {/* Abstract shapes */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Bugün Başla.
            </h2>
            <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              YouTube kariyerine ilk adımını at. Sıfırdan profesyonelliğe uzanan bu yolculukta sana rehberlik etmek için buradayız.
            </p>
            
            <Link href="/login">
              <Button 
                variant="primary" 
                size="lg" 
                className="bg-white text-indigo-600 hover:bg-slate-50 border-none shadow-xl h-14 px-10 text-lg group"
                rightIcon={<ArrowRight className="w-5 h-5 text-indigo-500 group-hover:translate-x-1 transition-transform" />}
              >
                Hemen Başla
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
