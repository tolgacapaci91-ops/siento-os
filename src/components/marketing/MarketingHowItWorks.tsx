"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserPlus, PlayCircle, Award } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Hesap Oluştur",
    description: "Saniyeler içinde ücretsiz hesabınızı açın ve platforma adım atın.",
  },
  {
    icon: PlayCircle,
    title: "Eğitimleri Tamamla",
    description: "Video dersleri izleyin, PDF'leri okuyun ve workshoplara katılın.",
  },
  {
    icon: Award,
    title: "Rozetlerini Kazan",
    description: "Tamamladığınız görevler için başarı rozetleri kazanarak profilinizi güçlendirin.",
  },
];

export function MarketingHowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-950/50 border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-950 to-slate-950 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-indigo-400 font-semibold tracking-wider uppercase text-sm mb-3"
          >
            Nasıl Çalışır?
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Başarıya Giden 3 Adım
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 -right-2 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30 z-20">
                {idx + 1}
              </div>

              <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center mb-8 relative z-10 group hover:border-indigo-500/50 transition-colors shadow-xl">
                <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <step.icon className="w-10 h-10 text-indigo-400" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
