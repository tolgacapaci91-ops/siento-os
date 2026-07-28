"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function MarketingHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center lg:items-start lg:text-left z-10"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              SientoOps Academy Açıldı
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6"
            >
              YouTube'da Başarıya Giden Yol{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Burada Başlıyor.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl leading-relaxed"
            >
              Sıfırdan profesyonelliğe uzanan video eğitimleri, PDF rehberleri ve uygulamalı workshoplarla içerik üreticiliğini öğren.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto h-14 px-8 text-base" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Eğitime Başla
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base border-white/10 hover:bg-white/5" leftIcon={<PlayCircle className="w-5 h-5" />}>
                  Platformu Keşfet
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Image Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="relative lg:ml-10 z-10 [perspective:1000px]"
          >
            <div className="relative rounded-2xl border border-white/10 bg-slate-900/50 p-2 shadow-2xl shadow-indigo-500/20 backdrop-blur-sm overflow-hidden transform-gpu">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent pointer-events-none" />
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-white/5 bg-slate-950">
                <Image
                  src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop"
                  alt="SientoOps Platform Dashboard Preview"
                  fill
                  className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                  priority
                />
                
                {/* Mockup UI Elements overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-12 h-12 rounded-lg bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 flex items-center justify-center">
                      <PlayCircle className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-sm font-bold text-white">Video Düzenleme 101</div>
                      <div className="text-xs text-indigo-300">İzlenmeye Hazır</div>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/20 backdrop-blur-md">
                    %100 Tamamlandı
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
