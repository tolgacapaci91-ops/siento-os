"use client";

import React from "react";
import { motion } from "framer-motion";
import { LayoutTemplate, Briefcase, Medal, RefreshCw } from "lucide-react";

const reasons = [
  {
    icon: LayoutTemplate,
    title: "Premium Arayüz",
    desc: "Apple ve Linear sadeliğinde tasarlanmış, göz yormayan ve tamamen öğrenmeye odaklı özel platform.",
  },
  {
    icon: Briefcase,
    title: "Gerçek Projeler",
    desc: "Teorik bilgileri değil, sektörde birebir karşılığı olan gerçek dünya senaryolarını öğretiyoruz.",
  },
  {
    icon: Medal,
    title: "Başarı Sistemi",
    desc: "Oyunlaştırma (Gamification) altyapısı ile motivasyonunuzu her zaman en üst seviyede tutun.",
  },
  {
    icon: RefreshCw,
    title: "Her Zaman Güncel",
    desc: "YouTube algoritması değiştikçe eğitimlerimiz de güncellenir. Asla geride kalmazsınız.",
  },
];

export function MarketingWhyUs() {
  return (
    <section className="py-24 relative bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
            >
              Neden Binlerce Kişi Bizi Tercih Ediyor?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 text-lg leading-relaxed mb-8"
            >
              Çünkü biz sadece bir eğitim satmıyoruz, baştan uca bir kariyer dönüşüm ekosistemi sunuyoruz. En yeni teknolojilerle donatılmış platformumuzda başarı tesadüf değildir.
            </motion.p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {reasons.map((reason, idx) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:bg-slate-800/60 transition-colors"
              >
                <reason.icon className="w-8 h-8 text-indigo-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{reason.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{reason.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
