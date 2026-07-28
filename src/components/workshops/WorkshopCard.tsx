"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ExternalLink, Clock, Play } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Workshop } from "@/types/database";

interface WorkshopCardProps {
  workshop: Workshop;
  onToggleFavorite: (id: string) => void;
}

export const WorkshopCard = React.memo(function WorkshopCard({
  workshop,
  onToggleFavorite,
}: WorkshopCardProps) {
  return (
    <Card hoverable className="flex flex-col justify-between p-4 group">
      <div>
        {/* Cover Image */}
        <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4">
          <Image
            src={workshop.cover_image}
            alt={workshop.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="success">{workshop.category}</Badge>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(workshop.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
              workshop.is_favorite
                ? "bg-rose-500 text-white"
                : "bg-black/40 text-white/80 hover:bg-black/60"
            }`}
          >
            <Heart className={`w-4 h-4 ${workshop.is_favorite ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-400 transition-colors">
          {workshop.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
          {workshop.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {workshop.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800/80">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> ~{workshop.estimated_hours} Saat
        </span>

        <div className="flex items-center gap-2">
          {workshop.repo_url && (
            <a href={workshop.repo_url} target="_blank" rel="noreferrer">
              <button className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200">
                <ExternalLink className="w-4 h-4" />
              </button>
            </a>
          )}
          <Link href={`/academy/workshops/${workshop.id}`}>
            <Button
              variant="primary"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 border-emerald-500/30 shadow-emerald-500/20"
              leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            >
              Laboratuvarı Aç
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
});
