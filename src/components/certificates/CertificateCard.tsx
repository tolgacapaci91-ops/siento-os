"use client";

import React, { useRef, useState } from "react";
import { Award, Download, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

interface CertificateCardProps {
  userName: string;
  issueDate: string;
}

export function CertificateCard({ userName, issueDate }: CertificateCardProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;
    
    try {
      setIsDownloading(true);
      // Wait a tiny bit for UI to settle if needed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(certificateRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#020617",
      });
      
      // Calculate aspect ratio for A4 landscape
      // A4 dimensions in mm: 297 x 210
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      
      const img = new Image();
      img.src = dataUrl;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // We want to fit the canvas inside the A4 page while maintaining aspect ratio
      const imgRatio = img.width / img.height;
      const pdfRatio = pdfWidth / pdfHeight;
      
      let finalWidth = pdfWidth;
      let finalHeight = pdfHeight;
      
      if (imgRatio > pdfRatio) {
        // Image is wider than A4
        finalHeight = pdfWidth / imgRatio;
      } else {
        // Image is taller than A4
        finalWidth = pdfHeight * imgRatio;
      }
      
      // Center the image
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;
      
      pdf.addImage(dataUrl, "PNG", x, y, finalWidth, finalHeight);
      pdf.save(`SientoOps_Sertifika_${userName.replace(/\s+/g, "_")}.pdf`);
      
    } catch (error: any) {
      console.error("PDF oluşturulurken hata:", error);
      alert("PDF oluşturulurken bir hata oluştu: " + (error.message || "Bilinmeyen hata"));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative group">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

      {/* Certificate Container */}
      <div 
        ref={certificateRef}
        className="relative p-1 rounded-3xl bg-gradient-to-br from-amber-200/20 via-slate-800 to-amber-900/40 backdrop-blur-sm overflow-hidden"
      >

        <div className="relative bg-slate-950/90 rounded-[22px] p-8 md:p-12 overflow-hidden border border-amber-500/10">
          {/* Abstract Watermark */}
          <div className="absolute -top-24 -right-24 w-64 h-64 border-[40px] border-amber-500/5 rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 border-[60px] border-amber-500/5 rounded-full" />

          <div className="text-center relative z-10 flex flex-col items-center">

            <div className="mb-6 inline-flex p-4 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-600/20 border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <ShieldCheck className="w-12 h-12 text-amber-400" />
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 uppercase tracking-widest mb-4">
              BAŞARI SERTİFİKASI
            </h1>

            <p className="text-slate-400 max-w-lg mx-auto leading-relaxed mb-8 text-sm md:text-base">
              Bu sertifika, SientoOps Academy Dijital İçerik Üreticiliği Eğitim Programını başarıyla tamamlayan
            </p>

            <div className="relative w-full max-w-xl mx-auto py-6 mb-8 border-y border-amber-500/20">
              <h2 className="text-4xl md:text-5xl font-script text-white italic capitalize">
                {userName}
              </h2>
            </div>

            <p className="text-slate-400 max-w-xl mx-auto leading-relaxed mb-12 text-sm md:text-base">
              isimli katılımcıya, göstermiş olduğu başarı, azim ve öğrenme sürecindeki üstün performansı dolayısıyla takdim edilmiştir.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-between w-full mt-8 pt-8 border-t border-slate-800/60">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Veriliş Tarihi</p>
                <p className="text-amber-100 font-medium">{issueDate}</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2 text-amber-500">
                  <Award className="w-6 h-6" />
                  <span className="font-bold tracking-widest">SIENTOOPS ACADEMY</span>
                </div>
                <div className="h-px w-32 bg-amber-500/30" />
                <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest">Doğrulanmış Başarı Belgesi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8 relative z-10">
        <Button
          variant="primary"
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 border-none shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all font-bold group"
          leftIcon={
            isDownloading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            )
          }
        >
          {isDownloading ? "Sertifika Hazırlanıyor..." : "Sertifikayı İndir (PDF)"}
        </Button>
      </div>
    </div>
  );
}
