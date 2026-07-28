"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Eğitimlere erişim süresi ne kadar?",
    answer: "Platforma kayıt olduktan sonra tüm eğitim içeriklerine ömür boyu (sınırsız) erişim hakkınız olur. Güncellemeler için ekstra ücret ödemezsiniz.",
  },
  {
    question: "Sıfırdan başlayanlar için uygun mu?",
    answer: "Kesinlikle. Müfredatımız tamamen teknik bilgisi olmayan kişilerin bile kolayca anlayabileceği, temelden zirveye doğru ilerleyen bir yapıda tasarlanmıştır.",
  },
  {
    question: "Eğitimleri telefondan izleyebilir miyim?",
    answer: "Evet! SientoOps platformu %100 mobil uyumludur. Eğitimleri bilgisayardan, tabletten veya cep telefonunuzdan sorunsuzca takip edebilirsiniz.",
  },
  {
    question: "Sertifika veriyor musunuz?",
    answer: "Evet, tüm eğitimleri ve workshop projelerini tamamladığınızda, profilinize işleyebileceğiniz ve dijital olarak doğrulanabilir bir başarı sertifikası alırsınız.",
  },
];

export function MarketingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 relative">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Sıkça Sorulan Sorular
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg"
          >
            Aklınıza takılan soruların cevaplarını burada bulabilirsiniz.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-2xl border border-white/10 bg-slate-900/30 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-white text-lg">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 ml-4 text-indigo-400"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-slate-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
