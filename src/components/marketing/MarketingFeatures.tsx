"use client";

import React from "react";
import { motion } from "framer-motion";
import { PlaySquare, FileText, MonitorPlay, Trophy } from "lucide-react";

const features = [
  {
    icon: PlaySquare,
    title: "Video Eğitimleri",
    description: "Sıfırdan ileri seviyeye kadar özel olarak hazırlanmış, 4K kalitesinde profesyonel video serileri ile kendi hızınızda öğrenin.",
    color: "from-blue-500 to-indigo-500",
    bgLight: "bg-blue-500/10",
    textLight: "text-blue-400",
  },
  {
    icon: FileText,
    title: "PDF Dokümanları",
    description: "Dersleri pekiştirmenizi sağlayacak detaylı notlar, kontrol listeleri ve sektörel şablonları anında cihazınıza indirin.",
    color: "from-emerald-400 to-teal-500",
    bgLight: "bg-emerald-500/10",
    textLight: "text-emerald-400",
  },
  {
    icon: MonitorPlay,
    title: "Workshoplar",
    description: "Gerçek hayat senaryoları üzerinden ilerleyen uygulamalı workshoplar ile teoriyi pratiğe dökme şansı yakalayın.",
    color: "from-purple-500 to-fuchsia-500",
    bgLight: "bg-purple-500/10",
    textLight: "text-purple-400",
  },
  {
    icon: Trophy,
    title: "Başarı Rozetleri",
    description: "Eğitimleri tamamladıkça rozetler kazanın, profilinizi geliştirin ve topluluk içinde yetkinliklerinizi sergileyin.",
    color: "from-amber-400 to-orange-500",
    bgLight: "bg-amber-500/10",
    textLight: "text-amber-400",
  },
];

export function MarketingFeatures() {
  return (
    <section id="features" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Neden SientoOps?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg leading-relaxed"
          >
            İçerik üreticiliği serüveninizde ihtiyacınız olan tüm modern araçları ve interaktif eğitim materyallerini tek bir çatı altında topladık.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="group relative p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors overflow-hidden"
            >
              {/* Hover Glow */}
              <div className={`absolute -inset-0.5 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />
              
              <div className="relative z-10 flex flex-col items-start text-left h-full">
                <div className={`p-4 rounded-2xl ${feature.bgLight} ${feature.textLight} mb-6 ring-1 ring-inset ring-white/10`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed flex-1">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
