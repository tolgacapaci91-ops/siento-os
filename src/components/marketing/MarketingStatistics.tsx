"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

function Counter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const incrementTime = (duration / end) * 2;

      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [value, isInView]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center p-6">
      <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
        {count}
        <span className="text-indigo-500">{suffix}</span>
      </div>
      <div className="text-sm font-medium text-slate-400 uppercase tracking-widest">{label}</div>
    </div>
  );
}

export function MarketingStatistics() {
  return (
    <section className="py-20 border-y border-white/5 bg-slate-950/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/5 border border-white/5 rounded-3xl bg-slate-900/20 backdrop-blur-sm overflow-hidden">
          <Counter value={50} suffix="+" label="Video Eğitim" />
          <Counter value={100} suffix="+" label="PDF Doküman" />
          <Counter value={30} suffix="+" label="Workshop" />
          <Counter value={10} suffix="+" label="Başarı Rozeti" />
        </div>
      </div>
    </section>
  );
}
