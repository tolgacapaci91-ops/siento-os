"use client";

import React from "react";
import { motion } from "framer-motion";
import { MonitorPlay, Camera, Video, Image as ImageIcon, Search, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";

const categories = [
  { icon: MonitorPlay, title: "Kanal Kurulumu", desc: "Profesyonel bir marka kimliği oluşturun." },
  { icon: Camera, title: "Video Çekimi", desc: "Kamera karşısında rahat olma ve ışık teknikleri." },
  { icon: Video, title: "Video Düzenleme", desc: "Premiere ve DaVinci ile akıcı kurgu teknikleri." },
  { icon: ImageIcon, title: "Kapak Resmi", desc: "Tıklama oranını artıran (CTR) thumbnail tasarımları." },
  { icon: Search, title: "YouTube SEO", desc: "Algoritmayı anlayın ve aramalarda üst sıraya çıkın." },
  { icon: DollarSign, title: "Para Kazanma", desc: "Sponsorluklar ve AdSense ile gelirinizi artırın." },
];

export function MarketingEducationCategories() {
  return (
    <section id="education" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-white mb-6"
            >
              Kapsamlı Eğitim Kataloğu
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 text-lg leading-relaxed"
            >
              Bir YouTube kanalını sıfırdan zirveye taşımak için ihtiyacınız olan tüm yetkinlikleri modüler eğitimlerle keşfedin.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="shrink-0"
          >
            <Link href="/login" className="inline-flex items-center gap-2 text-indigo-400 font-semibold hover:text-indigo-300 transition-colors group">
              Tüm Eğitimleri İncele 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="group p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:bg-slate-800/60 hover:border-indigo-500/30 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                <category.icon className="w-6 h-6 text-slate-300 group-hover:text-indigo-400 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{category.title}</h3>
              <p className="text-sm text-slate-400">{category.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
