"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { SlidersHorizontal, Check } from "lucide-react";

export interface WidgetOption {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface WidgetCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: WidgetOption[];
  onToggleWidget: (id: string) => void;
}

export function WidgetCustomizerModal({
  isOpen,
  onClose,
  widgets,
  onToggleWidget,
}: WidgetCustomizerModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dashboard Widget Ayarları" maxWidth="md">
      <div className="space-y-4">
        <p className="text-xs text-slate-500">
          Dashboard ekranınızda görüntülemek istediğiniz widget panellerini seçip düzenleyebilirsiniz.
        </p>

        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
          {widgets.map((widget) => (
            <div
              key={widget.id}
              onClick={() => onToggleWidget(widget.id)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                widget.enabled
                  ? "bg-indigo-500/10 border-indigo-500/30 text-slate-900 dark:text-slate-100"
                  : "bg-slate-100/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60"
              }`}
            >
              <div>
                <h5 className="text-xs font-semibold">{widget.label}</h5>
                <p className="text-[11px] text-slate-500">{widget.description}</p>
              </div>

              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                  widget.enabled
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "border-slate-400"
                }`}
              >
                {widget.enabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose} leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}>
            Değişiklikleri Kaydet
          </Button>
        </div>
      </div>
    </Modal>
  );
}
