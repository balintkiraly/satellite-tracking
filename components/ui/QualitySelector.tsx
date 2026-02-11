"use client";

import { useQuality, QUALITY_LABELS, type QualityLevel } from "@/store/quality";

export function QualitySelector() {
  const level = useQuality((s) => s.level);
  const setLevel = useQuality((s) => s.setLevel);

  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5 p-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/20">
      <span className="text-xs text-white/70 px-1">Texture / quality</span>
      <div className="flex gap-1">
        {(["low", "medium", "high"] as QualityLevel[]).map((q) => (
          <button
            key={q}
            onClick={() => setLevel(q)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              level === q
                ? "bg-white/25 text-white"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
            title={QUALITY_LABELS[q]}
          >
            {q === "low" ? "Low" : q === "medium" ? "Medium" : "High"}
          </button>
        ))}
      </div>
    </div>
  );
}
